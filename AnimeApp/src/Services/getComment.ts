// frontend/src/Services/getComment.ts
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const getComment = async (
  comment: string,
  id: number | string,
  finder: string
) => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Missing user token");
      return;
    }

    if (!id || !finder) {
      throw new Error("Missing id or finder");
    }

    return await fetchWithNgrok(`/mikesempai/api/auth/comment/${id}/${finder}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });
  } catch (error) {
    console.error("Error fetching api from backend", error);
  }
};