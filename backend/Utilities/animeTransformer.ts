// Transform AnimeKai data to match Anipub format
export const transformAnimeKaiToAnipubFormat = (animeKaiData: any): any => {
  if (!animeKaiData) return null;
  
  // Handle single anime info
  if (animeKaiData.id && !animeKaiData.results) {
    return {
      local: {
        _id: animeKaiData.id,
        Name: animeKaiData.title,
        ImagePath: animeKaiData.image,
        Cover: animeKaiData.image,
        DescripTion: animeKaiData.description,
        Genres: animeKaiData.genres || [],
        epCount: animeKaiData.totalEpisodes || 0,
        Status: animeKaiData.status || "Unknown",
        Duration: animeKaiData.type || "Unknown",
        MALScore: animeKaiData.rating || "N/A",
        Studios: "Unknown",
        Producers: "Unknown",
        Premiered: "Unknown",
        Aired: "Unknown",
        Synonyms: animeKaiData.otherName || "",
      }
    };
  }
  
  // Handle search results
  if (animeKaiData.results) {
    return {
      results: animeKaiData.results.map((item: any) => ({
        Id: item.id,
        Name: item.title,
        Image: item.image,
        finder: item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      })),
      found: animeKaiData.results.length > 0
    };
  }
  
  return animeKaiData;
};

// Transform AnimeKai episodes to match Anipub format
export const transformAnimeKaiEpisodes = (animeInfo: any): any => {
  if (!animeInfo || !animeInfo.episodes) return null;
  
  return {
    local: {
      _id: animeInfo.id,
      name: animeInfo.title,
      ep: animeInfo.episodes.map((ep: any) => ({
        link: ep.id,
        number: ep.number,
        title: ep.title
      })),
      link: animeInfo.episodes[0]?.id || null
    }
  };
};