import { IPFSNFTMetadata } from '../data/nftCollections';

// NFT Minting Service for handling blockchain interactions
export interface MintNFTRequest {
  nftData: IPFSNFTMetadata;
  userWallet: string;
  animeId: string;
  episodeId: string;
  watchTime: number;
}

export interface MintNFTResponse {
  success: boolean;
  transactionId?: string;
  nftId?: string;
  error?: string;
  metadata?: {
    ipfs_cid: string;
    token_id: string;
    contract_address: string;
  };
}

// Interface for anime data from /all-anime API response
export interface AnimeAPIResponse {
  id: string;
  title: string;
  description: string;
  episodes: number;
  thumbnail: string;
  status: string;
  nftCollection?: NFTFromAPI[];
  creator_id: string;
  creator_username?: string;
  creator_wallet?: string;
  created_at: string;
  views?: number;
  likes?: number;
  genres?: string[];
}

// Interface for NFT data from API response
export interface NFTFromAPI {
  id: string;
  name: string;
  description?: string;
  image: string; // Could be IPFS URL or regular URL
  episode: number;
  watchTime: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  isListed: boolean;
  price?: number;
  mintedAt?: string;
  tokenId?: string;
  contractAddress?: string;
  owner?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  // Additional API-specific fields
  anime_id?: string;
  creator_id?: string;
  ipfs_cid?: string;
  metadata_url?: string;
}

// Enhanced mint request payload for /mint-nft endpoint
export interface EnhancedMintNFTPayload {
  // User and context information
  userWallet: string;
  animeId: string;
  episodeId: string;
  watchTime: number;
  
  // Complete NFT metadata mapped from API response
  nftMetadata: {
    // Core NFT properties
    id: string;
    name: string;
    description: string;
    image: string; // Converted to proper IPFS URL
    
    // Anime-specific properties
    anime: string;
    animeId: string;
    episode: number;
    watchTime: number;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    
    // Marketplace properties
    isListed: boolean;
    price?: number;
    
    // Metadata attributes
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
    
    // IPFS and blockchain properties
    ipfs_metadata?: {
      cid?: string;
      gateway_url: string;
      pinned: boolean;
      metadata_url?: string;
    };
    
    // Creator information
    creator: {
      id: string;
      username: string;
      walletAddress?: string;
    };
    
    // Timestamps
    mintedAt: string;
    mintedBy: string;
    
    // API source tracking
    sourceAnimeData?: {
      title: string;
      description: string;
      thumbnail: string;
      genres?: string[];
      views?: number;
      likes?: number;
    };
  };
  
  // Platform information
  platform: string;
  version: string;
  timestamp: string;
  
  // Additional context
  mintingContext: {
    triggerType: 'watch_completion' | 'manual_mint' | 'episode_finish';
    actualWatchTime: number;
    videoProgress: number;
    sessionId?: string;
  };
}

class NFTMintingService {
  private readonly MINT_ENDPOINT = 'https://otakuverse-alogrand.onrender.com/mint-nft';

  /**
   * Map NFT data from /all-anime API response to /mint-nft payload format
   */
  public mapAnimeAPIToMintPayload(
    animeData: AnimeAPIResponse,
    selectedNFT: NFTFromAPI,
    userWallet: string,
    episodeId: string,
    actualWatchTime: number,
    mintingContext: {
      triggerType: 'watch_completion' | 'manual_mint' | 'episode_finish';
      videoProgress: number;
      sessionId?: string;
    }
  ): EnhancedMintNFTPayload {
    console.log('🗺️ Mapping anime API data to mint payload...', {
      animeTitle: animeData.title,
      nftName: selectedNFT.name,
      userWallet,
      actualWatchTime
    });

    // Convert image URL to proper IPFS format if needed
    const processedImageUrl = this.processImageUrl(selectedNFT.image);
    
    // Extract or generate IPFS CID
    const ipfsCID = this.extractOrGenerateIPFSCID(selectedNFT);
    
    // Create enhanced attributes combining API data with watch data
    const enhancedAttributes = this.createEnhancedAttributes(
      selectedNFT,
      animeData,
      actualWatchTime,
      mintingContext
    );

    // Build the complete payload
    const payload: EnhancedMintNFTPayload = {
      // User and context information
      userWallet,
      animeId: animeData.id,
      episodeId,
      watchTime: actualWatchTime,
      
      // Complete NFT metadata
      nftMetadata: {
        // Core NFT properties from API
        id: selectedNFT.id || `${animeData.id}_episode_${selectedNFT.episode}_${Date.now()}`,
        name: selectedNFT.name || `${animeData.title} Episode ${selectedNFT.episode} NFT`,
        description: selectedNFT.description || this.generateNFTDescription(animeData, selectedNFT, actualWatchTime),
        image: processedImageUrl,
        
        // Anime-specific properties
        anime: animeData.title,
        animeId: animeData.id,
        episode: selectedNFT.episode,
        watchTime: selectedNFT.watchTime || actualWatchTime,
        rarity: selectedNFT.rarity || 'Common',
        
        // Marketplace properties
        isListed: selectedNFT.isListed || false,
        price: selectedNFT.price,
        
        // Enhanced attributes
        attributes: enhancedAttributes,
        
        // IPFS metadata
        ipfs_metadata: {
          cid: ipfsCID,
          gateway_url: processedImageUrl,
          pinned: true,
          metadata_url: selectedNFT.metadata_url
        },
        
        // Creator information from API
        creator: {
          id: animeData.creator_id,
          username: animeData.creator_username || 'Unknown Creator',
          walletAddress: animeData.creator_wallet
        },
        
        // Timestamps
        mintedAt: new Date().toISOString(),
        mintedBy: userWallet,
        
        // Source anime data for reference
        sourceAnimeData: {
          title: animeData.title,
          description: animeData.description,
          thumbnail: animeData.thumbnail,
          genres: animeData.genres,
          views: animeData.views,
          likes: animeData.likes
        }
      },
      
      // Platform information
      platform: 'OtakuVerse',
      version: '2.0',
      timestamp: new Date().toISOString(),
      
      // Minting context
      mintingContext: {
        triggerType: mintingContext.triggerType,
        actualWatchTime,
        videoProgress: mintingContext.videoProgress,
        sessionId: mintingContext.sessionId || `session_${Date.now()}`
      }
    };

    console.log('✅ Payload mapping completed:', {
      nftId: payload.nftMetadata.id,
      imageUrl: payload.nftMetadata.image,
      attributeCount: payload.nftMetadata.attributes.length,
      ipfsCID: payload.nftMetadata.ipfs_metadata?.cid
    });

    return payload;
  }

  /**
   * Create enhanced attributes combining API data with watch session data
   */
  private createEnhancedAttributes(
    nftData: NFTFromAPI,
    animeData: AnimeAPIResponse,
    actualWatchTime: number,
    mintingContext: any
  ): Array<{ trait_type: string; value: string | number }> {
    const baseAttributes = nftData.attributes || [];
    
    const enhancedAttributes = [
      ...baseAttributes,
      
      // Watch session attributes
      { trait_type: 'Actual Watch Time', value: `${Math.floor(actualWatchTime / 60)} Minutes` },
      { trait_type: 'Video Progress', value: `${Math.round(mintingContext.videoProgress)}%` },
      { trait_type: 'Mint Trigger', value: mintingContext.triggerType },
      
      // Episode and series attributes
      { trait_type: 'Episode Number', value: nftData.episode },
      { trait_type: 'Series Title', value: animeData.title },
      { trait_type: 'Total Episodes', value: animeData.episodes },
      
      // Rarity and collection attributes
      { trait_type: 'Rarity', value: nftData.rarity },
      { trait_type: 'Collection Type', value: 'Watch-to-Earn' },
      { trait_type: 'Platform', value: 'OtakuVerse' },
      
      // Creator attributes
      { trait_type: 'Creator', value: animeData.creator_username || 'Unknown' },
      { trait_type: 'Creator ID', value: animeData.creator_id },
      
      // Anime metadata attributes
      ...(animeData.genres ? animeData.genres.slice(0, 3).map(genre => ({
        trait_type: 'Genre',
        value: genre
      })) : []),
      
      // Engagement attributes
      ...(animeData.views ? [{ trait_type: 'Series Views', value: animeData.views }] : []),
      ...(animeData.likes ? [{ trait_type: 'Series Likes', value: animeData.likes }] : []),
      
      // Timestamp attributes
      { trait_type: 'Mint Date', value: new Date().toISOString().split('T')[0] },
      { trait_type: 'Mint Year', value: new Date().getFullYear() },
      { trait_type: 'Mint Month', value: new Date().toLocaleString('default', { month: 'long' }) }
    ];

    // Remove duplicates and limit to reasonable number
    const uniqueAttributes = enhancedAttributes.filter((attr, index, self) => 
      index === self.findIndex(a => a.trait_type === attr.trait_type)
    ).slice(0, 15); // Limit to 15 attributes

    return uniqueAttributes;
  }

  /**
   * Process image URL to ensure proper IPFS format
   */
  private processImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return 'https://ipfs.io/ipfs/QmRj2WryQAiNKEhsjP8tUqfBC4KhEJhrtKezKGcYm4J9uK'; // Default fallback
    }

    // If already a proper IPFS URL, return as is
    if (imageUrl.startsWith('https://ipfs.io/ipfs/')) {
      return imageUrl;
    }

    // If it's an IPFS hash, convert to gateway URL
    if (imageUrl.match(/^Qm[a-zA-Z0-9]{44}$/) || imageUrl.match(/^ba[a-zA-Z0-9]+$/)) {
      return `https://ipfs.io/ipfs/${imageUrl}`;
    }

    // If it's ipfs:// protocol, convert to gateway URL
    if (imageUrl.startsWith('ipfs://')) {
      const hash = imageUrl.replace('ipfs://', '');
      return `https://ipfs.io/ipfs/${hash}`;
    }

    // For other URLs (HTTP/HTTPS), return as is but log warning
    if (imageUrl.startsWith('http')) {
      console.warn('⚠️ Non-IPFS image URL detected:', imageUrl);
      return imageUrl;
    }

    // Fallback for unrecognized formats
    console.warn('⚠️ Unrecognized image URL format:', imageUrl);
    return 'https://ipfs.io/ipfs/QmRj2WryQAiNKEhsjP8tUqfBC4KhEJhrtKezKGcYm4J9uK';
  }

  /**
   * Extract IPFS CID from NFT data or generate one
   */
  private extractOrGenerateIPFSCID(nftData: NFTFromAPI): string {
    // Try to extract from existing IPFS CID field
    if (nftData.ipfs_cid) {
      return nftData.ipfs_cid;
    }

    // Try to extract from image URL
    const cidFromImage = this.extractCIDFromIPFSUrl(nftData.image);
    if (cidFromImage) {
      return cidFromImage;
    }

    // Try to extract from metadata URL
    if (nftData.metadata_url) {
      const cidFromMetadata = this.extractCIDFromIPFSUrl(nftData.metadata_url);
      if (cidFromMetadata) {
        return cidFromMetadata;
      }
    }

    // Generate a placeholder CID (this should be replaced with actual IPFS upload)
    return 'QmRj2WryQAiNKEhsjP8tUqfBC4KhEJhrtKezKGcYm4J9uK';
  }

  /**
   * Generate NFT description if not provided
   */
  private generateNFTDescription(
    animeData: AnimeAPIResponse,
    nftData: NFTFromAPI,
    actualWatchTime: number
  ): string {
    const watchMinutes = Math.floor(actualWatchTime / 60);
    
    return `Exclusive NFT earned by watching ${animeData.title} Episode ${nftData.episode} for ${watchMinutes} minutes. ` +
           `This ${nftData.rarity} collectible proves your dedication to the series and grants you special privileges in the OtakuVerse ecosystem. ` +
           `${animeData.description ? animeData.description.substring(0, 100) + '...' : ''}`;
  }

  /**
   * Mint an NFT using the enhanced payload structure
   */
  async mintNFTFromAnimeAPI(
    animeData: AnimeAPIResponse,
    selectedNFT: NFTFromAPI,
    userWallet: string,
    episodeId: string,
    actualWatchTime: number,
    mintingContext: {
      triggerType: 'watch_completion' | 'manual_mint' | 'episode_finish';
      videoProgress: number;
      sessionId?: string;
    }
  ): Promise<MintNFTResponse> {
    try {
      console.log('🎨 Starting NFT minting from anime API data...', {
        animeTitle: animeData.title,
        nftName: selectedNFT.name,
        userWallet,
        actualWatchTime
      });

      // Map API data to mint payload
      const mintPayload = this.mapAnimeAPIToMintPayload(
        animeData,
        selectedNFT,
        userWallet,
        episodeId,
        actualWatchTime,
        mintingContext
      );

      // Validate the payload
      const validation = this.validateEnhancedPayload(mintPayload);
      if (!validation.valid) {
        console.error('❌ Payload validation failed:', validation.errors);
        return {
          success: false,
          error: `Payload validation failed: ${validation.errors.join(', ')}`
        };
      }

      console.log('📤 Sending enhanced payload to minting endpoint...', {
        endpoint: this.MINT_ENDPOINT,
        nftId: mintPayload.nftMetadata.id,
        payloadSize: JSON.stringify(mintPayload).length
      });

      // Send to minting endpoint
      const response = await fetch(this.MINT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(mintPayload)
      });

      console.log('📡 Minting endpoint response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      // Check response format
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('❌ Non-JSON response from minting endpoint:', responseText.substring(0, 200));
        throw new Error('Invalid response format from minting service');
      }

      const result = await response.json();
      console.log('📋 Minting service result:', result);

      if (!response.ok) {
        console.error('❌ Minting endpoint error:', result);
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      if (!result.success) {
        console.error('❌ Minting service reported failure:', result.error);
        return {
          success: false,
          error: result.error || 'Minting service failed'
        };
      }

      console.log('✅ NFT minted successfully from API data!', {
        transactionId: result.transactionId,
        nftId: result.nftId
      });

      return {
        success: true,
        transactionId: result.transactionId,
        nftId: result.nftId,
        metadata: result.metadata
      };

    } catch (error) {
      console.error('💥 NFT minting from API data failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown minting error';
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Validate enhanced payload structure
   */
  private validateEnhancedPayload(payload: EnhancedMintNFTPayload): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate required top-level fields
    if (!payload.userWallet) errors.push('User wallet is required');
    if (!payload.animeId) errors.push('Anime ID is required');
    if (!payload.episodeId) errors.push('Episode ID is required');
    if (typeof payload.watchTime !== 'number') errors.push('Watch time must be a number');

    // Validate NFT metadata
    const nft = payload.nftMetadata;
    if (!nft) {
      errors.push('NFT metadata is required');
    } else {
      if (!nft.id) errors.push('NFT ID is required');
      if (!nft.name) errors.push('NFT name is required');
      if (!nft.description) errors.push('NFT description is required');
      if (!nft.image) errors.push('NFT image URL is required');
      if (!nft.anime) errors.push('Anime name is required');
      if (!nft.animeId) errors.push('Anime ID in metadata is required');
      
      // Validate rarity
      const validRarities = ['Common', 'Rare', 'Epic', 'Legendary'];
      if (!validRarities.includes(nft.rarity)) {
        errors.push('Invalid rarity level');
      }

      // Validate creator info
      if (!nft.creator || !nft.creator.id) {
        errors.push('Creator information is required');
      }

      // Validate attributes
      if (!nft.attributes || nft.attributes.length === 0) {
        errors.push('NFT must have at least one attribute');
      }
    }

    // Validate minting context
    if (!payload.mintingContext) {
      errors.push('Minting context is required');
    } else {
      const validTriggers = ['watch_completion', 'manual_mint', 'episode_finish'];
      if (!validTriggers.includes(payload.mintingContext.triggerType)) {
        errors.push('Invalid minting trigger type');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Legacy mint function for backward compatibility
   */
  async mintNFT(request: MintNFTRequest): Promise<MintNFTResponse> {
    try {
      console.log('🎨 Legacy NFT minting process...', {
        nftName: request.nftData.name,
        userWallet: request.userWallet,
        animeId: request.animeId
      });

      // Convert legacy request to new format
      const legacyPayload = {
        userWallet: request.userWallet,
        animeId: request.animeId,
        episodeId: request.episodeId,
        watchTime: request.watchTime,
        
        nftMetadata: {
          id: request.nftData.id,
          name: request.nftData.name,
          description: request.nftData.description,
          image: request.nftData.image,
          anime: request.nftData.anime,
          episode: request.nftData.episode,
          watchTime: request.nftData.watchTime,
          rarity: request.nftData.rarity,
          attributes: request.nftData.attributes,
          ipfs_metadata: request.nftData.ipfs_metadata,
          mintedAt: new Date().toISOString(),
          mintedBy: request.userWallet
        },
        
        platform: 'OtakuVerse',
        version: '1.0',
        timestamp: new Date().toISOString()
      };

      console.log('📤 Sending legacy payload to minting endpoint...');

      const response = await fetch(this.MINT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(legacyPayload)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('❌ Non-JSON response:', responseText.substring(0, 200));
        throw new Error('Invalid response format from minting service');
      }

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Minting service failed'
        };
      }

      return {
        success: true,
        transactionId: result.transactionId,
        nftId: result.nftId,
        metadata: result.metadata
      };

    } catch (error) {
      console.error('💥 Legacy NFT minting failed:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown minting error';
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Validate NFT data before minting (legacy)
   */
  validateNFTData(nftData: IPFSNFTMetadata): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!nftData.id) errors.push('NFT ID is required');
    if (!nftData.name) errors.push('NFT name is required');
    if (!nftData.description) errors.push('NFT description is required');
    if (!nftData.image) errors.push('NFT image URL is required');
    if (!nftData.anime) errors.push('Anime name is required');

    if (nftData.image && !this.isValidIPFSUrl(nftData.image)) {
      errors.push('Image URL must be in IPFS format: https://ipfs.io/ipfs/[CID]');
    }

    const validRarities = ['Common', 'Rare', 'Epic', 'Legendary'];
    if (!validRarities.includes(nftData.rarity)) {
      errors.push('Invalid rarity level');
    }

    if (!nftData.attributes || nftData.attributes.length === 0) {
      errors.push('NFT must have at least one attribute');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if URL is valid IPFS format
   */
  private isValidIPFSUrl(url: string): boolean {
    const ipfsPattern = /^https:\/\/ipfs\.io\/ipfs\/[a-zA-Z0-9]+$/;
    return ipfsPattern.test(url);
  }

  /**
   * Extract CID from IPFS URL
   */
  extractCIDFromIPFSUrl(url: string): string | null {
    const match = url.match(/https:\/\/ipfs\.io\/ipfs\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }
}

// Export singleton instance
export const nftMintingService = new NFTMintingService();
export default nftMintingService;