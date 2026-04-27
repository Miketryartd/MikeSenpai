  import { useState } from "react";
  import img from "../assets/Images/removebg.png";
  import { useRegister } from "../Hooks/useRegister";
  import { useNavigate } from "react-router-dom";

  function Register() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const nav = useNavigate();
    const { loading, error, register } = useRegister();

    const handleRegister =  (e: React.FormEvent) => {
      e.preventDefault();
      
        register(email, password);
        nav('/Main');
        return;
    };

    return (
      <div className="min-h-screen w-full flex bg-[#0d0d14]">

        <div className="hidden md:flex w-1/2 items-center justify-center bg-purple-900/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black/80" />

          <img
            src={img}
            alt="logo"
            className="w-64 h-64 object-cover z-10 drop-shadow-2xl bg-purple-400 rounded-full"
          />
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-6">

          <div className="w-full max-w-md bg-[#16162a] border border-[#2d2d4a] rounded-2xl p-8 shadow-xl">

            <h1 className="text-3xl font-bold text-white text-center mb-2">
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
                  type="email"
                  placeholder="MichaelOliverM18@gmail.com"
                  className="mt-2 w-full p-3 rounded-lg bg-[#0d0d14] border border-[#2d2d4a] text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Password</label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="mt-2 w-full p-3 rounded-lg bg-[#0d0d14] border border-[#2d2d4a] text-white"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700 transition rounded-lg p-3 font-semibold text-white mt-2 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

            </form>

          </div>
        </div>

      </div>
    );
  }

  export default Register;