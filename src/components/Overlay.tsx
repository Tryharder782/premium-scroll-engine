import { Scroll } from '@react-three/drei';
import { ChevronDown } from 'lucide-react';

export function Overlay() {
  return (
    <Scroll html style={{ width: '100%' }}>
      <div className="w-screen h-[400vh] text-white font-sans">
        {/* Section 1 */}
        <section className="h-screen flex flex-col items-center justify-center relative">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            Design. Reimagined.
          </h1>
          <p className="mt-6 text-xl text-white/60 max-w-md text-center">
            Experience the pinnacle of craftsmanship and innovation.
          </p>
          
          <div className="absolute bottom-12 flex flex-col items-center animate-bounce text-white/40">
            <span className="text-sm uppercase tracking-widest mb-2">Scroll to Explore</span>
            <ChevronDown size={24} />
          </div>
        </section>

        {/* Section 2 */}
        <section className="h-screen flex flex-col items-end justify-center pr-[10vw] md:pr-[20vw]">
          <div className="max-w-md text-right">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Precision Engineering.
            </h2>
            <p className="text-xl text-white/60">
              Every curve, every edge, meticulously crafted to perfection. 
              A symphony of materials working in perfect harmony.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="h-screen flex flex-col items-start justify-center pl-[10vw] md:pl-[20vw]">
          <div className="max-w-md">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Unmatched Performance.
            </h2>
            <p className="text-xl text-white/60">
              Power that defies expectations. Efficiency that sets new standards.
              The future is here, and it's breathtaking.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="h-screen flex flex-col items-center justify-center">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-12 text-center">
            The Future is Now.
          </h2>
          <button className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-white/90 transition-colors duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Pre-order Now
          </button>
        </section>
      </div>
    </Scroll>
  );
}
