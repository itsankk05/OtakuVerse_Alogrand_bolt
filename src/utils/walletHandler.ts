import { PeraWalletConnect } from '@perawallet/connect';
import algosdk from 'algosdk';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface WalletConfig {
  shouldShowSignTxnToast?: boolean;
  chainId?: number;
  bridge?: string;
  deep_link?: string;
}

export interface AlgodConfig {
  token: string;
  server: string;
  port: number;
  network: 'mainnet' | 'testnet' | 'betanet';
}

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  accounts: string[];
  activeAccount: string | null;
  balance: number;
  error: string | null;
}

export interface TransactionParams {
  from: string;
  to: string;
  amount: number;
  note?: string;
  fee?: number;
}

export interface SignedTransaction {
  txID: string;
  blob: Uint8Array;
}

export interface WalletEventHandlers {
  onConnect?: (accounts: string[]) => void;
  onDisconnect?: () => void;
  onAccountChange?: (account: string) => void;
  onError?: (error: Error) => void;
  onBalanceUpdate?: (balance: number) => void;
}

export interface AccountInfo {
  address: string;
  balance: number;
  minBalance: number;
  assets: any[];
  createdApps: number[];
  createdAssets: number[];
}

// ==========================================
// WALLET HANDLER CLASS
// ==========================================

export class WalletHandler {
  private peraWallet: PeraWalletConnect;
  private algodClient: algosdk.Algodv2;
  private state: WalletState;
  private eventHandlers: WalletEventHandlers;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private balanceCheckInterval: NodeJS.Timeout | null = null;

  constructor(
    walletConfig: WalletConfig = {},
    algodConfig: AlgodConfig = {
      token: '',
      server: 'https://testnet-api.algonode.cloud',
      port: 443,
      network: 'testnet'
    }
  ) {
    // Initialize Pera Wallet
    this.peraWallet = new PeraWalletConnect({
      shouldShowSignTxnToast: false,
      ...walletConfig
    });

    // Initialize Algod Client
    this.algodClient = new algosdk.Algodv2(
      algodConfig.token,
      algodConfig.server,
      algodConfig.port
    );

    // Initialize state
    this.state = {
      isConnected: false,
      isConnecting: false,
      accounts: [],
      activeAccount: null,
      balance: 0,
      error: null
    };

    this.eventHandlers = {};

    // Setup wallet event listeners
    this.setupEventListeners();

    console.log('🔧 WalletHandler initialized for', algodConfig.network);
  }

  // ==========================================
  // PUBLIC METHODS
  // ==========================================

  /**
   * Connect to the wallet
   * @returns Promise<string[]> - Array of connected account addresses
   */
  public async connect(): Promise<string[]> {
    try {
      this.setState({ isConnecting: true, error: null });
      console.log('🔌 Attempting to connect wallet...');

      const accounts = await this.peraWallet.connect();
      
      if (accounts.length === 0) {
        throw new Error('No accounts found in wallet');
      }

      await this.handleSuccessfulConnection(accounts);
      console.log('✅ Wallet connected successfully:', accounts);
      
      return accounts;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
      console.error('❌ Wallet connection failed:', errorMessage);
      
      this.setState({ 
        isConnecting: false, 
        error: errorMessage 
      });
      
      this.eventHandlers.onError?.(error instanceof Error ? error : new Error(errorMessage));
      throw error;
    }
  }

  /**
   * Disconnect from the wallet
   */
  public async disconnect(): Promise<void> {
    try {
      console.log('🔌 Disconnecting wallet...');
      
      // Stop balance monitoring
      this.stopBalanceMonitoring();
      
      // Disconnect from Pera Wallet
      this.peraWallet.disconnect();
      
      // Reset state
      this.setState({
        isConnected: false,
        isConnecting: false,
        accounts: [],
        activeAccount: null,
        balance: 0,
        error: null
      });

      // Clear local storage
      this.clearStoredData();
      
      console.log('✅ Wallet disconnected successfully');
      this.eventHandlers.onDisconnect?.();
    } catch (error) {
      console.error('❌ Error during disconnect:', error);
      this.eventHandlers.onError?.(error instanceof Error ? error : new Error('Disconnect failed'));
    }
  }

  /**
   * Attempt to reconnect to a previously connected wallet
   * @returns Promise<string[]> - Array of reconnected account addresses
   */
  public async reconnect(): Promise<string[]> {
    try {
      console.log('🔄 Attempting to reconnect wallet...');
      this.setState({ isConnecting: true, error: null });

      const accounts = await this.peraWallet.reconnectSession();
      
      if (accounts.length === 0) {
        throw new Error('No previous session found');
      }

      await this.handleSuccessfulConnection(accounts);
      console.log('✅ Wallet reconnected successfully:', accounts);
      
      this.reconnectAttempts = 0; // Reset counter on success
      return accounts;
    } catch (error) {
      console.error('❌ Wallet reconnection failed:', error);
      
      this.reconnectAttempts++;
      this.setState({ 
        isConnecting: false, 
        error: 'Reconnection failed' 
      });

      // Auto-retry with exponential backoff
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        const delay = Math.pow(2, this.reconnectAttempts) * 1000;
        console.log(`🔄 Retrying reconnection in ${delay}ms...`);
        
        setTimeout(() => {
          this.reconnect();
        }, delay);
      }

      throw error;
    }
  }

  /**
   * Sign a transaction
   * @param txn - Algorand transaction object
   * @returns Promise<SignedTransaction>
   */
  public async signTransaction(txn: algosdk.Transaction): Promise<SignedTransaction> {
    try {
      if (!this.state.isConnected || !this.state.activeAccount) {
        throw new Error('Wallet not connected');
      }

      console.log('✍️ Signing transaction...');
      
      const txnArray = [{ txn, signers: [this.state.activeAccount] }];
      console.log("🚧 Signing with txn array:", txnArray);
      const signedTxns = await this.peraWallet.signTransaction([
  {
    txn: txnArray,
    signers: []
  }
]);
      await algodClient.sendRawTransaction(signedTxn.blob()).do();

      if (!signedTxns[0]) {
        throw new Error('Transaction signing failed');
      }

      const signedTxn = {
        txID: txn.txID(),
        blob: signedTxns[0]
      };

      console.log('✅ Transaction signed successfully:', signedTxn.txID);
      return signedTxn;
    } catch (error) {
      console.error('❌ Transaction signing failed:', error);
      this.eventHandlers.onError?.(error instanceof Error ? error : new Error('Signing failed'));
      throw error;
    }
  }

  /**
   * Send a payment transaction
   * @param params - Transaction parameters
   * @returns Promise<string> - Transaction ID
   */
  public async sendPayment(params: TransactionParams): Promise<string> {
    try {
      if (!this.state.isConnected || !this.state.activeAccount) {
        throw new Error('Wallet not connected');
      }

      console.log('💸 Preparing payment transaction...', params);

      // Get suggested transaction parameters
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      // Create payment transaction
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: params.from,
        to: params.to,
        amount: algosdk.algosToMicroalgos(params.amount),
        note: params.note ? new TextEncoder().encode(params.note) : undefined,
        suggestedParams: {
          ...suggestedParams,
          fee: params.fee ? algosdk.algosToMicroalgos(params.fee) : suggestedParams.fee
        }
      });

      // Sign transaction
      const signedTxn = await this.signTransaction(txn);
      
      // Submit transaction
      console.log('📤 Submitting transaction to network...');
      const { txId } = await this.algodClient.sendRawTransaction(signedTxn.blob).do();
      
      // Wait for confirmation
      console.log('⏳ Waiting for transaction confirmation...');
      await this.waitForConfirmation(txId);
      
      console.log('✅ Payment transaction confirmed:', txId);
      
      // Update balance after successful transaction
      await this.updateBalance();
      
      return txId;
    } catch (error) {
      console.error('❌ Payment transaction failed:', error);
      this.eventHandlers.onError?.(error instanceof Error ? error : new Error('Payment failed'));
      throw error;
    }
  }

  /**
   * Get account information
   * @param address - Account address (optional, uses active account if not provided)
   * @returns Promise<AccountInfo>
   */
  public async getAccountInfo(address?: string): Promise<AccountInfo> {
    try {
      const accountAddress = address || this.state.activeAccount;
      
      if (!accountAddress) {
        throw new Error('No account address provided');
      }

      console.log('📊 Fetching account information for:', accountAddress);
      
      const accountInfo = await this.algodClient.accountInformation(accountAddress).do();
      
      const info: AccountInfo = {
        address: accountAddress,
        balance: accountInfo.amount / 1000000, // Convert microAlgos to Algos
        minBalance: accountInfo['min-balance'] / 1000000,
        assets: accountInfo.assets || [],
        createdApps: accountInfo['created-apps'] || [],
        createdAssets: accountInfo['created-assets'] || []
      };

      console.log('✅ Account info retrieved:', info);
      return info;
    } catch (error) {
      console.error('❌ Failed to get account info:', error);
      throw error;
    }
  }

  /**
   * Set event handlers
   * @param handlers - Object containing event handler functions
   */
  public setEventHandlers(handlers: WalletEventHandlers): void {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
    console.log('🎯 Event handlers updated');
  }

  /**
   * Get current wallet state
   * @returns WalletState
   */
  public getState(): WalletState {
    return { ...this.state };
  }

  /**
   * Check if address is valid Algorand address
   * @param address - Address to validate
   * @returns boolean
   */
  public isValidAddress(address: string): boolean {
    try {
      return algosdk.isValidAddress(address);
    } catch {
      return false;
    }
  }

  /**
   * Format address for display (truncated)
   * @param address - Full address
   * @param startChars - Number of characters to show at start (default: 6)
   * @param endChars - Number of characters to show at end (default: 4)
   * @returns string
   */
  public formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
    if (!address) return '';
    if (address.length <= startChars + endChars) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  }

  // ==========================================
  // PRIVATE METHODS
  // ==========================================

  /**
   * Setup wallet event listeners
   */
  private setupEventListeners(): void {
    // Listen for disconnect events
    this.peraWallet.connector?.on('disconnect', () => {
      console.log('🔌 Wallet disconnected via connector');
      this.handleDisconnection();
    });

    // Listen for account changes
    this.peraWallet.connector?.on('session_update', (error, payload) => {
      if (error) {
        console.error('❌ Session update error:', error);
        this.eventHandlers.onError?.(error);
        return;
      }

      if (payload?.params?.[0]?.accounts) {
        const accounts = payload.params[0].accounts;
        console.log('🔄 Account changed:', accounts);
        this.handleAccountChange(accounts);
      }
    });

    console.log('👂 Wallet event listeners setup complete');
  }

  /**
   * Handle successful wallet connection
   */
  private async handleSuccessfulConnection(accounts: string[]): Promise<void> {
    const activeAccount = accounts[0];
    
    this.setState({
      isConnected: true,
      isConnecting: false,
      accounts,
      activeAccount,
      error: null
    });

    // Store connection data
    this.storeConnectionData(accounts);
    
    // Start balance monitoring
    await this.updateBalance();
    this.startBalanceMonitoring();
    
    // Trigger event handlers
    this.eventHandlers.onConnect?.(accounts);
    this.eventHandlers.onAccountChange?.(activeAccount);
  }

  /**
   * Handle wallet disconnection
   */
  private handleDisconnection(): void {
    this.stopBalanceMonitoring();
    
    this.setState({
      isConnected: false,
      isConnecting: false,
      accounts: [],
      activeAccount: null,
      balance: 0,
      error: null
    });

    this.clearStoredData();
    this.eventHandlers.onDisconnect?.();
  }

  /**
   * Handle account change
   */
  private handleAccountChange(accounts: string[]): void {
    if (accounts.length === 0) {
      this.handleDisconnection();
      return;
    }

    const activeAccount = accounts[0];
    
    this.setState({
      accounts,
      activeAccount
    });

    this.updateBalance();
    this.eventHandlers.onAccountChange?.(activeAccount);
  }

  /**
   * Update wallet state
   */
  private setState(updates: Partial<WalletState>): void {
    this.state = { ...this.state, ...updates };
  }

  /**
   * Update account balance
   */
  private async updateBalance(): Promise<void> {
    try {
      if (!this.state.activeAccount) return;

      const accountInfo = await this.getAccountInfo(this.state.activeAccount);
      
      if (accountInfo.balance !== this.state.balance) {
        this.setState({ balance: accountInfo.balance });
        this.eventHandlers.onBalanceUpdate?.(accountInfo.balance);
      }
    } catch (error) {
      console.error('❌ Failed to update balance:', error);
    }
  }

  /**
   * Start periodic balance monitoring
   */
  private startBalanceMonitoring(): void {
    if (this.balanceCheckInterval) {
      clearInterval(this.balanceCheckInterval);
    }

    this.balanceCheckInterval = setInterval(() => {
      this.updateBalance();
    }, 30000); // Check every 30 seconds

    console.log('📊 Balance monitoring started');
  }

  /**
   * Stop balance monitoring
   */
  private stopBalanceMonitoring(): void {
    if (this.balanceCheckInterval) {
      clearInterval(this.balanceCheckInterval);
      this.balanceCheckInterval = null;
      console.log('📊 Balance monitoring stopped');
    }
  }

  /**
   * Wait for transaction confirmation
   */
  private async waitForConfirmation(txId: string, maxRounds: number = 10): Promise<void> {
    const status = await this.algodClient.status().do();
    let lastRound = status['last-round'];
    
    while (lastRound < status['last-round'] + maxRounds) {
      const pendingInfo = await this.algodClient.pendingTransactionInformation(txId).do();
      
      if (pendingInfo['confirmed-round'] !== null && pendingInfo['confirmed-round'] > 0) {
        console.log('✅ Transaction confirmed in round:', pendingInfo['confirmed-round']);
        return;
      }
      
      lastRound++;
      await this.algodClient.statusAfterBlock(lastRound).do();
    }
    
    throw new Error('Transaction not confirmed within maximum rounds');
  }

  /**
   * Store connection data in localStorage
   */
  private storeConnectionData(accounts: string[]): void {
    try {
      localStorage.setItem('wallet_accounts', JSON.stringify(accounts));
      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('wallet_last_connected', Date.now().toString());
    } catch (error) {
      console.warn('⚠️ Failed to store connection data:', error);
    }
  }

  /**
   * Clear stored connection data
   */
  private clearStoredData(): void {
    try {
      localStorage.removeItem('wallet_accounts');
      localStorage.removeItem('wallet_connected');
      localStorage.removeItem('wallet_last_connected');
      localStorage.removeItem('walletconnect');
    } catch (error) {
      console.warn('⚠️ Failed to clear stored data:', error);
    }
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Create a new wallet handler instance
 * @param walletConfig - Wallet configuration options
 * @param algodConfig - Algorand node configuration
 * @returns WalletHandler instance
 */
export function createWalletHandler(
  walletConfig?: WalletConfig,
  algodConfig?: AlgodConfig
): WalletHandler {
  return new WalletHandler(walletConfig, algodConfig);
}

/**
 * Convert Algos to microAlgos
 * @param algos - Amount in Algos
 * @returns Amount in microAlgos
 */
export function algosToMicroalgos(algos: number): number {
  return algosdk.algosToMicroalgos(algos);
}

/**
 * Convert microAlgos to Algos
 * @param microalgos - Amount in microAlgos
 * @returns Amount in Algos
 */
export function microalgosToAlgos(microalgos: number): number {
  return microalgos / 1000000;
}

/**
 * Generate a random note for transactions
 * @param length - Length of the note (default: 16)
 * @returns Random string
 */
export function generateTransactionNote(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ==========================================
// DEFAULT EXPORT
// ==========================================

export default WalletHandler;