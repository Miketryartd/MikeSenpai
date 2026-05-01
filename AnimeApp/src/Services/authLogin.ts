
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const authLogin = async (email: string, password: string) => {
  try {
    const data = await fetchWithNgrok('/mikenichan/api/auth/login', {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    return data;
  } catch (err) {
    console.error("Error logging in:", err);
    throw err;
  }
};