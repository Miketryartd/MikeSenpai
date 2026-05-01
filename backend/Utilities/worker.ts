// backend/Utilities/worker.ts
const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'https://animeunityproxy.mikeleano26.workers.dev';

export const fetchViaCloudflareProxy = async (url: string): Promise<any> => {
  try {
    const proxyUrl = `${CLOUDFLARE_WORKER_URL}?url=${encodeURIComponent(url)}`;
    console.log(`Using Cloudflare proxy: ${proxyUrl}`);
    
    const response = await fetch(proxyUrl);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.log('Cloudflare proxy failed:', err);
  }
  return null;
};