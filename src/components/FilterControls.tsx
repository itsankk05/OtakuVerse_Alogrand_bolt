import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  X,
  Grid,
  List
} from 'lucide-react';
import { FilterOptions, SortOptions } from '../types/anime';

interface FilterControlsProps {
  filters: FilterOptions;
  sortOptions: SortOptions;
  onFiltersChange: (filters: Partial<FilterOptions>) => void;
  onSortChange: (sort: SortOptions) => void;
  onResetFilters: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalItems: number;
  isLoading?: boolean;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  sortOptions,
  onFiltersChange,
  onSortChange,
  onResetFilters,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalItems,
  isLoading = false
}) => {
  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
    'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life',
    'Sports', 'Supernatural', 'Thriller'
  ];

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

  const rarities = ['Common', 'Rare', 'Epic', 'Legendary'];

  const sortFields = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'views', label: 'Views' },
    { value: 'likes', label: 'Likes' },
    { value: 'rating', label: 'Rating' },
    { value: 'episodes', label: 'Episodes' }
  ];

  const hasActiveFilters = Object.values(filters).some(value => value !== 'all') || searchQuery.trim() !== '';

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card p-6 mb-6 border border-purple-500/20"
    >
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search anime titles, creators, or descriptions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-black/30 border border-purple-500/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-anime-purple/50 transition-colors"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        {/* Genre Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
          <select
            value={filters.genre}
            onChange={(e) => onFiltersChange({ genre: e.target.value })}
            className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-anime-purple/50"
            disabled={isLoading}
          >
            <option value="all">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre.toLowerCase()}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ status: e.target.value })}
            className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-anime-purple/50"
            disabled={isLoading}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
          <select
            value={filters.year}
            onChange={(e) => onFiltersChange({ year: e.target.value })}
            className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-anime-purple/50"
            disabled={isLoading}
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Rarity Filter (for NFTs) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">NFT Rarity</label>
          <select
            value={filters.rarity}
            onChange={(e) => onFiltersChange({ rarity: e.target.value })}
            className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-anime-purple/50"
            disabled={isLoading}
          >
            <option value="all">All Rarities</option>
            {rarities.map(rarity => (
              <option key={rarity} value={rarity.toLowerCase()}>{rarity}</option>
            ))}
          </select>
        </div>

        {/* Sort Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
          <select
            value={sortOptions.field}
            onChange={(e) => onSortChange({ ...sortOptions, field: e.target.value as any })}
            className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-anime-purple/50"
            disabled={isLoading}
          >
            {sortFields.map(field => (
              <option key={field.value} value={field.value}>{field.label}</option>
            ))}
          </select>
        </div>

        {/* Sort Direction & View Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Options</label>
          <div className="flex space-x-2">
            {/* Sort Direction */}
            <button
              onClick={() => onSortChange({ 
                ...sortOptions, 
                direction: sortOptions.direction === 'asc' ? 'desc' : 'asc' 
              })}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg border transition-colors ${
                sortOptions.direction === 'asc'
                  ? 'bg-anime-purple/20 border-anime-purple/30 text-anime-purple'
                  : 'bg-black/30 border-purple-500/20 text-gray-400 hover:text-white'
              }`}
              disabled={isLoading}
              title={`Sort ${sortOptions.direction === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {sortOptions.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>

            {/* View Mode Toggle */}
            <div className="flex bg-black/30 rounded-lg border border-purple-500/20 overflow-hidden">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`px-3 py-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-anime-purple/20 text-anime-purple'
                    : 'text-gray-400 hover:text-white'
                }`}
                disabled={isLoading}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-anime-purple/20 text-anime-purple'
                    : 'text-gray-400 hover:text-white'
                }`}
                disabled={isLoading}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary & Reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-gray-400 text-sm">
            {isLoading ? 'Loading...' : `${totalItems} results found`}
          </span>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center space-x-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors text-sm"
              disabled={isLoading}
            >
              <X className="w-3 h-3" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </div>
      </div>
    </motion.div>
  );
};