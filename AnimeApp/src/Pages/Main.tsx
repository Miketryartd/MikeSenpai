import AnimeGenre from "../Components/AnimeGenre";
import AnimeKaiNewReleases from "../Components/AnimeKaiNewReleases";
import AnimeKaiTopRated from "../Components/AnimeKaiTopRated";
import AnimeKaiRecentlyAdded from "../Components/AnimeKaiRecentlyAdded";
import AnimeKaiLatestCompleted from "../Components/AnimeKaiLatestCompleted";
import BingeWorth from "../Components/Featured";
import Hero from "../Components/Hero";
import Nav from "../Components/Nav";
import TopRatedShowcase from "../Components/TopRatedShowcase";
import { useAnimeAll } from "../Hooks/useAnimeAll";
import fixlogo from "../assets/Images/5cb1c11b-5c0e-42cc-8c6a-c5039ba24543-removebg-preview.png";
import OverlayCard from "../Components/OverlayCard";

const HeroSkeleton = () => (
  <div className="w-full h-[400px] bg-gray-800 animate-pulse rounded-lg" />
);

const TopRatedSkeleton = () => (
  <div className="p-4">
    <div className="h-4 w-32 bg-gray-700 rounded animate-pulse mb-4" />
    <div className="flex gap-3 overflow-hidden">
      {Array(6).fill(null).map((_, i) => (
        <div key={i} className="shrink-0 w-32 rounded-lg overflow-hidden bg-gray-800 animate-pulse">
          <div className="aspect-[2/3] bg-gray-700" />
          <div className="p-2 space-y-1">
            <div className="h-2 bg-gray-700 rounded w-4/5" />
            <div className="h-2 bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GenreSkeleton = () => (
  <div className="p-4">
    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-4" />
    <div className="flex flex-wrap gap-2">
      {Array(12).fill(null).map((_, i) => (
        <div key={i} className="h-7 w-16 bg-gray-800 rounded-full animate-pulse" />
      ))}
    </div>
  </div>
);

const GridSkeleton = () => (
  <div className="p-4">
    <div className="h-4 w-28 bg-gray-700 rounded animate-pulse mb-4" />
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
      {Array(12).fill(null).map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden bg-gray-800 animate-pulse">
          <div className="aspect-[2/3] bg-gray-700" />
          <div className="p-2 space-y-1">
            <div className="h-2 bg-gray-700 rounded w-4/5" />
            <div className="h-2 bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PageSkeleton = () => (
  <div className="bg-[#0d0d14] w-full min-h-screen">
    <Nav />
    <div className="px-4 pt-2">
      <HeroSkeleton />
    </div>
    <div className="pt-10">
      <TopRatedSkeleton />
    </div>
    <div className="pt-10">
      <GenreSkeleton />
    </div>
    <div className="pt-4">
      <GridSkeleton />
    </div>
  </div>
);

function Main() {
  const { anime, loading, error } = useAnimeAll();

  if (loading) return <PageSkeleton />;
  if (error) return (
    <div className="bg-[#0d0d14] w-full min-h-screen flex items-center justify-center">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  return (
    <>
      <div className="bg-[#0d0d14] text-purple-500 w-full min-h-screen">
        <OverlayCard />
        <Nav />
        
        {/* Hero Section - Anipub (Spotlight) */}
        <div>
          <Hero />
        </div>

        {/* AnimeKai - Fresh Content (Visual Accent) */}
        <div className="mt-8">
          <AnimeKaiNewReleases />
        </div>

        {/* AnimeKai - Horizontal Scrollers (Visual Variety) */}
        <div className="mt-4">
          <AnimeKaiRecentlyAdded />
        </div>
        
        <div className="mt-2">
          <AnimeKaiLatestCompleted />
        </div>

        {/* Anipub - Main Content (Primary) */}
        <div className="pt-4">
          <TopRatedShowcase />
        </div>

        {/* AnimeKai - Top Rated (Visual Accent) */}
        <div className="pt-4">
          <AnimeKaiTopRated />
        </div>

        {/* Anipub - Genre Section (Primary) */}
        <div className="pt-10">
          <AnimeGenre />
        </div>

        {/* Anipub - Binge Worth Section (Primary) */}
        <div>
          <BingeWorth />
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-center py-12 border-t border-[#2d2d4a] mt-12">
          <p className="text-gray-500 text-sm tracking-wider mb-3">
            I WILL KEEP ADDING STUFF LATER, MEANWHILE PLS LIKE MY GIT REPO
          </p>
          <img className="h-24 w-24 object-cover rounded-full opacity-75 hover:opacity-100 transition-opacity duration-300" src={fixlogo} />
          <div className="mt-4 px-4 py-2 bg-purple-500/10 rounded-full">
            <h1 className="text-sm text-purple-400">Total anime in database: {anime}</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;