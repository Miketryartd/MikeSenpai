// frontend/src/Services/fetchNewReleases.ts
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const fetchNewReleases = async (page: number = 1) => {
  try {
    return await fetchWithNgrok(`/mikesenpai/api/new-releases?page=${page}`);
  } catch (err) {
    console.error("fetchNewReleases error:", err);
    return { results: [], hasNextPage: false, totalPages: 0 };
  }
};