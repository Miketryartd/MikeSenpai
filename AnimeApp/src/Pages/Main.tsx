
import Hero from "../Components/Hero";
import Nav from "../Components/Nav";
import TopRatedShowcase from "../Components/TopRatedShowcase";
import { useAnimeAll } from "../Hooks/useAnimeAll";


function Main (){
    const {anime, loading, error} = useAnimeAll();
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <>
        <div className="bg-[#0d0d14] text-purple-500 w-full min-h-screen">
        
        <Nav/>

        <div>
          <Hero/>
        </div>
          <div className="pt-10">
            <TopRatedShowcase/>
          </div>

        <p>main</p>
         <h1>Total anime: {anime}</h1>
         
    </div>
        </>
    )
}

export default Main;