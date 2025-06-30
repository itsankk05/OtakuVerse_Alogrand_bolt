import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-anime-purple/30 border-t-anime-purple rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 text-sm"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export const LoadingCard: React.FC = () => {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="w-full h-48 bg-gray-700/50 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-700/50 rounded-full w-16"></div>
          <div className="h-6 bg-gray-700/50 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  );
};

export const LoadingGrid: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
};