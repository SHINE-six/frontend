'use client';

import { Canvas, useLoader, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, OrbitControls, Text3D, Center } from "@react-three/drei"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { useRef, useMemo } from "react"
import * as THREE from "three"

function AnimatedBackground() {
  const shaderRef = useRef()
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh>
      <sphereGeometry args={[50, 32, 32]} />
      <shaderMaterial
        ref={shaderRef}
        uniforms={uniforms}
        side={THREE.BackSide}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          // Noise function for void effect
          float rand(vec2 n) { 
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
          }
          
          void main() {
            vec3 emergency = vec3(0.7, 0.0, 0.0);    // Emergency red
            vec3 darkBlue = vec3(0.05, 0.0, 0.2);    // Dark blue
            vec3 voidPurple = vec3(0.2, 0.0, 0.3);   // Void purple
            
            // Emergency pulse
            float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
            pulse = smoothstep(0.2, 0.8, pulse);
            
            // Spatial coordinates
            float phi = atan(vPosition.z, vPosition.x);
            float theta = acos(vPosition.y / length(vPosition));
            
            // Void effect
            float noise = rand(vUv + uTime * 0.1) * 0.15;
            
            // Swirling motion
            float swirl = sin(phi * 3.0 + theta * 2.0 + uTime * 0.3);
            
            // Mix colors with emergency pulse
            vec3 color = mix(
              mix(darkBlue, voidPurple, swirl),
              emergency,
              pulse * 0.3
            );
            
            // Add void noise
            color += noise * (1.0 - pulse * 0.5);
            
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  )
}

export default function Page404() {
  const fbx = useLoader(FBXLoader, '/models/Error/fredbear-error-404-fbx/source/FredbearError404.fbx')

  return (
    <div className="w-screen h-screen">
      <Canvas>
        <AnimatedBackground />
        <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={60} />
        {/* <ambientLight intensity={1} /> */}
        <pointLight position={[1, 7, 2]} intensity={100} distance={30} color="#ff0000" />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={10}
          maxDistance={60}
          enableDamping
          dampingFactor={0.05}
        />
        <primitive 
          object={fbx} 
          position={[0, -8, 0]} 
          scale={0.008} 
          rotation={[0, 0, 0]}
        />
        {/* 3D text saying ERROR 404 \n Page Not Found */}
        <Center position={[0, 10, -5]}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={6}
            height={0.2}
            curveSegments={12}
          >
            ERROR 404
            <meshStandardMaterial color="red" />
          </Text3D>
        </Center>

        <Center position={[0, -3, -5]}>
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={2}
            height={0.2}
            curveSegments={12}
          >
            Page Not Found
            <meshStandardMaterial color="white" />
          </Text3D>
        </Center>

      </Canvas>
    </div>
  )
}