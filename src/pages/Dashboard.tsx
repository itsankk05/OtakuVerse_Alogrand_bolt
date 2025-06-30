import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Gem, Clock, TrendingUp, Star, Siren as Fire, Zap, Award } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { animeApi, SearchResult } from '../services/animeApi';
import { animeUtils, animationSequences } from '../utils/animations';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [trendingAnime, setTrendingAnime] = useState<SearchResult[]>([]);
  const [recentEpisodes, setRecentEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const [trending, recent] = await Promise.all([
          animeApi.getTrendingAnime(),
          animeApi.getRecentEpisodes()
        ]);
        
        setTrendingAnime(trending.results.slice(0, 6));
        setRecentEpisodes(recent.results.slice(0, 3));
      } catch (error) {
        console.error('Error fetching anime data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, []);

  // Animate page entrance
  useEffect(() => {
    if (!loading && containerRef.current) {
      animationSequences.pageEntrance(containerRef.current);
    }
  }, [loading]);

  // Animate cards when they load
  useEffect(() => {
    if (!loading && cardsRef.current && trendingAnime.length > 0) {
      setTimeout(() => {
        animationSequences.cardGrid(cardsRef.current!);
      }, 500);
    }
  }, [loading, trendingAnime]);

  const stats = [
    { label: 'Total Watch Time', value: `${user.totalWatchTime} min`, icon: Clock, color: 'from-anime-cyan to-anime-purple' },
    { label: 'NFTs Owned', value: user.nftsOwned.length.toString(), icon: Gem, color: 'from-anime-purple to-anime-pink' },
    { label: 'Episodes Watched', value: '23', icon: Play, color: 'from-anime-pink to-anime-cyan' },
    { label: 'Rank', value: 'Otaku Elite', icon: Award, color: 'from-anime-yellow to-anime-green' }
  ];

  const recentNFTDrops = [
    {
      id: 1,
      name: 'Legendary Saiyan Power',
      anime: 'Dragon Ball Z',
      rarity: 'Legendary',
      price: '12.5 ALGO',
      image: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg'
    },
    {
      id: 2,
      name: 'Sharingan Awakening',
      anime: 'Naruto',
      rarity: 'Epic',
      price: '8.2 ALGO',
      image: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg'
    }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anime-purple"></div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8 animate-header">
        <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-anime-gradient mb-2">
          Welcome back, {user.username}! 🎌
        </h1>
        <p className="text-gray-400 text-lg">
          Ready to earn some exclusive anime NFTs? Let's dive into the OtakuVerse!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-content">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300 anime-card"
              onMouseEnter={(e) => animeUtils.pulse(e.currentTarget)}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:animate-pulse-glow`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-orbitron font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Watch Progress */}
      <div className="glass-card p-6 mb-8 border border-purple-500/30 animate-content">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-orbitron font-semibold text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-anime-yellow" />
            Next NFT Progress
          </h2>
          <span className="text-sm text-gray-400">12 min / 15 min to next NFT</span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
            <div 
              className="progress-bar h-3 rounded-full transition-all duration-500 animate-pulse-glow"
              style={{ width: '80%' }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">Just 3 more minutes of watching to mint your next NFT! 🔥</p>
        </div>
      </div>

      {/* Trending Anime */}
      <div className="mb-8 animate-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-orbitron font-bold text-white flex items-center">
            <Fire className="w-6 h-6 mr-2 text-anime-pink" />
            Trending Anime
          </h2>
          <Link 
            to="/watch/trending" 
            className="text-anime-purple hover:text-anime-pink transition-colors text-sm font-medium"
          >
            View All →
          </Link>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
          {trendingAnime.map((anime, index) => (
            <div
              key={anime.id}
              className="anime-card p-4 group cursor-pointer"
              onClick={() => window.location.href = `/watch/${anime.id}`}
              onMouseEnter={(e) => {
                animeUtils.scaleIn(e.currentTarget.querySelector('.anime-poster'), { scale: [1, 1.05] });
                animeUtils.glow(e.currentTarget);
              }}
            >
              <div className="relative mb-4">
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="anime-poster w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="w-12 h-12 text-white animate-pulse" />
                </div>
                <div className="absolute top-2 right-2 bg-anime-purple/80 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {anime.episodes?.sub || 'N/A'} Episodes
                </div>
              </div>
              
              <h3 className="text-white font-semibold mb-1 group-hover:text-anime-purple transition-colors line-clamp-2">
                {anime.title}
              </h3>
              <p className="text-gray-400 text-sm mb-2">{anime.type} • {anime.duration || 'N/A'}</p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {anime.rating || 'N/A'}
                </span>
                <span className="text-anime-purple font-medium bg-anime-purple/10 px-2 py-1 rounded-full">
                  🎁 Watch & Earn NFT
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Episodes */}
      {recentEpisodes.length > 0 && (
        <div className="mb-8 animate-content">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-orbitron font-bold text-white flex items-center">
              <Clock className="w-6 h-6 mr-2 text-anime-cyan" />
              Recent Episodes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recentEpisodes.map((episode, index) => (
              <div
                key={episode.id}
                className="glass-card p-4 hover:bg-purple-500/10 transition-all duration-300 cursor-pointer group border border-purple-500/20 anime-card"
                onClick={() => window.location.href = `/watch/${episode.id}`}
                onMouseEnter={(e) => animeUtils.slideInUp(e.currentTarget)}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={episode.poster}
                    alt={episode.title}
                    className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1 group-hover:text-anime-purple transition-colors">
                      {episode.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">Episode {episode.episodeNumber}</p>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-anime-cyan/20 text-anime-cyan">
                        New Episode
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent NFT Drops */}
      <div className="mb-8 animate-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-orbitron font-bold text-white flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-anime-green" />
            Trending NFT Drops
          </h2>
          <Link 
            to="/marketplace" 
            className="text-anime-purple hover:text-anime-pink transition-colors text-sm font-medium"
          >
            View Marketplace →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {recentNFTDrops.map((nft, index) => (
            <div
              key={nft.id}
              className="glass-card p-4 hover:bg-purple-500/10 transition-all duration-300 cursor-pointer group border border-purple-500/20 anime-card"
              onMouseEnter={(e) => animeUtils.bounce(e.currentTarget)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-16 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1 group-hover:text-anime-purple transition-colors">
                    {nft.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">{nft.anime}</p>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      nft.rarity === 'Legendary' 
                        ? 'bg-anime-yellow/20 text-anime-yellow' 
                        : 'bg-anime-purple/20 text-anime-purple'
                    }`}>
                      <Star className="w-3 h-3 inline mr-1" />
                      {nft.rarity}
                    </span>
                    <span className="text-anime-green font-semibold">{nft.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;