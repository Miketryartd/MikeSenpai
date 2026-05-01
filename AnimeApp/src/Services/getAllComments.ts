// frontend/src/Services/getAllComments.ts
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const getAllComments = async (id: string, finder: string) => {
  try {
    return await fetchWithNgrok(`/mikesempai/api/auth/getComment/${id}/${finder}`);
  } catch (err) {
    console.error(err);
  }
};