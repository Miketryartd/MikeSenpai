import { useTopRated } from "../Hooks/useTopRated";
import topratedLogo from "../assets/Images/junko.png";
import WatchOverlay from "./WatchOverlay";
function TopRatedShowcase() {
  const { results, loading, error } = useTopRated();

  return (
    <div className="">
  <div className="flex items-center gap-3 px-4 py-2">

<h1 className="text-xl font-semibold text-white">
  Top Rated Anime
</h1>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="currentColor"
  className="w-5 h-5 text-purple-400"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 1.67a2.914 2.914 0 0 0 -2.492 1.403l-8.11 13.537a2.914 2.914 0 0 0 2.484 4.385h16.225a2.914 2.914 0 0 0 2.503 -4.371l-8.116 -13.546a2.917 2.917 0 0 0 -2.494 -1.408z" />
</svg>

<img
  src={topratedLogo}
  className="h-20 w-20 object-cover rounded-md"
/>

</div>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && results.length === 0 && (
        <p>No anime found.</p>
      )}

<div className="relative overflow-hidden rounded-md">
  

  {results[0] && (
    <img
      src={results[0].ImagePath}
      className="absolute inset-0 w-full h-full object-cover blur-xl opacity-70 "
    />
  )}

 
  <div className="absolute inset-0   " />



  <div className="relative overflow-x-auto scroll-smooth w-full  ">

    <div className="flex gap-4 ">

      {results.map((a) => (
          
        <div
          key={a._id}
          className="min-w-80 w-10 min-h-110 h-100 rounded-md bg-black/30 backdrop-blur-lg backdrop-blur-lg p-3 flex-shrink-0 m-5 shadow-lg"
        >
      
      <WatchOverlay 
  key={a._id} 
  id={a._id} 
  finder={a.finder}
>
  <img
    src={a.ImagePath}
    alt={a.Name}
    className="w-full h-60 object-cover rounded-md"
  />
</WatchOverlay>
       
          <div>
          <h1 className="text-lg font-bold mt-2 text-white">{a.Name}</h1>
          <h2 className="flex items-center gap-1 text-sm mt-2 text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="orange" className="icon icon-tabler icons-tabler-filled icon-tabler-device-tv"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8.707 2.293l3.293 3.292l3.293 -3.292a1 1 0 0 1 1.32 -.083l.094 .083a1 1 0 0 1 0 1.414l-2.293 2.293h4.586a3 3 0 0 1 3 3v9a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3 -3v-9a3 3 0 0 1 3 -3h4.585l-2.292 -2.293a1 1 0 0 1 1.414 -1.414" /></svg>{a.MALScore}</h2>
          <h2 className="flex items-center gap-1 text-sm mt-2 text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="yellow" className="icon icon-tabler icons-tabler-filled icon-tabler-star"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" /></svg>{a.RatingsNum}</h2>
          <h2 className="text-sm mt-2 text-white"> {a.DescripTion.slice(0, 60) + "..."}</h2>
          <h2>{a.Genres}</h2>
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