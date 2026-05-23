'use client'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Green Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020804] via-[#041209] to-[#020a06]" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(52,211,153,0.1) 0%, transparent 50%)'
      }} />
      {/* Grid Pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0v60M0 30h60\' stroke=\'%2310b981\' stroke-width=\'0.5\' opacity=\'0.06\'/%3E%3C/svg%3E")',
      }} />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-quantum-950/80 border border-quantum-500/20 text-quantum-300 text-sm mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-quantum-400 animate-pulse" />
          IBM-Class Quantum Noise Simulation
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 glow-text text-white">
          Quantum Error<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-400 to-emerald-300">
            Mitigation Stack
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Zero-Noise Extrapolation (ZNE) with digital gate folding and readout error correction
          .
          <br />
           Practical error mitigation on <span className="text-quantum-300 font-semibold">today&apos;s</span> noisy intermediate-scale (NISQ) quantum hardware.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a href="#circuit-visualizer"
             className="px-8 py-3 rounded-xl bg-quantum-500 hover:bg-quantum-600 text-black font-bold transition-all shadow-lg shadow-quantum-500/25">
            Interactive Demos
          </a>
          <a href="#results"
             className="px-8 py-3 rounded-xl border border-quantum-500/30 text-quantum-300 hover:bg-quantum-950/60 font-semibold transition-all">
            View Stack Results
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-quantum-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
