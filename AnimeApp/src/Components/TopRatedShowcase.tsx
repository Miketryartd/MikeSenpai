import { useTopRated } from "../Hooks/useTopRated";

function TopRatedShowcase() {
  const { results, loading, error } = useTopRated();

  return (
    <div className="m-20">
      <h1>Top rated</h1>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p>No anime found.</p>
      )}

<div className="relative overflow-hidden rounded-md">
  

  {results[0] && (
    <img
      src={results[0].ImagePath}
      className="absolute inset-0 w-full h-full object-cover blur-xl opacity-100 rounded-full"
    />
  )}

 
  <div className="absolute inset-0  bg-purple-300/10 rounded-full " />


  <div className="relative overflow-x-auto scroll-smooth w-full  ">
    <div className="flex gap-4 ">
      {results.map((a) => (
        <div
          key={a._id}
          className="min-w-[260px] bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-3 flex-shrink-0 m-5 shadow-lg"
        >
          <img
            src={a.ImagePath}
            alt={a.Name}
            className="w-full h-60 object-cover rounded-md"
          />
          <div>
          <h1 className="text-sm mt-2 text-white">{a.Name}</h1>
          <h2>{a.MALScore}</h2>
          <h2>{a.RatingsNum}</h2>
          <h2>{a.DescripTion.slice(0, 40) + "..."}</h2>
            </div>
        </div>
      ))}
    </div>
  </div>

</div>
       
    </div>
  );
}

export default TopRatedShowcase;