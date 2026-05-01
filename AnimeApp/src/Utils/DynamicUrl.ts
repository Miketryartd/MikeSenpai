export const DynamicUrl = () => {
    const prod = import.meta.env.VITE_BACKEND_PROD;
    const local = import.meta.env.VITE_BACKEND_LOCAL;
  
    const base = import.meta.env.MODE === "production" ? prod : local;
  
    if (!base) {
      console.error("Base URL is undefined. Check your env variables.");
    }
  
    return base;
  };