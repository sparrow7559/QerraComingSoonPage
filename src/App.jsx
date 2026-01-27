import React from "react";
import VideoParticleMorph from "./comingSoon";
import ComingSoonText from "./ComingSoonText";

const App = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative z-20">
        <ComingSoonText />
      </div>
      <div className="pointer-events-none absolute top-1/2 left-0 right-0 z-10 h-96 -translate-y-1/2">
        {/* <VideoParticleMorph /> */}
      </div>
    </div>
  );
};

export default App;
