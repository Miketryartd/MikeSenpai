// frontend/src/Services/topRated.ts
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export async function getTopRated() {
  try {
    return await fetchWithNgrok('/mikesenpai/api/topRated');
  } catch (error) {
    console.error("Error fetching top rated", error);
  }
}