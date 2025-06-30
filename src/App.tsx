import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Watch from './pages/Watch';
import Anime from './pages/Anime';
import StreamingAnime from './pages/StreamingAnime';
import Collection from './pages/Collection';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import UploadAnime from './pages/UploadAnime';
import WalletConnect from './pages/WalletConnect';
import RoleSelection from './pages/RoleSelection';
import { UserProvider, useUser } from './context/UserContext';
import { WalletProvider, useWallet } from './context/WalletContext';

// App content component that has access to contexts
const AppContent: React.FC = () => {
  const { isConnected, walletAddress } = useWallet();
  const { user, updateUser } = useUser();
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  // Sync wallet address to user context when wallet is connected
  useEffect(() => {
    if (isConnected && walletAddress && user.walletAddress !== walletAddress) {
      updateUser({ walletAddress });
    }
  }, [isConnected, walletAddress, user.walletAddress, updateUser]);

  // Determine what to show based on wallet connection and user type
  useEffect(() => {
    if (isConnected && !user.userType) {
      setShowRoleSelection(true);
    } else {
      setShowRoleSelection(false);
    }
  }, [isConnected, user.userType]);

  // Show wallet connection screen if not connected
  if (!isConnected) {
    return (
      <WalletConnect 
        onSuccess={() => {
          // Will be handled by useEffect above
        }} 
      />
    );
  }

  // Show role selection if wallet is connected but no role selected
  if (showRoleSelection) {
    return (
      <RoleSelection 
        onRoleSelected={() => {
          setShowRoleSelection(false);
        }} 
      />
    );
  }

  // Show main app if wallet connected and role selected
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/anime" element={<Layout><Anime /></Layout>} />
            <Route path="/streaming/:id" element={<Layout><StreamingAnime /></Layout>} />
            <Route path="/watch/:id" element={<Layout><Watch /></Layout>} />
            <Route path="/collection" element={<Layout><Collection /></Layout>} />
            <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/upload" element={<Layout><UploadAnime /></Layout>} />
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

function App() {
  return (
    <WalletProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </WalletProvider>
  );
}

export default App;