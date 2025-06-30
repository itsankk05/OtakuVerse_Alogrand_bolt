import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Gem, 
  Clock, 
  TrendingUp, 
  Star,
  Calendar,
  Award,
  Target,
  Activity,
  Trophy,
  Zap,
  Copy,
  ExternalLink,
  BarChart3,
  Play,
  Eye,
  Heart,
  Edit,
  Trash2,
  Upload
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const Profile: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'activity' | 'published'>('overview');

  const achievements = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Watch your first anime episode',
      icon: '🎌',
      completed: true,
      rarity: 'Common',
      progress: 100
    },
    {
      id: 2,
      name: 'NFT Collector',
      description: 'Own 5 NFTs',
      icon: '💎',
      completed: false,
      rarity: 'Rare',
      progress: 40
    },
    {
      id: 3,
      name: 'Binge Watcher',
      description: 'Watch for 100 minutes in a day',
      icon: '🔥',
      completed: true,
      rarity: 'Epic',
      progress: 100
    },
    {
      id: 4,
      name: 'Otaku Elite',
      description: 'Watch 50 episodes total',
      icon: '👑',
      completed: false,
      rarity: 'Legendary',
      progress: 46
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'nft_minted',
      title: 'Minted Attack on Titan NFT',
      description: 'Earned from watching Episode 5',
      timestamp: new Date('2024-01-18T14:30:00'),
      icon: Gem
    },
    {
      id: 2,
      type: 'watch_session',
      title: 'Watched Naruto Episode 1',
      description: '24 minutes of watch time',
      timestamp: new Date('2024-01-15T19:45:00'),
      icon: Clock
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Achievement Unlocked: Binge Watcher',
      description: 'Watched for 100+ minutes',
      timestamp: new Date('2024-01-12T22:15:00'),
      icon: Trophy
    }
  ];

  const weeklyWatchTime = [
    { day: 'Mon', minutes: 45, date: '15' },
    { day: 'Tue', minutes: 30, date: '16' },
    { day: 'Wed', minutes: 60, date: '17' },
    { day: 'Thu', minutes: 25, date: '18' },
    { day: 'Fri', minutes: 80, date: '19' },
    { day: 'Sat', minutes: 120, date: '20' },
    { day: 'Sun', minutes: 90, date: '21' }
  ];

  const monthlyWatchTime = [
    { month: 'Sep', minutes: 1200 },
    { month: 'Oct', minutes: 1450 },
    { month: 'Nov', minutes: 1680 },
    { month: 'Dec', minutes: 1890 },
    { month: 'Jan', minutes: 2100 }
  ];

  const maxWeeklyMinutes = Math.max(...weeklyWatchTime.map(d => d.minutes));
  const maxMonthlyMinutes = Math.max(...monthlyWatchTime.map(d => d.minutes));

  const copyWalletAddress = () => {
    if (user.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
    }
  };

  // Mock published animes for creators
  const publishedAnimes = user.userType === 'creator' ? [
    {
      id: 'anime-1',
      title: 'Mystic Warriors Academy',
      thumbnail: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
      episodes: 12,
      status: 'published' as const,
      views: 125000,
      likes: 8500,
      nftsSold: 45,
      revenue: 125.5,
      publishedAt: new Date('2024-01-10'),
      description: 'A thrilling adventure of young warriors learning mystical arts.'
    },
    {
      id: 'anime-2',
      title: 'Cyber Samurai Chronicles',
      thumbnail: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg',
      episodes: 24,
      status: 'published' as const,
      views: 89000,
      likes: 6200,
      nftsSold: 32,
      revenue: 89.2,
      publishedAt: new Date('2024-01-05'),
      description: 'Futuristic samurai battles in a cyberpunk world.'
    },
    {
      id: 'anime-3',
      title: 'Dragon Realm Legends',
      thumbnail: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
      episodes: 8,
      status: 'draft' as const,
      views: 0,
      likes: 0,
      nftsSold: 0,
      revenue: 0,
      publishedAt: new Date('2024-01-20'),
      description: 'Epic tales from the mystical dragon realms.'
    }
  ] : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Profile Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-6 mb-8 relative overflow-hidden border border-purple-500/30"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-anime-purple/10 to-anime-pink/10"></div>
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="w-24 h-24 anime-gradient rounded-full flex items-center justify-center text-white text-2xl font-orbitron font-bold animate-pulse-glow">
            {user.username.charAt(0).toUpperCase()}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-orbitron font-bold text-white mb-2">{user.username}</h1>
            <p className="text-gray-400 mb-4">Otaku Elite · Member since Jan 2024</p>
            
            {/* Wallet Info */}
            {user.walletAddress && (
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                <div className="bg-black/30 rounded-lg px-3 py-2 flex items-center space-x-2 border border-purple-500/20">
                  <span className="text-anime-green text-sm font-mono">{user.walletAddress}</span>
                  <button
                    onClick={copyWalletAddress}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-orbitron font-bold text-anime-gradient">{user.totalWatchTime}</p>
                <p className="text-sm text-gray-400">Minutes Watched</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-orbitron font-bold text-anime-gradient">{user.nftsOwned.length}</p>
                <p className="text-sm text-gray-400">NFTs Owned</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-orbitron font-bold text-anime-gradient">
                  {user.userType === 'creator' ? publishedAnimes.filter(a => a.status === 'published').length : '23'}
                </p>
                <p className="text-sm text-gray-400">
                  {user.userType === 'creator' ? 'Published Animes' : 'Episodes Watched'}
                </p>
              </div>
            </div>
          </div>

          {/* Settings Button */}
          <button className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex space-x-1 mb-6 bg-black/40 rounded-lg p-1 border border-purple-500/20"
      >
        {[
          { key: 'overview', label: 'Overview', icon: User },
          { key: 'achievements', label: 'Achievements', icon: Trophy },
          { key: 'activity', label: 'Activity', icon: Activity },
          ...(user.userType === 'creator' ? [{ key: 'published', label: 'Published Animes', icon: Upload }] : [])
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.key
                  ? 'anime-gradient text-white'
                  : 'text-gray-400 hover:text-white hover:bg-purple-500/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Weekly Watch Time Chart */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 border border-purple-500/20"
              >
                <h2 className="text-xl font-orbitron font-semibold text-white mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-anime-cyan" />
                  Weekly Watch Time
                </h2>
                
                <div className="flex items-end justify-between h-48 space-x-2 mb-4">
                  {weeklyWatchTime.map((data, index) => (
                    <div key={data.day} className="flex-1 flex flex-col items-center">
                      <div className="flex-1 flex items-end mb-2 w-full">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(data.minutes / maxWeeklyMinutes) * 100}%` }}
                          transition={{ delay: 0.1 * index, duration: 0.5 }}
                          className="w-full anime-gradient rounded-t-lg min-h-[20px] relative group cursor-pointer"
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {data.minutes}m
                          </div>
                        </motion.div>
                      </div>
                      <span className="text-xs text-gray-400 mb-1">{data.day}</span>
                      <span className="text-xs text-gray-500">{data.date}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center text-sm text-gray-400">
                  Total this week: {weeklyWatchTime.reduce((sum, day) => sum + day.minutes, 0)} minutes
                </div>
              </motion.div>

              {/* Monthly Watch Time Chart */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 border border-purple-500/20"
              >
                <h2 className="text-xl font-orbitron font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-anime-pink" />
                  Monthly Progress
                </h2>
                
                <div className="flex items-end justify-between h-32 space-x-3 mb-4">
                  {monthlyWatchTime.map((data, index) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center">
                      <div className="flex-1 flex items-end mb-2 w-full">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(data.minutes / maxMonthlyMinutes) * 100}%` }}
                          transition={{ delay: 0.1 * index, duration: 0.8 }}
                          className="w-full bg-gradient-to-t from-anime-purple to-anime-pink rounded-t-lg min-h-[15px] relative group cursor-pointer"
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {data.minutes}m
                          </div>
                        </motion.div>
                      </div>
                      <span className="text-xs text-gray-400">{data.month}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center text-sm text-gray-400">
                  Average monthly growth: +15.2%
                </div>
              </motion.div>

              {/* Recent NFTs */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6 border border-purple-500/20"
              >
                <h2 className="text-xl font-orbitron font-semibold text-white mb-4 flex items-center">
                  <Gem className="w-5 h-5 mr-2 text-anime-purple" />
                  Recent NFTs
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {user.nftsOwned.slice(0, 4).map((nft, index) => (
                    <motion.div
                      key={nft.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center space-x-3 p-3 bg-black/30 rounded-lg hover:bg-purple-500/10 transition-colors cursor-pointer border border-purple-500/10"
                    >
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-sm">{nft.name}</h3>
                        <p className="text-gray-400 text-xs">{nft.anime}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        nft.rarity === 'Legendary' ? 'bg-anime-yellow/20 text-anime-yellow' :
                        nft.rarity === 'Epic' ? 'bg-anime-purple/20 text-anime-purple' :
                        nft.rarity === 'Rare' ? 'bg-anime-cyan/20 text-anime-cyan' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {nft.rarity}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`glass-card p-4 border ${
                    achievement.completed ? 'border-anime-green/30' : 'border-purple-500/20'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                      achievement.completed 
                        ? 'anime-gradient animate-pulse-glow' 
                        : 'bg-gray-500/20'
                    }`}>
                      {achievement.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-orbitron font-semibold ${
                          achievement.completed ? 'text-white' : 'text-gray-400'
                        }`}>
                          {achievement.name}
                        </h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          achievement.rarity === 'Legendary' ? 'bg-anime-yellow/20 text-anime-yellow' :
                          achievement.rarity === 'Epic' ? 'bg-anime-purple/20 text-anime-purple' :
                          achievement.rarity === 'Rare' ? 'bg-anime-cyan/20 text-anime-cyan' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {achievement.rarity}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                      
                      {!achievement.completed && (
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="progress-bar h-2 rounded-full transition-all duration-300"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    {achievement.completed && (
                      <div className="text-anime-green">
                        <Award className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="glass-card p-4 border border-purple-500/20"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'nft_minted' ? 'bg-anime-purple/20 text-anime-purple' :
                        activity.type === 'watch_session' ? 'bg-anime-cyan/20 text-anime-cyan' :
                        'bg-anime-yellow/20 text-anime-yellow'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{activity.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{activity.description}</p>
                        <p className="text-gray-500 text-xs flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'published' && user.userType === 'creator' && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Published Animes Stats */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="glass-card p-4 text-center border border-purple-500/20">
                  <p className="text-2xl font-bold text-anime-gradient">
                    {publishedAnimes.filter(a => a.status === 'published').length}
                  </p>
                  <p className="text-sm text-gray-400">Published</p>
                </div>
                <div className="glass-card p-4 text-center border border-purple-500/20">
                  <p className="text-2xl font-bold text-anime-gradient">
                    {publishedAnimes.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">Total Views</p>
                </div>
                <div className="glass-card p-4 text-center border border-purple-500/20">
                  <p className="text-2xl font-bold text-anime-gradient">
                    {publishedAnimes.reduce((sum, a) => sum + a.nftsSold, 0)}
                  </p>
                  <p className="text-sm text-gray-400">NFTs Sold</p>
                </div>
                <div className="glass-card p-4 text-center border border-purple-500/20">
                  <p className="text-2xl font-bold text-anime-gradient">
                    {publishedAnimes.reduce((sum, a) => sum + a.revenue, 0).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-400">ALGO Earned</p>
                </div>
              </div>

              {/* Published Animes List */}
              <div className="space-y-4">
                {publishedAnimes.map((anime, index) => (
                  <motion.div
                    key={anime.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="glass-card p-6 border border-purple-500/20"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={anime.thumbnail}
                        alt={anime.title}
                        className="w-24 h-32 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-1">{anime.title}</h3>
                            <p className="text-gray-400 text-sm mb-2">{anime.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              anime.status === 'published' 
                                ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
                            }`}>
                              {anime.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">{anime.episodes}</p>
                            <p className="text-xs text-gray-400">Episodes</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">{anime.views.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">Views</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">{anime.likes.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">Likes</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-anime-green">{anime.revenue.toFixed(1)} ALGO</p>
                            <p className="text-xs text-gray-400">Revenue</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Published {anime.publishedAt.toLocaleDateString()}
                          </span>
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {anime.views} views
                            </span>
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 mr-1" />
                              {anime.likes} likes
                            </span>
                            <span className="flex items-center">
                              <Gem className="w-3 h-3 mr-1" />
                              {anime.nftsSold} NFTs sold
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 border border-purple-500/20"
          >
            <h3 className="text-lg font-orbitron font-semibold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-anime-green" />
              Next Goal
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Next NFT</span>
                  <span className="text-white text-sm">12/15 min</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="progress-bar h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Weekly Goal</span>
                  <span className="text-white text-sm">450/500 min</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-anime-green to-anime-cyan h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Rank Card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 border border-purple-500/20"
          >
            <h3 className="text-lg font-orbitron font-semibold text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-anime-yellow" />
              Rank & Status
            </h3>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 anime-gradient rounded-full flex items-center justify-center animate-pulse-glow">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-orbitron font-bold text-white mb-1">Otaku Elite</h4>
              <p className="text-gray-400 text-sm mb-4">Rank #156 globally</p>
              
              <div className="bg-black/30 rounded-lg p-3 border border-purple-500/20">
                <p className="text-xs text-gray-400 mb-1">Next Rank: Anime Legend</p>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-anime-yellow to-anime-pink h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-white mt-1">2,350 / 3,600 XP</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 border border-purple-500/20"
          >
            <h3 className="text-lg font-orbitron font-semibold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-anime-cyan" />
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button className="w-full anime-gradient px-4 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
                {user.userType === 'creator' ? 'Upload New Anime' : 'Start Watching'}
              </button>
              <button className="w-full bg-black/30 hover:bg-purple-500/20 border border-purple-500/20 px-4 py-3 rounded-lg text-white font-semibold transition-colors">
                View Collection
              </button>
              <button className="w-full bg-black/30 hover:bg-purple-500/20 border border-purple-500/20 px-4 py-3 rounded-lg text-white font-semibold transition-colors">
                Browse Marketplace
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;