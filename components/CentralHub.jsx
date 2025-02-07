import { PlaneGeometry, EdgesGeometry } from "three"
import { useRef, useState, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Plane, useGLTF } from "@react-three/drei"
import { HologramMaterial } from "./HologramMaterial.js"

export default function CentralHub({ setFocusedItem }) {
  const groupRef = useRef()
  const gltfRef = useRef()
  const gltf = useGLTF("/models/Hero/Shaded/central-hub.glb")
  const [hovered, setHovered] = useState(false)

  const planeGeometry = new PlaneGeometry(15, 6)
  const edges = new EdgesGeometry(planeGeometry)

  useFrame((state) => {
    gltfRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.3
  })

  return (
    <group
      ref={groupRef}
      name="about"
      // onClick={() => setFocusedItem(groupRef.current)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      position={[0, 2, 0]}
    >
      {/* <Billboard position={[0, 0, 0]}> */}
        <primitive 
          object={gltf.scene} 
          ref={gltfRef} 
          scale={[2.6, 2.6, 2.6]} 
          position={[-3.5, -2, 2]} 
          rotation={[0.1, 0, 0]}
        />
        {gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = 0.85; // Set the desired opacity here
          }
        })}
        <lineSegments position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <primitive object={edges} />
          <lineBasicMaterial color="#00ffff" linewidth={2} />
        </lineSegments>

        <HoloIDCard hovered={hovered} position={[0,0,0]} />
      {/* </Billboard> */}

      {/* ==== Holographic Info Card ==== */}
    </group>
  )
}



function HoloIDCard({ hovered, position }) {
  const cardRef = useRef()
  const material = useMemo(() => new HologramMaterial(), [])

  // Rotate or pulse the card slightly
  useFrame((state) => {
    // cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    material.uniforms.time.value = state.clock.elapsedTime
  })

  return (
    <group ref={cardRef} position={position}>
      <Plane args={[15, 6]} >
        <hologramMaterial attach="material" color="#8E44AD" opacity={0.3} transparent={true}/>
      </Plane>
      <group position={[1.5, 2.2, 0.01]}>
        {/* ID Row */}
        <Text
          fontSize={0.3}
          color="#ffffff"
          anchorX="left"
          anchorY="top"
          position={[-2.5, 0, 0]}
        >
          ID
        </Text>
        <Text
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          position={[-0.5, 0, 0]}
        >
          :
        </Text>
        <Text
          fontSize={0.3}
          color="#ffffff"
          anchorX="left"
          anchorY="top"
          position={[0, 0, 0]}
        >
          000001
        </Text>

        {/* Name Row */}
        <Text
          fontSize={0.3}
          color="#ffffff"
          anchorX="left"
          anchorY="top"
          position={[-2.5, -0.6, 0]}
        >
          Name
        </Text>
        <Text
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          position={[-0.5, -0.6, 0]}
        >
          :
        </Text>
        <Text
          fontSize={0.3}
          color="#ffffff"
          anchorX="left"
          anchorY="top"
          position={[0, -0.6, 0]}
        >
          Desmond Foo
        </Text>

        {/* Role Row */}
        <Text
          fontSize={0.3}
          color="#ffffff"
          anchorX="left"
          anchorY="top"
          position={[-2.5, -1.2, 0]}
        >
          Role
        </Text>
        <Text
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          position={[-0.5, -1.2, 0]}
        >
          :
        </Text>
        <Text
          fontSize={0.3}
          color="#ffffff"
          anchorX="left"
          anchorY="top"
          position={[0, -1.2, 0]}
          maxWidth={5.5}
        >
          Full Stack Developer, DevOps Engineer, ML Engineer
        </Text>

        {/* Description Row */}
        <Text
          fontSize={0.3}
          color="#aaffff"
          anchorX="left"
          anchorY="top"
          position={[-2.5, -2.2, 0]}
        >
          Description
        </Text>
        <Text
          fontSize={0.3}
          color="#aaffff"
          anchorX="center"
          anchorY="top"
          position={[-0.5, -2.2, 0]}
        >
          :
        </Text>
        <Text
          fontSize={0.3}
          color="#aaffff"
          anchorX="left"
          anchorY="top"
          position={[0, -2.2, 0]}
          maxWidth={5}
        >
          Building immersive web experiences with React, Three.js & WebGL.
        </Text>

        {/* Location Row */}
        <Text
          fontSize={0.3}
          color="#aaffff"
          anchorX="left"
          anchorY="top"
          position={[-2.5, -3.6, 0]}
        >
          Location
        </Text>
        <Text
          fontSize={0.3}
          color="#aaffff"
          anchorX="center"
          anchorY="top"
          position={[-0.5, -3.6, 0]}
        >
          :
        </Text>
        <Text
          fontSize={0.3}
          color="#aaffff"
          anchorX="left"
          anchorY="top"
          position={[0, -3.6, 0]}
          maxWidth={5}
        >
          Earth 🌍
        </Text>
        {/* Could add more lines:
            - "Location: Earth"
            - "Tech Stack: React, R3F, Node, etc."
            - "Current Status: Exploring new galaxies of code!"
        */}
      </group>
    </group>
  )
}

