import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor,
  Gem,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Play,
  Video
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAnimeData } from '../hooks/useAnimeData';
import { AnimeData, NFTMetadata } from '../types/anime';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoadingSpinner, LoadingGrid } from '../components/LoadingSpinner';
import { FilterControls } from '../components/FilterControls';
import { AnimeCard } from '../components/AnimeCard';
import { NFTCard } from '../components/NFTCard';
import { Pagination } from '../components/Pagination';

const Anime: React.FC = () => {
  const { user } = useUser();
  const {
    animeList,
    nftList,
    isLoading,
    isError,
    error,
    pagination,
    filters,
    sortOptions,
    fetchData,
    setFilters,
    setSortOptions,
    resetFilters,
    refetch
  } = useAnimeData();

  // Local state for UI controls
  const [activeTab, setActiveTab] = useState<'anime' | 'nfts'>('anime');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
  const filteredAnime = animeList.filter(anime =>
    anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    anime.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (anime as any).creator?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNFTs = nftList.filter(nft =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.anime.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (nft as any).creator?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle anime click
  const handleAnimeClick = (anime: AnimeData) => {
    console.log('🎬 Opening anime:', anime.title);
    // Navigate to streaming page
    window.location.href = `/streaming/${anime.id}`;
  };

  // Handle NFT click
  const handleNFTClick = (nft: NFTMetadata) => {
    console.log('💎 Opening NFT:', nft.name);
    // Navigate to NFT details or marketplace
    // For now, just log the action
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchData(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Error state
  if (isError && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center border border-red-500/30"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
            Failed to Load Content
          </h2>
          <p className="text-gray-400 mb-6">
            {error || 'Unable to fetch anime data from the server. Please try again.'}
          </p>
          <button
            onClick={refetch}
            className="flex items-center space-x-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-orbitron font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2"
          >
            Anime Hub
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Stream anime content and discover exclusive NFT collectibles
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-1 mb-6 bg-black/40 rounded-lg p-1 border border-purple-500/20"
        >
          {[
            { key: 'anime', label: 'Anime Library', icon: Monitor, count: filteredAnime.length },
            { key: 'nfts', label: 'NFT Collectibles', icon: Gem, count: filteredNFTs.length }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'anime-gradient text-white'
                    : 'text-gray-400 hover:text-white hover:bg-purple-500/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {isLoading ? '...' : tab.count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Filter Controls */}
        <FilterControls
          filters={filters}
          sortOptions={sortOptions}
          onFiltersChange={setFilters}
          onSortChange={setSortOptions}
          onResetFilters={resetFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalItems={activeTab === 'anime' ? filteredAnime.length : filteredNFTs.length}
          isLoading={isLoading}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="mb-8">
            <LoadingSpinner size="lg" text="Loading content from blockchain..." className="mb-8" />
            <LoadingGrid count={8} />
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <>
            {activeTab === 'anime' ? (
              /* Anime Library */
              <>
                {filteredAnime.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-12 text-center border border-purple-500/20"
                  >
                    <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Anime Found</h3>
                    <p className="text-gray-400 mb-4">
                      {searchQuery || Object.values(filters).some(f => f !== 'all')
                        ? 'No anime matches your current filters. Try adjusting your search criteria.'
                        : 'No anime content available yet. Be the first to upload some amazing content!'
                      }
                    </p>
                    {user.userType === 'creator' && (
                      <button
                        onClick={() => window.location.href = '/upload'}
                        className="flex items-center space-x-2 px-6 py-3 anime-gradient rounded-lg text-white font-semibold hover:opacity-90 transition-opacity mx-auto"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Upload Your First Anime</span>
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }>
                    {filteredAnime.map((anime, index) => (
                      <AnimeCard
                        key={anime.id}
                        anime={anime}
                        viewMode={viewMode}
                        onClick={handleAnimeClick}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* NFT Content */
              <>
                {filteredNFTs.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-12 text-center border border-purple-500/20"
                  >
                    <Gem className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-white mb-2">No NFTs Found</h3>
                    <p className="text-gray-400 mb-4">
                      {searchQuery || Object.values(filters).some(f => f !== 'all')
                        ? 'No NFTs match your current filters. Try adjusting your search criteria.'
                        : 'No NFT collectibles available yet. Start watching anime to earn your first NFTs!'
                      }
                    </p>
                    <button
                      onClick={() => setActiveTab('anime')}
                      className="flex items-center space-x-2 px-6 py-3 anime-gradient rounded-lg text-white font-semibold hover:opacity-90 transition-opacity mx-auto"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Start Streaming</span>
                    </button>
                  </motion.div>
                ) : (
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  }>
                    {filteredNFTs.map((nft, index) => (
                      <NFTCard
                        key={nft.id}
                        nft={nft}
                        viewMode={viewMode}
                        onClick={handleNFTClick}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {!isLoading && (filteredAnime.length > 0 || filteredNFTs.length > 0) && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          </>
        )}

        {/* Stats Footer */}
        {!isLoading && !isError && (animeList.length > 0 || nftList.length > 0) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 mt-8 border border-purple-500/20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-orbitron font-bold text-anime-gradient">
                  {animeList.length}
                </p>
                <p className="text-sm text-gray-400">Total Anime</p>
              </div>
              <div>
                <p className="text-2xl font-orbitron font-bold text-anime-gradient">
                  {nftList.length}
                </p>
                <p className="text-sm text-gray-400">NFT Collectibles</p>
              </div>
              <div>
                <p className="text-2xl font-orbitron font-bold text-anime-gradient">
                  {[...new Set(animeList.map(a => (a as any).creator?.username))].length}
                </p>
                <p className="text-sm text-gray-400">Active Creators</p>
              </div>
              <div>
                <p className="text-2xl font-orbitron font-bold text-anime-gradient">
                  {animeList.reduce((sum, anime) => sum + (anime.views || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Total Views</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </ErrorBoundary>
  );
};

export default Anime;