import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  Settings,
  Gift,
  Clock,
  Gem,
  Star,
  ArrowLeft,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { animeApi, AnimeInfo, Episode, StreamingData } from '../services/animeApi';
import { animeUtils } from '../utils/animations';

const Watch: React.FC = () => {
  const { id } = useParams();
  const { user, addWatchTime, mintNFT } = useUser();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [watchTimeProgress, setWatchTimeProgress] = useState(12);
  const [showNFTMinted, setShowNFTMinted] = useState(false);
  const [animeInfo, setAnimeInfo] = useState<AnimeInfo | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [streamingData, setStreamingData] = useState<StreamingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const nftNotificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAnimeData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [info, episodeList] = await Promise.all([
          animeApi.getAnimeInfo(id),
          animeApi.getAnimeEpisodes(id)
        ]);
        
        setAnimeInfo(info);
        setEpisodes(episodeList);
        
        if (episodeList.length > 0) {
          setCurrentEpisode(episodeList[0]);
          setCurrentEpisodeIndex(0);
          
          // Get streaming data for first episode
          const streaming = await animeApi.getStreamingData(episodeList[0].episodeId);
          setStreamingData(streaming);
        }
      } catch (error) {
        console.error('Error fetching anime data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentEpisode) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
        
        // Every 60 seconds (1 minute) of watch time
        if (currentTime % 60 === 0 && currentTime > 0) {
          addWatchTime(1);
          setWatchTimeProgress(prev => {
            const newProgress = prev + 1;
            
            // Mint NFT when reaching 15 minutes
            if (newProgress >= 15) {
              mintNFT({
                name: `${animeInfo?.title} Episode ${currentEpisode.number} Viewer`,
                image: animeInfo?.poster || 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
                anime: animeInfo?.title || 'Unknown Anime',
                episode: currentEpisode.number,
                watchTime: newProgress,
                rarity: 'Rare',
                isListed: false
              });
              setShowNFTMinted(true);
              
              // Animate NFT notification
              if (nftNotificationRef.current) {
                animeUtils.slideInRight(nftNotificationRef.current);
              }
              
              setTimeout(() => setShowNFTMinted(false), 5000);
              return 0; // Reset progress
            }
            
            return newProgress;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTime, addWatchTime, mintNFT, animeInfo, currentEpisode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEpisodeChange = async (episode: Episode, index: number) => {
    setCurrentEpisode(episode);
    setCurrentEpisodeIndex(index);
    setCurrentTime(0);
    setIsPlaying(false);
    
    try {
      const streaming = await animeApi.getStreamingData(episode.episodeId);
      setStreamingData(streaming);
    } catch (error) {
      console.error('Error loading episode:', error);
    }
  };

  const handlePreviousEpisode = () => {
    if (currentEpisodeIndex > 0) {
      const prevIndex = currentEpisodeIndex - 1;
      handleEpisodeChange(episodes[prevIndex], prevIndex);
    }
  };

  const handleNextEpisode = () => {
    if (currentEpisodeIndex < episodes.length - 1) {
      const nextIndex = currentEpisodeIndex + 1;
      handleEpisodeChange(episodes[nextIndex], nextIndex);
    }
  };

  const duration = 1440; // 24 minutes in seconds
  const progressPercentage = (currentTime / duration) * 100;
  const nftProgressPercentage = (watchTimeProgress / 15) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anime-purple mx-auto mb-4"></div>
          <p className="text-white">Loading anime...</p>
        </div>
      </div>
    );
  }

  if (!animeInfo || !currentEpisode) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Anime not found</p>
          <Link to="/dashboard" className="text-anime-purple hover:text-anime-pink">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* NFT Minted Notification */}
      {showNFTMinted && (
        <div
          ref={nftNotificationRef}
          className="fixed top-20 right-4 z-50 glass-card p-4 border border-green-400/30 bg-green-500/10"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-green-400 font-semibold">NFT Minted! 🎉</h3>
              <p className="text-white text-sm">{animeInfo.title} Episode {currentEpisode.number}</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Player */}
      <div className="relative aspect-video bg-gray-900">
        {streamingData && streamingData.sources.length > 0 ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={animeInfo.poster}
            controls
            crossOrigin="anonymous"
            onPlay={() => {
              setIsPlaying(true);
              if (videoRef.current) {
                animeUtils.fadeIn(videoRef.current);
              }
            }}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(e) => setCurrentTime(Math.floor(e.currentTarget.currentTime))}
          >
            {streamingData.sources.map((source, index) => (
              <source key={index} src={source.url} type={source.isM3U8 ? 'application/x-mpegURL' : 'video/mp4'} />
            ))}
            {streamingData.subtitles.map((sub, index) => (
              <track
                key={index}
                kind="subtitles"
                src={sub.url}
                srcLang={sub.lang.toLowerCase()}
                label={sub.lang}
              />
            ))}
            Your browser does not support the video tag.
          </video>
        ) : (
          <>
            <img
              src={animeInfo.poster}
              alt={animeInfo.title}
              className="w-full h-full object-cover"
            />
            
            {/* Video Overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                onMouseEnter={(e) => animeUtils.pulse(e.currentTarget)}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white ml-1" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>
            </div>

            {/* Custom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-1 mb-4">
                <div 
                  className="bg-gradient-to-r from-neon-purple to-neon-blue h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePreviousEpisode}
                    disabled={currentEpisodeIndex === 0}
                    className="text-white hover:text-neon-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onMouseEnter={(e) => !e.currentTarget.disabled && animeUtils.bounce(e.currentTarget)}
                  >
                    <SkipBack className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-neon-purple transition-colors"
                    onMouseEnter={(e) => animeUtils.pulse(e.currentTarget)}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={handleNextEpisode}
                    disabled={currentEpisodeIndex === episodes.length - 1}
                    className="text-white hover:text-neon-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onMouseEnter={(e) => !e.currentTarget.disabled && animeUtils.bounce(e.currentTarget)}
                  >
                    <SkipForward className="w-6 h-6" />
                  </button>
                  <Volume2 className="w-5 h-5 text-white" />
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <Settings className="w-5 h-5 text-white hover:text-neon-purple cursor-pointer transition-colors" />
                  <Maximize className="w-5 h-5 text-white hover:text-neon-purple cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Content Below Video */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link 
            to="/dashboard"
            className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
            onMouseEnter={(e) => animeUtils.slideInLeft(e.currentTarget)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Episode Info */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 mb-6 animate-content">
              <h1 className="text-2xl font-bold text-white mb-2">{animeInfo.title}</h1>
              <h2 className="text-lg text-neon-purple mb-4">
                Episode {currentEpisode.number}: {currentEpisode.title}
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">{animeInfo.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {animeInfo.genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-anime-purple/20 text-anime-purple rounded-full text-sm"
                    onMouseEnter={(e) => animeUtils.glow(e.currentTarget)}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Watch Stats */}
            <div className="glass-card p-6 animate-content">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                Watch Statistics
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Episode Progress</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-white text-sm">{Math.round(progressPercentage)}% Complete</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Watch Time Today</p>
                  <p className="text-white text-xl font-semibold">{user.totalWatchTime + Math.floor(currentTime / 60)} min</p>
                </div>
              </div>
            </div>
          </div>

          {/* Episodes List */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 max-h-96 overflow-y-auto animate-sidebar">
              <h3 className="text-lg font-semibold text-white mb-4">Episodes</h3>
              <div className="space-y-2">
                {episodes.map((episode, index) => (
                  <button
                    key={episode.episodeId}
                    onClick={() => handleEpisodeChange(episode, index)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      currentEpisode.episodeId === episode.episodeId
                        ? 'bg-anime-purple/20 border border-anime-purple/30 text-anime-purple'
                        : 'bg-black/30 hover:bg-purple-500/10 text-gray-300 hover:text-white'
                    }`}
                    onMouseEnter={(e) => animeUtils.slideInLeft(e.currentTarget)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Episode {episode.number}</span>
                      {episode.isFiller && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                          Filler
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-75 mt-1">{episode.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* NFT Progress Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24 animate-sidebar">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Gem className="w-5 h-5 mr-2 text-purple-400" />
                NFT Progress
              </h3>

              {/* NFT Reward Preview */}
              <div className="mb-6">
                <div className="relative">
                  <img
                    src={animeInfo.poster}
                    alt="NFT Preview"
                    className="w-full h-32 object-cover rounded-lg opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg flex items-end p-3">
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {animeInfo.title} Episode {currentEpisode.number}
                      </p>
                      <div className="flex items-center mt-1">
                        <Star className="w-3 h-3 text-yellow-400 mr-1" />
                        <span className="text-yellow-400 text-xs">Rare</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Watch Progress</span>
                  <span className="text-white text-sm font-medium">{watchTimeProgress}/15 min</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="progress-bar h-3 rounded-full transition-all duration-500"
                    style={{ width: `${nftProgressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">
                  {15 - watchTimeProgress} minutes left to mint your NFT!
                </p>
                <div className="flex items-center justify-center text-neon-purple">
                  <Gift className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Keep watching to earn!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;