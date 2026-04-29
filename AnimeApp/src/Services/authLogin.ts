
import { DynamicUrl } from "../Utils/DynamicUrl";

export const authLogin = async (email: string, password: string) => {
  try {
    const url = `${DynamicUrl()}/mikenichan/api/auth/login`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Login failed");
    }
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error logging in:", err);
    throw err;
  }
};