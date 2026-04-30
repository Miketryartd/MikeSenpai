import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface WatchedAnime {
  id: string;
  title: string;
  image: string;
  lastEpisode: number;
  timestamp: number;
  finder: string;
}

interface Bookmark {
  id: string;
  title: string;
  image: string;
  type?: string;
  addedAt: number;
  finder: string;
}

function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"history" | "bookmarks">("history");
  const [watchedHistory, setWatchedHistory] = useState<WatchedAnime[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
 
const loadWatchedHistory = () => {
  const history: WatchedAnime[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("watched_") && !key.includes("time") && !key.includes("info")) {
      const animeId = key.replace("watched_", "");
      const watchedEpisodes = JSON.parse(localStorage.getItem(key) || "[]");
      if (watchedEpisodes.length > 0) {
        const savedInfo = localStorage.getItem(`anime_info_${animeId}`);
        let animeInfo = null;
        let title = "";
        let image = "";
        let finderVal = "";
        
        if (savedInfo) {
          try {
            animeInfo = JSON.parse(savedInfo);
            title = animeInfo?.title || "";
            image = animeInfo?.image || "";
            finderVal = animeInfo?.finder || animeId;
          } catch (e) {}
        }
        
       
        if (!title) {
          if (finderVal && finderVal !== animeId) {
            title = finderVal.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          } else {
            title = animeId.slice(0, 30);
          }
        }
        
        history.push({
          finder: finderVal || animeId,
          id: animeId,
          title: title,
          image: image,
          lastEpisode: Math.max(...watchedEpisodes),
          timestamp: parseInt(localStorage.getItem(`watched_time_${animeId}`) || Date.now().toString())
        });
      }
    }
  }
  history.sort((a, b) => b.timestamp - a.timestamp);
  setWatchedHistory(history.slice(0, 20));
};

    loadWatchedHistory();
    window.addEventListener("storage", loadWatchedHistory);
    return () => window.removeEventListener("storage", loadWatchedHistory);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchBookmarks = async () => {
        try {
          const token = sessionStorage.getItem("token");
          const response = await fetch("/api/bookmarks", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setBookmarks(data);
          }
        } catch (error) {
          console.error("Failed to fetch bookmarks:", error);
        }
      };
      fetchBookmarks();
    }
  }, [isLoggedIn]);

  const removeFromHistory = (animeId: string) => {
    localStorage.removeItem(`watched_${animeId}`);
    localStorage.removeItem(`watched_time_${animeId}`);
    localStorage.removeItem(`anime_info_${animeId}`);
    setWatchedHistory(prev => prev.filter(item => item.id !== animeId));
  };

  const clearAllHistory = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("watched_") && !key.includes("time") && !key.includes("info")) {
        const animeId = key.replace("watched_", "");
        localStorage.removeItem(key);
        localStorage.removeItem(`watched_time_${animeId}`);
        localStorage.removeItem(`anime_info_${animeId}`);
      }
    }
    setWatchedHistory([]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 bg-purple-600/50 cursor-pointer hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-history"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 8l0 4l2 2" /><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" /></svg>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-18 h-full w-80 bg-[#0d0d14] border-r border-purple-800/30 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-purple-800/30 flex items-center justify-between">
          <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Dashboard
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2  cursor-pointer rounded-lg hover:bg-purple-500/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-purple-800/30">
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 cursor-pointer py-3 text-sm font-semibold transition-colors relative ${
              activeTab === "history" ? "text-purple-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            History
            {activeTab === "history" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex-1 py-3  cursor-pointer text-sm font-semibold transition-colors relative ${
              activeTab === "bookmarks" ? "text-purple-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Bookmarks
            {activeTab === "bookmarks" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 rounded-full" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 h-[calc(100%-120px)]">
          {activeTab === "history" && (
            <>
              {watchedHistory.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No watch history yet</p>
                  <p className="text-gray-600 text-xs mt-1">Episodes you watch will appear here</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500">{watchedHistory.length} items</span>
                    <button
                      onClick={clearAllHistory}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-2">
                    {watchedHistory.map((item) => (
                      <div key={item.id} className="bg-[#1a1a24] rounded-lg p-2 hover:bg-purple-900/20 transition-colors group relative">
                        <Link
                          to={`/Detail/${item.id}/${item.finder}`}
                          onClick={() => setIsOpen(false)}
                          className="flex gap-3"
                        >
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-12 h-16 object-cover rounded" />
                          ) : (
                            <div className="w-12 h-16 bg-gray-800 rounded flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{item.title}</p>
                            <p className="text-xs text-gray-400">Last watched: Episode {item.lastEpisode}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleDateString()}</p>
                          </div>
                        </Link>
                        <button
                          onClick={() => removeFromHistory(item.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/20"
                        >
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "bookmarks" && (
            <>
              {!isLoggedIn ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <p className="text-gray-500 text-sm">Login to save bookmarks</p>
                  <Link
                    to="/Register"
                    onClick={() => setIsOpen(false)}
                    className="inline-block mt-3 px-4 py-2 bg-purple-300 rounded-lg text-sm hover:bg-purple-400  text-black transition"
                  >
                    Sign In / Register
                  </Link>
                </div>
              ) : bookmarks.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No bookmarks yet</p>
                  <p className="text-gray-600 text-xs mt-1">Save anime you want to watch later</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((bookmark) => (
                    <Link
                      key={bookmark.id}
                      to={`/Detail/${bookmark.id}/${bookmark.finder}`}
                      onClick={() => setIsOpen(false)}
                      className="flex gap-3 bg-[#1a1a24] rounded-lg p-2 hover:bg-purple-900/20 transition-colors"
                    >
                      {bookmark.image ? (
                        <img src={bookmark.image} alt={bookmark.title} className="w-12 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-16 bg-gray-800 rounded flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{bookmark.title}</p>
                        {bookmark.type && <p className="text-xs text-gray-400">{bookmark.type}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-4 border-t border-purple-800/30 text-center">
          <p className="text-[10px] text-gray-600">Your watch history is saved locally</p>
          <p className="text-[10px] text-gray-600 mt-1">Bookmarks sync across devices when logged in</p>
        </div>
      </div>
    </>
  );
}

export default DashboardSidebar;