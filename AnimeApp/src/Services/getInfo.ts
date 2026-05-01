// frontend/src/Services/getInfo.ts
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const getInfo = async (id: number | string) => {
  try {
    return await fetchWithNgrok(`/mikesenpai/api/getInfo/${id}`);
  } catch (err) {
    console.error("Error fetching api from backend", err);
  }
};