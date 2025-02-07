import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Box } from "@react-three/drei"

export default function ContactSatellite({ position, setFocusedItem }) {
  const meshRef = useRef()

  useFrame((state) => {
    meshRef.current.rotation.y += 0.01
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2
  })

  return (
    <group position={position} onClick={() => setFocusedItem(meshRef.current)} name="contact">
      <Box ref={meshRef} args={[1, 0.5, 0.2]}>
        <meshStandardMaterial color="#ff00ff" emissive="#1f001f" metalness={0.8} roughness={0.2} />
      </Box>
      <Text position={[0, 0.5, 0]} fontSize={0.2} color="white">
        Contact
      </Text>
    </group>
  )
}

