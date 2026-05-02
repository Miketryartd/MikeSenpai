
export const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 3, delay = 1000): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (response.ok || response.status !== 500) {
        return response;
      }
      
      if (i === retries - 1) return response;
    } catch (err) {
      console.log(`Attempt ${i + 1} failed for ${url}:`, err);
      if (i === retries - 1) throw err;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
  }
  throw new Error(`Failed after ${retries} retries`);
};