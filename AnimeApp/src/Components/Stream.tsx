

import type { StreamProps } from "../Types/Interface";


function Stream ({currentVideo}: StreamProps){

    return (

     <>
         <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
      
      {!currentVideo ? (
        <p className="text-gray-400">Select an episode</p>
      ) : (
        <iframe
          src={currentVideo}
          className="w-full h-full"
          allowFullScreen
        />
      )}

    </div>
     </>
    )
}

export default Stream;