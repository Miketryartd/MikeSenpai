// backend/Utilities/animeUnityFetcher.ts
// This utility handles fetching from AnimeUnity with multiple intelligent fallback strategies

import axios from 'axios';

const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 
  'https://animeunityproxy.mikeleano26.workers.dev';

// Browser-like headers that make AnimeUnity think we're a real user
const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'DNT': '1',
  'Connection': 'keep-alive',
  'Referer': 'https://animeunity.to/',
  'Origin': 'https://animeunity.to',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'Cache-Control': 'no-cache',
};


export const fetchAnimeUnityDirect = async (endpoint: string): Promise<any> => {
  try {
    console.log(`[AnimeUnity Direct] Fetching: ${endpoint.substring(0, 60)}...`);
    
    const response = await axios.get(endpoint, {
      headers: browserHeaders,
      timeout: 10000,
    
      validateStatus: () => true,
    });

    if (response.status === 200 && response.data) {
      console.log(`[AnimeUnity Direct]  Success`);
      return response.data;
    } else {
      console.log(`[AnimeUnity Direct]  Failed with status ${response.status}`);
    }
  } catch (err: any) {
    console.log(`[AnimeUnity Direct]  Error: ${err.message}`);
  }
  return null;
};


export const fetchAnimeUnityViaWorker = async (endpoint: string): Promise<any> => {
  try {
    console.log(`[AnimeUnity Worker] Fetching via: ${CLOUDFLARE_WORKER_URL}`);
    
    const proxyUrl = `${CLOUDFLARE_WORKER_URL}?url=${encodeURIComponent(endpoint)}`;
    
    const response = await axios.get(proxyUrl, {
      headers: {
        'Accept': 'application/json',
      },
      timeout: 15000,
      validateStatus: () => true,
    });

    if (response.status === 200 && response.data) {
      console.log(`[AnimeUnity Worker]  Success`);
      return response.data;
    } else {
      console.log(`[AnimeUnity Worker]  Failed with status ${response.status}`);
    }
  } catch (err: any) {
    console.log(`[AnimeUnity Worker]  Error: ${err.message}`);
  }
  return null;
};


export const fetchAnimeUnityViaFallback = async (endpoint: string): Promise<any> => {
  const fallbacks = [
    {
      name: 'allorigins',
      buildUrl: (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    },
    {
      name: 'cors.sh',
      buildUrl: (url: string) => `https://proxy.cors.sh/${url}`
    },
  ];

  for (const fallback of fallbacks) {
    try {
      const proxyUrl = fallback.buildUrl(endpoint);
      console.log(`[AnimeUnity Fallback] Trying ${fallback.name}...`);
      
      const response = await axios.get(proxyUrl, {
        headers: browserHeaders,
        timeout: 10000,
        validateStatus: () => true,
      });

      if (response.status === 200 && response.data) {
        console.log(`[AnimeUnity Fallback]  ${fallback.name} succeeded`);
        return response.data;
      }
    } catch (err) {
      console.log(`[AnimeUnity Fallback]  ${fallback.name} failed`);
    }
  }
  return null;
};

export const fetchAnimeUnity = async (endpoint: string): Promise<any> => {
  console.log(`\n[AnimeUnity Master] Starting fetch sequence for endpoint`);
  console.log(`═══════════════════════════════════════════════════════════════`);

  console.log(`[1/3] Attempting direct fetch...`);
  let result = await fetchAnimeUnityDirect(endpoint);
  if (result) {
    console.log(`[Success] Direct fetch worked!`);
    console.log(`═══════════════════════════════════════════════════════════════\n`);
    return result;
  }


  console.log(`[2/3] Attempting Cloudflare Worker proxy...`);
  result = await fetchAnimeUnityViaWorker(endpoint);
  if (result) {
    console.log(`[Success] Cloudflare Worker worked!`);
    console.log(`═══════════════════════════════════════════════════════════════\n`);
    return result;
  }

  console.log(`[3/3] Attempting fallback proxies...`);
  result = await fetchAnimeUnityViaFallback(endpoint);
  if (result) {
    console.log(`[Success] Fallback proxy worked!`);
    console.log(`═══════════════════════════════════════════════════════════════\n`);
    return result;
  }


  console.log(`[Failed] All fetch strategies exhausted`);
  console.log(`═══════════════════════════════════════════════════════════════\n`);
  return null;
};


export const buildAnimeUnityEndpoint = (type: 'info' | 'search' | 'episode', param: string): string => {
  const baseUrl = 'https://animeunity.to/api';
  
  switch (type) {
    case 'info':
      return `${baseUrl}/info?id=${param}`;
    case 'search':
      return `${baseUrl}/search?q=${encodeURIComponent(param)}`;
    case 'episode':
      return `${baseUrl}/episode/${param}`;
    default:
      return baseUrl;
  }
};