// frontend/src/Services/streamLink.ts
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const getStreamLinks = async (id: number | string | undefined) => {
  try {
    return await fetchWithNgrok(`/mikesenpai/api/getStream/${id}`);
  } catch (error) {
    console.error("Error fetching api from backend", error);
  }
};