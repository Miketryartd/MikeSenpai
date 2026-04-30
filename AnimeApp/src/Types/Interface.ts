// frontend/src/Types/Interface.ts - Make source optional
export interface AnimeInfo {
    _id: string,
    Name: string,
    ImagePath: string,
    Cover: string,
    Synonyms: string,
    Aired: Date,
    Premiered: Date,
    RatingsNum: number,
    Genres: string[],
    Studios: string,
    Description: string,
    Duration: string,
    MALScore: string,
    Status: string,
    epCount: number,
}

export type AnimeSearch = {
    Name?: string;
    Id?: number | string;
    Image?: string;
    source?: "anipub" | "animekai" | "animeunity"
    finder?: string;
}

export type AniData = {
    _id: number;
    Name: string;
    ImagePath: string;
    MALScore: number | string;
    RatingsNum: number;
    DescripTion: string;
    Genres: string[];
    finder: string;
  };
  
  export interface TopRatedAnime {
    currentPage: number;
    AniData: AniData[];
  }

export type WatchOverlayProps = {
  children: React.ReactNode;
  onClick?: () => void;
  id?: number | string | undefined;
  finder?: string | undefined;
  name?: string | undefined;
  source?: "anipub" | "animekai" | "animeunity" | "animesaturn" | "hianime";
}

export type AnimeDetailProps = {
  title?: string;
    _id?: number | string;
    Name?: string;
    ImagePath?: string;
    Cover?: string;
    Synonyms?: string;
    MALID?: number | string;
    Aired?: string;
    Premiered?: string;
    Duration?: string;
    Status?: string;
    MALScore?: number | string;
    RatingsNum?: number | string;
    Genres?: string[];
    Studios?: string;
    Producers?: string;
    DescripTion?: string;
    epCount?: number | string;
}

export type BingeWorth = {
    bingeList: AnimeDetailProps[];
    isLoading: boolean;
    error: string | null;
}

export interface AnimeDetail {
    local: AnimeDetailProps;
}

export type Episode = {
    link: string; 
    image: string;
};

export type AnimeStreamingProps = {
    _id?: number | string;
    name?: string;
    link?: string;
    whatType?: string;
    type?: string;
    ep?: Episode[]; 
    finder?: string;
};

export type AnimeStream = {
    local: AnimeStreamingProps;
};

export type StreamProps = {
    currentVideo?: string | null;
}

export type AnimeGenreProps = {
    _id: number | string;
    Name: string;
    ImagePath: string;
    MALScore: string;
    RatingsNum: string;
    DescripTion: string;
    finder: string;
}

export type AnimeGenre = {
    currentPage?: number | string;
    wholePage?: AnimeGenreProps[];
}