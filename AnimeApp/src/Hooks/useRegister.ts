import { authRegister } from "../Services/authRegister";
import {  useState } from "react";


export const useRegister = () => {
 
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (email: string, password: string) => {
           try{
               setLoading(true)
               setError(null);

               const data = await authRegister(email, password);
                 sessionStorage.setItem("token", data.token);
               return data;
           } catch (err: any){
            console.error("Error registering user ", err);
            setError("Error connecting with service");
           
           } finally {
            setLoading(false);
           }
    }

    return {loading, error, register}
    
}
