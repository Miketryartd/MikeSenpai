import { useState } from "react";
import { useSearchAnime } from "../Hooks/useSearchAnime";

function SearchAnime() {
  const [query, setQuery] = useState("");
  const { results, search, loading, error } = useSearchAnime();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Go</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ul>
        {results.map((a, i) => (
          <li key={i}>{a.Name}</li>
        ))}
      </ul>
    </>
  );
}

export default SearchAnime;