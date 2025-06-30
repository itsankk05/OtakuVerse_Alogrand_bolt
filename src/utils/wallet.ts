import { PeraWalletConnect } from '@perawallet/connect';
import algosdk from 'algosdk';

// Initialize Pera Wallet
export const peraWallet = new PeraWalletConnect({
  chainId: 416002, // Changed from 416001 (MainNet) to 416002 (TestNet)
  shouldShowSignTxnToast: false,
});

// Algorand node configuration (using TestNet for development)
const algodToken = '';
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = 443;

export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Connect to wallet and return first account address
export const connectWallet = async (): Promise<string> => {
  try {
    const accounts = await peraWallet.connect();
    
    if (accounts.length === 0) {
      throw new Error('No accounts found in wallet');
    }

    // Setup disconnect event listener
    peraWallet.connector?.on('disconnect', () => {
      // Handle disconnect
      localStorage.removeItem('walletconnect');
      localStorage.removeItem('otakuverse_user_type');
      window.location.reload();
    });

    return accounts[0]; // Return user wallet address
  } catch (error) {
    console.error('Failed to connect to Pera Wallet:', error);
    throw error;
  }
};

// Sign transaction with Pera Wallet - accepts Transaction object
export const signTxnWithPera = async (txn: algosdk.Transaction): Promise<Uint8Array> => {
  const account = (await peraWallet.reconnectSession())[0]; // ensure account

  const txGroup: algosdk.SignerTransaction[] = [
    { txn, signers: [account] }
  ];

  const signedGroups = await peraWallet.signTransaction([ txGroup ], account);

  // `signedGroups` is Uint8Array[] for each group → take first
  return signedGroups[0];
};

// Disconnect wallet
export const disconnectWallet = (): void => {
  peraWallet.disconnect();
  localStorage.removeItem('walletconnect');
  localStorage.removeItem('otakuverse_user_type');
};

// Reconnect to existing session
export const reconnectWallet = async (): Promise<string[]> => {
  try {
    const accounts = await peraWallet.reconnectSession();
    return accounts;
  } catch (error) {
    console.error('Failed to reconnect wallet:', error);
    return [];
  }
};

// Check if wallet is connected
export const isWalletConnected = (): boolean => {
  return peraWallet.isConnected;
};

// Get account balance
export const getAccountBalance = async (address: string): Promise<number> => {
  try {
    const accountInfo = await algodClient.accountInformation(address).do();
    return accountInfo.amount / 1000000; // Convert microAlgos to Algos
  } catch (error) {
    console.error('Failed to get account balance:', error);
    return 0;
  }
};

// Format wallet address for display
export const formatWalletAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Validate Algorand address
export const isValidAlgorandAddress = (address: string): boolean => {
  try {
    return algosdk.isValidAddress(address);
  } catch {
    return false;
  }
};

// Helper function to safely decode base64 and create transaction
export const decodeTransactionFromBase64 = (base64Txn: string): algosdk.Transaction => {
  try {
    // Validate base64 string format
    if (!base64Txn || typeof base64Txn !== 'string') {
      throw new Error('Invalid base64 transaction string');
    }

    // Remove any whitespace and validate base64 format
    const cleanBase64 = base64Txn.trim();
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
      throw new Error('Invalid base64 format');
    }

    // Decode base64 to bytes
    const txnBytes = Uint8Array.from(atob(cleanBase64), c => c.charCodeAt(0));
    
    // Decode unsigned transaction
    const transaction = algosdk.decodeUnsignedTransaction(txnBytes);
    
    return transaction;
  } catch (error) {
    console.error('Failed to decode transaction from base64:', error);
    throw new Error(`Transaction decoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};