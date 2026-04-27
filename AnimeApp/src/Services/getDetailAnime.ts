import { DynamicUrl } from "../Utils/DynamicUrl";




export const getDetailAnime = async (id: number | string) => {

    try{
        
        const url = `${DynamicUrl()}/mikesenpai/api/getAnimeDetail/${id}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) throw new Error("Error fetching url from backend");
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching data from backend/ possible server error", error);
    }

}