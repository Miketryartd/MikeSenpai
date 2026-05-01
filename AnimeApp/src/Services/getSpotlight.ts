// frontend/src/Services/getSpotlight.ts
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const fetchSpotlight = async () => {
  try {
    return await fetchWithNgrok('/mikesenpai/api/spotlight');
  } catch (err) {
    console.error("fetchSpotlight error:", err);
    return { results: [] };
  }
};