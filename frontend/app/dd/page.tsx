'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DDPage() {
  const [sequenceType, setSequenceType] = useState<'none' | 'cpmg' | 'xy4'>('none')
  const [idleDuration, setIdleDuration] = useState<number>(200) // in ns

  // Calculate simulated dephasing error
  // T2 dephasing rate (approx 150us = 150000ns)
  const T2 = 120 // dephasing time constant scale factor
  const rawError = 1 - Math.exp(-idleDuration / T2)

  // Decoupling effectiveness
  const mitigationFactor = sequenceType === 'none' ? 1.0 : sequenceType === 'cpmg' ? 0.15 : 0.05
  const dephasingError = rawError * mitigationFactor
  const dephasingPct = (dephasingError * 100).toFixed(1)

  return (
    <main className="min-h-screen bg-[#020704] text-slate-100 font-sans py-16 px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#010503] via-[#020d07] to-[#010804]" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            Passive Error Mitigation
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Dynamical Decoupling<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              (DD) Pulse Sequences
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Protecting idle qubits from phase relaxation during multi-qubit operations using periodic sequences of fast, reversing control pulses.
          </p>
        </div>

        {/* Section 1: Concept & Python Draft */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="gradient-border rounded-2xl p-8 bg-quantum-950/10 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-quantum-400">01.</span> What is Dynamical Decoupling?
            </h2>
            <p className="text-sm text-slate-350 leading-relaxed">
              When executing complex quantum circuits (such as Grover&apos;s diffuser or QFT swap networks), entangling gates (CNOT, CZ) take significantly longer than single-qubit gates. Qubits not participating in these gates must sit <strong>idle</strong>, during which they accumulate dephasing noise (T₂ dephasing) and interact destructively via crosstalk.
            </p>
            <p className="text-sm text-slate-350 leading-relaxed">
              Dynamical Decoupling is a passive control technique that solves this by applying a sequence of fast pulses (e.g. X or Y phase reversals) that rotate the qubit state. Because these rotations cancel out to identity, they do not change the computational logic, but they effectively cancel out low-frequency environmental noise.
            </p>
          </div>

          <div className="gradient-border rounded-2xl p-8 bg-quantum-950/10 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-quantum-400">02.</span> Qiskit Implementation Pass
            </h2>
            <p className="text-xs text-slate-450 mb-3">
              We can configure a transpiler pass in Qiskit to schedule idle periods and inject DD pulse sequences automatically:
            </p>
            <div className="p-4 bg-black/60 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{`def apply_dynamical_decoupling(circuit, dd_sequence=['x', 'x']):
    """Inserts DD pulse sequences into idle periods of a circuit."""
    from qiskit.transpiler.passes import PadDelay, DynamicalDecoupling
    from qiskit.circuit.library import XGate
    
    # 1. Schedule the circuit to find idle times (delays)
    # 2. Define the DD sequence (e.g. CPMG: X - X)
    dd_gates = [XGate(), XGate()]
    
    # 3. Apply the Qiskit DynamicalDecoupling pass
    # Returns a circuit with DD pulses injected
    pass`}</pre>
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Pulse Simulator */}
        <div className="gradient-border rounded-2xl p-8 bg-[#040e09] mb-16 shadow-inner">
          <h2 className="text-2xl font-bold text-white mb-2">Idle Time Pulse Visualizer</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-3xl">
            Simulate a qubit sitting idle while an entangling gate takes place on another qubit. Adjust the idle duration slider, choose a decoupling sequence, and watch how the pulses keep dephasing error under control!
          </p>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Interactive Timeline */}
            <div className="md:col-span-8 bg-black/40 p-6 rounded-2xl border border-slate-800 space-y-8">
              {/* Qubit 0: Active */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-450 font-mono">
                  <span>Qubit 0 (Active Gate)</span>
                  <span className="text-slate-500">2-Qubit Entangling Block</span>
                </div>
                <div className="h-12 bg-slate-900/60 rounded-xl relative border border-slate-800/80 overflow-hidden flex items-center px-4">
                  <div className="h-8 w-44 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-400 text-xs font-bold flex items-center justify-center font-mono">
                    CNOT (Gate Target)
                  </div>
                  <div className="flex-1 h-0.5 bg-slate-800" />
                </div>
              </div>

              {/* Qubit 1: Idle (Target for DD) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-450 font-mono">
                  <span>Qubit 1 (Idle & Protected)</span>
                  <span className="text-quantum-400 font-bold">
                    {sequenceType === 'none' ? 'No Decoupling (Idle)' : `${sequenceType.toUpperCase()} Pulses Active`}
                  </span>
                </div>
                <div className="h-12 bg-slate-900/60 rounded-xl relative border border-slate-800/80 overflow-hidden flex items-center">
                  {/* Start padding line */}
                  <div className="w-4 h-0.5 bg-slate-800" />
                  
                  {/* Idle interval box */}
                  <div className="flex-1 h-8 rounded-lg bg-emerald-950/5 border border-dashed border-emerald-500/10 relative flex items-center justify-around px-4">
                    {sequenceType === 'none' && (
                      <span className="text-[10px] text-rose-400/80 font-mono uppercase tracking-widest animate-pulse mx-auto">
                        Idle: Phase Dephasing Active
                      </span>
                    )}

                    {sequenceType === 'cpmg' && (
                      <>
                        <div className="w-8 h-6 rounded bg-emerald-500 text-black font-extrabold text-[10px] flex items-center justify-center font-mono shadow-md">X</div>
                        <div className="flex-1 h-0.5 bg-emerald-500/20" />
                        <div className="w-8 h-6 rounded bg-emerald-500 text-black font-extrabold text-[10px] flex items-center justify-center font-mono shadow-md">X</div>
                      </>
                    )}

                    {sequenceType === 'xy4' && (
                      <>
                        <div className="w-6 h-6 rounded bg-emerald-500 text-black font-bold text-[9px] flex items-center justify-center font-mono shadow">X</div>
                        <div className="w-6 h-6 rounded bg-teal-500 text-black font-bold text-[9px] flex items-center justify-center font-mono shadow">Y</div>
                        <div className="w-6 h-6 rounded bg-emerald-500 text-black font-bold text-[9px] flex items-center justify-center font-mono shadow">X</div>
                        <div className="w-6 h-6 rounded bg-teal-500 text-black font-bold text-[9px] flex items-center justify-center font-mono shadow">Y</div>
                      </>
                    )}
                  </div>

                  {/* End padding line */}
                  <div className="w-8 h-0.5 bg-slate-800" />
                </div>
              </div>
            </div>

            {/* Metrics & Control Panel */}
            <div className="md:col-span-4 space-y-6">
              <div className="space-y-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Pulse Sequence
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['none', 'cpmg', 'xy4'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setSequenceType(type)}
                      className={`py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                        sequenceType === type
                          ? 'bg-quantum-500 text-black border-quantum-400 font-extrabold shadow-lg shadow-quantum-500/20'
                          : 'bg-black/40 text-slate-450 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {type === 'none' ? 'None' : type.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-350">
                  <span>Idle Interval:</span>
                  <span className="text-quantum-400 font-bold">{idleDuration} ns</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  value={idleDuration}
                  onChange={(e) => setIdleDuration(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-quantum-500"
                />
              </div>

              {/* Display Resulting Error */}
              <div className="p-4 rounded-xl bg-black/40 border border-slate-900 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Qubit Dephasing Error (T₂)</div>
                <div className={`text-3xl font-bold font-mono mt-2 transition-all ${
                  dephasingError > 0.4 ? 'text-rose-400' : dephasingError > 0.1 ? 'text-amber-400' : 'text-quantum-400'
                }`}>
                  {dephasingPct}%
                </div>
                <div className="text-[9px] text-slate-500 mt-2 font-mono">
                  {sequenceType === 'none' 
                    ? 'State vector suffers decay from dephasing'
                    : `DD pulses cancel dephasing by ${((1 - mitigationFactor) * 100).toFixed(0)}%`
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
