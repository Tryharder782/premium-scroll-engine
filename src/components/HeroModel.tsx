import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

export function HeroModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const r1 = scroll.range(0, 1 / 4);
    const r2 = scroll.range(1 / 4, 1 / 4);
    const r3 = scroll.range(2 / 4, 1 / 4);
    const r4 = scroll.range(3 / 4, 1 / 4);

    // Base continuous rotation
    meshRef.current.rotation.y += delta * 0.2;

    // Section 1 (0-25%): Center, slow rotation
    // Section 2 (25-50%): Move left, rotate to side profile
    // Section 3 (50-75%): Move right, zoom in
    // Section 4 (75-100%): Return to center, dramatic 360 flip

    // Position X interpolation
    let targetX = 0;
    if (r2 > 0 && r3 === 0) {
      targetX = THREE.MathUtils.lerp(0, -2, r2);
    } else if (r3 > 0 && r4 === 0) {
      targetX = THREE.MathUtils.lerp(-2, 2, r3);
    } else if (r4 > 0) {
      targetX = THREE.MathUtils.lerp(2, 0, r4);
    }
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, 4, delta);

    // Position Z (Zoom) interpolation
    let targetZ = 0;
    if (r3 > 0 && r4 === 0) {
      targetZ = THREE.MathUtils.lerp(0, 2, r3);
    } else if (r4 > 0) {
      targetZ = THREE.MathUtils.lerp(2, 0, r4);
    }
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 4, delta);

    // Rotation interpolation
    let targetRotX = 0;
    let targetRotY = meshRef.current.rotation.y; // Keep base rotation
    let targetRotZ = 0;

    if (r2 > 0 && r3 === 0) {
      targetRotY += THREE.MathUtils.lerp(0, Math.PI / 2, r2);
    } else if (r4 > 0) {
      targetRotX = THREE.MathUtils.lerp(0, Math.PI * 2, r4);
      targetRotY += THREE.MathUtils.lerp(Math.PI / 2, 0, r4);
    }

    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetRotX, 4, delta);
    // We don't damp Y here because it has continuous rotation, we just add the offset
    if (r2 > 0 && r3 === 0) {
        meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY, 4, delta);
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <dodecahedronGeometry args={[1.5, 0]} />
      <meshStandardMaterial
        color="#ffffff"
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1}
      />
    </mesh>
  );
}
