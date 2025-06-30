import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Eye, 
  Heart, 
  Star, 
  Calendar,
  User,
  Gem,
  Clock
} from 'lucide-react';
import { AnimeData } from '../types/anime';
import { animeUtils } from '../utils/animations';

interface AnimeCardProps {
  anime: AnimeData;
  viewMode: 'grid' | 'list';
  onClick: (anime: AnimeData) => void;
  index: number;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ 
  anime, 
  viewMode, 
  onClick,
  index 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatViews = (views: number = 0) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  const formatRating = (rating: number | undefined) => {
    if (!rating) return 'N/A';
    return rating.toFixed(1);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.05 * index }}
        className="glass-card p-responsive hover:bg-white/10 transition-all duration-300 cursor-pointer group border border-purple-500/20"
        onClick={() => onClick(anime)}
        onMouseEnter={(e) => animeUtils.glow(e.currentTarget)}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0 w-full sm:w-auto">
            <img
              src={anime.thumbnail || 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg'}
              alt={anime.title}
              className="w-full sm:w-24 h-32 sm:h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="w-6 h-6 text-white" />
            </div>
            
            {/* Status Badge */}
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
              anime.status === 'published' 
                ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                : anime.status === 'pending'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
            }`}>
              {anime.status}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-2">
              <div className="flex-1 mb-2 lg:mb-0">
                <h3 className="text-white font-semibold text-responsive-lg group-hover:text-anime-purple transition-colors line-clamp-1">
                  {anime.title}
                </h3>
                <p className="text-gray-400 text-responsive-sm mb-2 line-clamp-2">
                  {anime.description}
                </p>
              </div>
              
              {anime.rating && (
                <div className="flex items-center text-yellow-400 lg:ml-4">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="text-responsive-sm font-semibold">{formatRating(anime.rating)}</span>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs text-gray-500 mb-3">
              <span className="flex items-center">
                <Play className="w-3 h-3 mr-1" />
                {anime.episodes} episodes
              </span>
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(anime.createdAt)}
              </span>
              <span className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {(anime as any).creator?.username || 'Unknown'}
              </span>
              {anime.nftCollection && (
                <span className="flex items-center">
                  <Gem className="w-3 h-3 mr-1" />
                  {anime.nftCollection.length} NFTs
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1 mb-3">
              {anime.genres?.slice(0, 3).map((genre, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-anime-purple/20 text-anime-purple rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {formatViews(anime.views || 0)}
                </span>
                <span className="flex items-center">
                  <Heart className="w-3 h-3 mr-1" />
                  {formatViews(anime.likes || 0)}
                </span>
              </div>
              
              <span className="text-anime-purple text-xs font-medium">
                🎁 Watch & Earn NFTs
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.05 * index }}
      className="glass-card hover:bg-white/10 transition-all duration-300 group cursor-pointer border border-purple-500/20 overflow-hidden"
      onClick={() => onClick(anime)}
      onMouseEnter={(e) => animeUtils.glow(e.currentTarget)}
    >
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={anime.thumbnail || 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg'}
          alt={anime.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Play className="w-12 h-12 text-white animate-pulse" />
        </div>

        {/* Status Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
          anime.status === 'published' 
            ? 'bg-green-500/20 text-green-400 border border-green-400/30'
            : anime.status === 'pending'
            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
            : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
        }`}>
          {anime.status}
        </div>

        {/* Rating */}
        {anime.rating && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center">
            <Star className="w-3 h-3 mr-1 text-yellow-400" />
            {formatRating(anime.rating)}
          </div>
        )}

        {/* NFT Count */}
        {anime.nftCollection && anime.nftCollection.length > 0 && (
          <div className="absolute bottom-2 right-2 bg-anime-purple/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center">
            <Gem className="w-3 h-3 mr-1" />
            {anime.nftCollection.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-responsive">
        <h3 className="text-white font-semibold mb-1 group-hover:text-anime-purple transition-colors line-clamp-2 text-responsive-base">
          {anime.title}
        </h3>
        
        <p className="text-gray-400 text-responsive-sm mb-3 line-clamp-2">
          {anime.description}
        </p>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center">
            <Play className="w-3 h-3 mr-1" />
            {anime.episodes} eps
          </span>
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatDate(anime.createdAt)}
          </span>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {anime.genres?.slice(0, 2).map((genre, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 bg-anime-purple/20 text-anime-purple rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center space-x-3 text-gray-500">
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {formatViews(anime.views || 0)}
            </span>
            <span className="flex items-center">
              <Heart className="w-3 h-3 mr-1" />
              {formatViews(anime.likes || 0)}
            </span>
          </div>
          
          <span className="text-anime-purple font-medium">
            🎁 Earn NFTs
          </span>
        </div>

        {/* Creator */}
        <div className="pt-2 border-t border-purple-500/20">
          <span className="text-xs text-gray-500 flex items-center">
            <User className="w-3 h-3 mr-1" />
            by {(anime as any).creator?.username || 'Unknown Creator'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};