// frontend/src/Utils/DynamicUrl.ts
export const DynamicUrl = () => {
    const prod = import.meta.env.VITE_BACKEND_PROD;
    const local = import.meta.env.VITE_BACKEND_LOCAL;
  
    const base = import.meta.env.MODE === "production" ? prod : local;
  
    if (!base) {
      console.error("Base URL is undefined. Check your env variables.");
    }
  
    return base;
};

export const fetchWithNgrok = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${DynamicUrl()}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...options.headers
  };
  
  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check if response has content before parsing JSON
    const text = await response.text();
    if (!text || text.trim() === '') {
      throw new Error('Empty response from server');
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    throw error;
  }
};