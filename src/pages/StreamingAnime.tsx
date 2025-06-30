import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Bookmark,
  Share,
  Download,
  Star,
  Eye,
  Clock,
  Calendar,
  Users,
  Gem,
  TrendingUp,
  Heart,
  MessageCircle,
  Gift,
  CheckCircle,
  Grid,
  List,
  Filter,
  Tag,
  ExternalLink,
  Sparkles,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { StreamingGrid } from '../components/StreamingGrid';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { NFTCard } from '../components/NFTCard';
import { useUser } from '../context/UserContext';
import { useAnimeData } from '../hooks/useAnimeData';
import { NFTMetadata } from '../types/anime';

interface AnimeDetails {
  id: string;
  title: string;
  description: string;
  poster: string;
  cover: string;
  rating: number;
  year: number;
  status: string;
  genres: string[];
  studios: string[];
  totalEpisodes: number;
  duration: string;
  views: number;
  likes: number;
  followers: number;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  nftCollection: NFTMetadata[];
}

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

const StreamingAnime: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, addWatchTime, mintNFT, showToast } = useUser();
  const { fetchAnimeById, isLoading: apiLoading, isError: apiError, error: apiErrorMessage } = useAnimeData();
  
  const [animeDetails, setAnimeDetails] = useState<AnimeDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'episodes' | 'nfts'>('episodes');
  const [nftViewMode, setNftViewMode] = useState<'grid' | 'list'>('grid');
  const [nftFilter, setNftFilter] = useState<'all' | 'Common' | 'Rare' | 'Epic' | 'Legendary'>('all');
  const [watchStats, setWatchStats] = useState({
    totalWatchTime: 0,
    episodesWatched: 0,
    nftsEarned: 0
  });

  // Fetch specific anime by ID using the dedicated function
  useEffect(() => {
    const fetchAnimeData = async () => {
      if (!id) {
        setError('No anime ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔍 Fetching anime with ID:', id);
        
        // Use the dedicated fetchAnimeById function to get the specific anime
        const foundAnime = await fetchAnimeById(id);
        
        if (!foundAnime) {
          console.error('❌ Anime not found with ID:', id);
          setError(`Anime with ID "${id}" not found in the database.`);
          setIsLoading(false);
          return;
        }

        console.log('✅ Found anime:', foundAnime.title);
        console.log('🎨 NFT Collection size:', foundAnime.nftCollection?.length || 0);

        // Process NFT collection from API response
        const processedNFTCollection: NFTMetadata[] = [];
        
        if (foundAnime.nftCollection && Array.isArray(foundAnime.nftCollection)) {
          console.log('📦 Processing NFT collection from API...');
          
          foundAnime.nftCollection.forEach((nft: any, index: number) => {
            try {
              // Convert API NFT format to our NFTMetadata interface
              const processedNFT: NFTMetadata = {
                id: nft.id || `${foundAnime.id}_nft_${index}`,
                name: nft.name || `${foundAnime.title} NFT #${index + 1}`,
                description: nft.description || `Exclusive NFT from ${foundAnime.title}`,
                image: nft.image || foundAnime.thumbnail,
                anime: foundAnime.title,
                episode: nft.episode || (index + 1),
                watchTime: nft.watchTime || 15,
                rarity: nft.rarity || 'Common',
                isListed: nft.isListed || false,
                price: nft.price,
                mintedAt: nft.mintedAt || new Date().toISOString(),
                tokenId: nft.tokenId,
                contractAddress: nft.contractAddress,
                owner: nft.owner,
                attributes: nft.attributes || [
                  { trait_type: 'Series', value: foundAnime.title },
                  { trait_type: 'Episode', value: nft.episode || (index + 1) },
                  { trait_type: 'Rarity', value: nft.rarity || 'Common' }
                ]
              };
              
              processedNFTCollection.push(processedNFT);
              console.log(`✅ Processed NFT ${index + 1}:`, processedNFT.name, `(${processedNFT.rarity})`);
            } catch (nftError) {
              console.error(`❌ Error processing NFT ${index}:`, nftError);
            }
          });
        } else {
          console.log('ℹ️ No NFT collection found in API response for this anime');
        }

        // Create anime details object
        const animeDetailsFromAPI: AnimeDetails = {
          id: foundAnime.id,
          title: foundAnime.title,
          description: foundAnime.description,
          poster: foundAnime.thumbnail,
          cover: foundAnime.thumbnail,
          rating: foundAnime.rating || 8.5,
          year: foundAnime.year || new Date(foundAnime.createdAt).getFullYear(),
          status: foundAnime.status === 'published' ? 'Completed' : 'Ongoing',
          genres: foundAnime.genres || ['Action', 'Adventure'],
          studios: ['Studio from API'],
          totalEpisodes: foundAnime.episodes,
          duration: '24m',
          views: foundAnime.views || 0,
          likes: foundAnime.likes || 0,
          followers: Math.floor((foundAnime.views || 0) * 0.1),
          creator: {
            id: foundAnime.creatorId,
            username: (foundAnime as any).creator?.username || 'Unknown Creator',
            avatar: foundAnime.thumbnail
          },
          nftCollection: processedNFTCollection
        };
        
        setAnimeDetails(animeDetailsFromAPI);
        
        console.log('🎯 Final anime details:', {
          title: animeDetailsFromAPI.title,
          nftCount: animeDetailsFromAPI.nftCollection.length,
          episodes: animeDetailsFromAPI.totalEpisodes
        });

        // Generate mock episodes
        const mockEpisodes: Episode[] = Array.from({ length: animeDetailsFromAPI.totalEpisodes }, (_, i) => ({
          id: `ep-${i + 1}`,
          title: `Episode ${i + 1}`,
          number: i + 1,
          duration: '24:00',
          thumbnail: foundAnime.thumbnail,
          videoId: 'sample-video',
          description: `Episode ${i + 1} of ${foundAnime.title}`,
          views: Math.floor(Math.random() * 500000) + 100000,
          rating: parseFloat((8.0 + Math.random() * 1.5).toFixed(1)),
          releaseDate: new Date(2024, 0, 1 + i * 7).toISOString(),
          watchProgress: Math.random() > 0.7 ? Math.floor(Math.random() * 100) : 0,
          isWatched: Math.random() > 0.6
        }));

        setEpisodes(mockEpisodes);
        
        // Load watch stats from localStorage
        const savedStats = localStorage.getItem(`watch_stats_${id}`);
        if (savedStats) {
          setWatchStats(JSON.parse(savedStats));
        }
        
      } catch (err) {
        console.error('💥 Error in fetchAnimeData:', err);
        setError('Failed to load anime details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeData();
  }, [id, fetchAnimeById]);

  // Handle episode progress updates
  const handleProgressUpdate = useCallback((episodeId: string, progress: number) => {
    const watchTimeMinutes = Math.floor(progress * 0.24);
    addWatchTime(watchTimeMinutes);
    
    setWatchStats(prev => {
      const newStats = {
        ...prev,
        totalWatchTime: prev.totalWatchTime + 1
      };
      
      if (progress > 90) {
        newStats.episodesWatched = prev.episodesWatched + 1;
        
        if (animeDetails) {
          mintNFT({
            name: `${animeDetails.title} Episode ${episodes.find(ep => ep.id === episodeId)?.number} Completion`,
            image: animeDetails.poster,
            anime: animeDetails.title,
            episode: episodes.find(ep => ep.id === episodeId)?.number || 1,
            watchTime: 24,
            rarity: 'Common',
            isListed: false
          });
          
          newStats.nftsEarned = prev.nftsEarned + 1;
        }
      }
      
      localStorage.setItem(`watch_stats_${id}`, JSON.stringify(newStats));
      return newStats;
    });
  }, [addWatchTime, mintNFT, animeDetails, episodes, id]);

  // Handle NFT minting from video player
  const handleNFTMint = useCallback((nftData: any) => {
    console.log('🎨 NFT minted from video player:', nftData);
    
    mintNFT(nftData);
    
    setWatchStats(prev => {
      const newStats = {
        ...prev,
        nftsEarned: prev.nftsEarned + 1
      };
      localStorage.setItem(`watch_stats_${id}`, JSON.stringify(newStats));
      return newStats;
    });

    showToast(`🎉 NFT Minted: ${nftData.name}`, 'success');
  }, [mintNFT, id, showToast]);

  // Handle episode selection
  const handleEpisodeSelect = useCallback((episode: Episode) => {
    console.log('Selected episode:', episode.title);
  }, []);

  // Handle NFT click
  const handleNFTClick = useCallback((nft: NFTMetadata) => {
    console.log('💎 NFT clicked:', nft.name);
    // Could open NFT details modal or navigate to marketplace
  }, []);

  // Toggle follow status
  const toggleFollow = useCallback(() => {
    setIsFollowing(prev => !prev);
  }, []);

  // Filter NFTs based on rarity
  const filteredNFTs = animeDetails?.nftCollection?.filter(nft => 
    nftFilter === 'all' || nft.rarity === nftFilter
  ) || [];

  // NFT statistics
  const nftStats = {
    total: animeDetails?.nftCollection?.length || 0,
    common: animeDetails?.nftCollection?.filter(nft => nft.rarity === 'Common').length || 0,
    rare: animeDetails?.nftCollection?.filter(nft => nft.rarity === 'Rare').length || 0,
    epic: animeDetails?.nftCollection?.filter(nft => nft.rarity === 'Epic').length || 0,
    legendary: animeDetails?.nftCollection?.filter(nft => nft.rarity === 'Legendary').length || 0,
    listed: animeDetails?.nftCollection?.filter(nft => nft.isListed).length || 0
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Loading anime details..." />
          <p className="text-gray-400 mt-4">Fetching data from blockchain...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || apiError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Failed to Load Anime</h2>
          <p className="text-gray-400 mb-6">{error || apiErrorMessage || 'The requested anime could not be found.'}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <Link
              to="/anime"
              className="flex items-center space-x-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 hover:text-purple-300 transition-all duration-200 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Anime</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No anime found
  if (!animeDetails) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Anime Not Found</h2>
          <p className="text-gray-400 mb-6">The requested anime could not be found in our database.</p>
          <Link
            to="/anime"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-anime-purple hover:bg-anime-purple/80 rounded-lg text-white font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Anime</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="relative">
          {/* Cover Image */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={animeDetails.cover}
              alt={animeDetails.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          {/* Anime Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end space-x-6">
                {/* Poster */}
                <motion.img
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  src={animeDetails.poster}
                  alt={animeDetails.title}
                  className="w-48 h-72 object-cover rounded-lg shadow-2xl border-2 border-white/20"
                />

                {/* Details */}
                <div className="flex-1 pb-4">
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl font-orbitron font-bold text-white mb-4"
                  >
                    {animeDetails.title}
                  </motion.h1>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center space-x-6 mb-4"
                  >
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-5 h-5 mr-1" />
                      <span className="font-semibold">{animeDetails.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-300">{animeDetails.year}</span>
                    <span className="text-gray-300">{animeDetails.totalEpisodes} Episodes</span>
                    <span className="text-gray-300">{animeDetails.duration}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      animeDetails.status === 'Completed' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {animeDetails.status}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2 mb-4"
                  >
                    {animeDetails.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-anime-purple/20 text-anime-purple rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </motion.div>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-300 text-lg max-w-3xl mb-6"
                  >
                    {animeDetails.description}
                  </motion.p>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center space-x-4"
                  >
                    <Link
                      to={`/watch/${animeDetails.id}/episode/1`}
                      className="flex items-center space-x-2 px-6 py-3 anime-gradient rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Play className="w-5 h-5" />
                      <span>Start Watching</span>
                    </Link>

                    <button
                      onClick={toggleFollow}
                      className={`flex items-center space-x-2 px-6 py-3 border rounded-lg font-semibold transition-colors ${
                        isFollowing
                          ? 'bg-anime-purple/20 border-anime-purple/30 text-anime-purple'
                          : 'border-white/30 text-white hover:bg-white/10'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFollowing ? 'fill-current' : ''}`} />
                      <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    </button>

                    <button className="flex items-center space-x-2 px-6 py-3 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors">
                      <Bookmark className="w-5 h-5" />
                      <span>Watch Later</span>
                    </button>

                    <button className="flex items-center space-x-2 px-6 py-3 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors">
                      <Share className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <Link
            to="/anime"
            className="absolute top-4 left-4 flex items-center space-x-2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg text-white hover:bg-black/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Anime</span>
          </Link>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex space-x-1 mb-8 bg-black/40 rounded-lg p-1 border border-purple-500/20"
          >
            {[
              { key: 'episodes', label: 'Episodes', icon: Play, count: episodes.length },
              { key: 'nfts', label: 'NFT Collection', icon: Gem, count: nftStats.total }
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
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'episodes' ? (
                /* Episodes */
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-orbitron font-bold text-white mb-6">Episodes</h2>
                  <StreamingGrid
                    episodes={episodes}
                    animeTitle={animeDetails.title}
                    onEpisodeSelect={handleEpisodeSelect}
                    onProgressUpdate={handleProgressUpdate}
                    onNFTMint={handleNFTMint}
                    animeId={animeDetails.id}
                    animeData={animeDetails} // Pass anime details to StreamingGrid
                  />
                </motion.div>
              ) : (
                /* NFT Collection */
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-orbitron font-bold text-white">NFT Collection</h2>
                    
                    {/* NFT Controls */}
                    <div className="flex items-center space-x-4">
                      {/* Rarity Filter */}
                      <select
                        value={nftFilter}
                        onChange={(e) => setNftFilter(e.target.value as any)}
                        className="bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-anime-purple/50"
                      >
                        <option value="all">All Rarities</option>
                        <option value="Common">Common ({nftStats.common})</option>
                        <option value="Rare">Rare ({nftStats.rare})</option>
                        <option value="Epic">Epic ({nftStats.epic})</option>
                        <option value="Legendary">Legendary ({nftStats.legendary})</option>
                      </select>

                      {/* View Mode Toggle */}
                      <div className="flex bg-black/30 rounded-lg border border-purple-500/20 overflow-hidden">
                        <button
                          onClick={() => setNftViewMode('grid')}
                          className={`px-3 py-2 transition-colors ${
                            nftViewMode === 'grid'
                              ? 'bg-anime-purple/20 text-anime-purple'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <Grid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setNftViewMode('list')}
                          className={`px-3 py-2 transition-colors ${
                            nftViewMode === 'list'
                              ? 'bg-anime-purple/20 text-anime-purple'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* NFT Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="glass-card p-4 text-center border border-purple-500/20">
                      <p className="text-2xl font-bold text-white">{nftStats.total}</p>
                      <p className="text-sm text-gray-400">Total NFTs</p>
                    </div>
                    <div className="glass-card p-4 text-center border border-purple-500/20">
                      <p className="text-2xl font-bold text-yellow-400">{nftStats.legendary}</p>
                      <p className="text-sm text-gray-400">Legendary</p>
                    </div>
                    <div className="glass-card p-4 text-center border border-purple-500/20">
                      <p className="text-2xl font-bold text-purple-400">{nftStats.epic}</p>
                      <p className="text-sm text-gray-400">Epic</p>
                    </div>
                    <div className="glass-card p-4 text-center border border-purple-500/20">
                      <p className="text-2xl font-bold text-blue-400">{nftStats.rare}</p>
                      <p className="text-sm text-gray-400">Rare</p>
                    </div>
                    <div className="glass-card p-4 text-center border border-purple-500/20">
                      <p className="text-2xl font-bold text-green-400">{nftStats.listed}</p>
                      <p className="text-sm text-gray-400">Listed</p>
                    </div>
                  </div>

                  {/* API Collection Info */}
                  {animeDetails.nftCollection && animeDetails.nftCollection.length > 0 && (
                    <div className="glass-card p-4 mb-6 border border-green-500/20 bg-green-500/5">
                      <div className="flex items-center space-x-3">
                        <Sparkles className="w-5 h-5 text-green-400" />
                        <div>
                          <h3 className="text-green-400 font-semibold">API-Powered Collection</h3>
                          <p className="text-gray-300 text-sm">
                            This collection is loaded directly from the blockchain API. All NFT data is real and up-to-date.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NFT Grid/List */}
                  {filteredNFTs.length === 0 ? (
                    <div className="glass-card p-12 text-center border border-purple-500/20">
                      <Gem className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold text-white mb-2">No NFTs Found</h3>
                      <p className="text-gray-400 mb-4">
                        {nftFilter === 'all' 
                          ? 'This anime doesn\'t have any NFTs yet. Start watching to earn some!'
                          : `No ${nftFilter} rarity NFTs found. Try a different filter.`
                        }
                      </p>
                      <button
                        onClick={() => setActiveTab('episodes')}
                        className="flex items-center space-x-2 px-6 py-3 anime-gradient rounded-lg text-white font-semibold hover:opacity-90 transition-opacity mx-auto"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start Watching</span>
                      </button>
                    </div>
                  ) : (
                    <div className={
                      nftViewMode === 'grid' 
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }>
                      {filteredNFTs.map((nft, index) => (
                        <NFTCard
                          key={nft.id}
                          nft={nft}
                          viewMode={nftViewMode}
                          onClick={handleNFTClick}
                          index={index}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6 border border-purple-500/20"
              >
                <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Views
                    </span>
                    <span className="text-white font-semibold">
                      {animeDetails.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Likes
                    </span>
                    <span className="text-white font-semibold">
                      {animeDetails.likes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Followers
                    </span>
                    <span className="text-white font-semibold">
                      {animeDetails.followers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <Gem className="w-4 h-4 mr-2" />
                      NFTs
                    </span>
                    <span className="text-white font-semibold">
                      {nftStats.total}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Your Progress */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6 border border-purple-500/20"
              >
                <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Episodes Watched</span>
                      <span className="text-white">{watchStats.episodesWatched}/{animeDetails.totalEpisodes}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="progress-bar h-2 rounded-full"
                        style={{ width: `${(watchStats.episodesWatched / animeDetails.totalEpisodes) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Watch Time
                    </span>
                    <span className="text-white font-semibold">
                      {watchStats.totalWatchTime}m
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <Gem className="w-4 h-4 mr-2" />
                      NFTs Earned
                    </span>
                    <span className="text-anime-purple font-semibold">
                      {watchStats.nftsEarned}
                    </span>
                  </div>
                </div>

                {/* NFT Earning Info */}
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Gift className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 font-semibold text-sm">NFT Rewards</span>
                  </div>
                  <p className="text-gray-300 text-xs">
                    Watch episodes to unlock exclusive NFTs from this anime's collection! Each episode completion rewards you with collectibles.
                  </p>
                </div>
              </motion.div>

              {/* Creator Info */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-6 border border-purple-500/20"
              >
                <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Creator</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={animeDetails.creator.avatar}
                    alt={animeDetails.creator.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{animeDetails.creator.username}</h4>
                    <p className="text-gray-400 text-sm">Content Creator</p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 anime-gradient rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
                  View Profile
                </button>
              </motion.div>

              {/* Studios */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="glass-card p-6 border border-purple-500/20"
              >
                <h3 className="text-lg font-orbitron font-semibold text-white mb-4">Studios</h3>
                <div className="space-y-2">
                  {animeDetails.studios.map((studio, index) => (
                    <div key={index} className="text-gray-300">
                      {studio}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default StreamingAnime;