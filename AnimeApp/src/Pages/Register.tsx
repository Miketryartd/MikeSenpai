import { useState } from "react";
import img from "../assets/Images/removebg.png";
import { useRegister } from "../Hooks/useRegister";
import { Link, useNavigate } from "react-router-dom";
import bglogo from "../assets/Images/angel-beats-yui-desktop-wallpaper-preview.jpg";

function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const nav = useNavigate();
  const { loading, error, register } = useRegister();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await register(email, password);
    if (data) {
      nav('/Main');
      return;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0d0d14]">
      <button 
        onClick={() => window.history.back()}
        className="fixed top-4 left-4 z-20 p-2 rounded-lg bg-[#16162a]/80 backdrop-blur-sm border border-purple-700 text-purple-400 hover:text-white hover:bg-purple-700 transition-all duration-300 cursor-pointer md:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l14 0" />
          <path d="M5 12l4 4" />
          <path d="M5 12l4 -4" />
        </svg>
      </button>

      <div
        className="hidden md:flex w-1/2 items-center justify-center relative bg-cover"
        style={{ backgroundImage: `url(${bglogo})` }}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black/80" />
        <img
          src={img}
          alt="logo"
          className="w-64 h-64 object-cover z-10 drop-shadow-2xl bg-purple-400/20 shadow-md shadow-purple-400 rounded-full"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 min-h-screen md:min-h-0">
        <div className="w-full max-w-md bg-[#16162a] border border-[#2d2d4a] rounded-2xl p-6 sm:p-8 shadow-xl">
          <button 
            onClick={() => window.history.back()}
            className="hidden md:flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors mb-6 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l14 0" />
              <path d="M5 12l4 4" />
              <path d="M5 12l4 -4" />
            </svg>
            <span className="text-sm">Back</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
            Create Account
          </h1>

          <p className="text-sm text-gray-400 text-center mb-8">
            Join and start watching anime
          </p>

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="MichaelOliverM18@gmail.com"
                className="mt-2 w-full p-3 rounded-lg bg-[#0d0d14] border outline-none border-[#2d2d4a] text-white focus:border-purple-700 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                className="mt-2 w-full p-3 rounded-lg bg-[#0d0d14] border outline-none border-[#2d2d4a] text-white focus:border-purple-700 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700 transition rounded-lg p-3 font-semibold text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="flex flex-row gap-1 mt-6 justify-center">
            <p className="text-sm text-gray-400">Already have an account?</p>
            <Link className="text-sm text-purple-400 hover:text-purple-300 transition" to='/Login'>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;