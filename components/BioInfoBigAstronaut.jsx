import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";

export default function BioInfoBigAstronaut() {
  const { scene } = useGLTF("/models/About/BioInfoBigAstronaut/scene-v1.glb");
  const groupRef = useRef();

  useEffect(() => {
    // Apply material properties to all meshes
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.roughness = 0.3
        obj.material.metalness = 0.8
      }
    })
  }, [scene])

  return (
    <group 
      ref={groupRef} 
      position={[10, -110, -25]}
      scale={[0.7, 0.7, 0.7]}
    >
      <primitive object={scene} />
    </group>
  )
}