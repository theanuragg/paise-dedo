## ICM – Token Launch to Market Display (Technical Documentation)

### Scope
This document maps the end‑to‑end flow from creating a token (UI + backend) to rendering its market page, including realtime and swap behaviors (pre/post graduation), data sources, and key modules.

---

### High‑Level Architecture
- Launch UI: `markets/create/page.tsx` mounts `LaunchTokenForm` (two‑step: `BasicInfoStep` → `ReviewStep`).
- Backend:
  - `POST /api/launch` prepares a Dynamic Bonding Curve (DBC) create‑pool transaction and uploads image/metadata.
  - `POST /api/sendtxn` broadcasts a signed tx, confirms, extracts the actual mint, searches for the created pool.
- Market Page: `markets/[slug]/page.tsx` renders token details, chart, realtime trades/holders, and swap panel.
- Utilities: REST client (`utils/httpClient.ts`), realtime WS (`utils/SignalingManager.ts`), chart wrapper (`utils/ChartManager.ts`), graduated pool derivation (`utils/getGraduationAddress.ts`), and shared types.

---

### Launch Flow (UI)
- `LaunchTokenForm` (client)
  - Validates forms (Zod + React Hook Form) across two steps.
  - Prepares launch via `POST /api/launch` → receives `poolTx` (base64), predicted `tokenMint`, tentative `poolAddress`.
  - Signs tx with user wallet and posts to `POST /api/sendtxn`.
  - Confirms on‑chain and shows `TokenCreationSuccessDialog`.

Key functions in `LaunchTokenForm`:
- `launchTokenOnDBC(formData)` → calls `/api/launch` with token metadata and image (base64).
- `handleTransactionSigning(serializedTx)` → decodes base64 tx, ensures `feePayer` and `recentBlockhash`, wallet‑signs, and POSTs to `/api/sendtxn`.
- `handleLaunch(socialDataString)` → orchestrates validation, preparation, signing, error retry for expired blockhash, success state.

---

### Backend – Prepare Launch (`/api/launch/route.ts`)
Responsibilities:
- Upload image (optional) and token metadata JSON to DigitalOcean Spaces.
- Create a DBC pool transaction with a server‑generated mint keypair.
- Partially sign tx server‑side (generated keypair), set `feePayer` to user, and provide `recentBlockhash`.
- Return serialized tx (base64), predicted `tokenMint`, and tentative `poolAddress` (or `TBD`).

Notes:
- The “predicted” `tokenMint` comes from the generated keypair; the actual mint may differ after execution.
- The pool address may be non‑deterministic pre‑confirmation; the client later resolves it.

---

### Backend – Broadcast & Resolve (`/api/sendtxn/route.ts`)
Responsibilities:
- Parse and refresh blockhash; simulate; send with retry logic for blockhash/timeout; confirm with `{ blockhash, lastValidBlockHeight, signature }`.
- Extract actual mint by scanning tx accounts (verify via `getParsedAccountInfo`), with fallback to provided `mint` if needed.
- Resolve DBC pool via multiple strategies: scanning all pools, parsing tx accounts, and polling.
- Respond with `{ success, signature, actualMintAddress, poolData }`.

---

### Market Page – `markets/[slug]/page.tsx`
- `[slug]` is the token mint.
- Data load and realtime:
  - Fetch token: `getCoinByMint(slug)` (REST).
  - Subscribe to realtime: `SignalingManager.subscribeToToken(slug)`.
- Composition:
  - `TokenDetails` – header, description, market cap (computed), bonding curve progress.
  - `Chart` – klines (REST) rendered by `ChartManager`.
  - `RealtimeTransactions` – live trades (WS) and Top Holders (REST).
  - `SwapContainer` – chooses swap UI based on graduation status.

---

### TokenDetails – Market Cap & Progress
- Market Cap:
  - Fetch DBC pool state (`client.state.getPool`) and pool config (`getPoolConfig`).
  - Price = `getPriceFromSqrtPrice(poolState.sqrtPrice, tokenDecimal, 6)`.
  - Supply = `preMigrationTokenSupply / 10^tokenDecimal`.
  - Market Cap (approx, in quote units like USDC) = `price × supply`.
- Progress:
  - UI uses `useCurveProgress(poolAddress)` and a graduation target (e.g., 75k) to show progress and banner.

---

### Chart – Klines & Rendering
- Data: `getKlines(mint, interval)` (REST) + `useTrades` time range to normalize timestamps.
- Rendering: `ChartManager` wraps `lightweight-charts` with candlestick and histogram series; lifecycle managed by `init/update/destroy`.

---

### Realtime – Trades & Top Holders
- Trades:
  - `useTrades({ tokenMint, limit, enableRealtime: true })` fetches recent trades (REST) and registers a `TRADE` callback via `SignalingManager`.
  - Deduping and fixed‑length queue ensure newest first within `limit`.
  - Displayed units:
    - For buys: `amountIn` is SOL lamports → divide by `1e9`.
    - For sells: `amountIn` is base token units → divide by `1e6` (assumes 6 dp; see pool config for exact).
    - `amountOut` is the counter leg’s units (token units for buy, lamports for sell).
- Top Holders:
  - `getTopHolders(mint)` (REST) → list of `{ holder_address, amount }`.
  - Percentages derived by dividing holder amount by the sum of amounts in the response slice.

---

### Swap – Pre/Post Graduation
`SwapContainer` determines if pool is migrated (`isMigrated`) using DBC state and switches UI.

Pre‑Graduation (DBC) – `swap-section.tsx`:
- Quote: `client.pool.swapQuote({ virtualPool, config, swapBaseForQuote, amountIn, slippageBps })`.
- Direction & units:
  - Buy (quote→base): `swapBaseForQuote=false`; `amountIn` in lamports (9 dp); min out from quote.
  - Sell (base→quote): `swapBaseForQuote=true`; `amountIn` in base units (assumes 6 dp).
- Execute: `client.pool.swap({...})` → wallet sign → `sendRawTransaction` and confirm.

Post‑Graduation (Meteora CP AMM) – `graduated-swap-section.tsx`:
- Find graduated pool: `getGraduationAddress({ connection, poolAddress, mintAddress })` using `deriveDammV2PoolAddress`.
- Quote/Swap: `cpAmm.getQuote({ inAmount, inputTokenMint, slippage, ... })` then `cpAmm.swap({...})`.
- Direction & units:
  - Buy SOL→Base: input is SOL (9 dp), output is base (6 dp).
  - Sell Base→SOL: input is base (6 dp), output is SOL (9 dp).
- Slippage is given in percent (e.g., `0.5` for 0.5%).

Unit Considerations:
- The code currently assumes base tokens use 6 decimals. For tokens with different decimals, pull exact decimals from the pool config/state and convert accordingly.

---

### Data Sources & Utilities
- REST (`utils/httpClient.ts`):
  - `getCoinByMint`, `getKlines`, `getRecentTrades`, `getTopHolders`, `getBondingCurveStats`, `getPoolCurveProgress` (Next API `/api/progress/:pool`).
- Realtime (`utils/SignalingManager.ts`):
  - Singleton WebSocket to `WS_BASE_URL`, buffered send until connected, heartbeat/reconnect.
  - `registerCallback(type, cb, id)`, `deRegisterCallback(type, id)`, `subscribeToToken(baseMint)`, `unsubscribeFromToken(baseMint)`.
- Chart (`utils/ChartManager.ts`): candlestick + histogram wrapper over `lightweight-charts`.
- Graduation (`utils/getGraduationAddress.ts`): derives DAMM v2 pool address for migrated pools. Note: contains unreachable logging after `return` (non‑critical).

---

### Shared Types
- `utils/types.ts`:
  - `KLine`: string‑typed OHLCV fields; normalize before plotting.
  - `Trade`: `{ traderAddress, time, poolAddress, amountIn, amountOut, baseMint, quoteMint, type }`.
  - Re‑exports `Coin` from `types/types.ts`.
- `types/types.ts`:
  - `Coin` includes `mint`, `name`, `symbol`, `description`, `image_uri`, `bonding_curve`, `creator`, reserves, `total_supply`, `complete`, `bonding_curve_stats` (progress, graduation target, `is_graduated`).

---

### External Dependencies
- DBC SDK: `@meteora-ag/dynamic-bonding-curve-sdk` – pool state/config, pricing, swap/quotes, graduation mapping.
- CP AMM SDK: `@meteora-ag/cp-amm-sdk` – quotes and swaps for graduated pools.
- Solana Web3: `@solana/web3.js` – connections, transactions, blockhashes.
- Wallet Adapter: `@solana/wallet-adapter-react` – wallet connection and signing.
- Charts: `lightweight-charts` via `ChartManager`.

---

### Operational Notes & Pitfalls
- Blockhash expiry: `/api/sendtxn` refreshes blockhash and retries; UI also retries by re‑preparing tx via `/api/launch`.
- Units & Decimals: SOL is 9 dp; base token often 6 dp. Always prefer reading decimals from pool config.
- Preview vs Execution: UI “You will receive” is a rough estimate; use SDK quote’s `minimumAmountOut` for execution.
- Pool discovery: immediate pool address may be `TBD` until confirmed; `/api/sendtxn` resolves it post‑broadcast.

---

### File Index (Key Files)
- UI – Launch: `src/app/(main)/markets/create/components/LaunchTokenForm.tsx`, `BasicInfoStep.tsx`, `ReviewStep.tsx`
- API – Launch Prep: `src/app/api/launch/route.ts`
- API – Broadcast: `src/app/api/sendtxn/route.ts`
- Market Page: `src/app/(main)/markets/[slug]/page.tsx`
  - `components/TokenDetails.tsx`
  - `components/Chart.tsx`
  - `components/RealtimeTransactions.tsx`
  - `components/swap/swap-container.tsx`
  - `components/swap/swap-section.tsx`
  - `components/swap/graduated-swap-section.tsx`
- Utilities: `src/utils/httpClient.ts`, `src/hooks/useTrades.ts`, `src/utils/SignalingManager.ts`, `src/utils/ChartManager.ts`, `src/utils/getGraduationAddress.ts`
- Types: `src/utils/types.ts`, `src/types/types.ts`


