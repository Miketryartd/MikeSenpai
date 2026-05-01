// frontend/src/Services/getGenre.ts
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const getGenre = async (genre: string | number, page: number | string) => {
  try {
    return await fetchWithNgrok(`/mikesenpai/api/findByGenre/${genre}?page=${page}`);
  } catch (err) {
    console.error("Error fetching genre find by genre", err);
  }
};