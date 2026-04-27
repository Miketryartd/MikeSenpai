import { useState } from "react";
import { getComment } from "../Services/getComment";

export const useComment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = async (comment: string, id: number | string, finder: string) => {
    try {
      setLoading(true);
      setError(null);

      const d = await getComment(comment, id, finder);
      return d;

    } catch (err: any) {
      setError("Error adding comment");
      return null;
    } finally {
      setLoading(false);
    }
  };

 
  return {
    loading,
    error,
    addComment,
  };
};