import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ParticleVortex } from './ParticleVortex';
import { Overlay } from './Overlay';

export function Scene() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 15], fov: 60 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      dpr={[1, 2]} // Limit pixel ratio for performance
    >
      <color attach="background" args={['#000000']} />
      
      {/* Minimal lighting, mostly relying on emissive/shader colors */}
      <ambientLight intensity={0.2} />
      
      <ScrollControls pages={4} damping={0.2}>
        <ParticleVortex count={20000} />
        <Overlay />
      </ScrollControls>

      {/* Post-processing for the SaaS Glow */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.8}
        />
      </EffectComposer>
    </Canvas>
  );
}
