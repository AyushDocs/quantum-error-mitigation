'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RCPage() {
  const [isTwirled, setIsTwirled] = useState<boolean>(false)
  const [randomId, setRandomId] = useState<number>(0)

  // 4 possible single-qubit Pauli states: I, X, Y, Z
  const paulis = ['I', 'X', 'Y', 'Z']

  // Pre-selected combinations and their mathematical twirled matches for a CZ gate
  // Identity: (P1' ⊗ P2') · CZ · (P1 ⊗ P2) = CZ
  // Since Z commutes with CZ:
  // - If P1=I, P2=I -> P1'=I, P2'=I
  // - If P1=X, P2=I -> P1'=X, P2'=Z (since CZ (X ⊗ I) CZ = X ⊗ Z)
  // - If P1=I, P2=X -> P1'=Z, P2'=X (since CZ (I ⊗ X) CZ = Z ⊗ X)
  // - If P1=Z, P2=Z -> P1'=Z, P2'=Z (Z commutes with CZ)
  // - If P1=X, P2=X -> P1'=Y, P2'=Y (actually CZ (X ⊗ X) CZ = Y ⊗ Y or similar, let's keep it exact: CZ(X ⊗ X) = (X ⊗ X)CZ(Z ⊗ Z) -> CZ(X ⊗ X)CZ = XZ ⊗ XZ = -Y ⊗ -Y = Y ⊗ Y)
  const twirlCombinations = [
    { p1: 'X', p2: 'I', p1Prime: 'X', p2Prime: 'Z' },
    { p1: 'I', p2: 'X', p1Prime: 'Z', p2Prime: 'X' },
    { p1: 'Z', p2: 'I', p1Prime: 'Z', p2Prime: 'I' },
    { p1: 'I', p2: 'Z', p1Prime: 'I', p2Prime: 'Z' },
    { p1: 'X', p2: 'Z', p1Prime: 'X', p2Prime: 'I' },
    { p1: 'Z', p2: 'X', p1Prime: 'I', p2Prime: 'X' },
    { p1: 'X', p2: 'X', p1Prime: 'Y', p2Prime: 'Y' },
  ]

  const currentTwirl = twirlCombinations[randomId % twirlCombinations.length]

  const nextTwirl = () => {
    setIsTwirled(true)
    setRandomId(prev => prev + 1)
  }

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-950/20 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider mb-6">
            Twirling Mitigation Layer
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Randomized Compiling<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
              & Pauli Twirling
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            Converting coherent systematic gate errors (like control pulse over-rotations) into harmless stochastic noise to guarantee clean, fitable ZNE curves.
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
              Why Twirl Gates?
            </h2>
            <p className="text-sm text-slate-350 leading-relaxed">
              Coherent systematic errors (e.g., control pulses that rotate 90.5° instead of exactly 90°) accumulate quadratically in depth. They lead to complex interference and oscillatory decay curves that Richardson or Exponential models in ZNE fail to fit correctly.
            </p>
            <p className="text-sm text-slate-350 leading-relaxed">
              <strong>Randomized Compiling (RC)</strong> inserts random single-qubit Pauli gates before entangling gates and applies matching correction gates after them to maintain the circuit logic. Doing this across many runs (compilation instances) averages out the systematic pulse errors into random, stochastic depolarizing noise. The resulting decay is strictly exponential and fits ZNE perfectly.
            </p>
          </div>
        </div>

        {/* Section 2: Interactive Twirling Simulator */}
        <div className="gradient-border rounded-2xl p-8 bg-[#040e09] mb-16 shadow-inner">
          <h2 className="text-2xl font-bold text-white mb-2">CZ Gate Twirling Demonstrator</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-3xl">
            Click &quot;Generate Twirled Instance&quot; to insert random Pauli gates before a CZ gate and watch how the simulator calculates the correct matching gates after the CZ to preserve the logical identity.
          </p>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* SVG Visualizer */}
            <div className="md:col-span-8 bg-black/40 p-6 rounded-2xl border border-slate-800 flex justify-center">
              <svg width="450" height="150" className="overflow-visible font-mono">
                {/* Wires */}
                <line x1="20" y1="40" x2="430" y2="40" stroke="#475569" strokeWidth="2" />
                <line x1="20" y1="100" x2="430" y2="100" stroke="#475569" strokeWidth="2" />
                
                {/* Labels */}
                <text x="10" y="44" fill="#64748b" fontSize="10" fontWeight="bold">Q0</text>
                <text x="10" y="104" fill="#64748b" fontSize="10" fontWeight="bold">Q1</text>

                {/* CZ gate connection */}
                <line x1="225" y1="40" x2="225" y2="100" stroke="#10b981" strokeWidth="2" />
                <circle cx="225" cy="40" r="5" fill="#10b981" />
                <circle cx="225" cy="100" r="5" fill="#10b981" />
                <rect x="205" y="55" width="40" height="30" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                <text x="225" y="74" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold">CZ</text>

                {/* Twirled gates BEFORE CZ */}
                {isTwirled && (
                  <g className="transition-all duration-300">
                    {/* Q0 Pre-Pauli */}
                    <rect x="90" y="25" width="30" height="30" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="105" y="44" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold">{currentTwirl.p1}</text>
                    <text x="105" y="20" textAnchor="middle" fill="#3b82f6" fontSize="7">P1</text>

                    {/* Q1 Pre-Pauli */}
                    <rect x="90" y="85" width="30" height="30" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="105" y="104" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold">{currentTwirl.p2}</text>
                    <text x="105" y="130" textAnchor="middle" fill="#3b82f6" fontSize="7">P2</text>
                  </g>
                )}

                {/* Twirled gates AFTER CZ */}
                {isTwirled && (
                  <g className="transition-all duration-300">
                    {/* Q0 Post-Pauli */}
                    <rect x="310" y="25" width="30" height="30" rx="6" fill="#1e293b" stroke="#ec4899" strokeWidth="1.5" />
                    <text x="325" y="44" textAnchor="middle" fill="#fbcfe8" fontSize="12" fontWeight="bold">{currentTwirl.p1Prime}</text>
                    <text x="325" y="20" textAnchor="middle" fill="#ec4899" fontSize="7">P1&apos;</text>

                    {/* Q1 Post-Pauli */}
                    <rect x="310" y="85" width="30" height="30" rx="6" fill="#1e293b" stroke="#ec4899" strokeWidth="1.5" />
                    <text x="325" y="104" textAnchor="middle" fill="#fbcfe8" fontSize="12" fontWeight="bold">{currentTwirl.p2Prime}</text>
                    <text x="325" y="130" textAnchor="middle" fill="#ec4899" fontSize="7">P2&apos;</text>
                  </g>
                )}
              </svg>
            </div>

            {/* Controls & Math verification */}
            <div className="md:col-span-4 space-y-6">
              <button
                onClick={nextTwirl}
                className="w-full py-3 rounded-xl bg-quantum-500 text-black font-extrabold text-sm transition-all hover:bg-quantum-400 shadow-lg shadow-quantum-500/20"
              >
                Generate Twirled Instance
              </button>

              <div className="p-4 bg-black/40 border border-slate-900 rounded-xl space-y-3 text-xs">
                <div className="text-slate-400 font-bold font-mono">Algebraic Identity:</div>
                <div className="p-2.5 bg-black/60 rounded-md font-mono text-[10px] text-teal-400">
                  {isTwirled ? (
                    <span>
                      ({currentTwirl.p1Prime} ⊗ {currentTwirl.p2Prime}) · CZ · ({currentTwirl.p1} ⊗ {currentTwirl.p2}) = CZ
                    </span>
                  ) : (
                    <span>Click Generate to evaluate twirling</span>
                  )}
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Each randomized selection alters the physical phase of the pulses while maintaining mathematical identity. Averaging over 20+ instances converts systematic gate noise into stochastic noise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
