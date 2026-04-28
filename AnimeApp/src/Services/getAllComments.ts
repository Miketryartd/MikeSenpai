import { DynamicUrl } from "../Utils/DynamicUrl"

export const getAllComments = async (id: string, finder: string) => {

    try{
        const url  = `${DynamicUrl()}/mikesempai/api/auth/getComment/${id}/${finder}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) throw new Error("Problems getting comments, services");
        const d = await res.json();
        return d;
    } catch (err){
        console.error(err);
    }
}