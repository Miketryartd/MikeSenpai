// frontend/src/Services/multiStreamLink.ts
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const getMultiStreamLinks = async (id: number | string | undefined) => {
  try {
    const data = await fetchWithNgrok(`/mikesenpai/api/multi/stream/${id}`);
    console.log(`Stream source: ${data.source}, episodes: ${data.local?.ep?.length || 0}`);
    return data;
  } catch (error) {
    console.error("Error fetching stream links:", error);
    return null;
  }
};