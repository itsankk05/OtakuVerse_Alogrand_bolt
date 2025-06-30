import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  Heart, 
  Eye, 
  User,
  Gem,
  ExternalLink,
  Tag
} from 'lucide-react';
import { NFTMetadata } from '../types/anime';
import { animeUtils } from '../utils/animations';

interface NFTCardProps {
  nft: NFTMetadata;
  viewMode: 'grid' | 'list';
  onClick: (nft: NFTMetadata) => void;
  index: number;
}

export const NFTCard: React.FC<NFTCardProps> = ({ 
  nft, 
  viewMode, 
  onClick,
  index 
}) => {
  const rarityColors = {
    Common: 'from-gray-500 to-gray-400',
    Rare: 'from-blue-500 to-purple-500',
    Epic: 'from-purple-500 to-pink-500',
    Legendary: 'from-yellow-500 to-orange-500'
  };

  const rarityBorders = {
    Common: 'border-gray-500/30',
    Rare: 'border-blue-500/30',
    Epic: 'border-purple-500/30',
    Legendary: 'border-yellow-500/30'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.05 * index }}
        className={`glass-card p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer group ${rarityBorders[nft.rarity]}`}
        onClick={() => onClick(nft)}
        onMouseEnter={(e) => animeUtils.glow(e.currentTarget)}
      >
        <div className="flex items-center space-x-4">
          {/* NFT Image */}
          <div className="relative flex-shrink-0">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Rarity Badge */}
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r ${rarityColors[nft.rarity]} flex items-center justify-center`}>
              <Star className="w-2 h-2 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-white font-semibold group-hover:text-anime-purple transition-colors line-clamp-1">
                {nft.name}
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${rarityColors[nft.rarity]} text-white ml-2`}>
                {nft.rarity}
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-2">
              {nft.anime} - Episode {nft.episode}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {nft.watchTime}m
                </span>
                <span className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {(nft as any).creator || 'Unknown'}
                </span>
                {nft.tokenId && (
                  <span className="flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    #{nft.tokenId}
                  </span>
                )}
              </div>
              
              {nft.isListed && nft.price && (
                <div className="text-right">
                  <p className="text-green-400 font-bold">{nft.price} ALGO</p>
                </div>
              )}
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
      className={`glass-card hover:bg-white/10 transition-all duration-300 group cursor-pointer overflow-hidden ${rarityBorders[nft.rarity]}`}
      onClick={() => onClick(nft)}
      onMouseEnter={(e) => animeUtils.glow(e.currentTarget)}
    >
      {/* NFT Image */}
      <div className="relative">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <Heart className="w-4 h-4 text-white" />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <ExternalLink className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Rarity Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${rarityColors[nft.rarity]} text-white`}>
          <Star className="w-3 h-3 inline mr-1" />
          {nft.rarity}
        </div>

        {/* Listed Badge */}
        {nft.isListed && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-400/30">
            <Tag className="w-3 h-3 inline mr-1" />
            Listed
          </div>
        )}

        {/* Token ID */}
        {nft.tokenId && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white">
            #{nft.tokenId}
          </div>
        )}
      </div>

      {/* NFT Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-semibold group-hover:text-anime-purple transition-colors line-clamp-1 flex-1">
            {nft.name}
          </h3>
          {nft.isListed && nft.price && (
            <div className="text-right ml-2">
              <p className="text-green-400 font-bold text-sm">{nft.price}</p>
              <p className="text-green-400 text-xs">ALGO</p>
            </div>
          )}
        </div>
        
        <p className="text-gray-400 text-sm mb-3">
          {nft.anime} - Episode {nft.episode}
        </p>
        
        {/* Description */}
        {nft.description && (
          <p className="text-gray-500 text-xs mb-3 line-clamp-2">
            {nft.description}
          </p>
        )}
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {nft.watchTime}m watch time
          </span>
          <span className="flex items-center">
            <Gem className="w-3 h-3 mr-1" />
            NFT
          </span>
        </div>

        {/* Attributes */}
        {nft.attributes && nft.attributes.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {nft.attributes.slice(0, 2).map((attr, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-anime-cyan/20 text-anime-cyan rounded-full"
                  title={`${attr.trait_type}: ${attr.value}`}
                >
                  {attr.trait_type}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 flex items-center">
            <User className="w-3 h-3 mr-1" />
            {(nft as any).creator || 'Unknown'}
          </span>
          <span className="text-gray-500">
            {formatDate(nft.mintedAt)}
          </span>
        </div>

        {/* Action Button */}
        {nft.isListed && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-3 bg-gradient-to-r from-anime-purple to-anime-blue px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {nft.price ? `Buy for ${nft.price} ALGO` : 'View Details'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};