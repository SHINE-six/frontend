import React, { useRef } from "react";
import { Decal, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

export const Ball = ({ imgUrl, position, scale = 2.75, opacity = 1, astronautPosition }) => {
  const [decal] = useTexture([imgUrl.src]);
  const meshRef = useRef();

  const [springs, api] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { mass: 1, tension: 180, friction: 12 }
  }));

  useFrame(() => {
    if (!meshRef.current || !astronautPosition) return;

    const ballPosition = new THREE.Vector3();
    meshRef.current.getWorldPosition(ballPosition);
    const distance = Math.sqrt(
      Math.pow(astronautPosition.x - ballPosition.x, 2) +
      Math.pow(astronautPosition.y - ballPosition.y, 2)
    );

    // Interaction radius
    const INTERACTION_DISTANCE = 3;
    
    if (distance < INTERACTION_DISTANCE) {
      // Calculate tilt direction based on relative position
      const dx = astronautPosition.x - ballPosition.x;
      const dy = astronautPosition.y - ballPosition.y;
      
      // Calculate tilt amount (max 0.3 radians)
      const tiltAmount = 0.7 * (1 - distance / INTERACTION_DISTANCE);
      
      // Apply tilt
      api.start({
        rotation: [
          -dy * tiltAmount,
          0,
          dx * tiltAmount
        ]
      });
    } else {
      // Return to original rotation
      api.start({
        rotation: [0, 0, 0]
      });
    }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      scale={scale}
      {...springs}
    >
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color='#9792A9'
        polygonOffset
        polygonOffsetFactor={-5}
        flatShading
        transparent
        opacity={opacity}
      />
      <Decal
        position={[0, 0, 1]}
        rotation={[2 * Math.PI, 0, 6.25]}
        scale={1.3}
        map={decal}
        flatShading
      />
    </animated.mesh>
  );
};

export default Ball;
