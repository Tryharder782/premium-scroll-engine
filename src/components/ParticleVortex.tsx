import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScrollSpeed;
  
  attribute float aSize;
  attribute float aSpeed;
  attribute float aOffset;
  
  varying vec3 vColor;
  
  void main() {
    // Base position
    vec3 pos = position;
    
    // Calculate distance from center (radius)
    float radius = length(pos.xy);
    
    // Angle based on position
    float angle = atan(pos.y, pos.x);
    
    // Vortex effect: rotate based on time, distance, and individual speed
    float rotation = uTime * aSpeed * 0.5 + aOffset;
    
    // Twist effect: inner particles rotate faster
    float twist = 2.0 / (radius + 0.5);
    angle += rotation * twist;
    
    // Apply new rotated position
    pos.x = cos(angle) * radius;
    pos.y = sin(angle) * radius;
    
    // Tunnel movement: move particles along Z axis
    // We use uScrollSpeed as an offset, not a multiplier for time, to avoid the "jumping" effect
    float zSpeed = aSpeed * 5.0;
    float zOffset = mod(pos.z + uTime * zSpeed + uScrollSpeed, 50.0) - 25.0;
    pos.z = zOffset;
    
    // Mouse interaction: subtle tilt/bend based on mouse position
    // Influence is stronger further down the tunnel
    float mouseInfluence = smoothstep(-25.0, 25.0, pos.z);
    pos.x += uMouse.x * 5.0 * mouseInfluence;
    pos.y += uMouse.y * 5.0 * mouseInfluence;
    
    // Calculate final position
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation based on distance
    gl_PointSize = aSize * (30.0 / -mvPosition.z);
    
    // Color variation based on radius and z-position
    // Core is bright cyan/white, outer is deep blue
    vec3 coreColor = vec3(0.0, 1.0, 1.0); // Cyan
    vec3 outerColor = vec3(0.0, 0.2, 0.8); // Deep Blue
    
    float mixFactor = smoothstep(0.0, 10.0, radius);
    
    // Fade out particles far away or very close to camera
    float alpha = smoothstep(-25.0, -15.0, pos.z) * smoothstep(20.0, 10.0, pos.z);
    
    vColor = mix(coreColor, outerColor, mixFactor) * alpha;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Create soft circular particles
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // Discard pixels outside the circle
    if (dist > 0.5) discard;
    
    // Soft edge (glow)
    float alpha = smoothstep(0.5, 0.1, dist);
    
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export function ParticleVortex({ count = 15000 }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const scroll = useScroll();
  const lastScrollOffset = useRef(0);
  const currentScrollSpeed = useRef(0);

  // Generate particle data
  const [positions, sizes, speeds, offsets] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute particles in a cylinder/tunnel shape
      // More particles near the center, fewer on the edges
      const radius = Math.pow(Math.random(), 2) * 15 + 0.5;
      const theta = Math.random() * Math.PI * 2;
      
      // Initial Z position spread along the tunnel
      const z = (Math.random() - 0.5) * 50;

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.sin(theta) * radius;
      positions[i * 3 + 2] = z;

      // Randomize sizes, speeds, and starting offsets
      sizes[i] = Math.random() * 2.0 + 0.5;
      speeds[i] = Math.random() * 0.5 + 0.5;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    return [positions, sizes, speeds, offsets];
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScrollSpeed: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Calculate scroll speed
      const currentOffset = scroll.offset;
      const scrollDelta = currentOffset - lastScrollOffset.current;
      
      // Only accelerate when scrolling down (positive delta)
      // We accumulate the scroll delta into the uniform to act as a continuous offset
      const targetSpeed = Math.max(0, scrollDelta * 150);
      currentScrollSpeed.current = THREE.MathUtils.damp(
        currentScrollSpeed.current,
        targetSpeed,
        2, // Lower damping factor for smoother deceleration
        delta
      );
      
      // Accumulate the speed into the uniform to move particles forward
      materialRef.current.uniforms.uScrollSpeed.value += currentScrollSpeed.current;
      lastScrollOffset.current = currentOffset;

      // Smoothly interpolate mouse position for fluid interaction
      // state.pointer is normalized between -1 and 1
      materialRef.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(state.pointer.x, state.pointer.y),
        0.05
      );
    }
    
    // Slowly rotate the entire vortex system
    if (pointsRef.current) {
        pointsRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={count}
          array={speeds}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          count={count}
          array={offsets}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
