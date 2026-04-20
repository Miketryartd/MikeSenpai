import { useState } from "react";
import { useSearchAnime } from "../Hooks/useSearchAnime";
import AnimeWrapper from "./AnimeWrapper";
import logo from "../assets/Images/logo.png"
function SearchAnime() {
  const [query, setQuery] = useState("");
  const { results, search, loading, error } = useSearchAnime();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className=" bg-[#0d0d14] font-sans">


      <div className="max-w-5xl mx-auto">

        <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d4a]">

        <div className="flex items-center gap-3">

<img src={logo} className="h-20 w-20 object-cover rounded-full" />

<div className="flex flex-col">
  <span className="text-lg font-bold tracking-[3px] uppercase text-purple-400">
    ⟨ Mike Senpai ⟩
  </span>
  <span className="text-[10px] text-gray-600 tracking-widest mt-0.5">
    find your next obsession
  </span>
</div>

</div>

          <form
            onSubmit={handleSubmit}
            className="flex border border-purple-800 rounded-lg overflow-hidden bg-[#16162a]"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anime title..."
              className="bg-transparent outline-none px-4 py-2 text-gray-200 placeholder-gray-600 text-sm w-120"
            />
            <button
              type="submit"
              className="cursor-pointer bg-purple-700 hover:bg-purple-600 px-4 text-white font-semibold uppercase tracking-widest text-xs transition-colors"
            >
              Search
            </button>
          </form>

      
          <button className="cursor-pointer border border-purple-700 text-purple-400 hover:bg-purple-700 hover:text-white px-5 py-2 rounded-lg text-sm font-semibold uppercase tracking-widest transition-colors">
            Sign Up
          </button>

        </nav>

        <div className="px-6 py-6">
          {loading && <p className="text-center text-gray-500 tracking-widest text-sm">Loading...</p>}
          {error && <p className="text-center text-red-400 text-sm">{error}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((a, i) => (
              <AnimeWrapper key={i} Name={a.Name} Image={a.Image} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SearchAnime;