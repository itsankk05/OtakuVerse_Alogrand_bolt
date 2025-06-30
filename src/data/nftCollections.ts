// IPFS-based NFT collections for anime series
export interface IPFSNFTMetadata {
  id: string;
  name: string;
  description: string;
  image: string; // IPFS URL format: https://ipfs.io/ipfs/[CID]
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
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  ipfs_metadata?: {
    cid: string;
    gateway_url: string;
    pinned: boolean;
  };
}

// Demon Slayer NFT Collection with IPFS URLs
export const demonSlayerNFTCollection: IPFSNFTMetadata[] = [
  {
    id: 'ds_nft_001',
    name: 'Tanjiro\'s Determination',
    description: 'Exclusive NFT showcasing Tanjiro\'s unwavering determination in his quest to save his sister Nezuko. This rare collectible captures the essence of his resolve.',
    image: 'https://ipfs.io/ipfs/QmRj2WryQAiNKEhsjP8tUqfBC4KhEJhrtKezKGcYm4J9uK',
    anime: 'Demon Slayer: Kimetsu no Yaiba',
    episode: 1,
    watchTime: 24,
    rarity: 'Rare',
    isListed: true,
    price: 5.5,
    mintedAt: new Date().toISOString(),
    attributes: [
      { trait_type: 'Character', value: 'Tanjiro Kamado' },
      { trait_type: 'Episode', value: 1 },
      { trait_type: 'Emotion', value: 'Determination' },
      { trait_type: 'Series', value: 'Demon Slayer' },
      { trait_type: 'Season', value: 1 }
    ],
    ipfs_metadata: {
      cid: 'QmRj2WryQAiNKEhsjP8tUqfBC4KhEJhrtKezKGcYm4J9uK',
      gateway_url: 'https://ipfs.io/ipfs/QmRj2WryQAiNKEhsjP8tUqfBC4KhEJhrtKezKGcYm4J9uK',
      pinned: true
    }
  },
  {
    id: 'ds_nft_002',
    name: 'Nezuko\'s Protective Stance',
    description: 'Epic NFT featuring Nezuko in her protective demon form, showcasing her unique ability to retain her humanity while protecting those she loves.',
    image: 'https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    anime: 'Demon Slayer: Kimetsu no Yaiba',
    episode: 3,
    watchTime: 24,
    rarity: 'Epic',
    isListed: false,
    mintedAt: new Date().toISOString(),
    attributes: [
      { trait_type: 'Character', value: 'Nezuko Kamado' },
      { trait_type: 'Episode', value: 3 },
      { trait_type: 'Form', value: 'Demon Form' },
      { trait_type: 'Power', value: 'Demon Blood Art' },
      { trait_type: 'Emotion', value: 'Protection' }
    ],
    ipfs_metadata: {
      cid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
      gateway_url: 'https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
      pinned: true
    }
  },
  {
    id: 'ds_nft_003',
    name: 'Water Breathing First Form',
    description: 'Legendary NFT showcasing Tanjiro\'s mastery of Water Breathing First Form: Water Surface Slash. A testament to his training and dedication.',
    image: 'https://ipfs.io/ipfs/QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51',
    anime: 'Demon Slayer: Kimetsu no Yaiba',
    episode: 5,
    watchTime: 24,
    rarity: 'Legendary',
    isListed: true,
    price: 12.0,
    mintedAt: new Date().toISOString(),
    attributes: [
      { trait_type: 'Technique', value: 'Water Breathing' },
      { trait_type: 'Form', value: 'First Form' },
      { trait_type: 'Episode', value: 5 },
      { trait_type: 'Element', value: 'Water' },
      { trait_type: 'Rarity', value: 'Legendary' }
    ],
    ipfs_metadata: {
      cid: 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51',
      gateway_url: 'https://ipfs.io/ipfs/QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51',
      pinned: true
    }
  },
  {
    id: 'ds_nft_004',
    name: 'Zenitsu\'s Thunder Breathing',
    description: 'Rare NFT capturing Zenitsu\'s incredible Thunder Breathing technique in action, demonstrating his hidden strength and speed.',
    image: 'https://ipfs.io/ipfs/QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB',
    anime: 'Demon Slayer: Kimetsu no Yaiba',
    episode: 7,
    watchTime: 24,
    rarity: 'Rare',
    isListed: true,
    price: 7.8,
    mintedAt: new Date().toISOString(),
    attributes: [
      { trait_type: 'Character', value: 'Zenitsu Agatsuma' },
      { trait_type: 'Technique', value: 'Thunder Breathing' },
      { trait_type: 'Episode', value: 7 },
      { trait_type: 'Element', value: 'Thunder' },
      { trait_type: 'Speed', value: 'Lightning Fast' }
    ],
    ipfs_metadata: {
      cid: 'QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB',
      gateway_url: 'https://ipfs.io/ipfs/QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB',
      pinned: true
    }
  },
  {
    id: 'ds_nft_005',
    name: 'Inosuke\'s Beast Breathing',
    description: 'Epic NFT showcasing Inosuke\'s wild and unpredictable Beast Breathing style, reflecting his feral nature and combat prowess.',
    image: 'https://ipfs.io/ipfs/QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4',
    anime: 'Demon Slayer: Kimetsu no Yaiba',
    episode: 9,
    watchTime: 24,
    rarity: 'Epic',
    isListed: false,
    mintedAt: new Date().toISOString(),
    attributes: [
      { trait_type: 'Character', value: 'Inosuke Hashibira' },
      { trait_type: 'Technique', value: 'Beast Breathing' },
      { trait_type: 'Episode', value: 9 },
      { trait_type: 'Style', value: 'Wild' },
      { trait_type: 'Weapons', value: 'Dual Swords' }
    ],
    ipfs_metadata: {
      cid: 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4',
      gateway_url: 'https://ipfs.io/ipfs/QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4',
      pinned: true
    }
  },
  {
    id: 'ds_nft_006',
    name: 'Giyu\'s Water Breathing Mastery',
    description: 'Legendary NFT featuring Giyu Tomioka\'s perfect execution of Water Breathing techniques, representing the pinnacle of swordsmanship.',
    image: 'https://ipfs.io/ipfs/QmYHGxzyjkXZfTuQcVoXs2FHoQp9QzAWxVDjBK8nGEyKaL',
    anime: 'Demon Slayer: Kimetsu no Yaiba',
    episode: 11,
    watchTime: 24,
    rarity: 'Legendary',
    isListed: true,
    price: 15.0,
    mintedAt: new Date().toISOString(),
    attributes: [
      { trait_type: 'Character', value: 'Giyu Tomioka' },
      { trait_type: 'Rank', value: 'Hashira' },
      { trait_type: 'Technique', value: 'Water Breathing' },
      { trait_type: 'Episode', value: 11 },
      { trait_type: 'Mastery', value: 'Perfect' }
    ],
    ipfs_metadata: {
      cid: 'QmYHGxzyjkXZfTuQcVoXs2FHoQp9QzAWxVDjBK8nGEyKaL',
      gateway_url: 'https://ipfs.io/ipfs/QmYHGxzyjkXZfTuQcVoXs2FHoQp9QzAWxVDjBK8nGEyKaL',
      pinned: true
    }
  }
];

// Attack on Titan NFT Collection with IPFS URLs
export const attackOnTitanNFTCollection: IPFSNFTMetadata[] = [
  {
    id: 'aot_nft_001',
    name: 'Eren\'s Titan Transformation',
    description: 'Epic NFT capturing Eren\'s first titan transformation, a pivotal moment that changed the course of humanity\'s fight for survival.',
    image: 'https://ipfs.io/ipfs/QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn',
    anime: 'Attack on Titan',
    episode: 8,
    watchTime: 24,
    rarity: 'Epic',
    isListed: true,
    price: 9.5,
    mintedAt: new Date().toISOString(),
    attributes: [
      { trait_type: 'Character', value: 'Eren Yeager' },
      { trait_type: 'Form', value: 'Attack Titan' },
      { trait_type: 'Episode', value: 8 },
      { trait_type: 'Moment', value: 'First Transformation' },
      { trait_type: 'Impact', value: 'World Changing' }
    ],
    ipfs_metadata: {
      cid: 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn',
      gateway_url: 'https://ipfs.io/ipfs/QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn',
      pinned: true
    }
  },
  {
    id: 'aot_nft_002',
    name: 'Levi\'s Spinning Attack',
    description: 'Legendary NFT showcasing Captain Levi\'s incredible spinning attack technique, demonstrating why he\'s humanity\'s strongest soldier.',
    image: 'https://ipfs.io/ipfs/QmVU9iLvRRHWsgy6T2oHWDU3rLD4DkpQqb3viAEzSiNtSX',
    anime: 'Attack on Titan',
    episode: 22,
    watchTime: 24,
    rarity: 'Legendary',
    isListed: true,
    price: 18.0,
    mintedAt: new Date().toISOString(),
    attributes: [
      { trait_type: 'Character', value: 'Levi Ackerman' },
      { trait_type: 'Technique', value: 'Spinning Attack' },
      { trait_type: 'Episode', value: 22 },
      { trait_type: 'Title', value: 'Humanity\'s Strongest' },
      { trait_type: 'Skill Level', value: 'Legendary' }
    ],
    ipfs_metadata: {
      cid: 'QmVU9iLvRRHWsgy6T2oHWDU3rLD4DkpQqb3viAEzSiNtSX',
      gateway_url: 'https://ipfs.io/ipfs/QmVU9iLvRRHWsgy6T2oHWDU3rLD4DkpQqb3viAEzSiNtSX',
      pinned: true
    }
  }
];

// Naruto NFT Collection with IPFS URLs
export const narutoNFTCollection: IPFSNFTMetadata[] = [
  {
    id: 'naruto_nft_001',
    name: 'Nine-Tails Chakra Mode',
    description: 'Legendary NFT featuring Naruto in his Nine-Tails Chakra Mode, representing the pinnacle of his power and his bond with Kurama.',
    image: 'https://ipfs.io/ipfs/QmSrCRJQm4o2fXQg7vFMVt9t3VcSjjLp47z13PYrAiB2Vz',
    anime: 'Naruto',
    episode: 329,
    watchTime: 24,
    rarity: 'Legendary',
    isListed: true,
    price: 25.0,
    mintedAt: new Date().toISOString(),
    attributes: [
      { trait_type: 'Character', value: 'Naruto Uzumaki' },
      { trait_type: 'Mode', value: 'Nine-Tails Chakra Mode' },
      { trait_type: 'Episode', value: 329 },
      { trait_type: 'Power Level', value: 'Maximum' },
      { trait_type: 'Bond', value: 'Kurama Partnership' }
    ],
    ipfs_metadata: {
      cid: 'QmSrCRJQm4o2fXQg7vFMVt9t3VcSjjLp47z13PYrAiB2Vz',
      gateway_url: 'https://ipfs.io/ipfs/QmSrCRJQm4o2fXQg7vFMVt9t3VcSjjLp47z13PYrAiB2Vz',
      pinned: true
    }
  }
];

// Collection mapping by anime ID
export const nftCollectionsByAnime: Record<string, IPFSNFTMetadata[]> = {
  'demon-slayer-1': demonSlayerNFTCollection,
  'attack-on-titan-1': attackOnTitanNFTCollection,
  'naruto-1': narutoNFTCollection
};

// Function to get NFT collection for a specific anime
export const getNFTCollectionForAnime = (animeId: string): IPFSNFTMetadata[] => {
  return nftCollectionsByAnime[animeId] || [];
};

// Function to get the first NFT from a collection (for automatic minting)
export const getFirstNFTFromCollection = (animeId: string): IPFSNFTMetadata | null => {
  const collection = getNFTCollectionForAnime(animeId);
  return collection.length > 0 ? collection[0] : null;
};

// Function to validate IPFS URL format
export const isValidIPFSUrl = (url: string): boolean => {
  const ipfsPattern = /^https:\/\/ipfs\.io\/ipfs\/[a-zA-Z0-9]+$/;
  return ipfsPattern.test(url);
};

// Function to extract CID from IPFS URL
export const extractCIDFromIPFSUrl = (url: string): string | null => {
  const match = url.match(/https:\/\/ipfs\.io\/ipfs\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
};