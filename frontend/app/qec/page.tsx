'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function QECPage() {
  // 9 Data Qubits represented as a flat array of 9 booleans (true = X bit-flip error)
  const [dataErrors, setDataErrors] = useState<boolean[]>(Array(9).fill(false))

  // Toggle error on a data qubit
  const toggleError = (index: number) => {
    const next = [...dataErrors]
    next[index] = !next[index]
    setDataErrors(next)
  }

  // Clear all injected errors
  const clearErrors = () => {
    setDataErrors(Array(9).fill(false))
  }

  // Z-stabilizer checks (detect X errors on connected data qubits)
  // An odd number of X errors on connected qubits triggers a -1 syndrome (lights up)
  const getSyndrome = (qubitIndices: number[]) => {
    const errorCount = qubitIndices.reduce((sum, idx) => sum + (dataErrors[idx] ? 1 : 0), 0)
    return errorCount % 2 === 1
  }

  // Define stabilizer checkers (Z ancillas)
  const stabilizers = [
    { id: 'Z00', label: 'Z₀₀', qubits: [0, 1, 3, 4], x: 75, y: 75 },
    { id: 'Z01', label: 'Z₀₁', qubits: [1, 2, 4, 5], x: 175, y: 75 },
    { id: 'Z10', label: 'Z₁₀', qubits: [3, 4, 6, 7], x: 75, y: 175 },
    { id: 'Z11', label: 'Z₁₁', qubits: [4, 5, 7, 8], x: 175, y: 175 },
  ]

  // Data qubits coordinates on the SVG canvas
  const dataQubits = [
    { idx: 0, label: 'D₀', x: 25, y: 25 },
    { idx: 1, label: 'D₁', x: 125, y: 25 },
    { idx: 2, label: 'D₂', x: 225, y: 25 },
    { idx: 3, label: 'D₃', x: 25, y: 125 },
    { idx: 4, label: 'D₄', x: 125, y: 125 },
    { idx: 5, label: 'D₅', x: 225, y: 125 },
    { idx: 6, label: 'D₆', x: 25, y: 225 },
    { idx: 7, label: 'D₇', x: 125, y: 225 },
    { idx: 8, label: 'D₈', x: 225, y: 225 },
  ]

  return (
    <main className="min-h-screen bg-[#020704] text-slate-100 font-sans py-16 px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#010503] via-[#020e07] to-[#010804]" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0v60M0 30h60\' stroke=\'%2310b981\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/svg%3E")',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Navigation / Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-quantum-400 hover:text-quantum-300 font-semibold transition-colors group">
            <span className="transform transition-transform group-hover:-translate-x-1">←</span>
            Back to Mitigation Dashboard
          </Link>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-6">
            QEC Core Theory & Surface Codes
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Quantum Error<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-300 animate-pulse">
              Correction Deep-Dive
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Unlike error mitigation (which applies post-processing to recover averages), Quantum Error Correction active-guards quantum states using logical redundancy and non-destructive syndrome measurements.
          </p>
        </div>

        {/* Section 1: Core Theory */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="gradient-border rounded-2xl p-8 bg-quantum-950/10 backdrop-blur-sm space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-red-400">01.</span> The QEC Principle
            </h2>
            <p className="text-sm text-slate-350 leading-relaxed">
              We cannot copy quantum states (No-Cloning Theorem) nor measure them directly (collapsing superposition). QEC bypasses this by encoding one <strong>logical qubit</strong> into a multi-qubit entangled state of <strong>physical qubits</strong>.
            </p>
            <div className="p-4 bg-black/45 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
              <div className="text-quantum-300 font-bold">3-Qubit Bit-Flip Encoding:</div>
              <div>|ψ_logical⟩ = a|000⟩ + b|111⟩</div>
              <div className="text-slate-500 mt-2">Stabilizers (Generators):</div>
              <div>S = {"{ Z₁Z₂I, IZ₂Z₃ }"}</div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stabilizers commute with the encoded state, meaning measuring them yields +1 without altering the coefficients a and b. If a bit-flip error (X₁) occurs, the stabilizers anti-commute, and measurement yields a -1 syndrome, exposing the exact error location!
            </p>
          </div>

          <div className="gradient-border rounded-2xl p-8 bg-quantum-950/10 backdrop-blur-sm space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-red-400">02.</span> Why QEC is Hard
              </h2>
              <p className="text-sm text-slate-350 leading-relaxed">
                QEC represents the long-term path to fault-tolerant quantum computers (FTQC). However, it introduces massive physical overhead:
              </p>
              <ul className="space-y-3 mt-4 text-xs text-slate-400">
                <li className="flex gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Physical-to-Logical Scaling:</strong> A single error-corrected logical qubit requires dozens to thousands of physical qubits.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Error Threshold:</strong> Physical error rates must be below a rigorous threshold (typically ~0.1% to 1%) for correction to help rather than introduce more noise.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Syndrome Decoding:</strong> Classical controllers must decode error syndromes in real-time within microseconds.</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-red-950/10 border border-red-500/10 rounded-xl text-xs text-red-400/80 leading-relaxed">
              <strong>Mitigation vs. Correction:</strong> Mitigation (ZNE, readout calibration) requires 0 extra qubits, whereas Correction requires large physical lattices. This makes mitigation critical for today&apos;s NISQ era.
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Lattice Simulator */}
        <div className="gradient-border rounded-2xl p-8 bg-[#040e09] mb-16 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-quantum-500/5 via-transparent to-transparent pointer-events-none" />
          
          <h2 className="text-2xl font-bold text-white mb-2">Interactive 2D Surface Code Simulator</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-3xl">
            Click on the white <strong>Data Qubits</strong> (D₀ through D₈) to inject bit-flip errors (represented in red). Observe how the colored <strong>Stabilizer Ancillas</strong> (Z₀₀ through Z₁₁) monitor syndrome measurements and light up when an odd number of connected data qubits are corrupted!
          </p>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* SVG Visualizer */}
            <div className="md:col-span-7 flex justify-center bg-black/40 p-6 rounded-2xl border border-slate-800">
              <svg width="250" height="250" className="overflow-visible font-mono">
                {/* Grid lines (plaquette connections) */}
                <line x1="25" y1="25" x2="225" y2="25" stroke="#1e293b" strokeWidth="2" />
                <line x1="25" y1="125" x2="225" y2="125" stroke="#1e293b" strokeWidth="2" />
                <line x1="25" y1="225" x2="225" y2="225" stroke="#1e293b" strokeWidth="2" />
                <line x1="25" y1="25" x2="25" y2="225" stroke="#1e293b" strokeWidth="2" />
                <line x1="125" y1="25" x2="125" y2="225" stroke="#1e293b" strokeWidth="2" />
                <line x1="225" y1="25" x2="225" y2="225" stroke="#1e293b" strokeWidth="2" />

                {/* Connection lines from stabilizers to data qubits */}
                {stabilizers.map(stab => (
                  <g key={`lines-${stab.id}`}>
                    {stab.qubits.map(qIdx => {
                      const dq = dataQubits[qIdx]
                      return (
                        <line
                          key={`${stab.id}-${qIdx}`}
                          x1={stab.x}
                          y1={stab.y}
                          x2={dq.x}
                          y2={dq.y}
                          stroke={getSyndrome(stab.qubits) ? '#ef4444' : '#10b981'}
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          opacity={0.4}
                        />
                      )
                    })}
                  </g>
                ))}

                {/* Draw stabilizers (checker nodes) */}
                {stabilizers.map(stab => {
                  const isActive = getSyndrome(stab.qubits)
                  return (
                    <g key={stab.id} className="cursor-help">
                      <rect
                        x={stab.x - 16}
                        y={stab.y - 16}
                        width="32"
                        height="32"
                        rx="6"
                        fill={isActive ? '#7f1d1d' : '#064e3b'}
                        stroke={isActive ? '#ef4444' : '#10b981'}
                        strokeWidth="1.5"
                        className="transition-all duration-300"
                      />
                      <text
                        x={stab.x}
                        y={stab.y + 4}
                        textAnchor="middle"
                        fill={isActive ? '#fca5a5' : '#a7f3d0'}
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {stab.label}
                      </text>
                    </g>
                  )
                })}

                {/* Draw data qubits */}
                {dataQubits.map(dq => {
                  const hasError = dataErrors[dq.idx]
                  return (
                    <g
                      key={dq.idx}
                      className="cursor-pointer group"
                      onClick={() => toggleError(dq.idx)}
                    >
                      <circle
                        cx={dq.x}
                        cy={dq.y}
                        r="14"
                        fill={hasError ? '#ef4444' : '#1e293b'}
                        stroke={hasError ? '#f87171' : '#475569'}
                        strokeWidth="2"
                        className="transition-all duration-200 group-hover:scale-[1.15] group-hover:stroke-quantum-400"
                      />
                      <text
                        x={dq.x}
                        y={dq.y + 4}
                        textAnchor="middle"
                        fill={hasError ? '#000' : '#cbd5e1'}
                        fontSize="9"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        D{dq.idx}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Explanation / Interactive controls */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Syndrome Registry</span>
                <button
                  onClick={clearErrors}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 hover:text-white hover:border-slate-600 transition-all font-mono"
                >
                  Clear Errors
                </button>
              </div>

              <div className="space-y-3">
                {stabilizers.map(stab => {
                  const active = getSyndrome(stab.qubits)
                  return (
                    <div
                      key={stab.id}
                      className={`p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all font-mono ${
                        active
                          ? 'bg-red-950/20 border-red-500/30 text-red-300'
                          : 'bg-black/20 border-slate-900 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-red-500 animate-ping' : 'bg-slate-800'}`} />
                        <span>Stabilizer {stab.label} ({stab.id})</span>
                      </div>
                      <span className="font-bold">{active ? '-1 (Error!)' : '+1 (Normal)'}</span>
                    </div>
                  )
                })}
              </div>

              <div className="p-4 bg-quantum-950/15 border border-quantum-500/10 rounded-xl text-xs text-slate-400 leading-relaxed">
                <strong className="text-quantum-300 block mb-1">Physics Note:</strong>
                If you toggle D₄ (the center qubit), all 4 stabilizers will detect the flip and light up. If you toggle D₀, only Z₀₀ will report an error. Decoders analyze these combinations to pinpoint which data qubit flipped without measuring the actual data state.
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Decoders */}
        <div className="gradient-border rounded-2xl p-8 bg-quantum-950/10 mb-16 space-y-6">
          <h2 className="text-2xl font-bold text-white">Syndrome Match Decoders</h2>
          <p className="text-sm text-slate-350 leading-relaxed">
            Measuring the stabilizers gives us the error syndrome (which checker nodes lit up). We must classically compute the most likely physical error that caused it. This is known as the <strong>decoding problem</strong>, solved by:
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-xs leading-relaxed">
            <div className="p-5 rounded-xl bg-black/40 border border-slate-900 space-y-2">
              <strong className="text-white block text-sm">1. Minimum Weight Perfect Matching (MWPM)</strong>
              <p className="text-slate-400">
                Models the syndrome nodes as vertices in a graph and finds the matching of minimum total distance (representing the most probable errors). It is mathematically optimal for depolarizing noise but scales poorly (O(V³)), making it difficult to run in real-time at scale.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-black/40 border border-slate-900 space-y-2">
              <strong className="text-white block text-sm">2. Union-Find Decoder</strong>
              <p className="text-slate-400">
                A highly-efficient topological decoder that clusters error syndromes using union-find data structures. While slightly less accurate than MWPM, it runs in almost linear time (O(V · α(V))), making it a prime candidate for high-speed hardware control systems.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Scaling & Qubit Overhead */}
        <div className="gradient-border rounded-2xl p-8 bg-quantum-950/10 mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">Physical Qubit Overhead</h2>
          <p className="text-sm text-slate-400 mb-6">
            Topological codes protect states exponentially with the code distance d. To increase code distance, the number of required physical qubits scales quadratically: N = 2d² - 1.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-widest font-semibold text-[10px]">
                  <th className="pb-3 font-medium">Distance (d)</th>
                  <th className="pb-3 font-medium">Data Qubits (d²)</th>
                  <th className="pb-3 font-medium">Measure Qubits (d² - 1)</th>
                  <th className="pb-3 font-medium text-right">Total Physical Qubits</th>
                  <th className="pb-3 font-medium text-right">Fault Tolerance Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 font-mono text-slate-350">
                {[
                  { d: 3, data: 9, meas: 8, total: 17, threshold: '10⁻³ logical error' },
                  { d: 5, data: 25, meas: 24, total: 49, threshold: '10⁻⁵ logical error' },
                  { d: 7, data: 49, meas: 48, total: 97, threshold: '10⁻⁷ logical error' },
                  { d: 9, data: 81, meas: 80, total: 161, threshold: '10⁻⁹ logical error' },
                  { d: 15, data: 225, meas: 224, total: 449, threshold: '10⁻¹⁵ logical error' },
                ].map(row => (
                  <tr key={row.d} className="hover:bg-quantum-950/10 transition-colors">
                    <td className="py-3 font-bold text-white">d = {row.d}</td>
                    <td className="py-3">{row.data}</td>
                    <td className="py-3">{row.meas}</td>
                    <td className="py-3 text-right font-bold text-quantum-300">{row.total}</td>
                    <td className="py-3 text-right text-slate-400">{row.threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-900 text-xs text-slate-500 leading-relaxed">
            *Note: To run a 100 logical qubit algorithm (such as Shor&apos;s algorithm) with a target logical error rate of 10⁻¹⁵ (d = 15), you would require 100 × 449 = 44,900 high-quality physical qubits! This heavy overhead highlights the immediate, present-day value of zero-overhead Quantum Error Mitigation techniques.
          </div>
        </div>
      </div>
    </main>
  )
}
