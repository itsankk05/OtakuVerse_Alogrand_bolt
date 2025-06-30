import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Gem, 
  Wallet, 
  Star, 
  Zap, 
  Shield, 
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Sparkles,
  Upload,
  Eye,
  Video,
  User
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { animeUtils, animationSequences } from '../utils/animations';

const Landing: React.FC = () => {
  const { user, setUserType } = useUser();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const heroSlides = [
    {
      title: "Watch Anime, Earn NFTs",
      subtitle: "Turn your passion into digital collectibles",
      image: "https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg"
    },
    {
      title: "Create & Share Content",
      subtitle: "Upload your anime content and build your community",
      image: "https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg"
    },
    {
      title: "Trade & Collect",
      subtitle: "Build your ultimate anime NFT collection",
      image: "https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg"
    }
  ];

  const features = [
    {
      icon: Play,
      title: "Watch-to-Earn",
      description: "Earn unique NFTs by watching your favorite anime episodes",
      color: "from-anime-purple to-anime-pink"
    },
    {
      icon: Upload,
      title: "Creator Tools",
      description: "Upload and monetize your anime content with NFT rewards",
      color: "from-anime-pink to-anime-cyan"
    },
    {
      icon: Gem,
      title: "Rare Collectibles",
      description: "Collect limited edition NFTs with different rarity levels",
      color: "from-anime-cyan to-anime-purple"
    },
    {
      icon: Shield,
      title: "Algorand Powered",
      description: "Fast, secure, and eco-friendly blockchain technology",
      color: "from-anime-yellow to-anime-green"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "NFTs Minted", value: "1M+", icon: Gem },
    { label: "Episodes Watched", value: "10M+", icon: Play },
    { label: "Total Volume", value: "500K ALGO", icon: TrendingUp }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Animate hero section on mount
  useEffect(() => {
    if (heroRef.current) {
      animeUtils.fadeIn(heroRef.current);
      animeUtils.float('.floating-logo');
    }
  }, []);

  // Animate features when they come into view
  useEffect(() => {
    if (featuresRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animeUtils.staggerIn('.feature-card');
          }
        });
      });
      observer.observe(featuresRef.current);
      return () => observer.disconnect();
    }
  }, []);

  // Check if user has already selected a type
  useEffect(() => {
    if (user.userType) {
      navigate('/dashboard');
    }
  }, [user.userType, navigate]);

  const handleGetStarted = () => {
    setShowUserTypeSelection(true);
    // Animate modal entrance
    setTimeout(() => {
      animeUtils.scaleIn('.user-type-modal');
    }, 100);
  };

  const handleUserTypeSelection = async (type: 'creator' | 'user') => {
    setUserType(type);
    navigate('/dashboard');
  };

  // Particle component
  const Particles = () => (
    <div className="particles">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${6 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Particles />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="floating-logo w-8 h-8 anime-gradient rounded-lg flex items-center justify-center animate-pulse-glow">
                <Play className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-orbitron font-bold text-anime-gradient">
                OtakuVerse
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={handleGetStarted}
                className="px-6 py-2 anime-gradient rounded-lg text-white font-semibold hover:opacity-90 transition-all duration-300 animate-pulse-glow"
                onMouseEnter={(e) => animeUtils.pulse(e.currentTarget)}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* User Type Selection Modal */}
      {showUserTypeSelection && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="user-type-modal glass-card p-8 max-w-2xl w-full border-2 border-purple-500/30">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-orbitron font-bold text-anime-gradient mb-4">
                Choose Your Path
              </h2>
              <p className="text-gray-300 text-lg">
                Are you here to create content or enjoy anime?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Creator Option */}
              <button
                onClick={() => handleUserTypeSelection('creator')}
                className="group p-8 glass-card border-2 border-purple-500/30 hover:border-anime-purple/60 transition-all duration-300 text-center"
                onMouseEnter={(e) => {
                  animeUtils.scaleIn(e.currentTarget, { scale: [1, 1.02] });
                  animeUtils.glow(e.currentTarget);
                }}
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-anime-purple to-anime-pink rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white mb-2 group-hover:text-anime-purple transition-colors">
                  Creator
                </h3>
                <p className="text-gray-400 mb-4">
                  Upload anime content, create NFT collections, and build your community
                </p>
                <div className="flex items-center justify-center space-x-2 text-anime-purple">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Upload & Monetize</span>
                </div>
              </button>

              {/* User Option */}
              <button
                onClick={() => handleUserTypeSelection('user')}
                className="group p-8 glass-card border-2 border-purple-500/30 hover:border-anime-cyan/60 transition-all duration-300 text-center"
                onMouseEnter={(e) => {
                  animeUtils.scaleIn(e.currentTarget, { scale: [1, 1.02] });
                  animeUtils.glow(e.currentTarget);
                }}
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-anime-cyan to-anime-purple rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white mb-2 group-hover:text-anime-cyan transition-colors">
                  User
                </h3>
                <p className="text-gray-400 mb-4">
                  Watch anime, earn NFTs, and trade collectibles in the marketplace
                </p>
                <div className="flex items-center justify-center space-x-2 text-anime-cyan">
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">Watch & Earn</span>
                </div>
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setShowUserTypeSelection(false)}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient"></div>
        
        {/* Background Slideshow */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentSlide === index ? 'opacity-30' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <div key={currentSlide}>
            <h1 className="text-6xl md:text-8xl font-orbitron font-black mb-6 text-anime-gradient animate-pulse-glow">
              {heroSlides[currentSlide].title}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">
              {heroSlides[currentSlide].subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleGetStarted}
              className="group px-8 py-4 anime-gradient rounded-xl text-white font-bold text-lg hover:scale-105 transition-all duration-300 animate-pulse-glow flex items-center space-x-2"
              onMouseEnter={(e) => animeUtils.bounce(e.currentTarget)}
            >
              <Sparkles className="w-5 h-5" />
              <span>Join OtakuVerse</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              className="px-8 py-4 glass-card border-2 border-purple-500/50 rounded-xl text-white font-bold text-lg hover:bg-purple-500/20 transition-all duration-300 flex items-center space-x-2"
              onMouseEnter={(e) => animeUtils.glow(e.currentTarget)}
            >
              <Wallet className="w-5 h-5" />
              <span>Learn More</span>
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mt-12">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'anime-gradient animate-pulse-glow' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                onMouseEnter={(e) => animeUtils.pulse(e.currentTarget)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="text-center glass-card p-6 hover:scale-105 transition-all duration-300 stat-card"
                  onMouseEnter={(e) => animeUtils.pulse(e.currentTarget)}
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-anime-purple" />
                  <div className="text-3xl font-orbitron font-bold text-anime-gradient mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-anime-gradient mb-4">
              Epic Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the future of anime entertainment with blockchain-powered rewards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="feature-card glass-card p-6 hover:scale-105 transition-all duration-300 group"
                  onMouseEnter={(e) => {
                    animeUtils.glow(e.currentTarget);
                    animeUtils.float(e.currentTarget.querySelector('.feature-icon'));
                  }}
                >
                  <div className={`feature-icon w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:animate-pulse-glow`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-orbitron font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="glass-card p-12 border-2 border-purple-500/30 cta-section">
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-anime-gradient mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of anime fans earning NFTs while watching their favorite shows
            </p>
            <button 
              onClick={handleGetStarted}
              className="inline-flex items-center space-x-3 px-10 py-4 anime-gradient rounded-xl text-white font-bold text-xl hover:scale-105 transition-all duration-300 animate-pulse-glow"
              onMouseEnter={(e) => animeUtils.bounce(e.currentTarget)}
            >
              <Sparkles className="w-6 h-6" />
              <span>Enter OtakuVerse</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 anime-gradient rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-orbitron font-bold text-anime-gradient">
              OtakuVerse
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-2">
            Built with ❤️ by{' '}
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-anime-purple hover:text-anime-pink transition-colors"
            >
              Bolt.new
            </a>
          </p>
          <p className="text-gray-500 text-xs">
            Powered by Algorand Blockchain
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;