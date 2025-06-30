import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { connectWallet, signTxnWithPera, disconnectWallet, reconnectWallet } from '../utils/wallet';

interface WalletContextType {
  walletAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  signTxnWithPera: (txn: Uint8Array) => Promise<Uint8Array>;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const accounts = await reconnectWallet();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.log('No existing session found');
      }
    };

    checkConnection();
  }, []);

  const connect = async (): Promise<void> => {
    setIsConnecting(true);
    setError(null);

    try {
      const address = await connectWallet();
      setWalletAddress(address);
      setIsConnected(true);
    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      setError(error.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = (): void => {
    disconnectWallet();
    setWalletAddress(null);
    setIsConnected(false);
    setError(null);
  };

  const clearError = (): void => {
    setError(null);
  };

  return (
    <WalletContext.Provider value={{
      walletAddress,
      isConnected,
      isConnecting,
      error,
      connect,
      disconnect,
      signTxnWithPera,
      clearError
    }}>
      {children}
    </WalletContext.Provider>
  );
};