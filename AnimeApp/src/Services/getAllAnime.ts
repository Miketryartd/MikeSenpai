import { DynamicUrl } from "../Utils/DynamicUrl";

export async function getAllAnime(){
    
    try{
     const url = `${DynamicUrl()}/mikesenpai/api/animeAll`;
     const res = await fetch(url, {
       method: "GET",
       headers: {
         "Content-Type": "application/json"
       },
     });
     if (!res.ok) throw new Error(`${res.status}`);
     const data = await res.json();
     return data;
    } catch (error){
     console.error("Error fetching aall anime", error);
    }
}