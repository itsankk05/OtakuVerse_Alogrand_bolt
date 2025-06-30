import { useState, useEffect, useCallback } from 'react';
import { AnimeData, NFTMetadata, BackendAnimeResponse, ApiResponse, FilterOptions, SortOptions, PaginationState } from '../types/anime';

interface UseAnimeDataReturn {
  // Data
  animeList: AnimeData[];
  nftList: NFTMetadata[];
  
  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  
  // Pagination
  pagination: PaginationState;
  
  // Filters and sorting
  filters: FilterOptions;
  sortOptions: SortOptions;
  
  // Actions
  fetchData: (page?: number) => Promise<void>;
  fetchAnimeById: (id: string) => Promise<AnimeData | null>;
  setFilters: (filters: Partial<FilterOptions>) => void;
  setSortOptions: (sort: SortOptions) => void;
  resetFilters: () => void;
  refetch: () => Promise<void>;
}

const API_ENDPOINT = 'https://372c-49-43-154-254.ngrok-free.app/all-anime';
const ITEMS_PER_PAGE = 12;

// Helper function to convert IPFS URLs to gateway URLs
const convertIpfsUrl = (ipfsUrl: string): string => {
  if (!ipfsUrl) return 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg';
  
  // If it's already a full HTTP URL, return as is
  if (ipfsUrl.startsWith('http://') || ipfsUrl.startsWith('https://')) {
    return ipfsUrl;
  }
  
  // If it starts with 'ipfs://', extract the hash and convert to gateway URL
  if (ipfsUrl.startsWith('ipfs://')) {
    const hash = ipfsUrl.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${hash}`;
  }
  
  // If it's just a hash (starts with 'Qm' or similar), convert to gateway URL
  if (ipfsUrl.match(/^Qm[a-zA-Z0-9]{44}$/) || ipfsUrl.match(/^ba[a-zA-Z0-9]+$/)) {
    return `https://ipfs.io/ipfs/${ipfsUrl}`;
  }
  
  // Fallback to default image if format is unrecognized
  console.warn('Unrecognized IPFS URL format:', ipfsUrl);
  return 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg';
};

// Helper function to process anime data
const processAnimeData = (animeData: any[]): AnimeData[] => {
  return animeData.map((item: any) => {
    return {
      id: item.id?.toString() || Math.random().toString(),
      title: item.title || 'Untitled Anime',
      description: item.description || 'No description available',
      episodes: item.episodes || 1,
      thumbnail: convertIpfsUrl(item.thumbnail) || 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
      status: item.status || 'published',
      nftCollection: item.nftCollection || [],
      creatorId: item.creator_id || 'unknown',
      createdAt: item.created_at || new Date().toISOString(),
      views: item.views || 0,
      likes: item.likes || 0,
      genres: item.genres || ['Action', 'Adventure'],
      // Add creator info if available
      creator: {
        id: item.creator_id || 'unknown',
        username: item.creator_username || 'Unknown Creator',
        walletAddress: item.creator_wallet || ''
      }
    };
  });
};

export const useAnimeData = (): UseAnimeDataReturn => {
  // State management
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [nftList, setNftList] = useState<NFTMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: ITEMS_PER_PAGE
  });
  
  // Filter and sort state
  const [filters, setFiltersState] = useState<FilterOptions>({
    genre: 'all',
    status: 'all',
    creator: 'all',
    rarity: 'all',
    year: 'all'
  });
  
  const [sortOptions, setSortOptionsState] = useState<SortOptions>({
    field: 'createdAt',
    direction: 'desc'
  });

  // Fetch data from backend
  const fetchData = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      console.log('🔄 Fetching anime data from backend...', { page, filters, sortOptions });

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        sortField: sortOptions.field,
        sortDirection: sortOptions.direction,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== 'all')
        )
      });

      // Use the query parameters in the fetch request
      const fetchUrl = `${API_ENDPOINT}?${queryParams}`;
      console.log('Fetching from URL:', fetchUrl);

      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          // Add ngrok-skip-browser-warning header to bypass ngrok browser warning
          'ngrok-skip-browser-warning': 'true'
        }
      });

      console.log('Raw response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        // Get response text to see what we're actually receiving
        const responseText = await response.text();
        console.log('Error response body:', responseText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}. Response: ${responseText.substring(0, 200)}...`);
      }

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.log('Non-JSON response received:', responseText.substring(0, 500));
        throw new Error(`Expected JSON response but received ${contentType || 'unknown content type'}. Response: ${responseText.substring(0, 200)}...`);
      }

      const result = await response.json();
      console.log('✅ Raw API response:', result);

      // Handle different response structures
      let animeData: any[] = [];
      
      // Check if result is an array (direct anime objects) or has a data property
      if (Array.isArray(result)) {
        animeData = result;
      } else if (result.success && Array.isArray(result.data)) {
        animeData = result.data;
      } else if (result.data && Array.isArray(result.data)) {
        animeData = result.data;
      } else {
        throw new Error('Invalid API response structure');
      }

      console.log('📊 Processing anime data:', animeData);

      // Process anime data
      const processedAnime = processAnimeData(animeData);

      // Extract all NFTs from anime collections and add anime title reference
      const allNFTs: NFTMetadata[] = [];
      animeData.forEach((animeItem: any) => {
        // Check if the anime has an nftCollection array
        if (animeItem.nftCollection && Array.isArray(animeItem.nftCollection)) {
          animeItem.nftCollection.forEach((nft: any) => {
            allNFTs.push({
              id: nft.id?.toString() || Math.random().toString(),
              name: nft.name || 'Unnamed NFT',
              description: nft.description || '',
              image: convertIpfsUrl(nft.image), // Convert IPFS URL to gateway URL
              anime: animeItem.title || 'Unknown Anime', // Reference to parent anime
              episode: nft.episode || 1,
              watchTime: nft.watchTime || 15,
              rarity: nft.rarity || 'Common',
              isListed: nft.isListed || false,
              price: nft.price,
              mintedAt: nft.mintedAt || new Date().toISOString(),
              tokenId: nft.tokenId,
              contractAddress: nft.contractAddress,
              owner: nft.owner,
              attributes: nft.attributes || [],
              // Add creator info
              creator: animeItem.creator_username || 'Unknown Creator'
            });
          });
        }
      });

      console.log('✅ Processed data:', { 
        animeCount: processedAnime.length, 
        nftCount: allNFTs.length,
        sampleNFT: allNFTs[0] // Log first NFT to verify image URL conversion
      });

      // Update state
      setAnimeList(processedAnime);
      setNftList(allNFTs);
      
      // Handle pagination - use provided values or calculate from data
      const totalItems = result.total || processedAnime.length;
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
      
      setPagination({
        currentPage: result.page || page,
        totalPages: totalPages,
        totalItems: totalItems,
        itemsPerPage: ITEMS_PER_PAGE
      });

    } catch (err) {
      console.error('❌ Failed to fetch anime data:', err);
      
      let errorMessage: string;
      
      if (err instanceof Error) {
        // Check for JSON parsing errors (HTML response instead of JSON)
        if (err.message.includes('Unexpected token') && err.message.includes('<!DOCTYPE')) {
          errorMessage = 'Backend server returned HTML instead of JSON. This usually means:\n' +
                       '1. The ngrok tunnel is not active or has expired\n' +
                       '2. The backend server is not running\n' +
                       '3. The API endpoint path is incorrect\n' +
                       'Please verify the backend server and ngrok tunnel are both running.';
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Unable to connect to the backend server. Please verify:\n' +
                       '1. Backend server is running\n' +
                       '2. Ngrok tunnel is active\n' +
                       '3. The ngrok URL is correct and accessible';
        } else if (err.message.includes('CORS')) {
          errorMessage = 'CORS error: The backend server needs to allow requests from this domain.';
        } else {
          errorMessage = err.message;
        }
      } else {
        errorMessage = 'Unknown error occurred while fetching anime data';
      }
      
      setError(errorMessage);
      setIsError(true);
      
      // Set empty data on error
      setAnimeList([]);
      setNftList([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: ITEMS_PER_PAGE
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortOptions]);

  // Fetch specific anime by ID
  const fetchAnimeById = useCallback(async (id: string): Promise<AnimeData | null> => {
    try {
      console.log('🔍 Fetching anime by ID:', id);

      // Try to fetch all anime without pagination to find the specific one
      const fetchUrl = `${API_ENDPOINT}?limit=1000&id=${id}`;
      console.log('Fetching anime by ID from URL:', fetchUrl);

      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.log('Error response body:', responseText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.log('Non-JSON response received:', responseText.substring(0, 500));
        throw new Error(`Expected JSON response but received ${contentType || 'unknown content type'}`);
      }

      const result = await response.json();
      console.log('✅ Raw API response for ID', id, ':', result);

      // Handle different response structures
      let animeData: any[] = [];
      
      if (Array.isArray(result)) {
        animeData = result;
      } else if (result.success && Array.isArray(result.data)) {
        animeData = result.data;
      } else if (result.data && Array.isArray(result.data)) {
        animeData = result.data;
      } else {
        throw new Error('Invalid API response structure');
      }

      // Find the specific anime by ID
      const foundAnime = animeData.find((anime: any) => anime.id?.toString() === id);
      
      if (!foundAnime) {
        console.log('❌ Anime not found with ID:', id);
        console.log('📋 Available anime IDs:', animeData.map(a => a.id));
        return null;
      }

      // Process the found anime
      const processedAnime = processAnimeData([foundAnime]);
      console.log('✅ Found and processed anime:', processedAnime[0].title);
      
      return processedAnime[0];

    } catch (err) {
      console.error('❌ Failed to fetch anime by ID:', err);
      return null;
    }
  }, []);

  // Filter management
  const setFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Sort management
  const setSortOptions = useCallback((newSort: SortOptions) => {
    setSortOptionsState(newSort);
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFiltersState({
      genre: 'all',
      status: 'all',
      creator: 'all',
      rarity: 'all',
      year: 'all'
    });
  }, []);

  // Refetch current data
  const refetch = useCallback(() => {
    return fetchData(pagination.currentPage);
  }, [fetchData, pagination.currentPage]);

  // Initial data fetch
  useEffect(() => {
    fetchData(1);
  }, [filters, sortOptions]);

  return {
    // Data
    animeList,
    nftList,
    
    // Loading states
    isLoading,
    isError,
    error,
    
    // Pagination
    pagination,
    
    // Filters and sorting
    filters,
    sortOptions,
    
    // Actions
    fetchData,
    fetchAnimeById,
    setFilters,
    setSortOptions,
    resetFilters,
    refetch
  };
};