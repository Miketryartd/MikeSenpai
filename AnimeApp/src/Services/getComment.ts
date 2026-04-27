import { DynamicUrl } from "../Utils/DynamicUrl"

export const getComment = async (
  comment: string,
  id: number | string,
  finder: string
) => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) return alert("Missing user token");

    if (!id || !finder) {
      throw new Error("Missing id or finder");
    }

    const url = `${DynamicUrl()}/mikesempai/api/auth/comment/${id}/${finder}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Backend error:", data);
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("Error fetching api from backend", error);
  }
};