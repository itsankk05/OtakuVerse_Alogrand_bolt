// Mock anime API service for OtakuVerse
export interface AnimeInfo {
  id: string;
  title: string;
  description: string;
  poster: string;
  cover?: string;
  rating?: string;
  releaseDate: string;
  genres: string[];
  totalEpisodes: number;
  status: string;
  type: string;
  studios?: string[];
  duration?: string;
  aired?: {
    from: string;
    to: string;
  };
  season?: string;
  year?: number;
  score?: number;
  rank?: number;
  popularity?: number;
  synopsis?: string;
  background?: string;
  related?: any[];
  characters?: any[];
  recommendations?: any[];
}

export interface Episode {
  episodeId: string;
  number: number;
  title: string;
  isFiller?: boolean;
  recap?: boolean;
}

export interface StreamingSource {
  url: string;
  quality: string;
  isM3U8: boolean;
}

export interface StreamingData {
  headers?: {
    Referer: string;
    'User-Agent'?: string;
  };
  sources: StreamingSource[];
  subtitles: Array<{
    url: string;
    lang: string;
  }>;
  intro?: {
    start: number;
    end: number;
  };
  outro?: {
    start: number;
    end: number;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  poster: string;
  duration?: string;
  type: string;
  rating?: string;
  episodes?: {
    sub: number;
    dub: number;
  };
}

class AnimeApiService {
  // Mock data for anime content
  private mockAnimeList: SearchResult[] = [
    {
      id: 'demon-slayer-1',
      title: 'Demon Slayer: Kimetsu no Yaiba',
      poster: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
      duration: '24m',
      type: 'TV',
      rating: 'PG-13',
      episodes: { sub: 44, dub: 44 }
    },
    {
      id: 'attack-on-titan-1',
      title: 'Attack on Titan',
      poster: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg',
      duration: '24m',
      type: 'TV',
      rating: 'R',
      episodes: { sub: 87, dub: 87 }
    },
    {
      id: 'naruto-1',
      title: 'Naruto',
      poster: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
      duration: '23m',
      type: 'TV',
      rating: 'PG-13',
      episodes: { sub: 720, dub: 220 }
    },
    {
      id: 'one-piece-1',
      title: 'One Piece',
      poster: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg',
      duration: '24m',
      type: 'TV',
      rating: 'PG-13',
      episodes: { sub: 1000, dub: 600 }
    },
    {
      id: 'jujutsu-kaisen-1',
      title: 'Jujutsu Kaisen',
      poster: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
      duration: '24m',
      type: 'TV',
      rating: 'R',
      episodes: { sub: 24, dub: 24 }
    },
    {
      id: 'my-hero-academia-1',
      title: 'My Hero Academia',
      poster: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg',
      duration: '24m',
      type: 'TV',
      rating: 'PG-13',
      episodes: { sub: 138, dub: 138 }
    }
  ];

  private mockAnimeDetails: Record<string, AnimeInfo> = {
    'demon-slayer-1': {
      id: 'demon-slayer-1',
      title: 'Demon Slayer: Kimetsu no Yaiba',
      description: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.',
      poster: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
      releaseDate: '2019',
      genres: ['Action', 'Historical', 'Supernatural', 'Shounen'],
      totalEpisodes: 44,
      status: 'Completed',
      type: 'TV',
      duration: '24m',
      year: 2019,
      score: 8.7,
      rank: 45,
      popularity: 1
    },
    'attack-on-titan-1': {
      id: 'attack-on-titan-1',
      title: 'Attack on Titan',
      description: 'Humanity fights for survival against giant humanoid Titans that have brought civilization to the brink of extinction.',
      poster: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg',
      releaseDate: '2013',
      genres: ['Action', 'Drama', 'Fantasy', 'Military'],
      totalEpisodes: 87,
      status: 'Completed',
      type: 'TV',
      duration: '24m',
      year: 2013,
      score: 9.0,
      rank: 1,
      popularity: 2
    }
  };

  async searchAnime(query: string, page: number = 1): Promise<{
    currentPage: number;
    hasNextPage: boolean;
    totalPages: number;
    results: SearchResult[];
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filteredResults = this.mockAnimeList.filter(anime =>
      anime.title.toLowerCase().includes(query.toLowerCase())
    );

    return {
      currentPage: page,
      hasNextPage: false,
      totalPages: 1,
      results: filteredResults
    };
  }

  async getAnimeInfo(animeId: string): Promise<AnimeInfo> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.mockAnimeDetails[animeId] || {
      id: animeId,
      title: 'Unknown Anime',
      description: 'No description available',
      poster: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
      releaseDate: '2024',
      genres: ['Action'],
      totalEpisodes: 12,
      status: 'Unknown',
      type: 'TV'
    };
  }

  async getAnimeEpisodes(animeId: string): Promise<Episode[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const animeInfo = await this.getAnimeInfo(animeId);
    
    return Array.from({ length: Math.min(animeInfo.totalEpisodes, 12) }, (_, i) => ({
      episodeId: `${animeId}-ep-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      isFiller: Math.random() > 0.8 // 20% chance of filler
    }));
  }

  async getStreamingData(episodeId: string): Promise<StreamingData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock streaming data with sample video
    return {
      headers: {
        Referer: 'https://otakuverse.app'
      },
      sources: [
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          quality: '1080p',
          isM3U8: false
        },
        {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          quality: '720p',
          isM3U8: false
        }
      ],
      subtitles: [
        {
          url: '',
          lang: 'English'
        }
      ]
    };
  }

  async getTrendingAnime(): Promise<{
    currentPage: number;
    hasNextPage: boolean;
    totalPages: number;
    results: SearchResult[];
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      currentPage: 1,
      hasNextPage: false,
      totalPages: 1,
      results: this.mockAnimeList.slice(0, 6)
    };
  }

  async getRecentEpisodes(): Promise<{
    currentPage: number;
    hasNextPage: boolean;
    totalPages: number;
    results: Array<{
      id: string;
      title: string;
      episodeNumber: number;
      poster: string;
      episodeId: string;
    }>;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      currentPage: 1,
      hasNextPage: false,
      totalPages: 1,
      results: [
        {
          id: 'demon-slayer-1',
          title: 'Demon Slayer: Kimetsu no Yaiba',
          episodeNumber: 12,
          poster: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
          episodeId: 'demon-slayer-ep-12'
        },
        {
          id: 'attack-on-titan-1',
          title: 'Attack on Titan',
          episodeNumber: 87,
          poster: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg',
          episodeId: 'attack-on-titan-ep-87'
        },
        {
          id: 'jujutsu-kaisen-1',
          title: 'Jujutsu Kaisen',
          episodeNumber: 24,
          poster: 'https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg',
          episodeId: 'jujutsu-kaisen-ep-24'
        }
      ]
    };
  }

  async getGenreList(): Promise<string[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
      'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life',
      'Sports', 'Supernatural', 'Thriller', 'Historical',
      'Military', 'Shounen', 'Shoujo', 'Seinen', 'Josei'
    ];
  }

  async getAnimeByGenre(genre: string, page: number = 1): Promise<{
    currentPage: number;
    hasNextPage: boolean;
    totalPages: number;
    results: SearchResult[];
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Filter anime by genre (mock implementation)
    const filteredResults = this.mockAnimeList.filter(anime => {
      const animeDetails = this.mockAnimeDetails[anime.id];
      return animeDetails?.genres.some(g => 
        g.toLowerCase().includes(genre.toLowerCase())
      );
    });

    return {
      currentPage: page,
      hasNextPage: false,
      totalPages: 1,
      results: filteredResults
    };
  }
}

export const animeApi = new AnimeApiService();