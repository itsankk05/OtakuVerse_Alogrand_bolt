import React from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Eye, 
  Upload, 
  Play, 
  Crown, 
  Users,
  Gem,
  TrendingUp
} from 'lucide-react';
import { useUser } from '../context/UserContext';

interface RoleSelectionProps {
  onRoleSelected: () => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelected }) => {
  const { setUserType } = useUser();

  const handleRoleSelection = (type: 'creator' | 'user') => {
    setUserType(type);
    onRoleSelected();
  };

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
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Particles />
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-orbitron font-bold text-anime-gradient mb-4"
            >
              Choose Your Path
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Are you here to create amazing anime content or enjoy the ultimate viewing experience?
            </motion.p>
          </div>

          {/* Role Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Creator Option */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="group"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelection('creator')}
                className="w-full p-8 glass-card border-2 border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 text-center relative overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                    <Video className="w-12 h-12 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-orbitron font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    <Crown className="w-6 h-6 inline mr-2 text-purple-400" />
                    Creator
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Upload anime content, create NFT collections, and build your community. 
                    Monetize your creativity and connect with fans worldwide.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-center space-x-3">
                      <Upload className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300 text-sm">Upload & manage content</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Gem className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300 text-sm">Create custom NFT collections</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300 text-sm">Monetize your audience</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300 text-sm">Build your community</span>
                    </div>
                  </div>
                  
                  {/* CTA */}
                  <div className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                    Start Creating
                  </div>
                </div>
              </motion.button>
            </motion.div>

            {/* User Option */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="group"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelection('user')}
                className="w-full p-8 glass-card border-2 border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 text-center relative overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                    <Eye className="w-12 h-12 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-orbitron font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    <Play className="w-6 h-6 inline mr-2 text-cyan-400" />
                    User
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Watch anime, earn exclusive NFTs, and trade collectibles. 
                    Experience the future of anime entertainment with blockchain rewards.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-center space-x-3">
                      <Play className="w-5 h-5 text-cyan-400" />
                      <span className="text-gray-300 text-sm">Watch premium anime content</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Gem className="w-5 h-5 text-cyan-400" />
                      <span className="text-gray-300 text-sm">Earn NFTs while watching</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      <span className="text-gray-300 text-sm">Trade in the marketplace</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-cyan-400" />
                      <span className="text-gray-300 text-sm">Join the community</span>
                    </div>
                  </div>
                  
                  {/* CTA */}
                  <div className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-white font-semibold group-hover:from-cyan-500 group-hover:to-blue-500 transition-all duration-300">
                    Start Watching
                  </div>
                </div>
              </motion.button>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-12"
          >
            <div className="glass-card p-6 max-w-2xl mx-auto border border-purple-500/20">
              <h4 className="text-white font-semibold mb-3">✨ You can switch roles anytime!</h4>
              <p className="text-gray-400 text-sm">
                Your choice isn't permanent. You can always change your role later from the navigation menu 
                to explore different features of OtakuVerse.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;