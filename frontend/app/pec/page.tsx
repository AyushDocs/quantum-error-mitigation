'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PECPage() {
  const [errorRate, setErrorRate] = useState<number>(1.5) // in %
  const [gateDepth, setGateDepth] = useState<number>(10) // number of gates

  // Calculate PEC overhead
  // For single-qubit depolarizing noise:
  // Noisy gate: G_noisy = (1-e)G_ideal + e/3 (X G_ideal X + Y G_ideal Y + Z G_ideal Z)
  // Inverse representation of ideal gate G_ideal in terms of noisy gates:
  // G_ideal = c0 * G_noisy + c1 * G_noisy_X + c2 * G_noisy_Y + c3 * G_noisy_Z
  // where c0 ≈ 1 + e, c_others ≈ -e/3
  // Sum of absolute values of coefficients (gamma factor):
  // gamma = |c0| + |c1| + |c2| + |c3| = 1 + 2 * errorRate (approximately)
  const eVal = errorRate / 100
  const gammaSingle = 1 + 2 * eVal
  const totalGamma = Math.pow(gammaSingle, gateDepth)

  // Shot overhead = gamma^(2d)
  const shotMultiplier = Math.pow(gammaSingle, 2 * gateDepth)
  const baselineShots = 1000
  const requiredShots = Math.round(baselineShots * shotMultiplier)

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/20 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            Active Error Mitigation
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Probabilistic Error<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300 animate-pulse">
              Cancellation (PEC)
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Exactly canceling noise bias by sampling from a quasi-probability representation of ideal quantum operations.
          </p>
        </div>

        {/* Section 1: Concept & Python Draft */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="gradient-border rounded-2xl p-8 bg-quantum-950/10 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">01.</span> Unbiased Exact Cancellation
            </h2>
            <p className="text-sm text-slate-350 leading-relaxed">
              Unlike ZNE (which uses curves to approximate the zero-noise limit), PEC acts as a direct error filter. We first characterize the hardware noise channel of a gate. We then decompose the ideal target gate as a linear combination (quasi-probability distribution) of noisy hardware operations:
            </p>
            <div className="p-4 bg-black/45 border border-slate-800 rounded-xl font-mono text-xs text-quantum-300">
              G_ideal = ∑ c_i * G_noisy_i
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Since some coefficients $c_i$ are negative, we cannot sample directly. We define a normalization factor $\gamma = \sum |c_i| &gt; 1$, and sample configurations with probability $p_i = |c_i|/\gamma$. When taking the weighted average of outputs (scaled by sign products and $\gamma^d$), the noise bias is exactly canceled!
            </p>
          </div>

          <div className="gradient-border rounded-2xl p-8 bg-quantum-950/10 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan-400">02.</span> PEC Python Simulator Draft
            </h2>
            <p className="text-xs text-slate-450 mb-3">
              Quasi-probability sampling over a depolarizing error channel:
            </p>
            <div className="p-4 bg-black/60 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{`def run_pec_simulation(circuit, noise_model, shots=10000):
    """Executes a circuit using Probabilistic Error Cancellation."""
    # 1. Define ideal gate G and noisy gates G_i
    # 2. Represent G = ∑ c_i * G_i where some c_i may be negative
    # 3. Compute sampling probabilities p_i = |c_i| / γ, where γ = ∑ |c_i|
    # 4. Sample and run:
    #    For each shot: sample a gate from the G_i pool and track the sign product
    # 5. Mitigated Expectation = γ^d * average(sign * outcome)
    pass`}</pre>
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Sampling Calculator */}
        <div className="gradient-border rounded-2xl p-8 bg-[#040e09] mb-16 shadow-inner">
          <h2 className="text-2xl font-bold text-white mb-2">Sampling Cost & Shot Inflation Calculator</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-3xl">
            Unbiased error cancellation comes with an exponential cost. Adjust the physical gate error rate and the circuit depth to observe how rapidly the required sampling shot budget explodes!
          </p>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="md:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-350">
                  <span>Physical Gate Error (e):</span>
                  <span className="text-cyan-400 font-bold">{errorRate.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10.0"
                  step="0.5"
                  value={errorRate}
                  onChange={(e) => setErrorRate(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-350">
                  <span>Gate Depth (d):</span>
                  <span className="text-cyan-400 font-bold">{gateDepth} gates</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={gateDepth}
                  onChange={(e) => setGateDepth(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="p-4 bg-black/30 border border-slate-800/80 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Gate Overhead (γ):</span>
                  <span className="text-slate-300 font-bold">{gammaSingle.toFixed(4)}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500">Total Overhead (γᵈ):</span>
                  <span className="text-slate-300 font-bold">{totalGamma.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Cost readout */}
            <div className="md:col-span-6 space-y-4">
              <div className="p-6 rounded-2xl bg-black/40 border border-slate-800 flex flex-col justify-between text-center relative overflow-hidden">
                {requiredShots > 1000000 && (
                  <div className="absolute inset-0 bg-red-950/10 border border-red-500/20 pointer-events-none rounded-2xl" />
                )}
                
                <div>
                  <span className="text-[10px] text-slate-550 uppercase tracking-widest font-semibold">Mitigated Shot Budget</span>
                  <div className={`text-4xl font-extrabold font-mono mt-2 transition-all ${
                    requiredShots > 1000000 ? 'text-red-400' : requiredShots > 100000 ? 'text-amber-400' : 'text-quantum-400'
                  }`}>
                    {requiredShots.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-550 font-mono mt-1">
                    vs. {baselineShots.toLocaleString()} baseline shots
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                  {requiredShots > 1000000 ? (
                    <strong className="text-red-400 block font-semibold">⚠️ Exponential Cost Warning:</strong>
                  ) : requiredShots > 100000 ? (
                    <strong className="text-amber-400 block font-semibold">Moderate Overhead:</strong>
                  ) : (
                    <strong className="text-quantum-400 block font-semibold">Low Overhead:</strong>
                  )}
                  {requiredShots > 1000000 
                    ? "Overhead exceeds 1M shots! PEC is completely impractical at this noise level. Choose ZNE instead."
                    : "Overhead is manageable. PEC will yield an exact error-free expectation value."
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
