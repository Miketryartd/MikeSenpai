export async function getAnimeInfo(idOrSlug: string) {
  const res = await fetch(`https://anipub.xyz/api/info/${idOrSlug}`);

  if (!res.ok) throw new Error(`${res.status}`);

  const data = await res.json();

  const fix = (p: string) =>
    p?.startsWith("http") ? p : `https://anipub.xyz/${p}`;

  data.ImagePath = fix(data.ImagePath);
  data.Cover = fix(data.Cover);

  return data;
}