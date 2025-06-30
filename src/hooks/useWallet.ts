import { useState, useEffect, useMemo, useCallback } from 'react';
import { WalletHandler, createWalletHandler, WalletState, TransactionParams, WalletEventHandlers } from '../utils/walletHandler';

// ==========================================
// REACT HOOK FOR WALLET MANAGEMENT
// ==========================================

export interface UseWalletReturn {
  // State
  walletState: WalletState;
  isLoading: boolean;
  
  // Actions
  connect: () => Promise<string[]>;
  disconnect: () => Promise<void>;
  reconnect: () => Promise<string[]>;
  
  // Transactions
  sendPayment: (params: TransactionParams) => Promise<string>;
  signTransaction: (txn: any) => Promise<any>;
  
  // Utilities
  getAccountInfo: (address?: string) => Promise<any>;
  formatAddress: (address: string, startChars?: number, endChars?: number) => string;
  isValidAddress: (address: string) => boolean;
  
  // Helpers
  refreshBalance: () => Promise<void>;
  clearError: () => void;
}

export function useWallet(): UseWalletReturn {
  // State management
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    accounts: [],
    activeAccount: null,
    balance: 0,
    error: null
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Create wallet handler instance (memoized)
  const walletHandler = useMemo(() => {
    console.log('🔧 Creating new WalletHandler instance');
    return createWalletHandler();
  }, []);

  // Update local state when wallet state changes
  const updateState = useCallback(() => {
    const newState = walletHandler.getState();
    setWalletState(newState);
  }, [walletHandler]);

  // Setup event handlers
  useEffect(() => {
    console.log('👂 Setting up wallet event handlers');
    
    const eventHandlers: WalletEventHandlers = {
      onConnect: (accounts) => {
        console.log('🎉 Wallet connected event:', accounts);
        updateState();
        setIsLoading(false);
      },
      
      onDisconnect: () => {
        console.log('👋 Wallet disconnected event');
        updateState();
        setIsLoading(false);
      },
      
      onAccountChange: (account) => {
        console.log('🔄 Account changed event:', account);
        updateState();
      },
      
      onError: (error) => {
        console.error('❌ Wallet error event:', error);
        updateState();
        setIsLoading(false);
      },
      
      onBalanceUpdate: (balance) => {
        console.log('💰 Balance updated event:', balance);
        updateState();
      }
    };
    
    walletHandler.setEventHandlers(eventHandlers);
    
    // Attempt to reconnect on mount
    const attemptReconnection = async () => {
      try {
        setIsLoading(true);
        await walletHandler.reconnect();
        console.log('✅ Successfully reconnected to previous session');
      } catch (error) {
        console.log('ℹ️ No previous session found or reconnection failed');
      } finally {
        setIsLoading(false);
      }
    };
    
    attemptReconnection();
    
    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up wallet event handlers');
    };
  }, [walletHandler, updateState]);

  // Action functions
  const connect = useCallback(async (): Promise<string[]> => {
    try {
      setIsLoading(true);
      console.log('🔌 Initiating wallet connection...');
      const accounts = await walletHandler.connect();
      return accounts;
    } catch (error) {
      console.error('❌ Connection failed in hook:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletHandler]);

  const disconnect = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('🔌 Initiating wallet disconnection...');
      await walletHandler.disconnect();
    } catch (error) {
      console.error('❌ Disconnection failed in hook:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletHandler]);

  const reconnect = useCallback(async (): Promise<string[]> => {
    try {
      setIsLoading(true);
      console.log('🔄 Initiating wallet reconnection...');
      const accounts = await walletHandler.reconnect();
      return accounts;
    } catch (error) {
      console.error('❌ Reconnection failed in hook:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletHandler]);

  const sendPayment = useCallback(async (params: TransactionParams): Promise<string> => {
    try {
      setIsLoading(true);
      console.log('💸 Initiating payment transaction...', params);
      const txId = await walletHandler.sendPayment(params);
      return txId;
    } catch (error) {
      console.error('❌ Payment failed in hook:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletHandler]);

  const signTransaction = useCallback(async (txn: any): Promise<any> => {
    try {
      setIsLoading(true);
      console.log('✍️ Initiating transaction signing...');
      const signedTxn = await walletHandler.signTransaction(txn);
      return signedTxn;
    } catch (error) {
      console.error('❌ Transaction signing failed in hook:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [walletHandler]);

  const getAccountInfo = useCallback(async (address?: string): Promise<any> => {
    try {
      console.log('📊 Fetching account info...');
      const accountInfo = await walletHandler.getAccountInfo(address);
      return accountInfo;
    } catch (error) {
      console.error('❌ Failed to get account info in hook:', error);
      throw error;
    }
  }, [walletHandler]);

  const refreshBalance = useCallback(async (): Promise<void> => {
    try {
      if (walletState.activeAccount) {
        console.log('🔄 Refreshing balance...');
        await getAccountInfo(walletState.activeAccount);
        updateState();
      }
    } catch (error) {
      console.error('❌ Failed to refresh balance:', error);
    }
  }, [walletState.activeAccount, getAccountInfo, updateState]);

  const clearError = useCallback((): void => {
    console.log('🧹 Clearing wallet error');
    // This would need to be implemented in the WalletHandler class
    // For now, we can trigger a state update
    updateState();
  }, [updateState]);

  // Utility functions (these don't need async handling)
  const formatAddress = useCallback((address: string, startChars?: number, endChars?: number): string => {
    return walletHandler.formatAddress(address, startChars, endChars);
  }, [walletHandler]);

  const isValidAddress = useCallback((address: string): boolean => {
    return walletHandler.isValidAddress(address);
  }, [walletHandler]);

  return {
    // State
    walletState,
    isLoading,
    
    // Actions
    connect,
    disconnect,
    reconnect,
    
    // Transactions
    sendPayment,
    signTransaction,
    
    // Utilities
    getAccountInfo,
    formatAddress,
    isValidAddress,
    
    // Helpers
    refreshBalance,
    clearError
  };
}

// ==========================================
// ADDITIONAL HOOKS
// ==========================================

/**
 * Hook for wallet connection status only
 */
export function useWalletConnection() {
  const { walletState, connect, disconnect, isLoading } = useWallet();
  
  return {
    isConnected: walletState.isConnected,
    isConnecting: walletState.isConnecting || isLoading,
    accounts: walletState.accounts,
    activeAccount: walletState.activeAccount,
    error: walletState.error,
    connect,
    disconnect
  };
}

/**
 * Hook for wallet balance monitoring
 */
export function useWalletBalance() {
  const { walletState, refreshBalance, getAccountInfo } = useWallet();
  
  return {
    balance: walletState.balance,
    activeAccount: walletState.activeAccount,
    refreshBalance,
    getAccountInfo
  };
}

/**
 * Hook for transaction operations
 */
export function useWalletTransactions() {
  const { walletState, sendPayment, signTransaction, isLoading } = useWallet();
  
  return {
    isConnected: walletState.isConnected,
    activeAccount: walletState.activeAccount,
    balance: walletState.balance,
    sendPayment,
    signTransaction,
    isLoading
  };
}

export default useWallet;