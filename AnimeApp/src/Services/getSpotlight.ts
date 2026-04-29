
import { DynamicUrl } from "../Utils/DynamicUrl";

export const fetchSpotlight = async () => {
  try {
    const res = await fetch(`${DynamicUrl()}/mikesenpai/api/spotlight`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("fetchSpotlight error:", err);
    return { results: [] };
  }
};
