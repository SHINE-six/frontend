import { useEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, useGLTF } from "@react-three/drei"

function ProjectSphere({ index, total, setFocusedItem, project }) {
  const groupRef = useRef()
  const { scene } = useGLTF(project.model.model_path)
  const color = "#000000"
  const angle = (index / total) * Math.PI * 2
  const radius = 14
  const tiltAngle = Math.PI * -0.15

  useEffect(() => {
    // Apply material properties to all meshes
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.roughness = 0.2
        obj.material.metalness = 0.8

        if (project.model.bloom) {
          obj.layers.enable(1)
          obj.material.emissive.set(color)
          obj.material.emissiveIntensity = 1
        }
      }
    })
  }, [scene, color, project.model.bloom])
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const orbitSpeed = 0.15
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
        {project.name}
      </Text>
    </group>
  )
}

export default function PortfolioSpheres({ projects, setFocusedItem }) {
  // Preload all GLTF models
  projects.forEach(project => useGLTF.preload(project.model.model_path))
  
  return (
    <>
      {projects.map((project, i) => (
        <ProjectSphere 
          key={i} 
          index={i} 
          total={projects.length} 
          setFocusedItem={setFocusedItem}
          project={project}
        />
      ))}
    </>
  )
}