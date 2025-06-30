import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Play, 
  Gem, 
  ShoppingBag, 
  User, 
  Wallet,
  Bell,
  Search,
  Menu,
  X,
  Upload,
  Crown,
  RefreshCw,
  Monitor
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useWallet } from '../context/WalletContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearUserType } = useUser();
  const { walletAddress, disconnect, isConnected } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Anime', href: '/anime', icon: Monitor },
    { name: 'Collection', href: '/collection', icon: Gem },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  // Add Upload Anime for creators - insert after Anime but before Collection
  const navigation = user.userType === 'creator' 
    ? [
        baseNavigation[0], // Dashboard
        baseNavigation[1], // Anime
        { name: 'Upload Anime', href: '/upload', icon: Upload }, // Insert Upload here
        ...baseNavigation.slice(2) // Collection, Marketplace, Profile
      ]
    : baseNavigation;

  const handleDisconnectWallet = () => {
    disconnect();
    clearUserType();
    navigate('/');
  };

  const handleSwitchRole = () => {
    clearUserType();
    // Stay on current page but trigger role selection
    window.location.reload();
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Close mobile menu when clicking outside or on navigation
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="glass-card border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container-responsive">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 anime-gradient rounded-lg flex items-center justify-center animate-pulse-glow">
                <Play className="w-5 h-5 text-white" />
              </div>
              <span className="text-responsive-lg font-orbitron font-bold text-anime-gradient hidden xs:block">
                OtakuVerse
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-4 xl:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-responsive-sm ${
                      isActive 
                        ? 'anime-gradient text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium hidden xl:block">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* User Type Badge */}
              {user.userType && (
                <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold border hidden sm:flex items-center ${
                  user.userType === 'creator' 
                    ? 'bg-anime-purple/20 text-anime-purple border-anime-purple/30' 
                    : 'bg-anime-cyan/20 text-anime-cyan border-anime-cyan/30'
                }`}>
                  {user.userType === 'creator' && <Crown className="w-3 h-3 mr-1" />}
                  <span className="hidden md:inline">
                    {user.userType === 'creator' ? 'Creator' : 'User'}
                  </span>
                </div>
              )}

              {/* Search Button */}
              <button className="p-2 text-gray-400 hover:text-white transition-colors hidden md:block">
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-white transition-colors hidden md:block">
                <Bell className="w-5 h-5" />
              </button>
              
              {/* Wallet Info - Desktop */}
              {walletAddress && isConnected && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDisconnectWallet}
                  className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-green-500/20 hover:bg-red-500/20 text-green-400 hover:text-red-400 border border-green-400/30 hover:border-red-400/30 rounded-lg transition-all duration-200 text-responsive-sm"
                  title="Click to disconnect wallet"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="font-mono">{formatWalletAddress(walletAddress)}</span>
                </motion.button>
              )}

              {/* Switch Role Button - Desktop */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSwitchRole}
                className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 transition-all duration-200 text-responsive-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="font-medium hidden xl:block">Switch Role</span>
              </motion.button>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={closeMobileMenu}
              />
              
              {/* Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-purple-500/20 z-50"
              >
                <div className="container-responsive py-4 space-y-2">
                  {/* Navigation Links */}
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={closeMobileMenu}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-responsive-base ${
                          isActive 
                            ? 'anime-gradient text-white' 
                            : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}

                  {/* Mobile-only actions */}
                  <div className="pt-4 border-t border-purple-500/20 space-y-2">
                    {/* Search */}
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-200">
                      <Search className="w-5 h-5" />
                      <span className="font-medium">Search</span>
                    </button>

                    {/* Notifications */}
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-200">
                      <Bell className="w-5 h-5" />
                      <span className="font-medium">Notifications</span>
                    </button>

                    {/* Wallet Info - Mobile */}
                    {walletAddress && isConnected && (
                      <button
                        onClick={() => {
                          handleDisconnectWallet();
                          closeMobileMenu();
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 bg-green-500/20 hover:bg-red-500/20 text-green-400 hover:text-red-400 border border-green-400/30 hover:border-red-400/30 rounded-lg transition-all duration-200"
                      >
                        <Wallet className="w-5 h-5" />
                        <div className="flex-1 text-left">
                          <span className="font-mono text-sm">{formatWalletAddress(walletAddress)}</span>
                          <p className="text-xs opacity-75">Tap to disconnect</p>
                        </div>
                      </button>
                    )}

                    {/* Switch Role - Mobile */}
                    <button
                      onClick={() => {
                        handleSwitchRole();
                        closeMobileMenu();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 transition-all duration-200"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span className="font-medium">Switch Role</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-purple-500/20 mt-16">
        <div className="container-responsive py-8">
          <div className="text-center text-gray-400">
            <p className="text-responsive-sm">
              Built with ❤️ by{' '}
              <a 
                href="https://bolt.new" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-anime-purple hover:text-anime-pink transition-colors"
              >
                Bolt.new
              </a>
            </p>
            <p className="text-responsive-xs mt-2">
              OtakuVerse - Powered by Algorand Blockchain
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;