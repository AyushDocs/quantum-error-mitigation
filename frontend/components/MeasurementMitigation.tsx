'use client'

import { useState } from 'react'
import { calibrationMatrix } from '@/lib/data'

export default function MeasurementMitigation() {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null)

  const states = ['00', '01', '10', '11']

  const getExplanation = () => {
    if (!hoveredCell) {
      return "Hover over any probability cell in the matrix to see how quantum readout noise behaves."
    }

    const { row, col } = hoveredCell
    const prep = states[col]
    const meas = states[row]
    const val = calibrationMatrix[row][col]
    const pct = (val * 100).toFixed(2)

    if (row === col) {
      return `Correct Readout: When the state |${prep}⟩ was prepared, it was correctly measured as |${meas}⟩ with a probability of ${pct}%.`
    } else {
      return `Readout Bit-Flip Error: When the state |${prep}⟩ was prepared, hardware noise caused a bit-flip, causing it to be incorrectly measured as |${meas}⟩ with a probability of ${pct}%.`
    }
  }

  return (
    <section id="measurement-mitigation" className="py-24 px-6 bg-[#030a06] border-t border-slate-900">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Measurement Error{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-400 to-emerald-300">
            Calibration & Mitigation
          </span>
        </h2>
        <p className="text-slate-400 text-center mb-6 max-w-2xl mx-auto">
          Readout noise (errors in measuring qubits at the end of a circuit) is often the largest error source. We calibrate this by measuring all basis states and solving the resulting matrix equation.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <a
            href="https://github.com/AyushDocs/quantum-error-mitigation/blob/main/notebooks/02-AyushDocs-MeasurementErrorMitigation.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-slate-800 text-xs font-semibold text-slate-350 hover:text-white hover:border-slate-600 hover:bg-black/60 transition-all shadow-sm"
          >
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
            </svg>
            View Readout Mitigation Notebook
          </a>
          <a
            href="https://github.com/AyushDocs/quantum-error-mitigation/blob/main/notebooks/03-AyushDocs-CombinedMitigationStacking.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-slate-800 text-xs font-semibold text-slate-350 hover:text-white hover:border-slate-600 hover:bg-black/60 transition-all shadow-sm"
          >
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
            </svg>
            View Combined Mitigation Stacking Notebook
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Interactive Calibration Matrix */}
          <div className="gradient-border rounded-2xl p-6 bg-quantum-950/10 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">2-Qubit Calibration Matrix (M)</h3>
              <p className="text-xs text-slate-500 mb-6">
                Columns represent the <strong>Prepared State</strong> (the true state). Rows represent the <strong>Measured State</strong> (what the hardware reported).
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="p-3 text-left text-xs font-mono text-slate-500">Prep ↓ / Meas →</th>
                      {states.map(s => (
                        <th key={s} className="p-3 text-center text-xs font-mono text-slate-400 font-bold">|{s}⟩</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {calibrationMatrix.map((row, i) => (
                      <tr key={i} className="border-b border-slate-900/60 last:border-0 hover:bg-quantum-950/20 transition-colors">
                        <td className="p-3 text-quantum-300 font-mono font-bold text-xs">|{states[i]}⟩</td>
                        {row.map((val, j) => {
                          const isHovered = hoveredCell?.row === i && hoveredCell?.col === j
                          const isDiagonal = i === j
                          return (
                            <td
                              key={j}
                              onMouseEnter={() => setHoveredCell({ row: i, col: j })}
                              onMouseLeave={() => setHoveredCell(null)}
                              className={`p-3 text-center font-mono text-sm cursor-help transition-all duration-200 rounded-md ${
                                isDiagonal
                                  ? 'text-quantum-400 font-bold bg-quantum-500/5 hover:bg-quantum-500/20'
                                  : 'text-rose-400/70 bg-rose-950/5 hover:bg-rose-950/20'
                              } ${isHovered ? 'ring-1 ring-quantum-400 scale-[1.05]' : ''}`}
                            >
                              {val.toFixed(4)}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dynamic Explain Panel */}
            <div className="mt-8 p-4 rounded-xl bg-black/40 border border-slate-800 text-xs text-slate-300 min-h-[64px] flex items-center transition-all duration-300">
              <p className="leading-relaxed">
                <span className="text-quantum-400 font-bold mr-1">Explanation:</span>
                {getExplanation()}
              </p>
            </div>
          </div>

          {/* Mathematical Process & Impact */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="gradient-border rounded-2xl p-6 bg-quantum-950/10">
              <h3 className="text-lg font-semibold text-white mb-4">Step-by-Step Mitigation Stack</h3>
              <ol className="space-y-4 text-xs text-slate-300">
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-quantum-500 text-black font-bold font-mono text-[10px] shrink-0">1</span>
                  <div>
                    <strong className="text-white block mb-0.5">Prepare Basis States</strong>
                    <span>Initialize the device in |00⟩, |01⟩, |10⟩, and |11⟩.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-quantum-500 text-black font-bold font-mono text-[10px] shrink-0">2</span>
                  <div>
                    <strong className="text-white block mb-0.5">Measure & Build Matrix</strong>
                    <span>Record the outputs to form the confusion matrix M, where M_ij = P(measured j | prepared i).</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-quantum-500 text-black font-bold font-mono text-[10px] shrink-0">3</span>
                  <div>
                    <strong className="text-white block mb-0.5">Invert Readout Mapping</strong>
                    <span>The noisy probabilities relate to true values by P_noisy = M · P_true. We find the pseudo-inverse M⁻¹.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-quantum-500 text-black font-bold font-mono text-[10px] shrink-0">4</span>
                  <div>
                    <strong className="text-white block mb-0.5">Apply Correction Vector</strong>
                    <span>Recover the clean distribution: P_mitigated = M⁻¹ · P_noisy (re-normalized to prevent negative probabilities).</span>
                  </div>
                </li>
              </ol>
            </div>

            {/* Readout Mitigation Impact Display */}
            <div className="gradient-border rounded-2xl p-6 bg-quantum-950/10">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Readout Mitigation Impact (Grover)</h3>
              <div className="grid grid-cols-3 gap-2 items-center text-center">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Unmitigated</div>
                  <div className="text-xl font-bold text-rose-400 font-mono mt-1">0.8900</div>
                </div>
                <div className="text-slate-600 text-xl font-mono">→</div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Mitigated</div>
                  <div className="text-xl font-bold text-quantum-400 font-mono mt-1">0.9631</div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Readout Error Reduction:</span>
                <span className="text-quantum-400 font-bold font-mono">67.6% error corrected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
