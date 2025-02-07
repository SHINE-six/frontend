import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Octahedron } from "@react-three/drei"

export default function BlogArchive({ position, setFocusedItem }) {
  const groupRef = useRef()

  useFrame((state) => {
    groupRef.current.rotation.y += 0.007
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2
  })

  return (
    <group ref={groupRef} position={position} onClick={() => setFocusedItem(groupRef.current)} name="blog">
      <Octahedron args={[0.7]}>
        <meshStandardMaterial color="#ffff00" emissive="#1f1f00" metalness={0.5} roughness={0.3} />
      </Octahedron>
      <Text position={[0, 1, 0]} fontSize={0.2} color="white">
        Blog
      </Text>
    </group>
  )
}

