import { useEffect, useRef, useMemo } from 'react'
import { useGLTF } from "@react-three/drei"
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

export default function Assistant() {
  const meshRef = useRef()
  const { nodes } = useGLTF('/Hero/Shaded/central-hub.glb')
  const count = 2000 // number of particles
  const dummy = new THREE.Object3D()
  
  // Sample positions from the 3D model
  const modelPositions = useMemo(() => {
    const positions = nodes.geometry.attributes.position.array
    const sampledPositions = []
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * (positions.length / 3)) * 3
      sampledPositions.push(new THREE.Vector3(
        positions[index],
        positions[index + 1],
        positions[index + 2]
      ))
    }
    return sampledPositions
  }, [nodes])

  // Generate random initial positions
  const randomPositions = useMemo(() => 
    Array.from({ length: count }, () => new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    ))
  , [])

  useEffect(() => {
    // Animate particles from random to model positions
    randomPositions.forEach((pos, i) => {
      gsap.to(pos, {
        x: modelPositions[i].x,
        y: modelPositions[i].y,
        z: modelPositions[i].z,
        duration: 2,
        ease: "power2.inOut",
        delay: i * 0.001
      })
    })
  }, [])

  useFrame(() => {
    // Update instances
    randomPositions.forEach((pos, i) => {
      dummy.position.copy(pos)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.02]} />
      <meshPhongMaterial color="#ffffff" />
    </instancedMesh>
  )
}