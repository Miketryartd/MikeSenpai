// frontend/src/Pages/TestMultiProvider.tsx
import { useState } from "react";
import { DynamicUrl } from "../Utils/DynamicUrl";

interface ProviderResult {
  provider: string;
  success: boolean;
  responseTime?: string;
  error?: string;
  resultCount?: number;
  title?: string;
  totalEpisodes?: number;
  sourcesCount?: number;
  qualities?: string[];
  firstEpisodeId?: string;
  firstResult?: {
    id: string;
    title: string;
    image: string;
  };
  animeTitle?: string;  // Add this line
  animeId?: string;      // Add this line for completeness
}
interface BestProvider {
  provider: string;
  animeId: string;
  animeTitle: string;
  totalEpisodes: number;
  firstEpisodeId: string;
}

interface WorkingIdResult {
  success: boolean;
  searchQuery: string;
  timestamp: string;
  bestProvider: BestProvider | null;
  allResults: ProviderResult[];
  message: string;
}

function TestMultiProvider() {
  const [searchQuery, setSearchQuery] = useState("");
  const [animeId, setAnimeId] = useState("");
  const [episodeId, setEpisodeId] = useState("");
  const [searchResults, setSearchResults] = useState<ProviderResult[]>([]);
  const [infoResults, setInfoResults] = useState<ProviderResult[]>([]);
  const [episodeResults, setEpisodeResults] = useState<ProviderResult[]>([]);
  const [workingIdResult, setWorkingIdResult] = useState<WorkingIdResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "info" | "episode" | "find">("search");

  const testSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${DynamicUrl()}/mikesenpai/api/test/multi/search/${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.workingProviders);
      }
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
  };

  const testInfo = async () => {
    if (!animeId.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${DynamicUrl()}/mikesenpai/api/test/multi/info/${encodeURIComponent(animeId)}`);
      const data = await res.json();
      if (data.success) {
        setInfoResults(data.workingProviders);
      }
    } catch (err) {
      console.error("Info error:", err);
    }
    setLoading(false);
  };

  const testEpisode = async () => {
    if (!episodeId.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${DynamicUrl()}/mikesenpai/api/test/multi/episode/${encodeURIComponent(episodeId)}`);
      const data = await res.json();
      if (data.success) {
        setEpisodeResults(data.workingProviders);
      }
    } catch (err) {
      console.error("Episode error:", err);
    }
    setLoading(false);
  };

  const findWorkingId = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${DynamicUrl()}/mikesenpai/api/test/multi/find-id/${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setWorkingIdResult(data);
      if (data.bestProvider?.firstEpisodeId) {
        setEpisodeId(data.bestProvider.firstEpisodeId);
      }
    } catch (err) {
      console.error("Find ID error:", err);
    }
    setLoading(false);
  };

  const playEpisode = (id: string) => {
    if (!id) return;
    window.open(`${DynamicUrl()}/mikesenpai/api/test/multi/play/${encodeURIComponent(id)}`, '_blank');
  };

  const getStatusBadge = (success: boolean) => {
    return success
      ? <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">Working</span>
      : <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs">Failed</span>;
  };

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white p-6">
      <h1 className="text-2xl font-bold mb-2">Multi-Provider Test</h1>
      <p className="text-gray-400 text-sm mb-6">Tests all providers to see which ones are working</p>

      <div className="flex gap-2 mb-6 border-b border-purple-800/30 flex-wrap">
        <button
          onClick={() => setActiveTab("find")}
          className={`px-4 py-2 transition-colors ${activeTab === "find" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400 hover:text-gray-300"}`}
        >
          Find Working ID
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`px-4 py-2 transition-colors ${activeTab === "search" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400 hover:text-gray-300"}`}
        >
          Search Test
        </button>
        <button
          onClick={() => setActiveTab("info")}
          className={`px-4 py-2 transition-colors ${activeTab === "info" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400 hover:text-gray-300"}`}
        >
          Anime Info Test
        </button>
        <button
          onClick={() => setActiveTab("episode")}
          className={`px-4 py-2 transition-colors ${activeTab === "episode" ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-400 hover:text-gray-300"}`}
        >
          Episode Source Test
        </button>
      </div>

      {activeTab === "find" && (
        <div className="bg-[#16162a] rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Find Working Episode ID</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search: One Piece, Naruto, Demon Slayer"
              className="flex-1 p-2 rounded bg-[#0d0d14] border border-purple-800 text-white"
              onKeyPress={(e) => e.key === 'Enter' && findWorkingId()}
            />
            <button
              onClick={findWorkingId}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Find
            </button>
          </div>

          {workingIdResult && (
            <div className="mt-4">
              {workingIdResult.success ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-400 mb-2">✓ {workingIdResult.message}</p>
                  <div className="bg-black/30 rounded p-3 mt-2">
                    <p className="text-sm"><span className="text-gray-400">Provider:</span> <span className="text-purple-400">{workingIdResult.bestProvider?.provider}</span></p>
                    <p className="text-sm mt-1"><span className="text-gray-400">Anime ID:</span> <span className="font-mono text-xs">{workingIdResult.bestProvider?.animeId}</span></p>
                    <p className="text-sm mt-1"><span className="text-gray-400">Episode ID:</span> <span className="font-mono text-xs break-all">{workingIdResult.bestProvider?.firstEpisodeId}</span></p>
                    <button
                      onClick={() => workingIdResult.bestProvider?.firstEpisodeId && playEpisode(workingIdResult.bestProvider.firstEpisodeId)}
                      className="mt-3 px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-sm"
                    >
                      Play Episode
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400">{workingIdResult.message}</p>
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">All Provider Results:</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {workingIdResult.allResults?.map((result, idx) => (
                    <div key={idx} className="bg-black/30 rounded p-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{result.provider}</span>
                        {getStatusBadge(result.success)}
                      </div>
                      {result.success ? (
                        <div className="text-xs text-gray-400 mt-1">
                          <p>Anime: {result.animeTitle}</p>
                          <p>Episodes: {result.totalEpisodes}</p>
                          {result.firstEpisodeId && <p className="font-mono truncate">Episode ID: {result.firstEpisodeId}</p>}
                        </div>
                      ) : (
                        <p className="text-xs text-red-400 mt-1">{result.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "search" && (
        <div className="bg-[#16162a] rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Search Test</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search: One Piece, Naruto"
              className="flex-1 p-2 rounded bg-[#0d0d14] border border-purple-800 text-white"
              onKeyPress={(e) => e.key === 'Enter' && testSearch()}
            />
            <button
              onClick={testSearch}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Test Search
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Working Providers:</h3>
              {searchResults.map((result, idx) => (
                <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{result.provider}</span>
                    <span className="text-xs text-green-400">{result.responseTime}</span>
                  </div>
                  <p className="text-sm mt-1">Results: {result.resultCount}</p>
                  {result.firstResult && (
                    <p className="text-xs text-gray-400 mt-1">First: {result.firstResult.title}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "info" && (
        <div className="bg-[#16162a] rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Anime Info Test</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={animeId}
              onChange={(e) => setAnimeId(e.target.value)}
              placeholder="Anime ID (e.g., one-piece-dk6r, 30)"
              className="flex-1 p-2 rounded bg-[#0d0d14] border border-purple-800 text-white"
              onKeyPress={(e) => e.key === 'Enter' && testInfo()}
            />
            <button
              onClick={testInfo}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Test Info
            </button>
          </div>

          {infoResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Working Providers:</h3>
              {infoResults.map((result, idx) => (
                <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{result.provider}</span>
                    <span className="text-xs text-green-400">{result.responseTime}</span>
                  </div>
                  <p className="text-sm mt-1">Title: {result.title}</p>
                  <p className="text-xs text-gray-400 mt-1">Episodes: {result.totalEpisodes}</p>
                  {result.firstEpisodeId && (
                    <button
                      onClick={() => {
                        setEpisodeId(result.firstEpisodeId || "");
                        setActiveTab("episode");
                      }}
                      className="mt-2 text-xs text-purple-400 hover:text-purple-300"
                    >
                      Test this episode →
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "episode" && (
        <div className="bg-[#16162a] rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Episode Source Test</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={episodeId}
              onChange={(e) => setEpisodeId(e.target.value)}
              placeholder="Episode ID"
              className="flex-1 p-2 rounded bg-[#0d0d14] border border-purple-800 text-white"
              onKeyPress={(e) => e.key === 'Enter' && testEpisode()}
            />
            <button
              onClick={testEpisode}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Test Episode
            </button>
            {episodeId && (
              <button
                onClick={() => playEpisode(episodeId)}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
              >
                Play
              </button>
            )}
          </div>

          {episodeResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Providers with Working Sources:</h3>
              {episodeResults.map((result, idx) => (
                <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{result.provider}</span>
                    <span className="text-xs text-green-400">{result.responseTime}</span>
                  </div>
                  <p className="text-sm mt-1">Sources: {result.sourcesCount}</p>
                  <p className="text-xs text-gray-400 mt-1">Qualities: {result.qualities?.join(", ")}</p>
                  <button
                    onClick={() => playEpisode(episodeId)}
                    className="mt-2 text-xs bg-purple-600 px-3 py-1 rounded hover:bg-purple-700"
                  >
                    Play with {result.provider}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-400">Testing providers...</p>
        </div>
      )}
    </div>
  );
}

export default TestMultiProvider;