import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gem, 
  Star, 
  Calendar, 
  TrendingUp, 
  Filter,
  Grid,
  List,
  Search,
  Tag,
  Clock
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const Collection: React.FC = () => {
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

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

  const filteredNFTs = user.nftsOwned.filter(nft => 
    filterRarity === 'all' || nft.rarity === filterRarity
  );

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.mintedAt).getTime() - new Date(a.mintedAt).getTime();
      case 'oldest':
        return new Date(a.mintedAt).getTime() - new Date(b.mintedAt).getTime();
      case 'rarity':
        const rarityOrder = { 'Legendary': 4, 'Epic': 3, 'Rare': 2, 'Common': 1 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      case 'watchTime':
        return b.watchTime - a.watchTime;
      default:
        return 0;
    }
  });

  return (
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
          className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2"
        >
          My NFT Collection
        </motion.h1>
        <motion.p 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400"
        >
          Your earned anime NFTs from watching episodes
        </motion.p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 text-center"
        >
          <Gem className="w-8 h-8 mx-auto mb-2 text-purple-400" />
          <p className="text-2xl font-bold text-white">{user.nftsOwned.length}</p>
          <p className="text-sm text-gray-400">Total NFTs</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 text-center"
        >
          <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
          <p className="text-2xl font-bold text-white">
            {user.nftsOwned.filter(nft => nft.rarity === 'Legendary' || nft.rarity === 'Epic').length}
          </p>
          <p className="text-sm text-gray-400">Rare & Above</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 text-center"
        >
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
          <p className="text-2xl font-bold text-white">
            {user.nftsOwned.filter(nft => nft.isListed).length}
          </p>
          <p className="text-sm text-gray-400">Listed for Sale</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4 text-center"
        >
          <Clock className="w-8 h-8 mx-auto mb-2 text-blue-400" />
          <p className="text-2xl font-bold text-white">
            {user.nftsOwned.reduce((total, nft) => total + nft.watchTime, 0)}
          </p>
          <p className="text-sm text-gray-400">Total Watch Minutes</p>
        </motion.div>
      </div>

      {/* Filters and Controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4 mb-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search NFTs..."
                className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple/50"
              />
            </div>

            {/* Rarity Filter */}
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-purple/50"
            >
              <option value="all">All Rarities</option>
              <option value="Common">Common</option>
              <option value="Rare">Rare</option>
              <option value="Epic">Epic</option>
              <option value="Legendary">Legendary</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-purple/50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rarity">By Rarity</option>
              <option value="watchTime">By Watch Time</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-neon-purple/20 text-neon-purple' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-neon-purple/20 text-neon-purple' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* NFT Grid/List */}
      {sortedNFTs.length === 0 ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <Gem className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-white mb-2">No NFTs Found</h3>
          <p className="text-gray-400 mb-4">Start watching anime episodes to earn your first NFTs!</p>
          <button className="bg-gradient-to-r from-neon-purple to-neon-blue px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
            Start Watching
          </button>
        </motion.div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {sortedNFTs.map((nft, index) => (
            <motion.div
              key={nft.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`glass-card hover:bg-white/10 transition-all duration-300 group cursor-pointer ${
                rarityBorders[nft.rarity]
              } ${
                viewMode === 'grid' ? 'p-4' : 'p-4 flex items-center space-x-4'
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* NFT Image */}
                  <div className="relative mb-4">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    
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
                  </div>

                  {/* NFT Info */}
                  <div>
                    <h3 className="text-white font-semibold mb-1 group-hover:text-neon-purple transition-colors">
                      {nft.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">{nft.anime} - Episode {nft.episode}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {nft.watchTime}m watched
                      </span>
                      {nft.isListed && nft.price && (
                        <span className="text-green-400 font-semibold">{nft.price} ALGO</span>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Minted {new Date(nft.mintedAt).toLocaleDateString()}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* List View */}
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-semibold group-hover:text-neon-purple transition-colors">
                        {nft.name}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${rarityColors[nft.rarity]} text-white`}>
                        <Star className="w-3 h-3 inline mr-1" />
                        {nft.rarity}
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-2">{nft.anime} - Episode {nft.episode}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {nft.watchTime}m watched
                        </span>
                        <span className="text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(nft.mintedAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {nft.isListed && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-400/30">
                            <Tag className="w-3 h-3 inline mr-1" />
                            Listed
                          </span>
                        )}
                        {nft.isListed && nft.price && (
                          <span className="text-green-400 font-semibold">{nft.price} ALGO</span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Collection;