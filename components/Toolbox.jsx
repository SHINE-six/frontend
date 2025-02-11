import { useGLTF } from "@react-three/drei";
import { AnimationMixer, LoopOnce } from "three";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function Toolbox({ astronautPosition }) {
  const { scene, animations } = useGLTF("/models/About/Toolbox/tool_box.glb");
  const groupRef = useRef();
  const mixerRef = useRef();
  const actionRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const INTERACTION_RANGE = 15;
  const TOOLBOX_POSITION = [-25, -30, 0];

  useEffect(() => {
    if (animations && animations.length) {
      mixerRef.current = new AnimationMixer(scene);
      const clip = animations[0];
      const action = mixerRef.current.clipAction(clip);
      actionRef.current = action;

      // Setup the animation
      action.clampWhenFinished = true;
      action.setLoop(LoopOnce);
      action.timeScale = 1; // Control animation speed
      
      // Start with box closed
      action.time = action._clip.duration;
      action.paused = true;
      action.play();
    }
  }, [animations, scene]);

  useFrame((state, delta) => {
    if (!mixerRef.current || !actionRef.current) return;

    // Calculate distance to astronaut
    const distance = Math.sqrt(
      Math.pow(astronautPosition.x - TOOLBOX_POSITION[0], 2) +
      Math.pow(astronautPosition.y - TOOLBOX_POSITION[1], 2)
    );

    const action = actionRef.current;
    const duration = action._clip.duration;

    // Handle animation states
    if (distance <= INTERACTION_RANGE && !isOpen && !isAnimating) {
      // Open the box
      setIsAnimating(true);
      action.paused = false;
      action.timeScale = -1; // Reverse playback to open
      action.play();
      
      setTimeout(() => {
        action.paused = true;
        setIsAnimating(false);
        setIsOpen(true);
      }, (duration * 1000) / 2); // Half duration for half-open
    }
    else if (distance > INTERACTION_RANGE && isOpen && !isAnimating) {
      // Close the box
      setIsAnimating(true);
      action.paused = false;
      action.timeScale = 1; // Forward playback to close
      action.play();

      setTimeout(() => {
        action.paused = true;
        setIsAnimating(false);
        setIsOpen(false);
      }, (duration * 1000) / 2); // Half duration for closing
    }

    mixerRef.current.update(delta);
  });

  return (
    <group 
      ref={groupRef} 
      position={TOOLBOX_POSITION}
      scale={[0.04, 0.04, 0.04]}
    >
      <primitive object={scene} />
    </group>
  );
}
