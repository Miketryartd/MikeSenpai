import { DynamicUrl } from "../Utils/DynamicUrl";


export const getInfo = async (id: number | string) => {

    try{
        const url = `${DynamicUrl()}/mikesenpai/api/getInfo/${id}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const d = await res.json();
        return d;
    } catch (err){
        console.error("Error fetching api from backend", err);
    }
}