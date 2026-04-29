// frontend/src/Types/AnimeKaiTypes.ts
export interface AnimeKaiAnime {
  id: string;
  title: string;
  japaneseTitle?: string;
  image: string;
  cover: string;
  rating: number;
  type: string;
  releaseDate: string;
  description: string;
  genres: string[];
  status?: string;
  totalEpisodes?: number;
  episodeCount?: number;
  subCount?: number;
  dubCount?: number;
  url?: string;
  rank?: number;
}

export interface AnimeKaiEpisode {
  id: string;
  episodeId: string;
  title: string;
  image: string;
  episodeNumber: number;
  rating?: number;
  type?: string;
  url?: string;
}

export interface AnimeKaiTopRatedResponse {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  results: AnimeKaiAnime[];
}

export interface AnimeKaiNewReleasesResponse {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  results: AnimeKaiAnime[];
}

export interface AnimeKaiRecentlyUpdatedResponse {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  results: AnimeKaiEpisode[];
}