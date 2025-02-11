import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThrustEffect({ position, rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const spriteRef = useRef();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/thrust-image.png');
    
    if (spriteRef.current) {
      spriteRef.current.material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.8,
        rotation: rotation[2]
      });
    }
  }, []);

  return <sprite ref={spriteRef} position={position} scale={scale} />;
}
