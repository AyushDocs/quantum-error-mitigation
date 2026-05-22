'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function VerificationPage() {
  const [prepError, setPrepError] = useState<number>(5) // in %
  const [gateError, setGateError] = useState<number>(8) // in %

  // Simulate Post-Selection of a Bell State (|00⟩ + |11⟩)
  // Ideal states: |00⟩ (50%), |11⟩ (50%) -> Even Parity
  // Noise causes bit-flips leading to |01⟩ and |10⟩ -> Odd Parity
  const pPrep = prepError / 100
  const pGate = gateError / 100

  // Probability of error on each qubit:
  // Combined error rate per qubit: p = pPrep + pGate (simplified model)
  const p = Math.min(pPrep + pGate, 0.5)

  // Out of 1000 simulated runs:
  // Probability of no flips (ideal): (1-p)^2
  // Probability of one flip (odd parity, error): 2 * p * (1-p)
  // Probability of two flips (even parity, but logical error |00⟩ -> |11⟩): p^2
  const probNoFlip = Math.pow(1 - p, 2)
  const probOneFlip = 2 * p * (1 - p)
  const probTwoFlips = Math.pow(p, 2)

  // Unmitigated success probability (ideal states |00⟩ and |11⟩ are correct):
  // Since noise can cause double-flips which preserves parity but are logical errors:
  const unmitigatedFidelity = probNoFlip
  const unmitigatedPct = (unmitigatedFidelity * 100).toFixed(1)

  // Discarded trials (any state with odd parity, i.e., single-flip):
  const discardRate = probOneFlip
  const discardPct = (discardRate * 100).toFixed(1)

  // Mitigated fidelity (fraction of accepted trials that are correct):
  // Accepted trials = 1 - discardRate = probNoFlip + probTwoFlips
  // Correct within accepted = probNoFlip
  const mitigatedFidelity = probNoFlip / (probNoFlip + probTwoFlips)
  const mitigatedPct = (mitigatedFidelity * 100).toFixed(1)

  return (
    <main className="min-h-screen bg-[#020704] text-slate-100 font-sans py-16 px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#010503] via-[#020e07] to-[#010804]" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0v60M0 30h60\' stroke=\'%2310b981\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/svg%3E")',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Navigation */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-quantum-400 hover:text-quantum-300 font-semibold transition-colors group">
            <span className="transform transition-transform group-hover:-translate-x-1">←</span>
            Back to Mitigation Dashboard
          </Link>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/20 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            State-Level Verification
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Parity Symmetry<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 animate-pulse">
              & Post-Selection
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Filtering out computational leakage and preparation errors by post-selecting only the measurement trials that satisfy physical symmetries.
          </p>
        </div>

        {/* Section 1: Concept & Explanation */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="gradient-border rounded-2xl p-8 bg-quantum-950/10 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-400">01.</span> Symmetry & Subspaces
            </h2>
            <p className="text-sm text-slate-350 leading-relaxed">
              Many quantum algorithms prepare target states that belong to a specific mathematical subspace or satisfy distinct symmetry constraints. For instance, in a 2-qubit Bell state $|00⟩ + |11⟩$, the sum of bits is always <strong>even</strong> (parity = 0).
            </p>
            <p className="text-sm text-slate-350 leading-relaxed">
              If physical noise causes a single-qubit bit-flip error, the state becomes $|01⟩$ or $|10⟩$, which has <strong>odd</strong> parity. By monitoring this parity (either using an ancillary check qubit or via classical post-processing of the readout registry), we can detect that an error occurred and discard that specific trial.
            </p>
          </div>

          <div className="gradient-border rounded-2xl p-8 bg-quantum-950/10 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-400">02.</span> Post-Selection in Practice
            </h2>
            <p className="text-sm text-slate-350 leading-relaxed">
              Post-selection is highly effective for cleaning up state preparation and measurement (SPAM) errors and leakage errors. Its principal limitation is that it reduces the effective count rate (increasing the discard rate), but the remaining data possesses substantially higher fidelity.
            </p>
            <div className="p-4 bg-black/40 border border-slate-900 rounded-xl space-y-2 text-xs font-mono">
              <div className="text-quantum-300 font-bold">Parity Check Operator:</div>
              <div>P = Z₁ ⊗ Z₂</div>
              <div className="text-slate-500 mt-2">Post-Selection Rule:</div>
              <div>Discard if Measure(P) = -1</div>
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Post-Selection Simulator */}
        <div className="gradient-border rounded-2xl p-8 bg-[#040e09] mb-16 shadow-inner">
          <h2 className="text-2xl font-bold text-white mb-2">Parity Filter Simulator</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-3xl">
            Simulate preparing the Bell state $|00⟩ + |11⟩$. Adjust the noise sliders to inject errors, and see how post-selecting (filtering out odd-parity results) recovers the target logical state fidelity.
          </p>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="md:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-350">
                  <span>State Prep Noise:</span>
                  <span className="text-blue-400 font-bold">{prepError}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={prepError}
                  onChange={(e) => setPrepError(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-350">
                  <span>Gate execution Noise:</span>
                  <span className="text-blue-400 font-bold">{gateError}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={gateError}
                  onChange={(e) => setGateError(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="p-4 bg-blue-950/10 border border-blue-500/10 rounded-xl text-xs text-slate-450 leading-relaxed">
                <strong className="text-blue-400 block mb-1">Double-Flip Limit:</strong>
                If both qubits flip ($D_0 \to 1$ and $D_1 \to 1$), the state becomes $|11⟩$. This preserves the even parity, meaning the checker will not catch the error. This is why post-selection fidelity is not exactly 100% under high noise.
              </div>
            </div>

            {/* Readout statistics */}
            <div className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-black/40 border border-slate-900 rounded-2xl text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Unmitigated Fidelity</div>
                  <div className="text-3xl font-extrabold text-rose-450 font-mono mt-2">{unmitigatedPct}%</div>
                  <span className="text-[9px] text-slate-500 block mt-1">Raw output registry</span>
                </div>

                <div className="p-5 bg-black/40 border border-slate-900 rounded-2xl text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Post-Selected Fidelity</div>
                  <div className="text-3xl font-extrabold text-quantum-400 font-mono mt-2">{mitigatedPct}%</div>
                  <span className="text-[9px] text-slate-500 block mt-1">Symmetry-validated output</span>
                </div>
              </div>

              {/* Discard rate display */}
              <div className="p-4 rounded-xl bg-black/30 border border-slate-800/80">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-slate-450">Discarded Shots (Odd Parity):</span>
                  <span className="text-amber-400 font-bold">{discardPct}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${discardPct}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-550 mt-1 block">
                  Higher noise rates discard more trials, requiring more initial shots to get sufficient valid outcomes.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
