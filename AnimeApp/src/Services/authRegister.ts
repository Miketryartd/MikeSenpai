import { DynamicUrl } from "../Utils/DynamicUrl";



export const authRegister = async (email: string, password: string) => {

    try{

        const url = `${DynamicUrl()}/mikenichan/api/auth/register`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        });
        if (!res.ok) throw new Error("Error creating acc");
        const data = await res.json();

        return data;
    } catch (err){
        console.error("ERRor creating account", err);
    }
}