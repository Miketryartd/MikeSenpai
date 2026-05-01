// frontend/src/Services/getDetailAnime.ts
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const getDetailAnime = async (id: number | string | undefined) => {
  try {
    return await fetchWithNgrok(`/mikesenpai/api/getAnimeDetail/${id}`);
  } catch (error) {
    console.error("Error fetching data from backend", error);
  }
};