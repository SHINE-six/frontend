'use client';

import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, Stars } from "@react-three/drei"
import Astronaut from "@/components/Astronaut"
import BioInfoBigAstronaut from "@/components/BioInfoBigAstronaut"
import Toolbox from "@/components/Toolbox";
// import Assistant from "@/components/Assistant";
import UIAbout from "@/components/UI-about";
import { useState } from 'react';

export default function AboutPage() {
  const [astronautPosition, setAstronautPosition] = useState({ x: 0, y: 0 });
  const [enableBike, setEnableBike] = useState(false);

  return (
    <div className="w-screen h-screen">
      <Canvas gl={{ alpha: false, antialias: true }} style={{ background: 'black' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={60} />
        <ambientLight intensity={1}/> 
        <directionalLight intensity={5} position={[9, 4, 4]} />

        {/* <Assistant/> */}
        <Astronaut onPositionUpdate={setAstronautPosition} enableBike={enableBike}/>
        <BioInfoBigAstronaut/>
        <Toolbox astronautPosition={astronautPosition}/>

        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={3} />
      </Canvas>
      <UIAbout setEnableBike={setEnableBike}/>
    </div>
  )
}