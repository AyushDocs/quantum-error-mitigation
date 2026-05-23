'use client'

import Link from 'next/link'

export default function OverviewSection() {
  return (
    <section id="overview" className="py-24 px-6 bg-[#020704]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Error Correction vs.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-400 to-emerald-300">
              Error Mitigation
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Quantum systems are highly sensitive to noise. While full correction is a long-term goal, mitigation provides a practical solution that works today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-2xl border border-red-500/10 bg-red-950/5 glow-card flex flex-col justify-between">
            <div>
              <div className="text-red-400 text-xs font-bold uppercase tracking-widest mb-3">Quantum Error Correction</div>
              <h3 className="text-xl font-bold text-white mb-3">Full Fault Tolerance</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-3">
                  <span className="text-red-400 font-bold shrink-0">→</span>
                  <span>Requires millions of physical qubits per logical qubit to execute surface codes.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400 font-bold shrink-0">→</span>
                  <span>Detects and active-corrects errors in real-time using syndrome measurements.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400 font-bold shrink-0">→</span>
                  <span>Decades away from scaling due to severe hardware overhead requirements.</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-red-500/5">
              <Link href="/qec" className="inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors group">
                Explore QEC Deep-Dive
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-quantum-500/10 bg-quantum-950/5 glow-card">
            <div className="text-quantum-400 text-xs font-bold uppercase tracking-widest mb-3">Quantum Error Mitigation</div>
            <h3 className="text-xl font-bold text-white mb-3">Post-Processing Correction</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex gap-3">
                <span className="text-quantum-400 font-bold shrink-0">→</span>
                <span>Runs directly on <strong className="text-white">existing</strong> 100+ physical qubit devices today.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-quantum-400 font-bold shrink-0">→</span>
                <span>Requires zero extra qubits; relies on scaling noise and classical post-processing.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-quantum-400 font-bold shrink-0">→</span>
                <span>Uses gate folding (ZNE) and readout calibration to recover clean logical results.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="gradient-border rounded-2xl p-8 bg-quantum-950/10 shadow-inner">
          <h3 className="text-lg font-bold text-white mb-6">How ZNE is Formulated & Applied</h3>
          <div className="grid sm:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-quantum-300 font-bold text-sm">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-quantum-950 border border-quantum-500/30 text-xs font-mono font-bold">1</span>
                Scan Noise Factors
              </div>
              <p className="text-slate-500 pl-9">
                We run the target quantum circuit at multiple noise scaling points ($k=1, 3, 5, 7, 9$) by inserting gate-identity pairs.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-quantum-300 font-bold text-sm">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-quantum-950 border border-quantum-500/30 text-xs font-mono font-bold">2</span>
                Measure Decay curves
              </div>
              <p className="text-slate-500 pl-9">
                We measure how success probabilities decay under noise. The noise multiplier scales linearly with fold count.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-quantum-300 font-bold text-sm">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-quantum-950 border border-quantum-500/30 text-xs font-mono font-bold">3</span>
                Extrapolate to Zero
              </div>
              <p className="text-slate-500 pl-9">
                We fit curve models (linear, quadratic, Richardson) and evaluate them at $k=0$ (the ideal noiseless state limit).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
