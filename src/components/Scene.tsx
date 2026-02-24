import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, ScrollControls } from '@react-three/drei';
import { HeroModel } from './HeroModel';
import { Overlay } from './Overlay';

export function Scene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      
      <Environment preset="studio" />
      
      <ScrollControls pages={4} damping={0.2}>
        <HeroModel />
        <Overlay />
      </ScrollControls>

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
        color="#ffffff"
      />
    </Canvas>
  );
}
