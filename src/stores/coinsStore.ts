import { create } from 'zustand';
import { getAllCoins } from '@/utils/httpClient';
import { Coin } from '@/utils/types';
import { SignalingManager } from '@/utils/SignalingManager';
import { toast } from 'sonner';

type BondingCurveStats = {
  progress_percentage: number;
  sol_in_curve: number;
  graduation_target: number;
  is_graduated: boolean;
};

export type CoinProject = Coin & {
  price_per_token: number | null;
  bonding_curve_progress: string;
  bonding_curve_stats: BondingCurveStats;
};

interface CoinsState {
  coins: CoinProject[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  wsConnected: boolean;

  fetchCoins: (force?: boolean) => Promise<void>;
  addNewCoin: (coin: Coin) => void;
  updateCoin: (coinId: number, updates: Partial<CoinProject>) => void;
  setError: (error: string | null) => void;
  setWsConnected: (connected: boolean) => void;
  clearCoins: () => void;
  initializeWebSocket: () => void;
  cleanupWebSocket: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000;

export const useCoinsStore = create<CoinsState>((set, get) => ({
  coins: [],
  loading: false,
  error: null,
  lastFetched: null,
  wsConnected: false,

  fetchCoins: async (force = false) => {
    const state = get();

    if (!force && state.lastFetched && state.coins.length > 0) {
      const cacheAge = Date.now() - state.lastFetched;
      if (cacheAge < CACHE_DURATION) {
        return;
      }
    }

    try {
      set({ loading: state.coins.length === 0, error: null });

      const data = await getAllCoins(100, 1);
      const projectsWithStats = data.map(coin => ({
        ...coin,
        price_per_token: coin.usd_market_cap
          ? coin.usd_market_cap / coin.total_supply
          : null,
        bonding_curve_progress: '0',
        bonding_curve_stats: {
          progress_percentage: coin.bonding_curve_stats.progress_percentage,
          sol_in_curve: coin.virtual_sol_reserves || 0,
          graduation_target:
            coin.bonding_curve_stats.graduation_target || 75000,
          is_graduated: coin.complete || false,
        },
      }));

      set({
        coins: projectsWithStats,
        loading: false,
        lastFetched: Date.now(),
      });
    } catch (error) {
      console.error('Failed to fetch coins:', error);
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load projects',
        loading: false,
        coins: state.coins.length > 0 ? state.coins : [],
      });
    }
  },

  addNewCoin: (coin: Coin) => {
    const state = get();
    const exists = state.coins.some(
      (project: CoinProject) =>
        project.id === coin.id || project.mint === coin.mint
    );

    if (!exists) {
      const coinProject = coin as CoinProject;

      toast.success(`🪙 New coin launched: ${coin.name} (${coin.symbol})`, {
        description: 'Click to view details',
        duration: 5000,
      });

      set({
        coins: [coinProject, ...state.coins],
      });
    }
  },

  updateCoin: (coinId: number, updates: Partial<CoinProject>) => {
    set(state => ({
      coins: state.coins.map(coin =>
        coin.id === coinId ? { ...coin, ...updates } : coin
      ),
    }));
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setWsConnected: (connected: boolean) => {
    set({ wsConnected: connected });
  },

  clearCoins: () => {
    set({
      coins: [],
      error: null,
      lastFetched: null,
    });
  },

  initializeWebSocket: () => {
    const signalingManager = SignalingManager.getInstance();
    const { addNewCoin, setWsConnected } = get();

    const handleNewCoin = (data: unknown) => {
      try {
        if (data && typeof data === 'object' && 'type' in data) {
          const messageData = data as { type: string; data?: unknown };

          if (
            messageData.type === 'LAUNCH_COIN' ||
            messageData.type === 'coin_created'
          ) {
            const newCoin = messageData.data || data;

            if (
              newCoin &&
              typeof newCoin === 'object' &&
              'id' in newCoin &&
              'mint' in newCoin &&
              'name' in newCoin
            ) {
              const coinData = newCoin as Coin;
              addNewCoin(coinData);
            }
          }
        }
      } catch (error) {
        console.error('Error processing real-time coin update:', error);
      }
    };

    const handleOpen = () => setWsConnected(true);
    const handleClose = () => setWsConnected(false);
    const handleError = (error: Event) => {
      setWsConnected(false);
      console.error('WebSocket error:', error);
    };

    signalingManager.registerCallback(
      'LAUNCH_COIN',
      handleNewCoin,
      'coins-store'
    );

    signalingManager.onOpen = handleOpen;
    signalingManager.onClose = handleClose;
    signalingManager.onError = handleError;

    signalingManager.sendMessage({
      type: 'SUBSCRIBE',
      room: 'coins',
    });

    if (signalingManager.isConnected()) {
      setWsConnected(true);
    }
  },

  cleanupWebSocket: () => {
    const signalingManager = SignalingManager.getInstance();

    signalingManager.deRegisterCallback('LAUNCH_COIN', 'coins-store');
    signalingManager.onOpen = undefined;
    signalingManager.onClose = undefined;
    signalingManager.onError = undefined;

    set({ wsConnected: false });
  },
}));

let wsInitialized = false;
export const initializeCoinsWebSocket = () => {
  if (!wsInitialized) {
    useCoinsStore.getState().initializeWebSocket();
    wsInitialized = true;
  }
};

export const selectCoins = (state: CoinsState) => state.coins;
export const selectLoading = (state: CoinsState) => state.loading;
export const selectError = (state: CoinsState) => state.error;
export const selectWsConnected = (state: CoinsState) => state.wsConnected;
