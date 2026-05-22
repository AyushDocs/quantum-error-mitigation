'use client'

import { useState } from 'react'

interface AlgorithmInfo {
  name: string
  depth: number
  gates: number
  description: string
  circuitSymbol: string
  inverseSymbol: string
  originalCircuit: string[]
}

const ALGORITHMS: Record<string, AlgorithmInfo> = {
  grover: {
    name: "Grover's Search (2-Qubit)",
    depth: 7,
    gates: 8,
    description: "Finds the target state |11⟩. It features H gates, an oracle CZ gate, and a diffuser containing X, H, and CZ gates. Its low qubit count makes it ideal for showing detailed gate folding.",
    circuitSymbol: "U_G",
    inverseSymbol: "U_G†",
    originalCircuit: ["H", "CZ", "H", "X", "CZ", "X", "H"],
  },
  qft: {
    name: "3-Qubit Quantum Fourier Transform",
    depth: 6,
    gates: 7,
    description: "Performs the Fourier transform of the quantum state. Built from Hadamard (H), Controlled-Phase (CP), and SWAP gates. It exhibits a uniform distribution at output.",
    circuitSymbol: "U_QFT",
    inverseSymbol: "U_QFT†",
    originalCircuit: ["H", "CP", "CP", "H", "CP", "H", "SWAP"],
  }
}

export default function CircuitVisualizer() {
  const [algoKey, setAlgoKey] = useState<'grover' | 'qft'>('grover')
  const [foldFactor, setFoldFactor] = useState<number>(3) // 1, 3, 5

  const algo = ALGORITHMS[algoKey]

  // Calculate stats based on folding
  const currentDepth = algo.depth * foldFactor
  const currentGates = algo.gates * foldFactor
  // Noise error probability approximation
  const noiseScale = foldFactor === 1 ? '1.0x (Baseline)' : `${foldFactor}.0x`
  const relativeNoise = foldFactor === 1 ? 8 : foldFactor === 3 ? 24 : 40

  // Get folding sequence: e.g. for fold=3, [U, U†, U]
  const sequence: { type: 'normal' | 'inverse'; id: number }[] = []
  for (let i = 0; i < foldFactor; i++) {
    sequence.push({
      type: i % 2 === 0 ? 'normal' : 'inverse',
      id: i
    })
  }

  return (
    <section id="circuit-visualizer" className="py-24 px-6 bg-[#030d08]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-quantum-950/80 border border-quantum-500/30 text-quantum-300 text-sm mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-quantum-400 animate-pulse" />
            Interactive Concept Demo
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Interactive{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-400 to-emerald-300">
              Gate Folding
            </span>{" "}
            Visualizer
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Zero-Noise Extrapolation requires scaling hardware noise. Since we cannot modify the physical temperature or crosstalk, we amplify noise digitally by folding the circuit.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="gradient-border rounded-2xl p-6 bg-quantum-950/20 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-white mb-4">1. Select Target Algorithm</h3>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {(Object.keys(ALGORITHMS) as Array<'grover' | 'qft'>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setAlgoKey(key)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      algoKey === key
                        ? 'bg-quantum-500/20 text-white border-quantum-400 shadow-md shadow-quantum-500/10'
                        : 'bg-black/20 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {ALGORITHMS[key].name.split(" ")[0]}
                  </button>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">2. Adjust Fold Factor (k)</h3>
              <p className="text-xs text-slate-500 mb-4">
                Controls the noise scaling. Higher fold factors execute the circuit forwards and backwards to scale gate count.
              </p>

              {/* Custom Fold Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-mono text-slate-300">
                  <span>Fold Factor (k):</span>
                  <span className="text-quantum-400 font-bold text-lg">{foldFactor}×</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setFoldFactor(val)}
                      className={`py-2 rounded-xl font-mono text-sm font-bold transition-all border ${
                        foldFactor === val
                          ? 'bg-quantum-500 text-black border-quantum-400 font-extrabold shadow-lg shadow-quantum-500/20'
                          : 'bg-black/40 text-slate-400 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {val}×
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Circuit stats panel */}
            <div className="gradient-border rounded-2xl p-6 bg-quantum-950/20 backdrop-blur-md space-y-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Physical Hardware Metrics</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-black/30 rounded-xl border border-slate-800/60">
                  <div className="text-xs text-slate-500 mb-1">Gate Depth</div>
                  <div className="text-lg font-bold text-white font-mono">{currentDepth}</div>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-slate-800/60">
                  <div className="text-xs text-slate-500 mb-1">Gate Count</div>
                  <div className="text-lg font-bold text-white font-mono">{currentGates}</div>
                </div>
                <div className="p-3 bg-black/30 rounded-xl border border-slate-800/60">
                  <div className="text-xs text-slate-500 mb-1">Noise Level</div>
                  <div className="text-lg font-bold text-quantum-300 font-mono">{noiseScale}</div>
                </div>
              </div>

              {/* Dynamic noise explanation box */}
              <div className="p-4 bg-emerald-950/10 border border-quantum-500/10 rounded-xl text-xs text-slate-300 leading-relaxed">
                <strong className="text-quantum-300 block mb-1">Logical Equivalence Proof:</strong>
                {foldFactor === 1 ? (
                  <span>Executing the original circuit {algo.circuitSymbol} once. The baseline noise error rate on IBM class hardware is approximately 8.8% for Grover&apos;s search.</span>
                ) : foldFactor === 3 ? (
                  <span>Evaluating {algo.circuitSymbol} · {algo.inverseSymbol} · {algo.circuitSymbol} = {algo.circuitSymbol} · I = {algo.circuitSymbol}. The state logic is unchanged, but gates are increased 3-fold, scaling physical noise linearly.</span>
                ) : (
                  <span>Evaluating {algo.circuitSymbol} · ({algo.inverseSymbol} · {algo.circuitSymbol})² = {algo.circuitSymbol} · I² = {algo.circuitSymbol}. This provides 5× noise scale for extrapolation fitting.</span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Visualizer Canvas */}
          <div className="lg:col-span-8 space-y-6">
            {/* Algorithm Info */}
            <div className="p-6 rounded-2xl bg-black/20 border border-slate-800/60">
              <h3 className="text-xl font-bold text-white mb-2">{algo.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{algo.description}</p>
            </div>

            {/* Interactive Circuit Diagram Container */}
            <div className="gradient-border rounded-2xl p-8 bg-[#040e09] relative overflow-hidden min-h-[300px] flex flex-col justify-between">
              {/* Dynamic Noise Glow Simulation */}
              <div 
                className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, rgba(16, 185, 129, ${relativeNoise / 300}) 0%, transparent 70%)`,
                  opacity: 0.6 + (relativeNoise / 100) * 0.4
                }}
              />

              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-500 mb-6">
                <span>INPUT |00...0⟩</span>
                <span className="text-quantum-400 font-semibold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-quantum-400 animate-ping" />
                  Noise Level: {relativeNoise}%
                </span>
                <span>MEASURE</span>
              </div>

              {/* SVG/CSS Circuit Representation */}
              <div className="relative z-10 my-auto py-6 overflow-x-auto">
                <div className="flex items-center justify-center gap-4 min-w-[500px]">
                  {/* Start State */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 font-mono shadow-md">
                      |ψ_in⟩
                    </div>
                    <span className="text-[10px] text-slate-500 mt-2 font-mono">Start</span>
                  </div>

                  {sequence.map((block, index) => (
                    <div key={block.id} className="flex items-center gap-4">
                      {/* Connecting Line */}
                      <div className="w-8 h-0.5 bg-slate-800 relative">
                        {/* Little pulsing noise sparks if k > 1 */}
                        {foldFactor > 1 && (
                          <div 
                            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-quantum-400 animate-bounce"
                            style={{ 
                              left: `${(index * 25) % 100}%`,
                              animationDelay: `${index * 0.4}s` 
                            }}
                          />
                        )}
                      </div>

                      {/* Unified block or expanded gates view */}
                      <div className="flex flex-col items-center">
                        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center w-28 text-center transition-all duration-500 ${
                          block.type === 'normal'
                            ? 'bg-quantum-950/40 border-quantum-500 text-quantum-300 shadow-md shadow-quantum-900/20'
                            : 'bg-emerald-950/20 border-quantum-400/50 text-quantum-400/90 border-dashed'
                        }`}
                        style={{
                          transform: `scale(${1.0 - (index * 0.02)})`
                        }}>
                          <span className="text-xl font-bold font-mono tracking-wider">
                            {block.type === 'normal' ? algo.circuitSymbol : algo.inverseSymbol}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-1 uppercase font-semibold">
                            {block.type === 'normal' ? 'Unitary' : 'Inverse'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-2 font-mono">Block {index + 1}</span>
                      </div>
                    </div>
                  ))}

                  {/* End State */}
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-0.5 bg-slate-800" />
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 font-mono shadow-md">
                        [M]
                      </div>
                      <span className="text-[10px] text-slate-500 mt-2 font-mono">Readout</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explanatory description below the circuit */}
              <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-quantum-500" />
                  <span>Original Circuit</span>
                  <div className="w-3 h-3 rounded-full bg-emerald-950/20 border border-quantum-400/50 border-dashed ml-3" />
                  <span>Folded Pairs (Identity)</span>
                </div>
                <div className="font-mono text-quantum-300 bg-quantum-950/60 border border-quantum-500/20 px-3 py-1 rounded-md">
                  {algoKey === 'grover' 
                    ? `Logical: Grover target |11⟩` 
                    : `Logical: Uniform Superposition`
                  }
                </div>
              </div>
            </div>

            {/* Step-by-Step folding animation detail */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-black/20 border border-slate-800/60 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-quantum-950 border border-quantum-500 flex items-center justify-center text-xs text-quantum-300 font-mono">1</span>
                  Digital Error Scaling
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In analog systems, noise is adjusted by raising pulse durations. In digital quantum processors, we do it by executing redundant gate sequences that cancel logically, but accumulate physical errors.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/20 border border-slate-800/60 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-quantum-950 border border-quantum-500 flex items-center justify-center text-xs text-quantum-300 font-mono">2</span>
                  Zero-Noise Limit
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  By running at 1×, 3×, 5× fold factors, we map out the performance decay. Using this curve, we fit a function and extrapolate back to 0× noise (the perfect, unachievable zero-noise state).
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
