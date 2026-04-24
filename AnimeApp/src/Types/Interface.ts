
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



export interface AnimeSearch {
    Name?: string,
    Id?: number,
    Image?: string,
    finder?: string
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

  export type  WatchOverlayProps = {
    children: React.ReactNode;
    onClick?: () => void;
    id: number | string,
    finder: string,
  }


  export type AnimeDetailProps = {
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

  export interface AnimeDetail {
    local: AnimeDetailProps;
  }
  