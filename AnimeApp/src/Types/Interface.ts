
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