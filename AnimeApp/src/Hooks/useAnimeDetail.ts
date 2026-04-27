import { useEffect, useState } from "react"
import { getDetailAnime } from "../Services/getDetailAnime"
import type { AnimeDetail } from "../Types/Interface"


export const useAnimeDetails =  (id: number | string | undefined) => {

    const [result, setResult] = useState<AnimeDetail | null>(null);
      const [loading, setLoading] = useState<boolean>(true);
      const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      let isMounted = true;
  
      const fetchData = async () => {
        try {
          setLoading(true);
  
          const data = await getDetailAnime(id);
  
          if (isMounted) {
            setResult(data);
          }
        } catch (err: any) {
          if (isMounted) {
            setError(err.message || "Something went wrong");
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
  
      fetchData();
  
      return () => {
        isMounted = false;
      };
    }, [id]);
  
    return { result, loading, error };
}