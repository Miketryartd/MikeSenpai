import { DynamicUrl } from "../Utils/DynamicUrl";

export const fetchNewReleases = async (page: number = 1) => {
  try {
    const res = await fetch(`${DynamicUrl()}/mikesenpai/api/new-releases?page=${page}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("fetchNewReleases error:", err);
    return { results: [], hasNextPage: false, totalPages: 0 };
  }
};