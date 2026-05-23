'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CodeConfig {
  name: string
  qubits: number
  generators: { id: string; formula: string }[]
  description: string
}

const CODES: CodeConfig[] = [
  {
    name: "3-Qubit Bit-Flip Code",
    qubits: 3,
    generators: [
      { id: "S₀", formula: "ZZI" },
      { id: "S₁", formula: "IZZ" }
    ],
    description: "The simplest quantum error-detecting code. It uses three physical qubits to encode one logical qubit, protecting against any single X (bit-flip) error."
  },
  {
    name: "3-Qubit Phase-Flip Code",
    qubits: 3,
    generators: [
      { id: "S₀", formula: "XXI" },
      { id: "S₁", formula: "IXX" }
    ],
    description: "Dual to the bit-flip code, this code protects against phase-flip (Z) errors by measuring stabilizers in the X-basis."
  },
  {
    name: "5-Qubit Code (Smallest Perfect Code)",
    qubits: 5,
    generators: [
      { id: "S₀", formula: "XZZXI" },
      { id: "S₁", formula: "IXZZX" },
      { id: "S₂", formula: "XIXZZ" },
      { id: "S₃", formula: "ZXIXZ" }
    ],
    description: "The smallest possible quantum code that can correct an arbitrary single-qubit error (X, Y, or Z). Its generators are cyclic shifts of XZZXI."
  }
]

export default function StabilizersPage() {
  const [selectedCodeIdx, setSelectedCodeIdx] = useState<number>(0)
  const code = CODES[selectedCodeIdx]

  // Track injected errors as a map: qubitIndex -> 'I' | 'X' | 'Y' | 'Z'
  const [errors, setErrors] = useState<Record<number, string>>({
    0: 'I', 1: 'I', 2: 'I', 3: 'I', 4: 'I'
  })

  const setQubitError = (qIdx: number, type: string) => {
    setErrors(prev => ({ ...prev, [qIdx]: type }))
  }

  const clearErrors = () => {
    setErrors({ 0: 'I', 1: 'I', 2: 'I', 3: 'I', 4: 'I' })
  }

  // Get current error string for the qubits in the code
  const getErrorString = () => {
    let str = ""
    for (let i = 0; i < code.qubits; i++) {
      str += errors[i] || 'I'
    }
    return str
  }

  const errorString = getErrorString()

  // Calculate if a generator commutes with the error string
  // For each position, check if characters are different and neither is 'I' (which means they anti-commute).
  // Total anti-commutations must be even to commute, odd to anti-commute.
  const checkCommutation = (generator: string, error: string) => {
    let antiCommutingCount = 0
    for (let i = 0; i < generator.length; i++) {
      const s = generator[i]
      const e = error[i] || 'I'
      if (s !== 'I' && e !== 'I' && s !== e) {
        antiCommutingCount++
      }
    }
    return antiCommutingCount % 2 === 0
  }

  return (
    <main className="min-h-screen bg-[#020704] text-slate-100 font-sans py-16 px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#010503] via-[#040e0b] to-[#010804]" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0v60M0 30h60\' stroke=\'%2310b981\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/svg%3E")',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Navigation */}
        <div className="mb-12">
          <Link href="/qec" className="inline-flex items-center gap-2 text-sm text-quantum-400 hover:text-quantum-300 font-semibold transition-colors group">
            <span className="transform transition-transform group-hover:-translate-x-1">←</span>
            Back to QEC Deep-Dive
          </Link>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            QEC Mathematical Foundations
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Stabilizer Formalism<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 animate-pulse">
              and Pauli Algebra
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Measuring eigenvalues of collective Pauli operators to detect physical qubit errors without destroying the logical superposition.
          </p>
        </div>

        {/* Section 1: Stabilizer Formalism Theory */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="gradient-border rounded-2xl p-6 bg-quantum-950/10 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">01.</span> Eigenstates
            </h2>
            <p className="text-xs text-slate-350 leading-relaxed">
              An operator <code className="text-emerald-300">S</code> stabilizes a state <code className="text-white">|ψ⟩</code> if <code className="text-white">S|ψ⟩ = |ψ⟩</code>. The state is in the +1 eigenspace of the operator. Measuring stabilizers leaves the logical state unchanged.
            </p>
          </div>

          <div className="gradient-border rounded-2xl p-6 bg-quantum-950/10 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">02.</span> Commutation Rules
            </h2>
            <p className="text-xs text-slate-350 leading-relaxed">
              Stabilizer generators must commute with each other to be simultaneously measurable. Furthermore, they must commute with the logical gates to protect the computing space.
            </p>
          </div>

          <div className="gradient-border rounded-2xl p-6 bg-quantum-950/10 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">03.</span> Syndrome Extraction
            </h2>
            <p className="text-xs text-slate-350 leading-relaxed">
              If an error <code className="text-white">E</code> anti-commutes with a generator <code className="text-white">S</code>, then <code className="text-white">S(E|ψ⟩) = -E(S|ψ⟩) = -E|ψ⟩</code>. Measuring <code className="text-emerald-300">S</code> returns eigenvalue <code className="text-red-400">-1</code>, signaling an error!
            </p>
          </div>
        </div>

        {/* Section 2: Interactive Playground */}
        <div className="gradient-border rounded-2xl p-8 bg-[#040e09] mb-16 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

          <h2 className="text-2xl font-bold text-white mb-2">Interactive Stabilizer Playground</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-3xl">
            Choose a quantum code, inject errors on physical qubits, and watch how the stabilizer generators commute or anti-commute to produce the syndrome registry output.
          </p>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Control panel */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Select Code</label>
                <div className="flex flex-wrap gap-2">
                  {CODES.map((c, idx) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedCodeIdx(idx)
                        clearErrors()
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                        selectedCodeIdx === idx
                          ? 'bg-emerald-500 text-black border-emerald-500 font-bold shadow-md'
                          : 'bg-black/30 text-slate-400 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed italic">{code.description}</p>
              </div>

              {/* Qubit Error Injector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inject Qubit Errors</span>
                  <button
                    onClick={clearErrors}
                    className="px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-slate-400 hover:text-white hover:border-slate-600 transition-all font-mono"
                  >
                    Reset All Qubits
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 justify-start">
                  {Array.from({ length: code.qubits }).map((_, idx) => {
                    const currentErr = errors[idx] || 'I'
                    return (
                      <div key={idx} className="flex-1 min-w-[80px] max-w-[120px] p-3 bg-black/40 border border-slate-800 rounded-xl text-center space-y-3">
                        <div className="flex justify-center">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                            currentErr !== 'I'
                              ? 'bg-red-950/40 border-red-500 text-red-400'
                              : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400'
                          }`}>
                            Q{idx}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          {['I', 'X', 'Y', 'Z'].map(type => (
                            <button
                              key={type}
                              onClick={() => setQubitError(idx, type)}
                              className={`py-1 rounded text-[9px] font-mono transition-all border ${
                                currentErr === type
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                                  : 'bg-black/40 border-slate-900 text-slate-500 hover:border-slate-800'
                              }`}
                            >
                              {type === 'I' ? 'Clean' : type}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Registry board */}
            <div className="md:col-span-5 space-y-6 bg-black/30 border border-slate-800 rounded-2xl p-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-800">
                Syndrome Registry
              </div>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between text-[11px] text-slate-500 pb-1">
                  <span>Generator</span>
                  <span>Eigenvalue</span>
                </div>

                {code.generators.map(gen => {
                  const commutes = checkCommutation(gen.formula, errorString)
                  return (
                    <div
                      key={gen.id}
                      className={`p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        commutes
                          ? 'bg-emerald-950/10 border-emerald-500/10 text-emerald-400'
                          : 'bg-red-950/20 border-red-500/20 text-red-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${commutes ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                        <span>Generator <strong className="text-white">{gen.id}</strong> ({gen.formula})</span>
                      </div>
                      <span className="font-bold text-sm">{commutes ? '+1' : '-1'}</span>
                    </div>
                  )
                })}
              </div>

              <div className="p-4 bg-quantum-950/20 border border-quantum-500/10 rounded-xl text-xs text-slate-400 space-y-2 font-mono">
                <div>
                  <span className="text-slate-500">Error String:</span>{' '}
                  <span className="text-red-400 font-bold">{errorString}</span>
                </div>
                <div>
                  <span className="text-slate-500">Syndrome Vector:</span>{' '}
                  <span className="text-white font-bold">
                    [{code.generators.map(gen => checkCommutation(gen.formula, errorString) ? '+1' : '-1').join(', ')}]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
