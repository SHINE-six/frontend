import { useEffect, useRef, useMemo, useState } from 'react'
import { useGLTF } from "@react-three/drei"
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

export default function Assistant({ astronautPosition }) {
  const instancedMeshRef = useRef()
  const meshRef = useRef()
  const [inToolboxRange, setInToolboxRange] = useState(false)
  const targetPosition = useRef(new THREE.Vector3())
  const model1 = useGLTF('/models/Hero/Pbr/central-hub.glb')
  const model2 = useGLTF('/models/About/TRex/TRex.glb')
  console.log(model2)
  const count = 20000 // number of particles
  const dummy = new THREE.Object3D()
  const TOOLBOX_POSITION = [-25, -30, 0];
  const INTERACTION_RANGE = 25;

  // Helper function to compress all positions form the child
  const getCompressedPositions = (node) => {
    const positions = []
    if (node.geometry) {
      const pos = node.geometry.attributes.position.array
      for (let i = 0; i < pos.length; i += 3) {
        positions.push(pos[i], pos[i + 1], pos[i + 2])
      }
    }
    if (node.children) {
      for (const child of node.children) {
        positions.push(...getCompressedPositions(child))
      }
    }
    return positions
  }

  // Add rotation matrix
  const rotationMatrix = new THREE.Matrix4()
  rotationMatrix.makeRotationX(Math.PI / 2)

  // Sample positions from both models
  const modelPositions = useMemo(() => {
    const positions1 = getCompressedPositions(model1.nodes.model)
    const positions2 = getCompressedPositions(model2.nodes.TrexByJoel3dfbx)
    const sampledPositions = []
    
    for (let i = 0; i < count; i++) {
      const index = Math.floor(Math.random() * (positions1.length / 3)) * 3
      const model1Vector = new THREE.Vector3(
        positions1[index],
        positions1[index + 1],
        positions1[index + 2]
      ).applyMatrix4(rotationMatrix) // Apply rotation to model1

      sampledPositions.push({
        model1: model1Vector,
        model2: new THREE.Vector3(
          positions2[index] * 0.2,
          positions2[index + 1] * 0.2,
          positions2[index + 2] * 0.2
        )
      })
    }
    return sampledPositions
  }, [model1, model2])

  // Generate random initial positions
  const randomPositions = useMemo(() => 
    Array.from({ length: count }, () => new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    ))
  , [])

  useEffect(() => {
    // Initial animation to model1 positions
    randomPositions.forEach((pos, i) => {
      gsap.to(pos, {
        x: modelPositions[i].model1.x,
        y: modelPositions[i].model1.y,
        z: modelPositions[i].model1.z,
        duration: 2,
        ease: "power2.inOut",
        delay: i * 0.0002
      })
    })
  }, [])

  function handleInRange(boolean) {
    // Check if the state has been change
    if (inToolboxRange !== boolean) {
      setInToolboxRange(boolean)
    }
  }
  
  const transitionProgress = useRef(0);
  const transitionStartTime = useRef(0);
  const TRANSITION_DURATION = 1; // 1 second
  
  useFrame((state) => {
      const time = state.clock.getElapsedTime();
      targetPosition.current.set(
        astronautPosition.x + 4 + Math.sin(time * 0.5) * 0.3,
        astronautPosition.y + 3 + Math.cos(time * 0.7) * 0.2,
        (astronautPosition.z || 0) + Math.sin(time * 0.3) * 0.2
      )
  
      if (instancedMeshRef.current) {
        instancedMeshRef.current.position.lerp(targetPosition.current, 0.01)
        meshRef.current.position.lerp(targetPosition.current, 0.01)
      }
      
      const distanceToToolbox = new THREE.Vector3(
        targetPosition.current.x - TOOLBOX_POSITION[0],
        targetPosition.current.y - TOOLBOX_POSITION[1],
        targetPosition.current.z - TOOLBOX_POSITION[2]
      ).length()
  
      const inRange = distanceToToolbox <= INTERACTION_RANGE;
      
      // Handle transitions
      if (inRange && !inToolboxRange) {
        // Instant transition when entering range
        transitionProgress.current = 1;
      } else if (!inRange && inToolboxRange) {
        // Start exit transition
        transitionStartTime.current = time;
      }
      
      // Handle exit transition
      if (!inRange && transitionProgress.current > 0) {
        const elapsed = time - transitionStartTime.current;
        if (elapsed <= TRANSITION_DURATION) {
          transitionProgress.current = 1 - (elapsed / TRANSITION_DURATION);
        } else {
          transitionProgress.current = 0;
        }
      }
      
      // setInToolboxRange(inRange);
      handleInRange(inRange);
  
      // Update positions
      randomPositions.forEach((pos, i) => {
        const model1Pos = modelPositions[i].model1;
        const model2Pos = modelPositions[i].model2;
        
        pos.x = THREE.MathUtils.lerp(model1Pos.x, model2Pos.x, transitionProgress.current);
        pos.y = THREE.MathUtils.lerp(model1Pos.y, model2Pos.y, transitionProgress.current);
        pos.z = THREE.MathUtils.lerp(model1Pos.z, model2Pos.z, transitionProgress.current);
        
        dummy.position.copy(pos);
        dummy.rotation.set(time * 0.1, time * 0.1, 0);
        dummy.updateMatrix();
        instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
      })
      
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;

      // Rotate the model until 60 degree then rotate it back
      meshRef.current.rotation.y = (Math.sin(time * 0.4) * 0.7) - 45 * (Math.PI / 180)
      instancedMeshRef.current.rotation.y = (Math.sin(time * 0.4) * 0.7) - 45 * (Math.PI / 180)
  })

  return (
    <>
      <mesh 
        ref={meshRef} 
        scale={[2,2,2]} 
        rotation={[0, -60 * (Math.PI / 180), 0]}
      >
        {inToolboxRange ? (
          <primitive object={model2.scene} scale={[0.2, 0.2, 0.2]} position={[0, 0, 0]} />
        ) : (
          <primitive object={model1.scene}/>
        ) }
        {model1.scene.traverse((child) => {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = 0.25; // Set the desired opacity here
          }
        })}
        {model2.scene.traverse((child) => {
          if (child.isMesh) {
            child.material.transparent = true;
            child.material.opacity = 0.25; // Set the desired opacity here
          }
        })}
      </mesh>
      <instancedMesh 
        ref={instancedMeshRef} 
        args={[null, null, count]} 
        scale={[2,2,2]} 
        rotation={[0, -60 * (Math.PI / 180), 0]}
      >
        <sphereGeometry args={[0.014, 3, 2]} />
        <meshPhongMaterial color="#8E44CD" side={THREE.DoubleSide}/>
      </instancedMesh>
    </>
  )
}