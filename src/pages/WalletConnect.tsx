import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Shield, 
  Zap, 
  AlertCircle, 
  RefreshCw,
  CheckCircle,
  ExternalLink,
  Play
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import whiteCircleImage from '../assets/white_circle_360x360.png';

interface WalletConnectProps {
  onSuccess: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onSuccess }) => {
  const { isConnected, isConnecting, error, connect, clearError } = useWallet();

  useEffect(() => {
    if (isConnected) {
      onSuccess();
    }
  }, [isConnected, onSuccess]);

  const handleConnect = async () => {
    clearError();
    await connect();
  };

  const Particles = () => (
    <div className="particles">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${6 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Particles />
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
      
      {/* White Circle Image - Top Right */}
      <a 
        href="https://bolt.new" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute top-8 right-8 z-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full hover:scale-110 transition-transform duration-200" 
        title="Visit bolt.new"
      >
        <img
          src={whiteCircleImage}
          alt="Visit bolt.new"
          className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain animate-float opacity-60 hover:opacity-100 transition-opacity duration-200"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))'
          }}
        />
      </a>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          {/* OtakuVerse Logo and Header */}
          <div className="text-center mb-8">
            {/* OtakuVerse Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="flex items-center justify-center space-x-3 mb-6"
            >
              <div className="w-16 h-16 anime-gradient rounded-full flex items-center justify-center animate-pulse-glow">
                <Play className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-orbitron font-bold text-anime-gradient">
                  OtakuVerse
                </h1>
                <p className="text-sm text-gray-400 font-medium">
                  Web3 Anime Platform
                </p>
              </div>
            </motion.div>
            
            {/* Wallet Connection Header */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 anime-gradient rounded-full flex items-center justify-center animate-pulse-glow"
            >
              <Wallet className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-orbitron font-bold text-white mb-2"
            >
              Connect Your Wallet
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400"
            >
              Connect your Algorand wallet to access OtakuVerse
            </motion.p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 mb-6 border border-red-500/30 bg-red-500/10"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-red-400 font-semibold text-sm mb-1">Connection Failed</h3>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Wallet Connection Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-8 border-2 border-purple-500/30"
          >
            {/* Pera Wallet Option */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 rounded-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                  {isConnecting ? (
                    <RefreshCw className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Wallet className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors">
                    {isConnecting ? 'Connecting...' : 'Pera Wallet'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {isConnecting ? 'Please check your wallet' : 'Connect with Pera Wallet'}
                  </p>
                </div>
                
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-300 transition-colors" />
              </div>
            </motion.button>

            {/* Features */}
            <div className="mt-8 space-y-4">
              <h4 className="text-white font-semibold text-center mb-4">Why Connect Your Wallet?</h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-gray-300 text-sm">Secure blockchain transactions</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300 text-sm">Earn NFTs while watching anime</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-gray-300 text-sm">Trade collectibles on marketplace</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-6"
          >
            <p className="text-gray-500 text-sm">
              Don't have a wallet?{' '}
              <a 
                href="https://perawallet.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Download Pera Wallet
              </a>
            </p>
          </motion.div>

          {/* Footer Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8 pt-6 border-t border-purple-500/20"
          >
            <p className="text-gray-500 text-xs">
              Powered by Algorand Blockchain
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Built with ❤️ by{' '}
              <a 
                href="https://bolt.new" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Bolt.new
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WalletConnect;