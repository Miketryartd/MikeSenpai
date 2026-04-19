export async function getAnimeInfo(idOrSlug: string) {
  
  try{
    const res = await fetch(`https://anipub.xyz/api/info/${idOrSlug}`);

    if (!res.ok) throw new Error(`${res.status}`);
  
    const data = await res.json();
  
    const fix = (p: string) =>
      p?.startsWith("http") ? p : `https://anipub.xyz/${p}`;
  
    data.ImagePath = fix(data.ImagePath);
    data.Cover = fix(data.Cover);
  
    return data;
  } catch (error){
    console.error('Error fetching anime info', error);
  }
}


export async function getAllAnime(){
    
     try{
      const url = `https://anipub.xyz/api/getAll`;
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