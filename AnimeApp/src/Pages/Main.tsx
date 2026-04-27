
import AnimeGenre from "../Components/AnimeGenre";
import BingeWorth from "../Components/Featured";
import Hero from "../Components/Hero";
import Nav from "../Components/Nav";
import TopRatedShowcase from "../Components/TopRatedShowcase";
import { useAnimeAll } from "../Hooks/useAnimeAll";
import fixlogo from "../assets/Images/5cb1c11b-5c0e-42cc-8c6a-c5039ba24543-removebg-preview.png";


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


          <div className="pt-10">
        <AnimeGenre/>  
      </div>

      <div>

        <BingeWorth/>
      </div>


      <div className="flex flex-col">
          <p>I WILL KEEP ADDING STUFF LATER, MEANWHILE PLS LIKE MY GIT REPO</p>
        <img className="h-30 w-30 object-cover" src={fixlogo}></img>
         <h1>Total anime: {anime}</h1>
      </div>
         
    </div>
        </>
    )
}

export default Main;