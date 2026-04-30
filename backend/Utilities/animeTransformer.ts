
export interface NormalizedAnime {
  _id: string;
  Name: string;
  ImagePath: string;
  Cover: string;
  DescripTion: string;
  Genres: string[];
  epCount: number;
  Status: string;
  Duration: string;
  MALScore: string;
  Studios: string;
  Producers: string;
  Premiered: string;
  Aired: string;
  Synonyms: string;
  RatingsNum: number;
  Type: string;
}

export function normalizeAnimeKaiData(anime: any): NormalizedAnime {
  return {
    _id: anime.id || "",
    Name: anime.title || "Unknown Title",
    ImagePath: anime.image || "",
    Cover: anime.cover || anime.image || "",
    DescripTion: anime.description || "No description available.",
    Genres: anime.genres || [],
    epCount: anime.totalEpisodes || anime.episodeCount || 0,
    Status: anime.status || "Unknown",
    Duration: anime.type || "TV",
    MALScore: anime.rating ? anime.rating.toString() : "N/A",
    Studios: anime.studios?.join(", ") || "Unknown",
    Producers: anime.producers?.join(", ") || "Unknown",
    Premiered: anime.releaseDate || anime.year || "Unknown",
    Aired: anime.releaseDate || anime.startDate || "Unknown",
    Synonyms: anime.otherNames?.join(", ") || "",
    RatingsNum: anime.rating ? Math.floor(anime.rating * 10) : 0,
    Type: anime.type || "TV"
  };
}

export function normalizeAnimeUnityData(anime: any): NormalizedAnime {
  const title = typeof anime.title === 'string' ? anime.title : (anime.title?.english || anime.title?.romaji || "Unknown");
  const rating = anime.rating || (anime as any).score || 0;
  
  return {
    _id: anime.id || "",
    Name: title,
    ImagePath: anime.image || "",
    Cover: anime.cover || anime.image || "",
    DescripTion: anime.description || anime.synopsis || "No description available.",
    Genres: anime.genres || [],
    epCount: anime.totalEpisodes || anime.episodes?.length || 0,
    Status: anime.status || "Unknown",
    Duration: anime.type || "TV",
    MALScore: rating ? rating.toString() : "N/A",
    Studios: anime.studios?.join(", ") || "Unknown",
    Producers: anime.producers?.join(", ") || "Unknown",
    Premiered: anime.releaseDate || anime.startDate || "Unknown",
    Aired: anime.releaseDate || anime.startDate || "Unknown",
    Synonyms: anime.synonyms?.join(", ") || "",
    RatingsNum: rating ? Math.floor(rating * 10) : 0,
    Type: anime.type || "TV"
  };
}

export function normalizeAnipubData(anime: any): NormalizedAnime {
  return {
    _id: anime._id?.toString() || "",
    Name: anime.Name || "Unknown Title",
    ImagePath: anime.ImagePath || "",
    Cover: anime.Cover || anime.ImagePath || "",
    DescripTion: anime.DescripTion || "No description available.",
    Genres: anime.Genres || [],
    epCount: typeof anime.epCount === 'number' ? anime.epCount : parseInt(anime.epCount) || 0,
    Status: anime.Status || "Unknown",
    Duration: anime.Duration || "TV",
    MALScore: anime.MALScore?.toString() || "N/A",
    Studios: anime.Studios || "Unknown",
    Producers: anime.Producers || "Unknown",
    Premiered: anime.Premiered || "Unknown",
    Aired: anime.Aired || "Unknown",
    Synonyms: anime.Synonyms || "",
    RatingsNum: anime.RatingsNum || 0,
    Type: anime.Duration || "TV"
  };
}