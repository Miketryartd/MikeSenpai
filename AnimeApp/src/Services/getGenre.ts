

export const getGenre = async (genre: string | undefined, page: number | string) => {

    try{

        console.log(page)
        console.log(genre)
        const url = `http://localhost:3000/mikesenpai/api/findByGenre/${genre}?page=${page}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) throw new Error("Error getting genre");
        const data = await res.json();
        return data;
    } catch (err){
        console.error("Error fetching genre find by genre", err);
    }
}