
import { useAnimeAll } from "../Hooks/useAnimeAll";


function Main (){
    const {anime, loading, error} = useAnimeAll();
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

    return (
        <>
        <p>main</p>
         <h1>Total anime: {anime}</h1>
   
        </>
    )
}

export default Main;