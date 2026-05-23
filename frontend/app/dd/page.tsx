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
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            Protecting idle qubits from phase relaxation during multi-qubit operations using periodic sequences of fast, reversing control pulses.
          </p>
          <div className="flex justify-center">
            <a
              href="https://github.com/AyushDocs/quantum-error-mitigation/blob/main/notebooks/04-AyushDocs-AdvancedErrorMitigation.ipynb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-slate-800 text-xs font-semibold text-slate-350 hover:text-white hover:border-slate-600 hover:bg-black/60 transition-all shadow-sm"
            >
              <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
              </svg>
              View Advanced Mitigation Jupyter Notebook
            </a>
          </div>
        </div>

        {/* Section 1: Concept */}
        <div className="mb-16">
          <div className="gradient-border rounded-2xl p-8 bg-quantum-950/10 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              What is Dynamical Decoupling?
            </h2>
            <p className="text-sm text-slate-350 leading-relaxed">
              When executing complex quantum circuits (such as Grover&apos;s diffuser or QFT swap networks), entangling gates (CNOT, CZ) take significantly longer than single-qubit gates. Qubits not participating in these gates must sit <strong>idle</strong>, during which they accumulate dephasing noise (T<sub>2</sub> dephasing) and interact destructively via crosstalk.
            </p>
            <p className="text-sm text-slate-350 leading-relaxed">
              Dynamical Decoupling is a passive control technique that solves this by applying a sequence of fast pulses (e.g. X or Y phase reversals) that rotate the qubit state. Because these rotations cancel out to identity, they do not change the computational logic, but they effectively cancel out low-frequency environmental noise.
            </p>
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
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Qubit Dephasing Error (T<sub>2</sub>)</div>
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
