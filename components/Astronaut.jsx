import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AnimationMixer } from "three";
import ThrustEffect from './ThrustEffect';
import * as THREE from 'three';

export default function Astronaut({ onPositionUpdate }) {
  const { camera } = useThree();
  const { scene, animations } = useGLTF("/models/About/Astronaut/astronaut.glb");
  const groupRef = useRef();
  const mixerRef = useRef();
  const velocityRef = useRef({ x: 0, y: 0 });
  const acceleration = 0.35;
  const maxSpeed = 3;
  const friction = 0.997;
  const minVelocity = 0.001;
  const [thrusters, setThrusters] = useState({
    up: false,
    down: false,
    left: false,
    right: false
  });

  const FOLLOW_OFFSET = {
    x: 0,
    y: 0,
    z: 18  // Keep the same z distance
  };

  // Add movement boundaries
  const MOVEMENT_BOUNDS = {
    minX: -30,
    maxX: 30,
    minY: -60,
    maxY: 8
  };

  const rotationRef = useRef(50 * (Math.PI / 180)); // Initial rotation
  const rotationVelocityRef = useRef(0);
  const ROTATION_SPEED = 2; // Rotation speed in radians per second
  const ROTATION_FRICTION = 0.95; // Rotation slowdown factor

  const ROTATION_LIMITS = {
    min: -50 * (Math.PI / 180),
    max: 50 * (Math.PI / 180)
  };

  useEffect(() => {
    if (animations && animations.length) {
      mixerRef.current = new AnimationMixer(scene);
      animations.forEach((clip) => {
        mixerRef.current.clipAction(clip).play();
      });
    }
    return () => mixerRef.current?.stopAllAction();
  }, [animations, scene]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key.toLowerCase()) { // Add toLowerCase() to handle both cases
        case 'arrowup':
        case 'w':
          velocityRef.current.y = Math.min(velocityRef.current.y + acceleration, maxSpeed);
          setThrusters(prev => ({ ...prev, up: true }));
          break;
        case 'arrowdown':
        case 's':
          velocityRef.current.y = Math.max(velocityRef.current.y - acceleration, -maxSpeed);
          setThrusters(prev => ({ ...prev, down: true }));
          break;
        case 'arrowleft':
        case 'a':
          velocityRef.current.x = Math.max(velocityRef.current.x - acceleration, -maxSpeed);
          setThrusters(prev => ({ ...prev, left: true }));
          break;
        case 'arrowright':
        case 'd':
          velocityRef.current.x = Math.min(velocityRef.current.x + acceleration, maxSpeed);
          setThrusters(prev => ({ ...prev, right: true }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key.toLowerCase()) { // Add toLowerCase() to handle both cases
        case 'arrowup':
        case 'w':
          setThrusters(prev => ({ ...prev, up: false }));
          break;
        case 'arrowdown':
        case 's':
          setThrusters(prev => ({ ...prev, down: false }));
          break;
        case 'arrowleft':
        case 'a':
          setThrusters(prev => ({ ...prev, left: false }));
          break;
        case 'arrowright':
        case 'd':
          setThrusters(prev => ({ ...prev, right: false }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);

    // Normalize diagonal movement
    const currentSpeed = Math.sqrt(
      velocityRef.current.x * velocityRef.current.x + 
      velocityRef.current.y * velocityRef.current.y
    );
    
    if (currentSpeed > maxSpeed) {
      const scale = maxSpeed / currentSpeed;
      velocityRef.current.x *= scale;
      velocityRef.current.y *= scale;
    }

    // Update rotation based on left/right movement with limits - FIX DIRECTION
    if (thrusters.left && rotationRef.current > ROTATION_LIMITS.min) {
      rotationVelocityRef.current = -ROTATION_SPEED; // Changed from positive to negative
    } else if (thrusters.right && rotationRef.current < ROTATION_LIMITS.max) {
      rotationVelocityRef.current = ROTATION_SPEED; // Changed from negative to positive
    }

    // Apply rotation with limits
    const newRotation = rotationRef.current + rotationVelocityRef.current * delta;
    if (newRotation >= ROTATION_LIMITS.min && newRotation <= ROTATION_LIMITS.max) {
      rotationRef.current = newRotation;
    } else {
      rotationVelocityRef.current = 0; // Stop rotation at limits
    }
    
    // Apply rotation friction
    rotationVelocityRef.current *= ROTATION_FRICTION;

    // Stop rotation if velocity is very small
    if (Math.abs(rotationVelocityRef.current) < 0.01) {
      rotationVelocityRef.current = 0;
    }

    // Calculate new position
    const newX = groupRef.current.position.x + velocityRef.current.x * delta;
    const newY = groupRef.current.position.y + velocityRef.current.y * delta;

    // Boundary checks with position clamping
    if (newX < MOVEMENT_BOUNDS.minX) {
      groupRef.current.position.x = MOVEMENT_BOUNDS.minX;
      velocityRef.current.x = 0;
    } else if (newX > MOVEMENT_BOUNDS.maxX) {
      groupRef.current.position.x = MOVEMENT_BOUNDS.maxX;
      velocityRef.current.x = 0;
    } else {
      groupRef.current.position.x = newX;
    }

    if (newY < MOVEMENT_BOUNDS.minY) {
      groupRef.current.position.y = MOVEMENT_BOUNDS.minY;
      velocityRef.current.y = 0;
    } else if (newY > MOVEMENT_BOUNDS.maxY) {
      groupRef.current.position.y = MOVEMENT_BOUNDS.maxY;
      velocityRef.current.y = 0;
    } else {
      groupRef.current.position.y = newY;
    }

    // Apply friction only when not at boundaries
    if (groupRef.current.position.x > MOVEMENT_BOUNDS.minX && 
        groupRef.current.position.x < MOVEMENT_BOUNDS.maxX) {
      velocityRef.current.x *= friction;
    }
    if (groupRef.current.position.y > MOVEMENT_BOUNDS.minY && 
        groupRef.current.position.y < MOVEMENT_BOUNDS.maxY) {
      velocityRef.current.y *= friction;
    }

    // Stop movement if velocity is very small
    if (Math.abs(velocityRef.current.x) < minVelocity) velocityRef.current.x = 0;
    if (Math.abs(velocityRef.current.y) < minVelocity) velocityRef.current.y = 0;

    // Apply the rotation to the mesh
    groupRef.current.rotation.y = rotationRef.current;

    // Simplified camera following logic - direct following without boundaries
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      groupRef.current.position.x + FOLLOW_OFFSET.x,
      0.1
    );
    
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      groupRef.current.position.y + FOLLOW_OFFSET.y,
      0.1
    );

    camera.position.z = FOLLOW_OFFSET.z;

    // Report position after updating it
    onPositionUpdate({
      x: groupRef.current.position.x,
      y: groupRef.current.position.y
    });
  });

  return (
    <mesh 
      ref={groupRef} 
      position={[0, 0, 0]} 
      rotation={[0, rotationRef.current, 0]}
    >
      <primitive object={scene} scale={[1, 1, 1]} />
      {thrusters.up && (
        <ThrustEffect 
          position={[-0.7, 0, 0]}
          scale={[0.5, 0.5, 0.5]}
          rotation={[0, 0, Math.PI / 2]}
        />
      )}
      {thrusters.down && (
        <ThrustEffect 
          position={[0, 2.7, 0]} 
          scale={[0.5, 0.5, 0.5]}
          rotation={[0, 0, - Math.PI / 2]}
        />
      )}
      {thrusters.left && (
        <ThrustEffect 
          position={[0.7, 1.3, 0]}
          scale={[0.5, 0.5, 0.5]}
          rotation={[0, 0, Math.PI]}
        />
      )}
      {thrusters.right && (
        <ThrustEffect 
          position={[-1, 1.3, 0]}
          scale={[0.5, 0.5, 0.5]}
          rotation={[0, 0, 0]}
        />
      )}
    </mesh>
  );
}