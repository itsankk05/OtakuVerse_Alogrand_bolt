import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NFT {
  id: string;
  name: string;
  image: string;
  anime: string;
  episode: number;
  watchTime: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  price?: number;
  isListed: boolean;
  mintedAt: Date;
}

interface AnimeContent {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  episodes: number;
  creatorId: string;
  createdAt: Date;
  nftCollection?: NFT[];
  status: 'draft' | 'published' | 'pending';
  views?: number;
  likes?: number;
  genres?: string[];
}

interface User {
  id: string;
  username: string;
  userType: 'creator' | 'user' | null;
  walletAddress?: string;
  totalWatchTime: number;
  nftsOwned: NFT[];
  createdContent?: AnimeContent[];
}

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  setUserType: (type: 'creator' | 'user') => void;
  clearUserType: () => void;
  addWatchTime: (minutes: number) => void;
  mintNFT: (nft: Omit<NFT, 'id' | 'mintedAt'>) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info'; show: boolean } | null;
  publishedAnimes: AnimeContent[];
  addPublishedAnime: (anime: AnimeContent) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: '1',
    username: 'AnimeOtaku_2024',
    userType: null,
    totalWatchTime: 142,
    nftsOwned: [
      {
        id: 'nft1',
        name: 'Naruto Episode 1 Viewer',
        image: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
        anime: 'Naruto',
        episode: 1,
        watchTime: 24,
        rarity: 'Common',
        isListed: false,
        mintedAt: new Date('2024-01-15')
      },
      {
        id: 'nft2',
        name: 'Attack on Titan Dedication',
        image: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg',
        anime: 'Attack on Titan',
        episode: 5,
        watchTime: 45,
        rarity: 'Rare',
        price: 2.5,
        isListed: true,
        mintedAt: new Date('2024-01-18')
      }
    ],
    createdContent: []
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; show: boolean } | null>(null);
  const [publishedAnimes, setPublishedAnimes] = useState<AnimeContent[]>([]);

  // Load user type from localStorage on mount
  useEffect(() => {
    const savedUserType = localStorage.getItem('otakuverse_user_type') as 'creator' | 'user' | null;
    if (savedUserType) {
      setUser(prev => ({ ...prev, userType: savedUserType }));
    }
  }, []);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast(prev => prev ? { ...prev, show: false } : null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const setUserType = (type: 'creator' | 'user') => {
    localStorage.setItem('otakuverse_user_type', type);
    setUser(prev => ({ ...prev, userType: type }));
  };

  const clearUserType = () => {
    localStorage.removeItem('otakuverse_user_type');
    setUser(prev => ({ ...prev, userType: null }));
  };

  const addWatchTime = (minutes: number) => {
    setUser(prev => ({
      ...prev,
      totalWatchTime: prev.totalWatchTime + minutes
    }));
  };

  const mintNFT = (nftData: Omit<NFT, 'id' | 'mintedAt'>) => {
    const newNFT: NFT = {
      ...nftData,
      id: `nft_${Date.now()}`,
      mintedAt: new Date()
    };
    
    setUser(prev => ({
      ...prev,
      nftsOwned: [...prev.nftsOwned, newNFT]
    }));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, show: true });
  };

  const addPublishedAnime = (anime: AnimeContent) => {
    setPublishedAnimes(prev => [...prev, anime]);
    setUser(prev => ({
      ...prev,
      createdContent: [...(prev.createdContent || []), anime]
    }));
  };

  return (
    <UserContext.Provider value={{
      user,
      updateUser,
      setUserType,
      clearUserType,
      addWatchTime,
      mintNFT,
      showToast,
      toast,
      publishedAnimes,
      addPublishedAnime
    }}>
      {children}
      
      {/* Toast Notification */}
      {toast?.show && toast.message && toast.type && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className={`glass-card p-4 border ${
            toast.type === 'success' ? 'border-green-400/30 bg-green-500/10' :
            toast.type === 'error' ? 'border-red-400/30 bg-red-500/10' :
            'border-blue-400/30 bg-blue-500/10'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                toast.type === 'success' ? 'bg-green-400' :
                toast.type === 'error' ? 'bg-red-400' :
                'bg-blue-400'
              }`}></div>
              <span className={`font-medium ${
                toast.type === 'success' ? 'text-green-400' :
                toast.type === 'error' ? 'text-red-400' :
                'text-blue-400'
              }`}>
                {toast.message}
              </span>
              <button
                onClick={() => setToast(prev => prev ? { ...prev, show: false } : null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </UserContext.Provider>
  );
};