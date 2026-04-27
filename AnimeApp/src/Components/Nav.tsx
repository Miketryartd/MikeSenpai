import { useState, useRef, useEffect } from "react";
import { useSearchAnime } from "../Hooks/useSearchAnime";
import AnimeWrapper from "./AnimeCard";
import logo from "../assets/Images/logo.png";
import { Link } from "react-router";

function Nav() {
  const [query, setQuery] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { results, search, loading, error } = useSearchAnime();
  const navRef = useRef<HTMLDivElement>(null); 

 const token = sessionStorage.getItem("token");
const isLoggedIn = !!token;

const getUserFromToken = (jwt: string) => {
  try {
    
    const payload = jwt.split(".")[1];
    
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const user = token ? getUserFromToken(token) : null;
const email = user?.email;
const real_name = email.slice(0, 1).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
     
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    
    document.addEventListener("mousedown", handleClickOutside);

 
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
    setMenuOpen(false);
  };

  return (

    <div ref={navRef} className="bg-[#0d0d14] font-sans w-full">
      <div className="max-w-10xl mx-auto">

        <nav className="flex items-center justify-between px-6 py-4 border-b border-[#2d2d4a]">
          <div className="flex items-center gap-3">
            <img src={logo} className="h-20 w-20 object-cover rounded-full" />
            <div className="flex flex-col">
              <Link to='/Main'>
                <span className="text-lg font-bold tracking-[3px] uppercase text-purple-400">
                  ⟨ Mike Senpai ⟩
                </span>
                <span className="text-[10px] text-gray-600 tracking-widest m-5">
                  Please follow my github
                </span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSubmit} className="flex border border-purple-800 rounded-lg overflow-hidden bg-[#16162a]">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anime title..."
                className="bg-transparent outline-none px-4 py-2 text-gray-200 placeholder-gray-600 text-sm w-64"
              />
              <button type="submit" className="cursor-pointer bg-purple-700 hover:bg-purple-600 px-4 text-white font-semibold uppercase tracking-widest text-xs transition-colors">
                Search
              </button>
            </form>

            <a href="https://github.com" className="cursor-pointer border border-purple-700 text-purple-400 hover:bg-purple-700 hover:text-white px-3 py-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M5.315 2.1c.791 -.113 1.9 .145 3.333 .966l.272 .161l.16 .1l.397 -.083a13.3 13.3 0 0 1 4.59 -.08l.456 .08l.396 .083l.161 -.1c1.385 -.84 2.487 -1.17 3.322 -1.148l.164 .008l.147 .017l.076 .014l.05 .011l.144 .047a1 1 0 0 1 .53 .514a5.2 5.2 0 0 1 .397 2.91l-.047 .267l-.046 .196l.123 .163c.574 .795 .93 1.728 1.03 2.707l.023 .295l.007 .272c0 3.855 -1.659 5.883 -4.644 6.68l-.245 .061l-.132 .029l.014 .161l.008 .157l.004 .365l-.002 .213l-.003 3.834a1 1 0 0 1 -.883 .993l-.117 .007h-6a1 1 0 0 1 -.993 -.883l-.007 -.117v-.734c-1.818 .26 -3.03 -.424 -4.11 -1.878l-.535 -.766c-.28 -.396 -.455 -.579 -.589 -.644l-.048 -.019a1 1 0 0 1 .564 -1.918c.642 .188 1.074 .568 1.57 1.239l.538 .769c.76 1.079 1.36 1.459 2.609 1.191l.001 -.678l-.018 -.168a5.03 5.03 0 0 1 -.021 -.824l.017 -.185l.019 -.12l-.108 -.024c-2.976 -.71 -4.703 -2.573 -4.875 -6.139l-.01 -.31l-.004 -.292a5.6 5.6 0 0 1 .908 -3.051l.152 -.222l.122 -.163l-.045 -.196a5.2 5.2 0 0 1 .145 -2.642l.1 -.282l.106 -.253a1 1 0 0 1 .529 -.514l.144 -.047l.154 -.03z"/>
              </svg>
            </a>

          {isLoggedIn ? (
            <p className="border rounded-full  bg-gray-600 w-10 h-10 p-2 text-center">{real_name}</p>
          ): (
             <Link to='/Register' className="cursor-pointer border border-purple-700 text-purple-400 hover:bg-purple-700 hover:text-white px-5 py-2 rounded-lg text-sm font-semibold uppercase tracking-widest transition-colors">
            Sign up
            </Link>
          )}
          </div>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-6 h-0.5 bg-purple-400 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-purple-400 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-purple-400 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </nav>

        {menuOpen && (
          <div className="md:hidden bg-[#0d0d14] border-b border-[#2d2d4a] px-6 py-4 flex flex-col gap-4">
            <form onSubmit={handleSubmit} className="flex border border-purple-800 rounded-lg overflow-hidden bg-[#16162a]">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anime title..."
                className="bg-transparent outline-none px-4 py-2 text-gray-200 placeholder-gray-600 text-sm flex-1"
              />
              <button type="submit" className="cursor-pointer bg-purple-700 hover:bg-purple-600 px-4 text-white font-semibold uppercase tracking-widest text-xs transition-colors">
                Search
              </button>
            </form>

            <div className="flex items-center justify-between">
              <a href="https://github.com" className="cursor-pointer border border-purple-700 text-purple-400 hover:bg-purple-700 hover:text-white px-3 py-2 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M5.315 2.1c.791 -.113 1.9 .145 3.333 .966l.272 .161l.16 .1l.397 -.083a13.3 13.3 0 0 1 4.59 -.08l.456 .08l.396 .083l.161 -.1c1.385 -.84 2.487 -1.17 3.322 -1.148l.164 .008l.147 .017l.076 .014l.05 .011l.144 .047a1 1 0 0 1 .53 .514a5.2 5.2 0 0 1 .397 2.91l-.047 .267l-.046 .196l.123 .163c.574 .795 .93 1.728 1.03 2.707l.023 .295l.007 .272c0 3.855 -1.659 5.883 -4.644 6.68l-.245 .061l-.132 .029l.014 .161l.008 .157l.004 .365l-.002 .213l-.003 3.834a1 1 0 0 1 -.883 .993l-.117 .007h-6a1 1 0 0 1 -.993 -.883l-.007 -.117v-.734c-1.818 .26 -3.03 -.424 -4.11 -1.878l-.535 -.766c-.28 -.396 -.455 -.579 -.589 -.644l-.048 -.019a1 1 0 0 1 .564 -1.918c.642 .188 1.074 .568 1.57 1.239l.538 .769c.76 1.079 1.36 1.459 2.609 1.191l.001 -.678l-.018 -.168a5.03 5.03 0 0 1 -.021 -.824l.017 -.185l.019 -.12l-.108 -.024c-2.976 -.71 -4.703 -2.573 -4.875 -6.139l-.01 -.31l-.004 -.292a5.6 5.6 0 0 1 .908 -3.051l.152 -.222l.122 -.163l-.045 -.196a5.2 5.2 0 0 1 .145 -2.642l.1 -.282l.106 -.253a1 1 0 0 1 .529 -.514l.144 -.047l.154 -.03z"/>
                </svg>
              </a>
              <Link to='/Signup' onClick={() => setMenuOpen(false)} className="cursor-pointer border border-purple-700 text-purple-400 hover:bg-purple-700 hover:text-white px-5 py-2 rounded-lg text-sm font-semibold uppercase tracking-widest transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        )}

        <div className={`px-6 py-6 transition-all duration-300 ${
          results.length === 0 ? "h-0 overflow-hidden" : "max-h-[500px] overflow-y-auto"
        }`}>
          {loading && <p className="text-center text-gray-500 tracking-widest text-sm">Loading...</p>}
          {error && <p className="text-center text-red-400 text-sm">{error}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 z-100">
            {results.map((a, i) => (
              <AnimeWrapper key={i} Id={a.Id} finder={a.finder} Name={a.Name} Image={a.Image} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Nav;