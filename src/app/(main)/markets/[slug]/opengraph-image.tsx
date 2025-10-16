import { ImageResponse } from "next/og"
import { getCoinByMint } from "@/utils/httpClient"

export const runtime = "edge"

function formatCurrencyShort(value?: number) {
  if (value == null || isNaN(value)) return "-"
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
  return `$${value.toFixed(2)}`
}

function formatUsd(value?: number) {
  if (value == null || isNaN(value)) return "-"
  if (value >= 1) return `$${value.toLocaleString(undefined, { maximumFractionDigits: 4 })}`
  return `$${value.toPrecision(5)}`
}

function safeNumber(n?: number | null, fallback = 0) {
  return typeof n === "number" && !isNaN(n) ? n : fallback
}

// Changed from "export async function GET" to "export default async function"
export default async function Image({ params }: { params: { slug: string } }) {
  try {
    // Fetch token data using the slug (mint address)
    const coin = await getCoinByMint(params.slug)
    
    if (!coin) {
      // Return a default image if token not found
      return new ImageResponse(
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0B0E0F 0%, #1A1A1A 100%)",
            color: "white",
            fontSize: 48,
            fontWeight: 800,
          }}
        >
          Token Not Found
        </div>,
        { width: 1200, height: 630 }
      )
    }

    // Extract token data
    const name = coin.name || "Token"
    const symbol = coin.symbol || "TKN"
    const price = safeNumber(coin.price_per_token)
    const priceStr = formatUsd(price)
    const mcap = safeNumber(coin.usd_market_cap)
    const mcapStr = mcap ? formatCurrencyShort(mcap) : "-"
    const liquidity = safeNumber(coin.virtual_sol_reserves, NaN)
    const liqStr = Number.isFinite(liquidity) ? formatCurrencyShort(liquidity) : "-"
    const change24 = 0 // TODO: Add price_change_24h to Coin interface or fetch separately
    const changeColor = change24 >= 0 ? "#14F195" : "#FF4D8D"
    const changeStr = change24 > 0 ? `+${change24.toFixed(2)}%` : `${change24.toFixed(2)}%`

    const netBuyVolStr = change24 >= 0 ? "+$457" : "-$457"

    const ts = new Date()
    const tsStr = ts
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      })
      .replace(",", " ")

    const cardWidth = 1200
    const cardHeight = 630
    const radius = 36

    // For background image, use a relative path that Next.js can resolve
    const backgroundImage = "/opengraph.png"

    return new ImageResponse(
      <div
        style={{
          width: cardWidth,
          height: cardHeight,
          display: "flex",
          position: "relative",
          borderRadius: radius,
          overflow: "hidden",
        }}
      >
        {/* Background Image Layer */}
        <img
          src={backgroundImage}
          alt="background"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Dark overlay for better text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(11, 14, 15, 0.7)",
          }}
        />

        {/* Border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.06)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: 56,
          }}
        >
          {/* Top row: avatar + name on left, price on right */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 9999,
                  background: "linear-gradient(135deg, rgba(20,241,149,0.25), rgba(0,0,0,0.2))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 36,
                  fontWeight: 800,
                  border: "2px solid rgba(255,255,255,0.12)",
                }}
              >
                {symbol?.[0]?.toUpperCase() || "T"}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: "white" }}>{symbol}</div>
                <div style={{ fontSize: 24, color: "rgba(255,255,255,0.7)" }}>{name}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: -0.5, color: "white" }}>{priceStr}</div>
              <div style={{ fontSize: 24, color: changeColor, fontWeight: 700 }}>{changeStr}</div>
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              marginTop: 36,
              display: "flex",
              gap: 24,
              maxWidth: 820,
            }}
          >
            <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column" }}>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 20 }}>Mcap</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "white" }}>{mcapStr}</div>
            </div>
            <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column" }}>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 20 }}>24h Vol</div>
            </div>
            <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column" }}>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 20 }}>Liquidity</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "white" }}>{liqStr}</div>
            </div>
            <div style={{ flex: "1 1 0", display: "flex", flexDirection: "column" }}>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 20 }}>Net Buy Vol</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#14F195" }}>{netBuyVolStr}</div>
            </div>
          </div>

          {/* CTA + timestamp */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                background: "rgba(0,0,0,0.6)",
                color: "white",
                padding: "10px 16px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 22,
                border: "2px solid rgba(255,255,255,0.12)",
              }}
            >
              {`${symbol} ${priceStr} | onlyfounders.fun`}
            </div>

            <div
              style={{
                position: "absolute",
                right: 56,
                bottom: 42,
                color: "rgba(255,255,255,0.6)",
                fontSize: 20,
              }}
            >
              {`${tsStr} UTC`}
            </div>
          </div>
        </div>
      </div>,
      {
        width: cardWidth,
        height: cardHeight,
      }
    )
  } catch (error) {
    console.error('Error generating opengraph image:', error)
    
    // Return error image
    return new ImageResponse(
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B0E0F 0%, #1A1A1A 100%)",
          color: "white",
          fontSize: 48,
          fontWeight: 800,
        }}
      >
        Error Loading Token
      </div>,
      { width: 1200, height: 630 }
    )
  }
}