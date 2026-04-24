



export const getDetailAnime = async (id: number | string) => {

    try{
        
        const url = `http://localhost:3000/mikesenpai/api/getAnimeDetail/${id}`;
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