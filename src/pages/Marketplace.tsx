import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  TrendingUp, 
  Star, 
  Clock, 
  Filter,
  Search,
  Tag,
  Heart,
  ExternalLink,
  Zap
} from 'lucide-react';

const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'recent'>('all');
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [filterAnime, setFilterAnime] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const marketplaceNFTs = [
    {
      id: '1',
      name: 'Legendary Saiyan Power',
      image: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg',
      anime: 'Dragon Ball Z',
      episode: 95,
      watchTime: 60,
      rarity: 'Legendary' as const,
      price: 12.5,
      seller: 'SuperSaiyan_Fan',
      listedAt: new Date('2024-01-20'),
      likes: 47,
      views: 1230
    },
    {
      id: '2',
      name: 'Sharingan Awakening',
      image: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
      anime: 'Naruto',
      episode: 3,
      watchTime: 24,
      rarity: 'Epic' as const,
      price: 8.2,
      seller: 'HokageNinja',
      listedAt: new Date('2024-01-19'),
      likes: 32,
      views: 890
    },
    {
      id: '3',
      name: 'Titan Slayer Badge',
      image: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg',
      anime: 'Attack on Titan',
      episode: 25,
      watchTime: 45,
      rarity: 'Rare' as const,
      price: 5.7,
      seller: 'ErenJaeger',
      listedAt: new Date('2024-01-18'),
      likes: 28,
      views: 650
    },
    {
      id: '4',
      name: 'Demon Slayer Corps',
      image: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
      anime: 'Demon Slayer',
      episode: 19,
      watchTime: 24,
      rarity: 'Epic' as const,
      price: 9.8,
      seller: 'TanjiroK',
      listedAt: new Date('2024-01-17'),
      likes: 55,
      views: 1450
    },
    {
      id: '5',
      name: 'One Piece Treasure',
      image: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg',
      anime: 'One Piece',
      episode: 1000,
      watchTime: 90,
      rarity: 'Legendary' as const,
      price: 15.0,
      seller: 'PirateKing_Luffy',
      listedAt: new Date('2024-01-16'),
      likes: 89,
      views: 2100
    },
    {
      id: '6',
      name: 'Hero License',
      image: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
      anime: 'My Hero Academia',
      episode: 138,
      watchTime: 24,
      rarity: 'Rare' as const,
      price: 4.5,
      seller: 'AllMight_Fan',
      listedAt: new Date('2024-01-15'),
      likes: 21,
      views: 480
    }
  ];

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

  const filteredNFTs = marketplaceNFTs.filter(nft => {
    if (filterRarity !== 'all' && nft.rarity !== filterRarity) return false;
    if (filterAnime !== 'all' && nft.anime !== filterAnime) return false;
    return true;
  });

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime();
      case 'oldest':
        return new Date(a.listedAt).getTime() - new Date(b.listedAt).getTime();
      case 'price_high':
        return b.price - a.price;
      case 'price_low':
        return a.price - b.price;
      case 'popular':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const animeList = [...new Set(marketplaceNFTs.map(nft => nft.anime))];

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
          NFT Marketplace
        </motion.h1>
        <motion.p 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400"
        >
          Discover, buy, and trade exclusive anime NFTs from the community
        </motion.p>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{marketplaceNFTs.length}</p>
            <p className="text-sm text-gray-400">Listed NFTs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">24h Volume</p>
            <p className="text-sm text-green-400">156.7 ALGO</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">Floor Price</p>
            <p className="text-sm text-blue-400">4.5 ALGO</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">Avg. Price</p>
            <p className="text-sm text-purple-400">9.2 ALGO</p>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1"
      >
        {[
          { key: 'all', label: 'All NFTs', icon: ShoppingBag },
          { key: 'trending', label: 'Trending', icon: TrendingUp },
          { key: 'recent', label: 'Recently Listed', icon: Clock }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 text-neon-purple'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4 mb-6"
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search NFTs, anime, or sellers..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple/50"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-purple/50"
            >
              <option value="all">All Rarities</option>
              <option value="Common">Common</option>
              <option value="Rare">Rare</option>
              <option value="Epic">Epic</option>
              <option value="Legendary">Legendary</option>
            </select>

            <select
              value={filterAnime}
              onChange={(e) => setFilterAnime(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-purple/50"
            >
              <option value="all">All Anime</option>
              {animeList.map(anime => (
                <option key={anime} value={anime}>{anime}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-purple/50"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_high">Price: High to Low</option>
              <option value="price_low">Price: Low to High</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedNFTs.map((nft, index) => (
          <motion.div
            key={nft.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
            className={`glass-card hover:bg-white/10 transition-all duration-300 group cursor-pointer overflow-hidden ${
              rarityBorders[nft.rarity]
            }`}
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

              {/* Quick Stats */}
              <div className="absolute bottom-2 left-2 flex space-x-2">
                <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center">
                  <Heart className="w-3 h-3 mr-1 text-red-400" />
                  {nft.likes}
                </div>
                <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center">
                  <Zap className="w-3 h-3 mr-1 text-yellow-400" />
                  {nft.views}
                </div>
              </div>
            </div>

            {/* NFT Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-semibold group-hover:text-neon-purple transition-colors line-clamp-1">
                  {nft.name}
                </h3>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg">{nft.price}</p>
                  <p className="text-green-400 text-xs">ALGO</p>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-3">{nft.anime} - Episode {nft.episode}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {nft.watchTime}m
                </span>
                <span>by @{nft.seller}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-neon-purple to-neon-blue px-4 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Buy Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 border border-white/20 rounded-lg text-white text-sm font-semibold hover:bg-white/5 transition-colors"
                >
                  Make Offer
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8"
      >
        <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-lg text-white font-semibold transition-all duration-300">
          Load More NFTs
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Marketplace;