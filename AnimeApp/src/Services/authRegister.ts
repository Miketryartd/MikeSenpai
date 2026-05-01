
import { fetchWithNgrok } from "../Utils/DynamicUrl";

export const authRegister = async (email: string, password: string) => {
  try {
    const data = await fetchWithNgrok('/mikenichan/api/auth/register', {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    return data;
  } catch (err) {
    console.error("Error creating account", err);
  }
};