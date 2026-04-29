// frontend/src/Pages/TestAnimeKai.tsx - UPDATED
import { useState } from "react";
import { DynamicUrl } from "../Utils/DynamicUrl";

function TestAnimeKai() {
  const [searchQuery, setSearchQuery] = useState("");
  const [animeId, setAnimeId] = useState("");
  const [episodeId, setEpisodeId] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
  

  const testSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${DynamicUrl()}/mikesenpai/api/test/search/${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setResults({ error: String(err) });
    }
    setLoading(false);
  };

  const testInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${DynamicUrl()}/mikesenpai/api/test/info/${animeId}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setResults({ error: String(err) });
    }
    setLoading(false);
  };

  const testEpisode = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${DynamicUrl()}/mikesenpai/api/test/episode/${episodeId}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setResults({ error: String(err) });
    }
    setLoading(false);
  };

  const testSpotlight = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${DynamicUrl()}/mikesenpai/api/test/spotlight`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setResults({ error: String(err) });
    }
    setLoading(false);
  };

  const testNewReleases = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${DynamicUrl()}/mikesenpai/api/test/new-releases`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setResults({ error: String(err) });
    }
    setLoading(false);
  };

  const findWorkingId = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${DynamicUrl()}/mikesenpai/api/test/find-id/${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setResults(data);
      if (data.recommendedId) {
        setWorkingId(data.recommendedId);
        setAnimeId(data.recommendedId);
      }
    } catch (err) {
      setResults({ error: String(err) });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white p-8">
      <h1 className="text-2xl font-bold mb-6">AnimeKai API Test</h1>
      
      {/* Quick Test - Find Working ID */}
      <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3 text-green-400">🎯 Quick Test: Find a Working ID</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter anime name (e.g., One Piece)"
            className="flex-1 p-2 rounded bg-[#0d0d14] border border-green-800"
          />
          <button
            onClick={findWorkingId}
            disabled={loading || !searchQuery}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Find Working ID
          </button>
        </div>
        {workingId && (
          <div className="bg-green-900/50 p-3 rounded">
            <p>✅ Found working ID: <code className="bg-black/50 px-2 py-1 rounded">{workingId}</code></p>
            <p className="text-xs text-gray-400 mt-1">Use this ID for the "Test Anime Info" below</p>
          </div>
        )}
      </div>

      {/* Search Test */}
      <div className="bg-[#16162a] p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">1. Test Search</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter anime name (e.g., One Piece, Naruto)"
            className="flex-1 p-2 rounded bg-[#0d0d14] border border-purple-800"
          />
          <button
            onClick={testSearch}
            disabled={loading || !searchQuery}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Search
          </button>
        </div>
      </div>

      {/* Anime Info Test */}
      <div className="bg-[#16162a] p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">2. Test Anime Info</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={animeId}
            onChange={(e) => setAnimeId(e.target.value)}
            placeholder="Try the ID from search results"
            className="flex-1 p-2 rounded bg-[#0d0d14] border border-purple-800"
          />
          <button
            onClick={testInfo}
            disabled={loading || !animeId}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Test Info
          </button>
        </div>
        <p className="text-xs text-gray-400">Use the ID from search results (like "one-piece" or "naruto")</p>
      </div>

      {/* Episode Source Test */}
      <div className="bg-[#16162a] p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">3. Test Episode Source</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={episodeId}
            onChange={(e) => setEpisodeId(e.target.value)}
            placeholder="Episode ID (e.g., one-piece-episode-1)"
            className="flex-1 p-2 rounded bg-[#0d0d14] border border-purple-800"
          />
          <button
            onClick={testEpisode}
            disabled={loading || !episodeId}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Test Episode
          </button>
        </div>
      </div>

      {/* Spotlight Test */}
      <div className="bg-[#16162a] p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">4. Test Spotlight</h2>
        <button
          onClick={testSpotlight}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Fetch Spotlight
        </button>
      </div>

      {/* New Releases Test */}
      <div className="bg-[#16162a] p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">5. Test New Releases</h2>
        <button
          onClick={testNewReleases}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Fetch New Releases
        </button>
      </div>

      {/* Results Display */}
      {results && (
        <div className="bg-[#16162a] p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Results:</h2>
          <pre className="bg-black/50 p-4 rounded overflow-auto max-h-96 text-xs">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-400">Testing AnimeKai API...</p>
        </div>
      )}
    </div>
  );
}

export default TestAnimeKai;