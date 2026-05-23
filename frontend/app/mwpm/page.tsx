'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Node {
  id: number
  label: string
  x: number
  y: number
}

const NODES: Node[] = [
  { id: 0, label: 'S₀₀', x: 80, y: 70 },
  { id: 1, label: 'S₀₁', x: 200, y: 70 },
  { id: 2, label: 'S₀₂', x: 320, y: 70 },
  { id: 3, label: 'S₁₀', x: 80, y: 180 },
  { id: 4, label: 'S₁₁', x: 200, y: 180 },
  { id: 5, label: 'S₁₂', x: 320, y: 180 }
]

interface Qubit {
  id: number
  label: string
  x: number
  y: number
}

const QUBITS: Qubit[] = [
  { id: 0, label: 'q₀', x: 140, y: 70 },
  { id: 1, label: 'q₁', x: 260, y: 70 },
  { id: 2, label: 'q₂', x: 140, y: 180 },
  { id: 3, label: 'q₃', x: 260, y: 180 },
  { id: 4, label: 'q₄', x: 80, y: 125 },
  { id: 5, label: 'q₅', x: 200, y: 125 },
  { id: 6, label: 'q₆', x: 320, y: 125 },
  { id: 7, label: 'q₇', x: 50, y: 70 },
  { id: 8, label: 'q₈', x: 50, y: 180 },
  { id: 9, label: 'q₉', x: 350, y: 70 },
  { id: 10, label: 'q₁₀', x: 350, y: 180 }
]

export default function MWPMPage() {
  // 11 physical qubits with boolean error states
  const [physicalErrors, setPhysicalErrors] = useState<boolean[]>(Array(11).fill(false))

  // Toggle physical qubit error
  const toggleQubit = (id: number) => {
    const next = [...physicalErrors]
    next[id] = !next[id]
    setPhysicalErrors(next)
  }

  const clearErrors = () => {
    setPhysicalErrors(Array(11).fill(false))
  }

  const setPreset = (type: 'clean' | 'single' | 'logical') => {
    const next = Array(11).fill(false)
    if (type === 'single') {
      next[0] = true // Inject error on q0 (correctable)
    } else if (type === 'logical') {
      // Inject errors on q7, q0, and q1 (creates a chain of 3 errors, exceeding correction capacity)
      next[7] = true
      next[0] = true
      next[1] = true
    }
    setPhysicalErrors(next)
  }

  // Calculate stabilizer checks (syndromes) active status based on physical errors
  const getActiveSyndromes = (): number[] => {
    const active: number[] = []
    
    // S00 (0): connected to q0, q4, q7
    if (((physicalErrors[0] ? 1 : 0) + (physicalErrors[4] ? 1 : 0) + (physicalErrors[7] ? 1 : 0)) % 2 === 1) {
      active.push(0)
    }
    // S01 (1): connected to q0, q1, q5
    if (((physicalErrors[0] ? 1 : 0) + (physicalErrors[1] ? 1 : 0) + (physicalErrors[5] ? 1 : 0)) % 2 === 1) {
      active.push(1)
    }
    // S02 (2): connected to q1, q6, q9
    if (((physicalErrors[1] ? 1 : 0) + (physicalErrors[6] ? 1 : 0) + (physicalErrors[9] ? 1 : 0)) % 2 === 1) {
      active.push(2)
    }
    // S10 (3): connected to q2, q4, q8
    if (((physicalErrors[2] ? 1 : 0) + (physicalErrors[4] ? 1 : 0) + (physicalErrors[8] ? 1 : 0)) % 2 === 1) {
      active.push(3)
    }
    // S11 (4): connected to q2, q3, q5
    if (((physicalErrors[2] ? 1 : 0) + (physicalErrors[3] ? 1 : 0) + (physicalErrors[5] ? 1 : 0)) % 2 === 1) {
      active.push(4)
    }
    // S12 (5): connected to q3, q6, q10
    if (((physicalErrors[3] ? 1 : 0) + (physicalErrors[6] ? 1 : 0) + (physicalErrors[10] ? 1 : 0)) % 2 === 1) {
      active.push(5)
    }

    return active
  }

  const activeSyndromes = getActiveSyndromes()

  // Double graph perfect matching solver (Exhaustive search since N is very small)
  const solveMWPM = (activeIndices: number[]) => {
    if (activeIndices.length === 0) {
      return { matching: [], weight: 0 }
    }

    const A = activeIndices
    const B = activeIndices.map(idx => idx + 100)
    const V = [...A, ...B]

    const getEdgeWeight = (u: number, v: number): number => {
      const uIsA = u < 100
      const vIsA = v < 100
      const uIdx = uIsA ? u : u - 100
      const vIdx = vIsA ? v : v - 100

      if (uIsA && vIsA) {
        // Euclidean distance
        const dx = NODES[uIdx].x - NODES[vIdx].x
        const dy = NODES[uIdx].y - NODES[vIdx].y
        return Math.sqrt(dx * dx + dy * dy)
      }
      if (!uIsA && !vIsA) {
        // Boundary-to-boundary: 0
        return 0
      }
      // Node-to-boundary (only matching to its own counterpart B_i)
      if (uIdx === vIdx) {
        const node = NODES[uIdx]
        const distLeft = node.x - 20
        const distRight = 380 - node.x
        return Math.min(distLeft, distRight)
      }
      return 1000000 // Infinite penalty
    }

    let bestMatching: [number, number][] = []
    let minWeight = Infinity

    function recurse(vertices: number[], currentMatching: [number, number][], currentWeight: number) {
      if (currentWeight >= minWeight) return
      if (vertices.length === 0) {
        if (currentWeight < minWeight) {
          minWeight = currentWeight
          bestMatching = [...currentMatching]
        }
        return
      }

      const first = vertices[0]
      const rest = vertices.slice(1)

      for (let i = 0; i < rest.length; i++) {
        const partner = rest[i]
        const w = getEdgeWeight(first, partner)
        if (w >= 1000000) continue

        const remaining = rest.filter((_, idx) => idx !== i)
        recurse(remaining, [...currentMatching, [first, partner]], currentWeight + w)
      }
    }

    recurse(V, [], 0)

    return {
      matching: bestMatching,
      weight: minWeight
    }
  }

  const { matching, weight } = solveMWPM(activeSyndromes)

  // Map to find shortest physical qubit paths between stabilizers
  const getShortestPath = (u: number, v: number): number[] => {
    const key = u < v ? `${u}-${v}` : `${v}-${u}`
    switch (key) {
      case '0-1': return [0]
      case '1-2': return [1]
      case '3-4': return [2]
      case '4-5': return [3]
      case '0-3': return [4]
      case '1-4': return [5]
      case '2-5': return [6]
      case '0-2': return [0, 1]
      case '3-5': return [2, 3]
      case '0-4': return [0, 5]
      case '0-5': return [0, 1, 6]
      case '1-3': return [0, 4]
      case '1-5': return [1, 6]
      case '2-3': return [1, 0, 4]
      case '2-4': return [1, 5]
      default: return []
    }
  }

  const getBoundaryPath = (nodeIdx: number, boundary: 'Left' | 'Right'): number[] => {
    if (boundary === 'Left') {
      if (nodeIdx === 0) return [7]
      if (nodeIdx === 3) return [8]
      if (nodeIdx === 1) return [0, 7]
      if (nodeIdx === 4) return [2, 8]
      return []
    } else {
      if (nodeIdx === 2) return [9]
      if (nodeIdx === 5) return [10]
      if (nodeIdx === 1) return [1, 9]
      if (nodeIdx === 4) return [3, 10]
      return []
    }
  }

  // Parse matched pairs and compile predicted physical error list
  const physicalMatches: { u: number; v: number; weight: number }[] = []
  const boundaryMatches: { nodeIdx: number; x1: number; y1: number; x2: number; y2: number; boundary: string; weight: number }[] = []
  const predictedErrors = Array(11).fill(false)

  matching.forEach(([u, v]) => {
    const uIsA = u < 100
    const vIsA = v < 100

    if (uIsA && vIsA) {
      const dx = NODES[u].x - NODES[v].x
      const dy = NODES[u].y - NODES[v].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      physicalMatches.push({ u, v, weight: dist })
      
      const path = getShortestPath(u, v)
      path.forEach(qIdx => {
        predictedErrors[qIdx] = true
      })
    } else if (uIsA !== vIsA) {
      const nodeIdx = uIsA ? u : v - 100
      const node = NODES[nodeIdx]
      const distLeft = node.x - 20
      const distRight = 380 - node.x
      const toLeft = distLeft < distRight
      const boundaryStr = toLeft ? 'Left' : 'Right'

      boundaryMatches.push({
        nodeIdx,
        x1: node.x,
        y1: node.y,
        x2: toLeft ? 20 : 380,
        y2: node.y,
        boundary: boundaryStr,
        weight: toLeft ? distLeft : distRight
      })

      const path = getBoundaryPath(nodeIdx, toLeft ? 'Left' : 'Right')
      path.forEach(qIdx => {
        predictedErrors[qIdx] = true
      })
    }
  })

  // Logical Error check: if predicted errors match actual injected errors
  const hasLogicalError = physicalErrors.some((val, idx) => val !== predictedErrors[idx])
  const activeInjectedCount = physicalErrors.filter(Boolean).length

  return (
    <main className="min-h-screen bg-[#020704] text-slate-100 font-sans py-16 px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#010503] via-[#03090f] to-[#010804]" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0v60M0 30h60\' stroke=\'%23a855f7\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/svg%3E")',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Navigation */}
        <div className="mb-12">
          <Link href="/qec" className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-semibold transition-colors group">
            <span className="transform transition-transform group-hover:-translate-x-1">←</span>
            Back to QEC Deep-Dive
          </Link>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-950/20 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
            Topological QEC Decoders
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Minimum Weight<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
              Perfect Matching (MWPM)
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Uncovering physical errors from stabilizer syndrome defects using Edmonds&apos; Blossom algorithm and doubled graph boundaries.
          </p>
        </div>

        {/* Section 1: MWPM Theory */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="gradient-border rounded-2xl p-6 bg-quantum-950/10 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">01.</span> Graph Mapping
            </h2>
            <p className="text-xs text-slate-350 leading-relaxed">
              When physical qubits experience errors, they trigger stabilizers on the boundaries of the error chains. The stabilizers report a <code className="text-purple-300">-1</code> syndrome (defects). We represent these defects as vertices <code className="text-white">V</code> in a graph.
            </p>
          </div>

          <div className="gradient-border rounded-2xl p-6 bg-quantum-950/10 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">02.</span> Path Weights
            </h2>
            <p className="text-xs text-slate-350 leading-relaxed">
              The edge weight between any two defects is the length of the shortest chain of physical errors connecting them. Physically, the probability of an error chain of length <code className="text-white">L</code> decays exponentially as <code className="text-white">pᴸ</code>, making shorter connections (lower weights) highly favored.
            </p>
          </div>

          <div className="gradient-border rounded-2xl p-6 bg-quantum-950/10 backdrop-blur-sm space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">03.</span> Boundary Matching
            </h2>
            <p className="text-xs text-slate-350 leading-relaxed">
              In a surface code, errors can start or end at rough/smooth boundaries. To allow defects to match to the nearest boundary rather than each other, we double the graph by adding virtual boundary nodes, resolving matching under odd defect counts.
            </p>
          </div>
        </div>

        {/* Section 2: Interactive Graph Visualizer */}
        <div className="gradient-border rounded-2xl p-8 bg-[#040e09] mb-16 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 via-transparent to-transparent pointer-events-none" />

          <h2 className="text-2xl font-bold text-white mb-2">Interactive MWPM Matching Simulator</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-3xl">
            Click on the circular **Physical Qubits** (labeled <code className="text-purple-300">q₀</code> through <code className="text-purple-300">q₁₀</code>) to inject bit errors. Watch how the stabilizer checks detect syndromes (highlighting in purple/red) and how the MWPM decoder matches syndromes to predict where the errors are!
          </p>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* SVG Graphic */}
            <div className="md:col-span-7 flex justify-center bg-black/40 p-6 rounded-2xl border border-slate-800 overflow-x-auto w-full">
              <svg width="400" height="250" className="overflow-visible font-mono min-w-[400px]">
                {/* Boundaries */}
                <line x1="20" y1="20" x2="20" y2="230" stroke="#a855f7" strokeWidth="3" opacity="0.6" strokeDasharray="4 4" />
                <text x="15" y="15" textAnchor="start" fill="#a855f7" fontSize="9" fontWeight="bold">LEFT BOUNDARY</text>

                <line x1="380" y1="20" x2="380" y2="230" stroke="#a855f7" strokeWidth="3" opacity="0.6" strokeDasharray="4 4" />
                <text x="385" y="15" textAnchor="end" fill="#a855f7" fontSize="9" fontWeight="bold">RIGHT BOUNDARY</text>

                {/* Grid connections (qubit wires) */}
                <line x1="20" y1="70" x2="380" y2="70" stroke="#1e293b" strokeWidth="1.5" />
                <line x1="20" y1="180" x2="380" y2="180" stroke="#1e293b" strokeWidth="1.5" />
                <line x1="80" y1="70" x2="80" y2="180" stroke="#1e293b" strokeWidth="1.5" />
                <line x1="200" y1="70" x2="200" y2="180" stroke="#1e293b" strokeWidth="1.5" />
                <line x1="320" y1="70" x2="320" y2="180" stroke="#1e293b" strokeWidth="1.5" />

                {/* Draw physical matches (Stabilizer-to-Stabilizer Matching paths) */}
                {physicalMatches.map(({ u, v }) => {
                  const n1 = NODES[u]
                  const n2 = NODES[v]
                  return (
                    <g key={`match-phys-${u}-${v}`}>
                      <line
                        x1={n1.x}
                        y1={n1.y}
                        x2={n2.x}
                        y2={n2.y}
                        stroke="#e9d5ff"
                        strokeWidth="5"
                        opacity="0.15"
                        className="animate-pulse"
                      />
                      <line
                        x1={n1.x}
                        y1={n1.y}
                        x2={n2.x}
                        y2={n2.y}
                        stroke="#c084fc"
                        strokeWidth="2.5"
                      />
                    </g>
                  )
                })}

                {/* Draw boundary matches (Stabilizer-to-Boundary Matching paths) */}
                {boundaryMatches.map(({ nodeIdx, x1, y1, x2, y2 }) => (
                  <g key={`match-bound-${nodeIdx}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#fca5a5"
                      strokeWidth="5"
                      opacity="0.15"
                      className="animate-pulse"
                    />
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                    />
                  </g>
                ))}

                {/* Draw stabilizer nodes */}
                {NODES.map(node => {
                  const isActive = activeSyndromes.includes(node.id)
                  return (
                    <g key={node.id}>
                      <rect
                        x={node.x - 14}
                        y={node.y - 14}
                        width="28"
                        height="28"
                        rx="4"
                        fill={isActive ? '#7f1d1d' : '#0b1329'}
                        stroke={isActive ? '#f87171' : '#1e293b'}
                        strokeWidth="2"
                        className="transition-all duration-200"
                      />
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        fill={isActive ? '#fca5a5' : '#cbd5e1'}
                        fontSize="9"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {node.label}
                      </text>
                    </g>
                  )
                })}

                {/* Draw physical qubits (clickable beads) */}
                {QUBITS.map(q => {
                  const hasErr = physicalErrors[q.id]
                  const isPred = predictedErrors[q.id]
                  return (
                    <g
                      key={q.id}
                      className="cursor-pointer group"
                      onClick={() => toggleQubit(q.id)}
                    >
                      {/* Prediction Highlight ring */}
                      {isPred && (
                        <circle
                          cx={q.x}
                          cy={q.y}
                          r="15"
                          fill="none"
                          stroke="#c084fc"
                          strokeWidth="2"
                          className="animate-ping"
                          style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                        />
                      )}
                      <circle
                        cx={q.x}
                        cy={q.y}
                        r="11"
                        fill={hasErr ? '#ef4444' : '#090f1d'}
                        stroke={hasErr ? '#f87171' : isPred ? '#c084fc' : '#475569'}
                        strokeWidth={hasErr || isPred ? "2" : "1.5"}
                        className="transition-all duration-200 group-hover:scale-125"
                        style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                      />
                      <text
                        x={q.x}
                        y={q.y + 3.5}
                        textAnchor="middle"
                        fill={hasErr ? '#ffffff' : '#e2e8f0'}
                        fontSize="9"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {q.label}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Readout panel */}
            <div className="md:col-span-5 space-y-6">
              {/* Presets */}
              <div className="p-4 bg-black/30 border border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Preset Scenarios</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPreset('clean')}
                    className="px-2 py-2 rounded-xl bg-black/40 hover:bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-350 transition-all text-center"
                  >
                    No Error (Clean)
                  </button>
                  <button
                    onClick={() => setPreset('single')}
                    className="px-2 py-2 rounded-xl bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-500/40 text-[9px] font-bold text-emerald-400 transition-all text-center"
                  >
                    Error & Detected
                  </button>
                  <button
                    onClick={() => setPreset('logical')}
                    className="px-2 py-2 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 text-[9px] font-bold text-red-400 transition-all text-center"
                  >
                    Error & Not Detected
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Decoder State</span>
                <button
                  onClick={clearErrors}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 hover:text-white hover:border-slate-600 transition-all font-mono"
                >
                  Clear Errors
                </button>
              </div>

              <div className="space-y-4">
                {/* Status Summary */}
                <div className="p-4 rounded-xl bg-black/40 border border-slate-900 space-y-3 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Injected Errors:</span>
                    <span className="text-red-400 font-bold">
                      {activeInjectedCount > 0 
                        ? QUBITS.filter(q => physicalErrors[q.id]).map(q => q.label).join(', ')
                        : 'None (Clean)'
                      }
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">MWPM Predictions:</span>
                    <span className="text-purple-300 font-bold">
                      {predictedErrors.some(Boolean)
                        ? QUBITS.filter(q => predictedErrors[q.id]).map(q => q.label).join(', ')
                        : 'None'
                      }
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-slate-900 pt-2">
                    <span className="text-slate-500 font-bold">Total Path Cost:</span>
                    <span className="text-quantum-400 font-bold">{weight.toFixed(1)} px</span>
                  </div>

                  <div className="flex justify-between border-t border-slate-900 pt-2">
                    <span className="text-slate-500 font-bold">Logical State:</span>
                    {activeInjectedCount === 0 ? (
                      <span className="text-emerald-400 font-bold">Clean</span>
                    ) : hasLogicalError ? (
                      <span className="text-red-400 font-bold">Logical Error (Corrupted)</span>
                    ) : (
                      <span className="text-emerald-400 font-bold">Corrected (Preserved)</span>
                    )}
                  </div>
                </div>

                {/* Physical Qubit Log Table */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Physical Qubit Register</div>
                  <div
                    className="max-h-[160px] overflow-y-auto pr-1 border border-slate-900 rounded-xl divide-y divide-slate-900 text-[11px] font-mono"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#6b21a8 #020704'
                    }}
                  >
                    <div className="p-2 bg-black/30 text-slate-500 flex justify-between">
                      <span className="w-1/3">Qubit</span>
                      <span className="w-1/3 text-center">Injected</span>
                      <span className="w-1/3 text-right">Predicted</span>
                    </div>
                    {QUBITS.map(q => {
                      const hasErr = physicalErrors[q.id]
                      const isPred = predictedErrors[q.id]
                      return (
                        <div key={q.id} className="p-2 flex justify-between hover:bg-slate-950/20 transition-all">
                          <span className="w-1/3 font-bold text-slate-350">{q.label}</span>
                          <span className={`w-1/3 text-center ${hasErr ? 'text-red-400 font-bold' : 'text-slate-600'}`}>
                            {hasErr ? 'Yes' : 'No'}
                          </span>
                          <span className={`w-1/3 text-right ${isPred ? 'text-purple-400 font-bold' : 'text-slate-600'}`}>
                            {isPred ? 'Yes' : 'No'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
