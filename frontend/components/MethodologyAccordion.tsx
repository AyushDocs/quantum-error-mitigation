'use client'

import { useState } from 'react'
import { fitModels, noiseModel } from '@/lib/data'

const details = [
  {
    title: 'Gate Folding Theory',
    content: 'Zero-Noise Extrapolation scales noise using Gate Folding. Since U† · U = I (the identity), any unitary U can be replaced by U(U† · U)^n without changing the logic. Under noise, however, executing U† and U adds physical error. Noise is scaled by factors k = 1, 3, 5, 7, 9.',
    code: 'Fold 1 (k=1):  U\nFold 3 (k=3):  U  |  U†  |  U\nFold 5 (k=5):  U  |  U†  |  U  |  U†  |  U',
  },
  {
    title: 'Noise Model Parameters',
    content: `We simulate a standard IBM-class hardware profile. It features ${noiseModel.singleQubit * 100}% error on single-qubit gates (H, X), ${noiseModel.twoQubit * 100}% error on two-qubit gates (CZ, CP, SWAP), and asymmetric readout errors: P(0→1) = ${noiseModel.readoutP0to1 * 100}%, P(1→0) = ${noiseModel.readoutP1to0 * 100}%.`,
    code: `NoiseModel Config:\n  Single-qubit depolarizing: 0.1%\n  Two-qubit depolarizing:    2.0%\n  Asymmetric readout:        2% P(0→1), 4% P(1→0)`,
  },
  {
    title: 'Algorithms & Circuit Depth',
    content: 'We evaluate two algorithms. Grover\'s Search (2-qubit, target |11⟩) has high density (depth 7, 2 two-qubit CZ gates). The 3-Qubit QFT has depth 6 with 3 controlled CP gates and 1 SWAP. Grover\'s higher gate density causes faster degradation, making it an excellent candidate for mitigation.',
    code: `Grover: depth=7, gates={'h': 6, 'x': 4, 'cz': 2}\nQFT-3:  depth=6, gates={'h': 3, 'cp': 3, 'swap': 1}`,
  },
  {
    title: 'Stacking Mitigation Techniques',
    content: 'Measurement mitigation and ZNE correct different types of errors. Measurement mitigation corrects readout bias at the end of the circuit, while ZNE corrects gate errors during execution. Running ZNE on measurement-corrected data yields cumulative error reduction.',
    code: `Stacking Logic:\n  1. Run Folded Scan -> 2. Calibrate Readout -> 3. Correct Readout via Inverse -> 4. Fit Curves -> 5. Extrapolate to Zero`,
  },
]

export default function MethodologyAccordion() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="methodology" className="py-24 px-6 bg-[#020805] border-t border-slate-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Technical{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-400 to-emerald-300">
            Deep Dive
          </span>
        </h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          The quantum noise models, circuit configurations, and fit algorithms backing this study.
        </p>

        <div className="space-y-3">
          {details.map((item, i) => (
            <div key={i} className="gradient-border rounded-xl overflow-hidden bg-quantum-950/10">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-quantum-950/20"
              >
                <span className="text-base font-semibold text-white">{item.title}</span>
                <svg className={`w-5 h-5 text-quantum-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-slate-300 text-xs leading-relaxed mb-4">{item.content}</p>
                  <pre className="p-4 rounded-lg bg-black/50 border border-quantum-800/10 text-xs text-quantum-300 font-mono leading-relaxed overflow-x-auto">
                    {item.code}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-bold text-white mb-6 text-center">ZNE Curve Fit Models</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {fitModels.map(m => (
              <div key={m.name} className="gradient-border rounded-xl p-5 bg-quantum-950/10 hover:border-quantum-500/20 transition-all">
                <div className="font-bold text-quantum-300 mb-1">{m.name} Fit</div>
                <div className="font-mono text-xs text-emerald-400 mb-2 bg-black/30 px-2.5 py-1 rounded inline-block">{m.formula}</div>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">{m.description}</p>
                <div className="text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-2">{m.params}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
