import { PlaneGeometry, EdgesGeometry } from "three"
import { useRef, useState, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Plane, useGLTF } from "@react-three/drei"
import { HologramMaterial } from "./HologramMaterial.js"
import { useRouter } from "next/navigation.js"

export default function CentralHub() {
  const groupRef = useRef()
  const gltfRef = useRef()
  const { scene } = useGLTF("/models/Hero/Shaded/central-hub.glb")

  const planeGeometry = new PlaneGeometry(15, 6)
  const edges = new EdgesGeometry(planeGeometry)

  useEffect(() => {
    // Apply material properties to all meshes
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.roughness = 0.3
        obj.material.metalness = 0.3
        obj.material.emissive.set("#ffffff")
        obj.material.emissiveIntensity = 1.5
      }
    })
  }, [scene])

  useFrame((state) => {
    gltfRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.3
  })

  return (
    <group
      ref={groupRef}
      name="about"
      position={[0, 2, 0]}
    >
      {/* <Billboard position={[0, 0, 0]}> */}
        <primitive 
          object={scene} 
          ref={gltfRef} 
          scale={[2.6, 2.6, 2.6]} 
          position={[-3.5, -2, 2]} 
          rotation={[0.1, 0, 0]}
        />
        {scene.traverse((child) => {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = 0.85; // Set the desired opacity here
          }
        })}
        <lineSegments position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <primitive object={edges} />
          <lineBasicMaterial color="#00ffff" linewidth={2} />
        </lineSegments>

        <HoloIDCard position={[0,0,0]} />
      {/* </Billboard> */}

    </group>
  )
}



function HoloIDCard({ position }) {
  const router = useRouter()
  const cardRef = useRef()
  const material = useMemo(() => new HologramMaterial(), [])
  const buttonRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Rotate or pulse the card slightly
  useFrame((state) => {
    // cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    material.uniforms.time.value = state.clock.elapsedTime
  })

  return (
    <group ref={cardRef} position={position}>
      <Plane args={[15, 6]} >
        <hologramMaterial 
          attach="material" 
          color="#8E44AD"
          opacity={0.3} 
          transparent={true}
        />
      </Plane>
      <group position={[1.5, 2.5, 0.01]}>
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

        <group ref={buttonRef} position={[1, -4.7, 0]}>
          {/* Background glow */}
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[7.4, 0.8]} />
            <meshBasicMaterial 
              color="#00ffff"
              opacity={hovered ? 0.2 : 0.1}
              transparent
              blending={2}
            />
          </mesh>

          {/* Main button */}
          <mesh
            onClick={() => router.push("/about")}
            onPointerOver={(e) => {
              document.body.style.cursor = 'pointer'
              setHovered(true)
              e.object.scale.set(1.05, 1.05, 1.05)
            }}
            onPointerOut={(e) => {
              document.body.style.cursor = 'auto'
              setHovered(false)
              e.object.scale.set(1, 1, 1)
            }}
          >
            <planeGeometry args={[7, 0.5]} />
            <meshPhongMaterial 
              color={hovered ? "#4a4a4a" : "#2a2a2a"}
              emissive={hovered ? "#00ffff" : "#001111"}
              emissiveIntensity={hovered ? 0.4 : 0.2}
              transparent
              opacity={0.9}
              shininess={100}
            />
          </mesh>

          {/* Border */}
          <lineSegments>
            <edgesGeometry args={[new PlaneGeometry(7, 0.5)]} />
            <lineBasicMaterial color="#00ffff" transparent opacity={hovered ? 0.8 : 0.4} />
          </lineSegments>

          {/* Text */}
          <Text
            fontSize={0.25}
            color={hovered ? "#ffffff" : "#aaffff"}
            anchorX="center"
            anchorY="center"
            position={[0, 0.15, 0.01]}
            maxWidth={5}
          >
            MORE DETAILS ›
          </Text>
        </group>

        {/* Could add more lines:
            - "Location: Earth"
            - "Tech Stack: React, R3F, Node, etc."
            - "Current Status: Exploring new galaxies of code!"
        */}
      </group>
    </group>
  )
}

