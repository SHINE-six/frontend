import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, useGLTF } from "@react-three/drei"

function ProjectSphere({ index, total, setFocusedItem, model }) {
  const groupRef = useRef()
  const { scene } = useGLTF(model.path)
  const color = "#000000"
  const angle = (index / total) * Math.PI * 2
  const radius = 12
  const tiltAngle = Math.PI * -0.15

  useEffect(() => {
    // Apply material properties to all meshes
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.roughness = 0.2
        obj.material.metalness = 0.8

        if (model.bloom) {
          obj.layers.enable(1)
          obj.material.emissive.set(color)
          obj.material.emissiveIntensity = 1
        }
      }
    })
  }, [scene, color, model.bloom])
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const orbitSpeed = 0.1
    const currentAngle = angle + t * orbitSpeed
    
    groupRef.current.position.x = Math.cos(currentAngle) * radius
    groupRef.current.position.y = Math.sin(currentAngle) * radius * Math.sin(tiltAngle) + 2
    groupRef.current.position.z = Math.sin(currentAngle) * radius * Math.cos(tiltAngle)
    
    groupRef.current.rotation.y += 0.01
  })

  return (
    <group
      ref={groupRef}
      name={`project-${index}`}
      onClick={(e) => {
        e.stopPropagation()
        console.log('clicked')
        setFocusedItem(groupRef.current)
      }}
      onPointerOver={(e) => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = 'default'
      }}
    >
      <primitive 
        object={scene} 
        scale={[0.5, 0.5, 0.5]}
      />
      {/* Invisible box */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      <Text position={[0, 2, 0]} fontSize={0.2} color="white">
        Project {index + 1}
      </Text>
    </group>
  )
}

const availableGLTFs = [
  {
    'path': "/models/Projects/ancient_egypt_civilization_island_downloadable.glb",
    'bloom': true
  },
  {
    'path': "/models/Projects/cheese_moon.glb",
    'bloom': true
  },
  {
    'path': "/models/Projects/satellite.glb",
    'bloom': true
  },
  {
    'path': "/models/Projects/simple_satellite_low_poly_free.glb",
    'bloom': true
  }
]

export default function PortfolioSpheres({ count, setFocusedItem }) {
  // Preload all GLTF models
  availableGLTFs.forEach(path => useGLTF.preload(path))
  
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProjectSphere 
          key={i} 
          index={i} 
          total={count} 
          setFocusedItem={setFocusedItem}
          model={availableGLTFs[i % availableGLTFs.length]}
        />
      ))}
    </>
  )
}