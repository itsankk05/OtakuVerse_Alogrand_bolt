import { WalletHandler, createWalletHandler, WalletEventHandlers } from '../utils/walletHandler';

// ==========================================
// USAGE EXAMPLES
// ==========================================

/**
 * Example 1: Basic Wallet Connection
 */
export async function basicWalletConnection() {
  console.log('📝 Example 1: Basic Wallet Connection');
  
  // Create wallet handler instance
  const walletHandler = createWalletHandler();
  
  try {
    // Connect to wallet
    const accounts = await walletHandler.connect();
    console.log('Connected accounts:', accounts);
    
    // Get wallet state
    const state = walletHandler.getState();
    console.log('Wallet state:', state);
    
    // Get account information
    const accountInfo = await walletHandler.getAccountInfo();
    console.log('Account info:', accountInfo);
    
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

/**
 * Example 2: Wallet with Event Handlers
 */
export async function walletWithEventHandlers() {
  console.log('📝 Example 2: Wallet with Event Handlers');
  
  const walletHandler = createWalletHandler();
  
  // Setup event handlers
  const eventHandlers: WalletEventHandlers = {
    onConnect: (accounts) => {
      console.log('🎉 Wallet connected!', accounts);
      // Update UI state
      updateUIConnectedState(accounts);
    },
    
    onDisconnect: () => {
      console.log('👋 Wallet disconnected!');
      // Reset UI state
      resetUIState();
    },
    
    onAccountChange: (account) => {
      console.log('🔄 Account changed:', account);
      // Update active account in UI
      updateActiveAccount(account);
    },
    
    onError: (error) => {
      console.error('❌ Wallet error:', error);
      // Show error notification
      showErrorNotification(error.message);
    },
    
    onBalanceUpdate: (balance) => {
      console.log('💰 Balance updated:', balance);
      // Update balance display
      updateBalanceDisplay(balance);
    }
  };
  
  walletHandler.setEventHandlers(eventHandlers);
  
  try {
    await walletHandler.connect();
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

/**
 * Example 3: Sending a Payment Transaction
 */
export async function sendPaymentExample() {
  console.log('📝 Example 3: Sending Payment Transaction');
  
  const walletHandler = createWalletHandler();
  
  try {
    // Connect wallet first
    await walletHandler.connect();
    
    const state = walletHandler.getState();
    if (!state.activeAccount) {
      throw new Error('No active account');
    }
    
    // Send payment
    const txId = await walletHandler.sendPayment({
      from: state.activeAccount,
      to: 'RECEIVER_ADDRESS_HERE', // Replace with actual receiver address
      amount: 1.0, // 1 ALGO
      note: 'Test payment from OtakuVerse'
    });
    
    console.log('✅ Payment sent successfully:', txId);
    
  } catch (error) {
    console.error('Payment failed:', error);
  }
}

/**
 * Example 4: Custom Transaction Signing
 */
export async function customTransactionExample() {
  console.log('📝 Example 4: Custom Transaction Signing');
  
  const walletHandler = createWalletHandler();
  
  try {
    await walletHandler.connect();
    
    const state = walletHandler.getState();
    if (!state.activeAccount) {
      throw new Error('No active account');
    }
    
    // Get Algorand SDK for creating custom transactions
    const algosdk = await import('algosdk');
    
    // Get suggested parameters
    const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', 443);
    const suggestedParams = await algodClient.getTransactionParams().do();
    
    // Create a custom transaction (example: application call)
    const txn = algosdk.makeApplicationNoOpTxnFromObject({
      from: state.activeAccount,
      appIndex: 123456, // Replace with actual app ID
      suggestedParams,
      appArgs: [new TextEncoder().encode('custom_method')]
    });
    
    // Sign the transaction
    const signedTxn = await walletHandler.signTransaction(txn);
    console.log('✅ Transaction signed:', signedTxn.txID);
    
    // Submit to network (optional)
    // const result = await algodClient.sendRawTransaction(signedTxn.blob).do();
    
  } catch (error) {
    console.error('Custom transaction failed:', error);
  }
}

/**
 * Example 5: Wallet Reconnection on App Load
 */
export async function walletReconnectionExample() {
  console.log('📝 Example 5: Wallet Reconnection on App Load');
  
  const walletHandler = createWalletHandler();
  
  // Setup event handlers first
  walletHandler.setEventHandlers({
    onConnect: (accounts) => {
      console.log('🔄 Reconnected to wallet:', accounts);
    },
    onError: (error) => {
      console.log('❌ Reconnection failed:', error.message);
      // Show connect button to user
      showConnectButton();
    }
  });
  
  try {
    // Attempt to reconnect to previous session
    await walletHandler.reconnect();
    console.log('✅ Successfully reconnected to previous session');
    
  } catch (error) {
    console.log('ℹ️ No previous session found, showing connect button');
    showConnectButton();
  }
}

/**
 * Example 6: Error Handling Scenarios
 */
export async function errorHandlingExamples() {
  console.log('📝 Example 6: Error Handling Scenarios');
  
  const walletHandler = createWalletHandler();
  
  // Example: Handle connection timeout
  try {
    // Set a timeout for connection
    const connectionPromise = walletHandler.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 30000)
    );
    
    await Promise.race([connectionPromise, timeoutPromise]);
    
  } catch (error) {
    if (error instanceof Error && error.message === 'Connection timeout') {
      console.error('⏰ Connection timed out');
      // Show timeout message to user
    } else {
      console.error('❌ Connection failed:', error);
    }
  }
  
  // Example: Handle insufficient balance
  try {
    const state = walletHandler.getState();
    if (state.balance < 1.0) {
      throw new Error('Insufficient balance for transaction');
    }
    
    await walletHandler.sendPayment({
      from: state.activeAccount!,
      to: 'RECEIVER_ADDRESS',
      amount: 1.0
    });
    
  } catch (error) {
    if (error instanceof Error && error.message.includes('Insufficient')) {
      console.error('💸 Insufficient balance');
      // Show balance error to user
    }
  }
  
  // Example: Handle invalid address
  const testAddress = 'invalid_address';
  if (!walletHandler.isValidAddress(testAddress)) {
    console.error('❌ Invalid Algorand address:', testAddress);
    // Show address validation error
  }
}

/**
 * Example 7: React Hook Integration
 */
export function useWalletHandler() {
  // This would be implemented as a React hook
  console.log('📝 Example 7: React Hook Integration Pattern');
  
  // Example implementation pattern:
  /*
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    accounts: [],
    activeAccount: null,
    balance: 0,
    error: null
  });
  
  const walletHandler = useMemo(() => createWalletHandler(), []);
  
  useEffect(() => {
    walletHandler.setEventHandlers({
      onConnect: (accounts) => {
        setWalletState(walletHandler.getState());
      },
      onDisconnect: () => {
        setWalletState(walletHandler.getState());
      },
      onAccountChange: (account) => {
        setWalletState(walletHandler.getState());
      },
      onBalanceUpdate: (balance) => {
        setWalletState(walletHandler.getState());
      },
      onError: (error) => {
        setWalletState(walletHandler.getState());
      }
    });
    
    // Attempt reconnection on mount
    walletHandler.reconnect().catch(() => {
      // Ignore reconnection errors on initial load
    });
  }, [walletHandler]);
  
  return {
    walletState,
    connect: () => walletHandler.connect(),
    disconnect: () => walletHandler.disconnect(),
    sendPayment: (params) => walletHandler.sendPayment(params),
    signTransaction: (txn) => walletHandler.signTransaction(txn),
    getAccountInfo: (address) => walletHandler.getAccountInfo(address),
    formatAddress: (address) => walletHandler.formatAddress(address),
    isValidAddress: (address) => walletHandler.isValidAddress(address)
  };
  */
}

// ==========================================
// MOCK UI FUNCTIONS (for example purposes)
// ==========================================

function updateUIConnectedState(accounts: string[]) {
  console.log('🎨 UI: Updating connected state with accounts:', accounts);
}

function resetUIState() {
  console.log('🎨 UI: Resetting to disconnected state');
}

function updateActiveAccount(account: string) {
  console.log('🎨 UI: Updating active account:', account);
}

function showErrorNotification(message: string) {
  console.log('🎨 UI: Showing error notification:', message);
}

function updateBalanceDisplay(balance: number) {
  console.log('🎨 UI: Updating balance display:', balance);
}

function showConnectButton() {
  console.log('🎨 UI: Showing connect wallet button');
}

// ==========================================
// EXPORT ALL EXAMPLES
// ==========================================

export const walletExamples = {
  basicWalletConnection,
  walletWithEventHandlers,
  sendPaymentExample,
  customTransactionExample,
  walletReconnectionExample,
  errorHandlingExamples,
  useWalletHandler
};

export default walletExamples;