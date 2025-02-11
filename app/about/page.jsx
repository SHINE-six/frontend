'use client';

import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, Stars } from "@react-three/drei"
import Astronaut from "@/components/Astronaut"
import BioInfoBigAstronaut from "@/components/BioInfoBigAstronaut"
import Toolbox from "@/components/Toolbox";
import { useState } from 'react';

export default function AboutPage() {
  const [astronautPosition, setAstronautPosition] = useState({ x: 0, y: 0 });

  return (
    <div className="w-screen h-screen">
      <Canvas gl={{ alpha: false, antialias: true }} style={{ background: 'black' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={60} />
        <ambientLight intensity={1}/> 
        <directionalLight intensity={5} position={[9, 4, 4]} />
      
        <Astronaut onPositionUpdate={setAstronautPosition}/>
        <BioInfoBigAstronaut/>
        <Toolbox astronautPosition={astronautPosition}/>

        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={3} />
      </Canvas>
    </div>
  )
}