

export async function getTopRated (){

    try{

        const url = `http://localhost:3000/mikesenpai/api/topRated`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) throw new Error("error W RESPONSE");
        const data = await res.json();
        return data;

    } catch (error){
        console.error("Error fw da data", error);
    }
}