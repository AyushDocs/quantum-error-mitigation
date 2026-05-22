import { groverResults, qftResults } from '@/lib/data'

export default function FooterSection() {
  return (
    <footer className="py-16 px-6 border-t border-slate-900 bg-[#010604]">
      <div className="max-w-5xl mx-auto text-center">
        <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-quantum-950/20 to-emerald-950/10 border border-quantum-800/10 mb-10 shadow-inner">
          <h3 className="text-lg font-bold text-white mb-4">Key Physics Insight</h3>
          <p className="text-slate-350 text-sm leading-relaxed">
            Error mitigation <span className="text-quantum-400 font-bold">≠</span> error correction.
            Mitigation works on noisy hardware <span className="text-white font-semibold">today</span> without
            requiring redundant logical qubits. It is the primary tool for near-term quantum advantage.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 text-sm text-slate-500 mb-12">
          <div>
            <div className="font-semibold text-slate-400 mb-2">Grover&apos;s Search</div>
            <div className="font-mono text-xs">
              {groverResults.errors.unmitigated.toFixed(4)} → {groverResults.errors.combined.toFixed(4)} error
            </div>
            <div className="text-quantum-450 text-quantum-450 font-bold mt-1 text-quantum-400">{groverResults.reductions.combined}% reduced</div>
          </div>
          <div>
            <div className="font-semibold text-slate-400 mb-2">3-Qubit QFT Stack</div>
            <div className="font-mono text-xs">
              TVD: {qftResults.mitigationTVD.unmitigated.toFixed(4)} → {qftResults.mitigationTVD.mitigated.toFixed(4)}
            </div>
            <div className="text-quantum-450 text-quantum-450 font-bold mt-1 text-quantum-400">Readout Mitigated</div>
          </div>
          <div>
            <div className="font-semibold text-slate-400 mb-2">Simulation Run</div>
            <div className="font-mono text-xs">
              16384 shots per basis state
            </div>
            <div className="text-quantum-450 text-quantum-450 font-bold mt-1 text-quantum-400">Qiskit Aer Simulator</div>
          </div>
        </div>

        <div className="text-xs text-slate-650 text-slate-650 text-slate-500 mb-4">
          Built with Qiskit Aer · Next.js · Recharts · Tailwind CSS
        </div>
        <div className="mt-6 pt-6 border-t border-slate-900">
          <a href="https://github.com/ayush/quantum-error-mitigation"
             target="_blank"
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-quantum-400 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View Study Code on GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
