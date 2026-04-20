import React, { useState } from "react";



function SearchAnime () {
   
    const [query, setQuery] = useState<string>('');
    const handleSearch = async (e: React.FormEvent) => {
           e.preventDefault();

           try{
              const cleanedQuery = query.trim();
              const url = `http://localhost:3000/mikesenpai/api/searchAnime/${encodeURIComponent(cleanedQuery)}`;
              const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
              });

              const data  = await res.json();
              if (!data) throw new Error("Error searching anime");
              console.log(data);
           } catch (error){
            console.error("Error server error", error);
           }
    }
    return (
        <>
        <div>
            <form method="GET" onSubmit={handleSearch} className="w-full flex flex-row" >
                <input type="text" placeholder="Search anime..." onChange={(e) => setQuery(e.target.value)}></input>
                <button type="submit">Go</button>
            </form>
        </div>
        </>
    )
}

export default SearchAnime;