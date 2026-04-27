import { DynamicUrl } from "../Utils/DynamicUrl";



export const getStreamLinks = async (id: number | string) => {

    try{

        const url = `${DynamicUrl()}/mikesenpai/api/getStream/${id}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) throw new Error("Error fetching api from backend");
        const data = await res.json();
        return data;
    } catch (error){
        console.error("Error fetching api from backend, serevr error rpobably", error);
    }
}