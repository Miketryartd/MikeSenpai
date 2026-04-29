
import { useState, useEffect } from "react";
import logo from "../assets/Images/android-chrome-512x512.png";

function OverlayCard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenOverlay = sessionStorage.getItem("hasSeenSourceOverlay");
    if (!hasSeenOverlay) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("hasSeenSourceOverlay", "true");
  };

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={handleClose}
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-gradient-to-br from-[#16162a] to-[#0d0d14] border border-[#2d2d4a] rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 border-b border-[#2d2d4a]">
            <div className="flex items-center gap-3">
              <img className="h-12 w-12 object-cover rounded-full" src={logo} alt="logo" />
              <h2 className="text-lg font-bold text-white">Source Information</h2>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-300 text-sm mb-4">
              To help you know which anime source is reliable, we've added visual indicators:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl border border-green-500/30">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xl font-bold">✓</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-green-500/20 border border-green-500 rounded-full text-green-400 text-xs font-bold">WORKING</span>
                    <span className="text-white text-sm font-medium">Green Badge</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    Content from external server - fully functional and reliable
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-xl border border-orange-500/30">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <span className="text-orange-400 text-xl font-bold">⚠</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500 rounded-full text-orange-400 text-xs font-bold">UNSTABLE</span>
                    <span className="text-white text-sm font-medium">Orange Badge</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    Content from local server - may sometimes fail or be unavailable
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-3 bg-purple-800/10 rounded-xl border border-purple-500/30">
              <p className="text-purple-300 text-xs text-center">
                💡 If an anime doesn't load, try refreshing or check back later.
                <br />
                I'm working to improve source reliability!
              </p>
            </div>
          </div>
          
          <div className="p-4 border-t border-[#2d2d4a] bg-black/30">
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-800 hover:to-pink-700 rounded-xl text-white font-semibold text-sm transition-colors duration-200 cursor-pointer"
            >
              Got it, thanks! 
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OverlayCard;