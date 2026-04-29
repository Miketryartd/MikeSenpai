
import { useState } from "react";
import { authLogin } from "../Services/authLogin";

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await authLogin(email, password);
      
      if (data.token) {
        sessionStorage.setItem("token", data.token);
      }
      
      return data;
    } catch (err: any) {
      console.error("Error logging in:", err);
      setError(err.message || "Error connecting with service");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login };
};