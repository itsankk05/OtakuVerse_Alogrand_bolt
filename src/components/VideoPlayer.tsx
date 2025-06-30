import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  RotateCcw,
  Share,
  Bookmark,
  Loader,
  ExternalLink,
  AlertCircle,
  Gem,
  Sparkles,
  Gift,
  CheckCircle
} from 'lucide-react';
import { getFirstNFTFromCollection, IPFSNFTMetadata } from '../data/nftCollections';
import { nftMintingService, AnimeAPIResponse, NFTFromAPI } from '../services/nftMintingService';
import { useUser } from '../context/UserContext';
import { useWallet } from '../context/WalletContext';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  episode: number;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
  startTime?: number;
  onError?: (error: string) => void;
  onNFTMint?: (nftData: any) => void;
  animeId?: string;
  className?: string;
  // Add anime data directly as prop to avoid dependency on useAnimeData
  animeData?: {
    id: string;
    title: string;
    description: string;
    episodes: number;
    thumbnail: string;
    status: string;
    nftCollection?: any[];
    
    creator?: {
      id: string;
      username: string;
      walletAddress?: string;
    };
    createdAt: string;
    views?: number;
    likes?: number;
    genres?: string[];
  };
}

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  isLoading: boolean;
  showControls: boolean;
  error: string | null;
  canMintNFT: boolean;
  hasMinutedNFT: boolean;
  showMintButton: boolean;
  isMinting: boolean;
  isVideoReady: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  title,
  episode,
  onProgress,
  onComplete,
  autoPlay = false,
  startTime = 0,
  onError,
  onNFTMint,
  animeId,
  className = '',
  animeData // Use anime data passed as prop
}) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const mintButtonTimeoutRef = useRef<NodeJS.Timeout>();

  const { user, showToast } = useUser();
  const { walletAddress } = useWallet();

  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isMuted: false,
    isFullscreen: false,
    isLoading: true,
    showControls: true,
    error: null,
    canMintNFT: false,
    hasMinutedNFT: false,
    showMintButton: false,
    isMinting: false,
    isVideoReady: false
  });

  const [showMintSuccess, setShowMintSuccess] = useState(false);

  // Sample video files
  const sampleVideos = [
    {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      title: 'Big Buck Bunny',
      description: 'A short computer-animated comedy film',
      poster: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg'
    },
    {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      title: 'Elephants Dream',
      description: 'An open source computer animated short film',
      poster: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg'
    },
    {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'For Bigger Blazes',
      description: 'A sample video for testing purposes',
      poster: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg'
    },
    {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      title: 'For Bigger Escapes',
      description: 'Another sample video for demonstration',
      poster: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg'
    }
  ];

  // Get current video based on episode
  const getCurrentVideo = () => {
    const index = episode ? (episode - 1) % sampleVideos.length : 0;
    return sampleVideos[index];
  };

  const currentVideo = getCurrentVideo();

  // Convert anime data to API response format
  const getCurrentAnimeData = useCallback((): AnimeAPIResponse | null => {
    if (!animeData) {
      console.log('❌ No anime data provided to VideoPlayer');
      return null;
    }
    
    console.log('✅ Using anime data from props:', {
      title: animeData.title,
      nftCollectionSize: animeData.nftCollection?.length || 0,
      creatorId: animeData.creator?.id,
      creatorUsername: animeData.creator?.username,
      creatorWallet: animeData.creator?.walletAddress
    });

    // Convert to API response format
    return {
      id: animeData.id,
      title: animeData.title,
      description: animeData.description,
      episodes: animeData.episodes,
      thumbnail: animeData.thumbnail,
      status: animeData.status,
      nftCollection: animeData.nftCollection as NFTFromAPI[] || [],
      creator_id: animeData.creator?.id, // Fixed: use animeData.creator.id instead of animeData.creatorId
      creator_username: animeData.creator?.username,
      creator_wallet: animeData.creator?.walletAddress,
      created_at: animeData.createdAt,
      views: animeData.views,
      likes: animeData.likes,
      genres: animeData.genres
    };
  }, [animeData]);

  // Update state helper
  const updateState = useCallback((updates: Partial<PlayerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Video event handlers
  const handleLoadStart = useCallback(() => {
    console.log('📹 Video load started');
    updateState({ isLoading: true, error: null });
  }, [updateState]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      console.log('📹 Video metadata loaded, duration:', duration, 'seconds');
      
      updateState({ 
        duration,
        isVideoReady: true,
        isLoading: false
      });

      // Set start time if provided
      if (startTime > 0 && startTime < duration) {
        videoRef.current.currentTime = startTime;
      }
    }
  }, [updateState, startTime]);

  const handleCanPlay = useCallback(() => {
    console.log('📹 Video can play');
    updateState({ isLoading: false });
  }, [updateState]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && state.isVideoReady) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      
      // Debug logging every 10 seconds
      if (Math.floor(currentTime) % 10 === 0 && Math.floor(currentTime) !== Math.floor(state.currentTime)) {
        console.log('⏰ Video time update:', {
          currentTime: Math.floor(currentTime),
          duration: Math.floor(duration),
          minutesWatched: Math.floor(currentTime / 60),
          canMintNFT: state.canMintNFT,
          hasMinutedNFT: state.hasMinutedNFT,
          showMintButton: state.showMintButton
        });
      }
      
      updateState({ currentTime, duration });
      
      // NFT minting logic - Check for 23 minutes (1380 seconds) OR 90% of video duration for testing
      const nftUnlockTime = Math.min(1380, duration * 0.9); // 23 minutes OR 90% of video (whichever is shorter)
      
      if (currentTime >= nftUnlockTime && !state.hasMinutedNFT && !state.canMintNFT) {
        console.log('🎁 NFT unlock threshold reached!', {
          currentTime,
          nftUnlockTime,
          duration,
          percentageWatched: (currentTime / duration) * 100
        });
        
        updateState({ 
          canMintNFT: true,
          showMintButton: true 
        });
        
        // Show toast notification
        showToast('🎁 NFT unlock available! Click the mint button to claim your reward!', 'success');
      }
      
      // Call progress callback
      onProgress?.(currentTime);
    }
  }, [updateState, state.hasMinutedNFT, state.canMintNFT, state.isVideoReady, state.currentTime, onProgress, showToast]);

  const handlePlay = useCallback(() => {
    console.log('📹 Video playing');
    updateState({ isPlaying: true });
  }, [updateState]);

  const handlePause = useCallback(() => {
    console.log('📹 Video paused');
    updateState({ isPlaying: false });
  }, [updateState]);

  const handleEnded = useCallback(() => {
    console.log('📹 Video ended - enabling NFT mint if not already done');
    updateState({ 
      isPlaying: false,
      canMintNFT: !state.hasMinutedNFT, // Enable NFT mint if not already minted
      showMintButton: !state.hasMinutedNFT
    });
    onComplete?.();
  }, [updateState, state.hasMinutedNFT, onComplete]);

  const handleVolumeChange = useCallback(() => {
    if (videoRef.current) {
      updateState({
        volume: Math.round(videoRef.current.volume * 100),
        isMuted: videoRef.current.muted
      });
    }
  }, [updateState]);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('❌ Video error:', e);
    updateState({ 
      error: 'Failed to load video. Please try refreshing the page.',
      isLoading: false 
    });
    onError?.('Video failed to load');
  }, [updateState, onError]);

  // Control functions
  const togglePlay = useCallback(() => {
    if (videoRef.current && state.isVideoReady) {
      if (state.isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Play failed:', error);
            showToast('Failed to play video', 'error');
          });
        }
      }
    }
  }, [state.isPlaying, state.isVideoReady, showToast]);

  const seekTo = useCallback((time: number) => {
    if (videoRef.current && state.isVideoReady) {
      const newTime = Math.max(0, Math.min(state.duration, time));
      videoRef.current.currentTime = newTime;
      console.log('⏭️ Seeking to:', newTime, 'seconds');
    }
  }, [state.duration, state.isVideoReady]);

  const skipTime = useCallback((seconds: number) => {
    const newTime = Math.max(0, Math.min(state.duration, state.currentTime + seconds));
    seekTo(newTime);
  }, [state.currentTime, state.duration, seekTo]);

  const setVolume = useCallback((volume: number) => {
    if (videoRef.current) {
      const normalizedVolume = Math.max(0, Math.min(100, volume));
      videoRef.current.volume = normalizedVolume / 100;
      videoRef.current.muted = normalizedVolume === 0;
      console.log('🔊 Volume set to:', normalizedVolume);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      console.log('🔇 Mute toggled:', videoRef.current.muted);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return;

    if (!state.isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [state.isFullscreen]);

  // Handle progress bar click
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!state.isVideoReady) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * state.duration;
    seekTo(newTime);
  }, [state.duration, state.isVideoReady, seekTo]);

  // Enhanced NFT Minting function using API data
  const handleMintNFT = useCallback(async () => {
    console.log('🎨 NFT minting button clicked!', {
      canMintNFT: state.canMintNFT,
      hasMinutedNFT: state.hasMinutedNFT,
      isMinting: state.isMinting,
      currentTime: state.currentTime,
      duration: state.duration,
      walletAddress: walletAddress,
      animeId: animeId,
      hasAnimeData: !!animeData
    });

    // Check all conditions before proceeding
    if (!state.canMintNFT) {
      console.log('❌ Cannot mint NFT: canMintNFT is false');
      showToast('NFT minting not available yet. Keep watching!', 'info');
      return;
    }

    if (state.hasMinutedNFT) {
      console.log('❌ Cannot mint NFT: already minted');
      showToast('NFT already minted for this episode!', 'info');
      return;
    }

    if (state.isMinting) {
      console.log('❌ Cannot mint NFT: already minting');
      showToast('NFT minting in progress...', 'info');
      return;
    }

    if (!walletAddress) {
      console.log('❌ Cannot mint NFT: no wallet connected');
      showToast('Please connect your wallet to mint NFTs', 'error');
      return;
    }

    console.log('✅ All conditions met, starting enhanced NFT minting process...');
    updateState({ isMinting: true });

    try {
      // Get current anime data from props
      const currentAnimeData = getCurrentAnimeData();
      
      if (currentAnimeData && currentAnimeData.nftCollection && currentAnimeData.nftCollection.length > 0) {
        console.log('🎯 Using NFT data from anime props...', {
          animeTitle: currentAnimeData.title,
          nftCollectionSize: currentAnimeData.nftCollection.length,
          creatorId: currentAnimeData.creator_id,
          creatorUsername: currentAnimeData.creator_username
        });

        // Find NFT for current episode or use first available
        const episodeNFT = currentAnimeData.nftCollection.find(nft => nft.episode === episode) || 
                          currentAnimeData.nftCollection[0];

        console.log('📦 Selected NFT from API:', {
          nftName: episodeNFT.name,
          episode: episodeNFT.episode,
          rarity: episodeNFT.rarity,
          image: episodeNFT.image
        });

        // Use enhanced minting with API data
        const mintResult = await nftMintingService.mintNFTFromAnimeAPI(
          currentAnimeData,
          episodeNFT,
          walletAddress,
          `${animeId}_episode_${episode}`,
          Math.floor(state.currentTime / 60), // Actual watch time in minutes
          {
            triggerType: 'watch_completion',
            videoProgress: (state.currentTime / state.duration) * 100,
            sessionId: `session_${Date.now()}`
          }
        );

        if (mintResult.success) {
          console.log('🎉 NFT minted successfully using API data!', mintResult);
          
          updateState({ 
            hasMinutedNFT: true, 
            isMinting: false,
            showMintButton: false 
          });

          setShowMintSuccess(true);
          setTimeout(() => setShowMintSuccess(false), 5000);

          // Create NFT object for callback
          const mintedNFT = {
            id: episodeNFT.id,
            name: episodeNFT.name,
            description: episodeNFT.description,
            image: episodeNFT.image,
            anime: currentAnimeData.title,
            episode: episodeNFT.episode,
            watchTime: Math.floor(state.currentTime / 60),
            rarity: episodeNFT.rarity,
            isListed: false,
            mintedAt: new Date().toISOString()
          };

          onNFTMint?.(mintedNFT);
          showToast(`🎉 NFT Minted Successfully: ${episodeNFT.name}`, 'success');
          return;
        } else {
          throw new Error(mintResult.error || 'API-based minting failed');
        }
      }

      // Fallback to IPFS collection or legacy method
      console.log('🔄 Falling back to IPFS collection or legacy minting...');
      
      let nftToMint: IPFSNFTMetadata | null = null;
      
      if (animeId) {
        nftToMint = getFirstNFTFromCollection(animeId);
        console.log('📦 Retrieved NFT from IPFS collection:', nftToMint?.name || 'undefined');
      }

      if (!nftToMint) {
        console.log('🔧 Creating fallback NFT data...');
        nftToMint = {
          id: `${animeId || 'unknown'}_episode_${episode}_${Date.now()}`,
          name: `${title} Episode ${episode} - Dedicated Viewer`,
          description: `Exclusive NFT for watching ${title} Episode ${episode}. This proves your dedication to the series!`,
          image: 'https://ipfs.io/ipfs/QmRj2WryQAiNKEhsjP8tUqfBC4KhEJhrtKezKGcYm4J9uK',
          anime: title,
          episode: episode,
          watchTime: Math.floor(state.currentTime / 60),
          rarity: 'Rare',
          isListed: false,
          mintedAt: new Date().toISOString(),
          attributes: [
            { trait_type: 'Watch Duration', value: `${Math.floor(state.currentTime / 60)} Minutes` },
            { trait_type: 'Episode', value: episode },
            { trait_type: 'Series', value: title },
            { trait_type: 'Achievement', value: 'Dedicated Viewer' }
          ],
          ipfs_metadata: {
            cid: 'QmRj2WryQAiNKEhsjP8tUqfBC4KhEJhrtKezKGcYm4J9uK',
            gateway_url: 'https://ipfs.io/ipfs/QmRj2WryQAiNKEhsjP8tUqfBC4KhEJhrtKezKGcYm4J9uK',
            pinned: true
          }
        };
      }

      console.log('🎨 Using legacy minting service...', {
        nftName: nftToMint.name,
        watchTime: nftToMint.watchTime,
        rarity: nftToMint.rarity
      });

      const mintResult = await nftMintingService.mintNFT({
        nftData: nftToMint,
        userWallet: walletAddress,
        animeId: animeId || 'unknown',
        episodeId: `${animeId}_episode_${episode}`,
        watchTime: Math.floor(state.currentTime / 60)
      });

      if (mintResult.success) {
        console.log('🎉 NFT minted successfully with legacy method!', mintResult);
        
        updateState({ 
          hasMinutedNFT: true, 
          isMinting: false,
          showMintButton: false 
        });

        setShowMintSuccess(true);
        setTimeout(() => setShowMintSuccess(false), 5000);

        onNFTMint?.(nftToMint);
        showToast(`🎉 NFT Minted Successfully: ${nftToMint.name}`, 'success');
      } else {
        throw new Error(mintResult.error || 'Legacy minting failed');
      }
    } catch (error) {
      console.error('💥 NFT minting failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown minting error';
      showToast(`NFT minting failed: ${errorMessage}`, 'error');
      updateState({ isMinting: false });
    }
  }, [state.canMintNFT, state.hasMinutedNFT, state.isMinting, state.currentTime, state.duration, title, episode, animeId, walletAddress, onNFTMint, showToast, updateState, getCurrentAnimeData]);

  // Test function to manually enable NFT minting (for debugging)
  const enableNFTMintingForTesting = useCallback(() => {
    console.log('🧪 Manually enabling NFT minting for testing...');
    updateState({ 
      canMintNFT: true,
      showMintButton: true 
    });
    showToast('🧪 NFT minting enabled for testing!', 'info');
  }, [updateState, showToast]);

  // Auto-hide mint button after 30 seconds
  useEffect(() => {
    if (state.showMintButton && !state.hasMinutedNFT) {
      mintButtonTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Auto-hiding mint button after 30 seconds');
        updateState({ showMintButton: false });
      }, 30000);
    }

    return () => {
      if (mintButtonTimeoutRef.current) {
        clearTimeout(mintButtonTimeoutRef.current);
      }
    };
  }, [state.showMintButton, state.hasMinutedNFT, updateState]);

  // Auto-hide controls
  const showControlsTemporarily = useCallback(() => {
    updateState({ showControls: true });
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (state.isPlaying) {
        updateState({ showControls: false });
      }
    }, 3000);
  }, [state.isPlaying, updateState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!playerRef.current?.contains(document.activeElement)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(100, state.volume + 10));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, state.volume - 10));
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyN':
          e.preventDefault();
          if (state.canMintNFT && !state.hasMinutedNFT) {
            handleMintNFT();
          }
          break;
        case 'KeyT':
          e.preventDefault();
          // Testing shortcut - enable NFT minting
          enableNFTMintingForTesting();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, skipTime, setVolume, state.volume, toggleMute, toggleFullscreen, state.canMintNFT, state.hasMinutedNFT, handleMintNFT, enableNFTMintingForTesting]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      updateState({ isFullscreen: !!document.fullscreenElement });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [updateState]);

  // Reset state when video changes
  useEffect(() => {
    console.log('🔄 Video changed, resetting state...', { videoId, title, episode });
    updateState({ 
      isLoading: true, 
      error: null,
      canMintNFT: false,
      hasMinutedNFT: false,
      showMintButton: false,
      currentTime: 0,
      isPlaying: false,
      isVideoReady: false
    });
  }, [videoId, updateState]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (mintButtonTimeoutRef.current) {
        clearTimeout(mintButtonTimeoutRef.current);
      }
    };
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  // Calculate NFT unlock progress
  const nftUnlockTime = Math.min(1380, state.duration * 0.9); // 23 minutes OR 90% of video
  const nftProgressPercentage = state.duration > 0 ? (state.currentTime / nftUnlockTime) * 100 : 0;

  // Error state
  if (state.error) {
    return (
      <div className={`relative aspect-video bg-gray-900 rounded-responsive-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-responsive">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-white font-semibold mb-2 text-responsive-lg">Video Load Error</h3>
            <p className="text-gray-400 text-responsive-sm mb-6">{state.error}</p>
            
            <button
              onClick={() => {
                updateState({ error: null, isLoading: true });
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors mx-auto btn-responsive"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={playerRef}
      className={`relative aspect-video bg-black rounded-responsive-lg overflow-hidden group ${className}`}
      onMouseMove={showControlsTemporarily}
      onMouseEnter={showControlsTemporarily}
      tabIndex={0}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={currentVideo.poster}
        preload="metadata"
        onLoadStart={handleLoadStart}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onVolumeChange={handleVolumeChange}
        onError={handleError}
        crossOrigin="anonymous"
      >
        <source src={currentVideo.src} type="video/mp4" />
        <p className="text-white text-center p-4">
          Your browser does not support the video tag.
        </p>
      </video>

      {/* Loading Overlay */}
      <AnimatePresence>
        {state.isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
          >
            <div className="text-center">
              <Loader className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
              <p className="text-white text-responsive-sm">Loading video...</p>
              <p className="text-gray-400 text-responsive-xs mt-1">{currentVideo.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mint NFT Button - Center Overlay */}
      <AnimatePresence>
        {state.showMintButton && !state.hasMinutedNFT && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMintNFT}
              disabled={state.isMinting}
              className="flex items-center space-x-3 px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-bold text-responsive-base md:text-responsive-lg shadow-2xl border-2 border-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isMinting ? (
                <>
                  <Loader className="w-5 md:w-6 h-5 md:h-6 animate-spin" />
                  <span>Minting NFT...</span>
                </>
              ) : (
                <>
                  <Gem className="w-5 md:w-6 h-5 md:h-6" />
                  <span>Mint NFT</span>
                  <Sparkles className="w-5 md:w-6 h-5 md:h-6" />
                </>
              )}
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-3"
            >
              <p className="text-white text-responsive-sm font-semibold bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
                🎉 {Math.floor(state.currentTime / 60)} minutes watched! Claim your reward!
              </p>
              <p className="text-gray-300 text-responsive-xs mt-1">
                Press 'N' key or click to mint • Press 'T' to test
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {showMintSuccess && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: 2,
                ease: "easeInOut"
              }}
              className="flex flex-col items-center space-y-4 p-4 md:p-8 bg-gradient-to-r from-green-600/90 to-emerald-600/90 rounded-xl text-white font-bold text-responsive-lg shadow-2xl border-2 border-white/20 backdrop-blur-sm"
            >
              <CheckCircle className="w-12 md:w-16 h-12 md:h-16 text-white" />
              <div className="text-center">
                <h3 className="text-responsive-xl md:text-responsive-2xl font-bold mb-2">NFT Minted! 🎉</h3>
                <p className="text-green-100 text-responsive-sm">{title} Episode {episode}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Title Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
          <h3 className="text-white font-semibold text-responsive-base">{title}</h3>
          <p className="text-gray-300 text-responsive-sm">Episode {episode} • {currentVideo.title}</p>
          
          {/* Debug Info - Only show on larger screens */}
          <div className="mt-2 text-xs text-gray-400 hidden md:block">
            <p>Time: {formatTime(state.currentTime)} / {formatTime(state.duration)}</p>
            <p>NFT Progress: {Math.min(100, nftProgressPercentage).toFixed(1)}%</p>
            <p>Anime Data: {animeData ? '✅ Available' : '❌ Missing'}</p>
            <p>NFT Collection: {animeData?.nftCollection?.length || 0} items</p>
            <p>Creator ID: {animeData?.creator?.id || 'N/A'}</p>
            {state.canMintNFT && (
              <p className="text-green-400">✅ NFT Ready to Mint!</p>
            )}
          </div>
        </div>
      </div>

      {/* Custom Controls Overlay */}
      <AnimatePresence>
        {(state.showControls || !state.isPlaying) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10"
          >
            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 pointer-events-auto">
              {/* Progress Bar */}
              <div className="mb-2 md:mb-4">
                <div className="relative">
                  <div 
                    className="w-full h-1 md:h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-anime-purple to-anime-pink transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                    {/* NFT unlock marker */}
                    <div 
                      className="absolute top-0 w-1 h-full bg-yellow-400"
                      style={{ left: `${Math.min(100, (nftUnlockTime / state.duration) * 100)}%` }}
                      title={`NFT unlock at ${Math.floor(nftUnlockTime / 60)} minutes`}
                    />
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 md:space-x-3">
                  {/* Play/Pause */}
                  <button
                    onClick={togglePlay}
                    className="p-1 md:p-2 text-white hover:text-anime-purple transition-colors"
                    disabled={!state.isVideoReady}
                  >
                    {state.isPlaying ? <Pause className="w-4 md:w-6 h-4 md:h-6" /> : <Play className="w-4 md:w-6 h-4 md:h-6" />}
                  </button>

                  {/* Skip Backward */}
                  <button
                    onClick={() => skipTime(-10)}
                    className="p-1 md:p-2 text-white hover:text-anime-purple transition-colors hidden sm:block"
                    disabled={!state.isVideoReady}
                  >
                    <SkipBack className="w-4 md:w-5 h-4 md:h-5" />
                  </button>

                  {/* Skip Forward */}
                  <button
                    onClick={() => skipTime(10)}
                    className="p-1 md:p-2 text-white hover:text-anime-purple transition-colors hidden sm:block"
                    disabled={!state.isVideoReady}
                  >
                    <SkipForward className="w-4 md:w-5 h-4 md:h-5" />
                  </button>

                  {/* Volume - Desktop only */}
                  <div className="hidden md:flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 text-white hover:text-anime-purple transition-colors"
                    >
                      {state.isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={state.isMuted ? 0 : state.volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-16 lg:w-20 h-1 bg-white/20 rounded-full appearance-none slider"
                    />
                  </div>

                  {/* Time Display */}
                  <span className="text-white text-xs md:text-sm font-mono hidden sm:block">
                    {formatTime(state.currentTime)} / {formatTime(state.duration)}
                  </span>

                  {/* NFT Status */}
                  {state.canMintNFT && (
                    <div className="hidden lg:flex items-center space-x-2 px-2 md:px-3 py-1 bg-green-500/20 rounded-full border border-green-400/30">
                      <Gem className="w-3 md:w-4 h-3 md:h-4 text-green-400" />
                      <span className="text-green-400 text-xs md:text-sm font-semibold">
                        {state.hasMinutedNFT ? 'NFT Minted!' : 'NFT Ready!'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-1 md:space-x-2">
                  {/* Test NFT Button - Desktop only */}
                  <button
                    onClick={enableNFTMintingForTesting}
                    className="hidden lg:block px-2 md:px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded text-yellow-400 text-xs"
                    title="Enable NFT minting for testing (T key)"
                  >
                    Test NFT
                  </button>

                  {/* Mint NFT Button (small version) */}
                  {state.canMintNFT && !state.hasMinutedNFT && (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleMintNFT}
                      disabled={state.isMinting}
                      className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1 md:py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 shadow-lg"
                    >
                      {state.isMinting ? (
                        <Loader className="w-3 md:w-4 h-3 md:h-4 animate-spin" />
                      ) : (
                        <Gem className="w-3 md:w-4 h-3 md:h-4" />
                      )}
                      <span className="text-xs md:text-sm">Mint NFT</span>
                    </motion.button>
                  )}

                  {/* Additional Controls - Desktop only */}
                  <button className="hidden md:block p-2 text-white hover:text-anime-purple transition-colors">
                    <Bookmark className="w-4 md:w-5 h-4 md:h-5" />
                  </button>

                  <button className="hidden md:block p-2 text-white hover:text-anime-purple transition-colors">
                    <Share className="w-4 md:w-5 h-4 md:h-5" />
                  </button>

                  <button className="hidden lg:block p-2 text-white hover:text-anime-purple transition-colors">
                    <Settings className="w-4 md:w-5 h-4 md:h-5" />
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-1 md:p-2 text-white hover:text-anime-purple transition-colors"
                  >
                    {state.isFullscreen ? <Minimize className="w-4 md:w-5 h-4 md:h-5" /> : <Maximize className="w-4 md:w-5 h-4 md:h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};