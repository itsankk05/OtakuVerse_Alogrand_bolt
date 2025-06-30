import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Grid,
  List,
  Filter,
  Search,
  Clock,
  Eye,
  Star,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share,
  MoreVertical,
  Gem,
  Gift
} from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { animeUtils } from '../utils/animations';

interface Episode {
  id: string;
  title: string;
  number: number;
  duration: string;
  thumbnail: string;
  videoId: string;
  description: string;
  views: number;
  rating: number;
  releaseDate: string;
  watchProgress?: number;
  isWatched?: boolean;
}

interface StreamingGridProps {
  episodes: Episode[];
  animeTitle: string;
  onEpisodeSelect?: (episode: Episode) => void;
  onProgressUpdate?: (episodeId: string, progress: number) => void;
  onNFTMint?: (nftData: any) => void;
  animeId?: string;
  className?: string;
  // Add anime data prop to pass to VideoPlayer
  animeData?: {
    id: string;
    title: string;
    description: string;
    episodes: number;
    thumbnail: string;
    status: string;
    nftCollection?: any[];
    creatorId: string;
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

export const StreamingGrid: React.FC<StreamingGridProps> = ({
  episodes,
  animeTitle,
  onEpisodeSelect,
  onProgressUpdate,
  onNFTMint,
  animeId,
  className = '',
  animeData // Receive anime data prop
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'episode' | 'rating' | 'views' | 'date'>('episode');
  const [filterWatched, setFilterWatched] = useState<'all' | 'watched' | 'unwatched'>('all');
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [expandedEpisode, setExpandedEpisode] = useState<string | null>(null);
  const [watchProgress, setWatchProgress] = useState<Record<string, number>>({});
  const [lastWatchedPosition, setLastWatchedPosition] = useState<Record<string, number>>({});
  const [nftEarnedEpisodes, setNftEarnedEpisodes] = useState<Set<string>>(new Set());

  const gridRef = useRef<HTMLDivElement>(null);
  const playerRefs = useRef<Record<string, HTMLDivElement>>({});

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`anime_progress_${animeTitle}`);
    if (savedProgress) {
      setWatchProgress(JSON.parse(savedProgress));
    }

    const savedPositions = localStorage.getItem(`anime_positions_${animeTitle}`);
    if (savedPositions) {
      setLastWatchedPosition(JSON.parse(savedPositions));
    }

    const savedNFTs = localStorage.getItem(`anime_nfts_${animeTitle}`);
    if (savedNFTs) {
      setNftEarnedEpisodes(new Set(JSON.parse(savedNFTs)));
    }
  }, [animeTitle]);

  // Save progress to localStorage
  const saveProgress = useCallback((episodeId: string, progress: number) => {
    const newProgress = { ...watchProgress, [episodeId]: progress };
    setWatchProgress(newProgress);
    localStorage.setItem(`anime_progress_${animeTitle}`, JSON.stringify(newProgress));
    onProgressUpdate?.(episodeId, progress);
  }, [watchProgress, animeTitle, onProgressUpdate]);

  // Save last watched position
  const saveLastPosition = useCallback((episodeId: string, position: number) => {
    const newPositions = { ...lastWatchedPosition, [episodeId]: position };
    setLastWatchedPosition(newPositions);
    localStorage.setItem(`anime_positions_${animeTitle}`, JSON.stringify(newPositions));
  }, [lastWatchedPosition, animeTitle]);

  // Handle NFT minting
  const handleNFTMint = useCallback((episodeId: string, nftData: any) => {
    console.log('🎨 NFT minted for episode:', episodeId, nftData);
    
    // Mark episode as having earned NFT
    const newNftEpisodes = new Set(nftEarnedEpisodes);
    newNftEpisodes.add(episodeId);
    setNftEarnedEpisodes(newNftEpisodes);
    
    // Save to localStorage
    localStorage.setItem(`anime_nfts_${animeTitle}`, JSON.stringify(Array.from(newNftEpisodes)));
    
    // Call parent callback
    onNFTMint?.(nftData);
  }, [nftEarnedEpisodes, animeTitle, onNFTMint]);

  // Filter and sort episodes
  const filteredEpisodes = episodes
    .filter(episode => {
      const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           episode.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterWatched === 'all' ||
                           (filterWatched === 'watched' && episode.isWatched) ||
                           (filterWatched === 'unwatched' && !episode.isWatched);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'episode':
          return a.number - b.number;
        case 'rating':
          return b.rating - a.rating;
        case 'views':
          return b.views - a.views;
        case 'date':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        default:
          return 0;
      }
    });

  // Handle episode click
  const handleEpisodeClick = useCallback((episode: Episode) => {
    console.log('🎬 Episode clicked:', episode.title, 'Video ID:', episode.videoId);
    
    // Pause any currently playing video
    if (activePlayer && activePlayer !== episode.id) {
      setActivePlayer(null);
    }

    // Toggle player for clicked episode
    setActivePlayer(activePlayer === episode.id ? null : episode.id);
    setExpandedEpisode(expandedEpisode === episode.id ? null : episode.id);
    
    onEpisodeSelect?.(episode);

    // Scroll to episode if needed
    setTimeout(() => {
      const episodeElement = playerRefs.current[episode.id];
      if (episodeElement) {
        episodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, [activePlayer, expandedEpisode, onEpisodeSelect]);

  // Handle video progress
  const handleVideoProgress = useCallback((episodeId: string, currentTime: number) => {   
    // Defer out of render
    setTimeout(() => {
      saveLastPosition(episodeId, currentTime);

      const progressPercent = (currentTime / (24 * 60)) * 100;
      saveProgress(episodeId, Math.min(progressPercent, 100));
    }, 0);
  }, [saveLastPosition, saveProgress]);

  // Handle video completion
  const handleVideoComplete = useCallback((episodeId: string) => {
    saveProgress(episodeId, 100);
    
    // Auto-advance to next episode
    const currentIndex = episodes.findIndex(ep => ep.id === episodeId);
    if (currentIndex < episodes.length - 1) {
      const nextEpisode = episodes[currentIndex + 1];
      setTimeout(() => {
        handleEpisodeClick(nextEpisode);
      }, 2000);
    }
  }, [episodes, saveProgress, handleEpisodeClick]);

  // Format duration
  const formatDuration = (duration: string) => {
    return duration || '24:00';
  };

  // Format views
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls */}
      <div className="glass-card p-4 border border-purple-500/20">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search episodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/30 border border-purple-500/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-anime-purple/50"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-anime-purple/50"
            >
              <option value="episode">Episode Order</option>
              <option value="rating">Highest Rated</option>
              <option value="views">Most Viewed</option>
              <option value="date">Latest</option>
            </select>

            <select
              value={filterWatched}
              onChange={(e) => setFilterWatched(e.target.value as any)}
              className="bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-anime-purple/50"
            >
              <option value="all">All Episodes</option>
              <option value="watched">Watched</option>
              <option value="unwatched">Unwatched</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-black/30 rounded-lg border border-purple-500/20 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-anime-purple/20 text-anime-purple'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-anime-purple/20 text-anime-purple'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {filteredEpisodes.length} of {episodes.length} episodes
          </span>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">
              {activePlayer ? 'Playing' : 'Paused'}
            </span>
            <div className="flex items-center space-x-2">
              <Gem className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm">
                {nftEarnedEpisodes.size} NFTs earned
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Grid/List */}
      <div ref={gridRef} className="space-y-4">
        {filteredEpisodes.map((episode, index) => (
          <motion.div
            key={episode.id}
            ref={(el) => {
              if (el) playerRefs.current[episode.id] = el;
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 * index }}
            className="glass-card border border-purple-500/20 overflow-hidden"
          >
            {/* Episode Header */}
            <div
              className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => handleEpisodeClick(episode)}
            >
              <div className="flex items-center space-x-4">
                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-32 h-18 object-cover rounded-lg"
                  />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    {activePlayer === episode.id ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* Progress Bar */}
                  {watchProgress[episode.id] > 0 && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="w-full h-1 bg-black/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-anime-purple transition-all duration-300"
                          style={{ width: `${watchProgress[episode.id]}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Episode Number */}
                  <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {episode.number}
                  </div>

                  {/* NFT Earned Badge */}
                  {nftEarnedEpisodes.has(episode.id) && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded flex items-center">
                      <Gem className="w-3 h-3 mr-1" />
                      NFT
                    </div>
                  )}
                </div>

                {/* Episode Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg line-clamp-1">
                        Episode {episode.number}: {episode.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                        {episode.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-sm">{episode.rating.toFixed(1)}</span>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(episode.duration)}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {formatViews(episode.views)}
                    </span>
                    <span>{new Date(episode.releaseDate).toLocaleDateString()}</span>
                    {episode.isWatched && (
                      <span className="text-green-400">✓ Watched</span>
                    )}
                    {nftEarnedEpisodes.has(episode.id) && (
                      <span className="text-purple-400 flex items-center">
                        <Gift className="w-3 h-3 mr-1" />
                        NFT Earned
                      </span>
                    )}
                  </div>
                </div>

                {/* Expand Button */}
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  {expandedEpisode === episode.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Video Player */}
            <AnimatePresence>
              {activePlayer === episode.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-purple-500/20"
                >
                  <div className="p-4">
                    <VideoPlayer
                      videoId={episode.videoId}
                      title={episode.title}
                      episode={episode.number}
                      autoPlay={true}
                      startTime={lastWatchedPosition[episode.id] || 0}
                      onProgress={(time) => handleVideoProgress(episode.id, time)}
                      onComplete={() => handleVideoComplete(episode.id)}
                      onError={(error) => console.error('Video error:', error)}
                      onNFTMint={(nftData) => handleNFTMint(episode.id, nftData)}
                      animeId={animeId}
                      animeData={animeData} // Pass anime data to VideoPlayer
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Episode Actions */}
            <AnimatePresence>
              {expandedEpisode === episode.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-purple-500/20 p-4 bg-black/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-2 px-3 py-2 bg-anime-purple/20 hover:bg-anime-purple/30 border border-anime-purple/30 rounded-lg text-anime-purple transition-colors">
                        <Bookmark className="w-4 h-4" />
                        <span className="text-sm">Watch Later</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-colors">
                        <Share className="w-4 h-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-400 flex items-center space-x-4">
                      {watchProgress[episode.id] > 0 && (
                        <span>Progress: {Math.round(watchProgress[episode.id])}%</span>
                      )}
                      {nftEarnedEpisodes.has(episode.id) && (
                        <span className="text-purple-400 flex items-center">
                          <Gem className="w-3 h-3 mr-1" />
                          NFT Earned
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEpisodes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center border border-purple-500/20"
        >
          <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Episodes Found</h3>
          <p className="text-gray-400">
            {searchQuery
              ? `No episodes match "${searchQuery}". Try adjusting your search.`
              : 'No episodes match your current filters.'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};