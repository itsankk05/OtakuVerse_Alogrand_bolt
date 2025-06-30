// TypeScript interfaces for anime and NFT data structures
export interface Creator {
  id: string;
  username: string;
  walletAddress: string;
}

export interface NFTMetadata {
  id: string;
  name: string;
  description?: string;
  image: string;
  anime: string;
  episode: number;
  watchTime: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  isListed: boolean;
  price?: number;
  mintedAt: string;
  tokenId?: string;
  contractAddress?: string;
  owner?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface AnimeData {
  id: string;
  title: string;
  description: string;
  episodes: number;
  thumbnail: string;
  status: 'draft' | 'published' | 'pending';
  nftCollection?: NFTMetadata[];
  creatorId: string;
  createdAt: string;
  views?: number;
  likes?: number;
  genres?: string[];
  duration?: string;
  rating?: number;
  year?: number;
  studios?: string[];
  type?: string;
  season?: string;
  creator?: Creator;
}

export interface BackendAnimeResponse {
  anime: AnimeData;
  creator: Creator;
  ipfs_cid?: string;
  timestamp: string;
}

export interface ApiResponse {
  success: boolean;
  data: BackendAnimeResponse[];
  total: number;
  page: number;
  limit: number;
  error?: string;
}

export interface FilterOptions {
  genre: string;
  status: string;
  creator: string;
  rarity: string;
  year: string;
}

export interface SortOptions {
  field: 'title' | 'createdAt' | 'views' | 'likes' | 'rating' | 'episodes';
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}