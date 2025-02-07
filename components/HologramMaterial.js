import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

export const HologramMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color(0x00ffff),
    scanLineIntensity: 30.0,
    noiseStrength: 0.08,
    gridSize: 20.0,
    opacity: 0.1
  },
  // Vertex Shader remains the same
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  `
  uniform float time;
  uniform vec3 color;
  uniform float scanLineIntensity;
  uniform float noiseStrength;
  uniform float gridSize;
  uniform float opacity;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    // Slowly moving grid lines
    vec2 movingUV = vUv + vec2(0, time * 0.2);
    float horizontalLines = smoothstep(0.95, 1.0, fract(movingUV.y * gridSize));
    float verticalLines = smoothstep(0.95, 1.0, fract(movingUV.x * gridSize));
    float grid = horizontalLines + verticalLines;
    
    // Subtle moving scan line
    float scanLine = smoothstep(0.95, 1.0, fract(vUv.y - time * 0.5));
    
    // Reduced noise
    float noise = random(vUv + time) * noiseStrength;
    
    // Subtle flicker
    float flicker = 0.97 + 0.03 * sin(time * 8.0);
    
    // Color variations
    vec3 pulsingColor = color * (0.9 + 0.1 * sin(time));
    
    // Combine effects
    vec3 finalColor = pulsingColor * (0.4 + grid * 0.6 + scanLine + noise) * flicker;
    
    // Softer edge fade
    float fade = 1.0 - pow(abs(vUv.x - 0.5) * 1.8, 2.0);
    finalColor *= fade;
    
    gl_FragColor = vec4(finalColor, opacity);
  }
  `
);

extend({ HologramMaterial });
