'use client'

import {
  Line, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ComposedChart,
} from 'recharts'
import { groverResults, qftResults, colorMap } from '@/lib/data'
import React, { useState } from 'react'

const ALL_FITS = ['Linear', 'Quadratic', 'Exponential', 'Richardson']

function generateFitValues(algo: 'grover' | 'qft', fitName: string, xs: number[]) {
  const results = algo === 'grover' ? groverResults : qftResults
  const data = results.zneExtrapolated
  const p0 = data[fitName as keyof typeof data] as number
  const measured = algo === 'grover' ? groverResults.measured : qftResults.hellingerFidelity
  const foldFactors = results.foldFactors

  if (fitName === 'Linear') {
    const slope = (measured[measured.length - 1] - p0) / foldFactors[foldFactors.length - 1]
    return xs.map(x => ({ x, y: Math.max(0, Math.min(1.02, p0 + slope * x)) }))
  }
  if (fitName === 'Quadratic' || fitName === 'Richardson') {
    const slope = (measured[1] - measured[0]) / 2
    const quad = (measured[2] - 2 * measured[1] + measured[0]) / 4
    return xs.map(x => ({ x, y: Math.max(0, Math.min(1.02, p0 + slope * x + quad * x * x)) }))
  }
  // Exponential approximation
  const rate = algo === 'grover' ? 0.35 : 0.08
  return xs.map(x => ({ x, y: Math.max(0, Math.min(1.02, p0 + (measured[0] - p0) * (1 - Math.exp(-x * rate)))) }))
}

export default function ZNEChart() {
  const [activeAlgo, setActiveAlgo] = useState<'grover' | 'qft'>('grover')
  const [activeFits, setActiveFits] = useState<Set<string>>(new Set(ALL_FITS))

  const toggleFit = (name: string) => {
    const next = new Set(activeFits)
    if (next.has(name)) next.delete(name)
    else next.add(name)
    setActiveFits(next)
  }

  const results = activeAlgo === 'grover' ? groverResults : qftResults
  const isGrover = activeAlgo === 'grover'

  const measuredData = results.foldFactors.map((ff, i) => ({
    x: ff,
    y: isGrover ? groverResults.measured[i] : qftResults.hellingerFidelity[i],
  }))

  const smoothXs = Array.from({ length: 100 }, (_, i) => (i / 99) * 10)

  // Configure chart aesthetics
  const yDomain = isGrover ? [0.6, 1.03] : [0.9990, 1.0002]
  const yLabel = isGrover ? 'P(|11⟩) — Success Prob' : 'Hellinger Fidelity'
  const yTickFormatter = isGrover ? (val: number) => val.toFixed(2) : (val: number) => val.toFixed(4)

  return (
    <section id="zne-chart" className="py-24 px-6 bg-[#020906] border-t border-slate-900">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Zero-Noise{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-400 to-emerald-300">
            Extrapolation (ZNE)
          </span>{" "}
          Scans
        </h2>
        <p className="text-slate-400 text-center mb-6 max-w-2xl mx-auto">
          Plotting noise degradation curves. Watch how gate folding increases physical errors and fit curves extrapolate back to the noiseless state (fold factor = 0).
        </p>
        <div className="flex justify-center mb-10">
          <a
            href="https://github.com/AyushDocs/quantum-error-mitigation/blob/main/notebooks/01-AyushDocs-ZeroNoiseExtrapolation.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-slate-800 text-xs font-semibold text-slate-350 hover:text-white hover:border-slate-600 hover:bg-black/60 transition-all shadow-sm"
          >
            <svg className="w-4 h-4 text-slate-400 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
            </svg>
            View ZNE Jupyter Notebook
          </a>
        </div>

        {/* Algorithm Switcher Tabs */}
        <div className="flex justify-center mb-8 w-full">
          <div className="flex flex-col sm:flex-row p-1 rounded-xl bg-black/40 border border-slate-800/80 w-full sm:w-auto gap-1 sm:gap-0">
            <button
              onClick={() => setActiveAlgo('grover')}
              className={`px-3 py-2.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all text-center ${
                activeAlgo === 'grover'
                  ? 'bg-quantum-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grover&apos;s Search (Target state)
            </button>
            <button
              onClick={() => setActiveAlgo('qft')}
              className={`px-3 py-2.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all text-center ${
                activeAlgo === 'qft'
                  ? 'bg-quantum-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3-Qubit QFT (Hellinger Fidelity)
            </button>
          </div>
        </div>

        {/* Recharts Chart */}
        <div className="gradient-border rounded-2xl p-6 bg-quantum-950/10 mb-8 shadow-inner">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart margin={{ top: 25, right: 30, left: 35, bottom: 35 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#12241a" />
              <XAxis
                dataKey="x"
                type="number"
                domain={[0, 10]}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'Fold Factor (noise multiplier)', position: 'bottom', fill: '#94a3b8', offset: 10, fontSize: 12 }}
                allowDataOverflow
              />
              <YAxis
                domain={yDomain}
                tickFormatter={yTickFormatter}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8', offset: -15, fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ background: '#05180f', border: '1px solid #10b981', borderRadius: '12px', color: '#e2e8f0' }}
                formatter={(value: number, name: string) => [value.toFixed(isGrover ? 4 : 6), name]}
                labelFormatter={(label) => `Noise Fold Factor: ${label}×`}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconSize={8}
                wrapperStyle={{ fontSize: '10px', color: '#94a3b8', paddingTop: '15px' }} 
              />

              {/* Ideal line */}
              <Line data={[{ x: 0, y: isGrover ? groverResults.ideal : qftResults.idealFidelity }, { x: 10, y: isGrover ? groverResults.ideal : qftResults.idealFidelity }]}
                    type="monotone" dataKey="y" stroke={colorMap.Ideal} strokeDasharray="5 5"
                    dot={false} name="Ideal Limit" isAnimationActive={false} />

              {/* Measured scatter */}
              <Scatter data={measuredData} fill={colorMap.Measured} name="Measured (Noisy Hardware)"
                       stroke="#b45309" strokeWidth={1} />

              {/* Fit lines */}
              {ALL_FITS.filter(f => activeFits.has(f)).map(fitName => {
                const fitVals = generateFitValues(activeAlgo, fitName, smoothXs)
                const zneVal = results.zneExtrapolated[fitName as keyof typeof results.zneExtrapolated] as number
                return (
                  <React.Fragment key={fitName}>
                    <Line data={fitVals} type="monotone" dataKey="y"
                          stroke={colorMap[fitName]} strokeDasharray="6 3"
                          dot={false} name={`${fitName} Fit`} isAnimationActive={false} strokeWidth={1.5} />
                    <Scatter data={[{ x: 0, y: zneVal }]}
                             fill={colorMap[fitName]} name={`${fitName} ZNE`}
                             stroke="#000" strokeWidth={0.5} shape="star" legendType="none" />
                  </React.Fragment>
                )
              })}

              {/* ZNE star at 0 */}
              <Scatter data={[{ x: 0, y: isGrover ? groverResults.mitigation.combined : qftResults.mitigationFidelity.mitigated }]}
                       fill={colorMap.Linear} name="Mitigated Stack Limit" stroke="#000" strokeWidth={1} shape="diamond" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive Fit selectors */}
        <div className="space-y-4">
          <div className="text-center text-xs text-slate-500 uppercase tracking-widest">
            Toggle Fits in Real-Time
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {ALL_FITS.map(name => (
              <button key={name} onClick={() => toggleFit(name)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                        activeFits.has(name)
                          ? 'bg-opacity-20 text-white border-current shadow-md'
                          : 'bg-opacity-5 text-slate-500 border-slate-800 hover:border-slate-600'
                      }`}
                      style={{ backgroundColor: activeFits.has(name) ? colorMap[name] + '20' : undefined,
                               borderColor: activeFits.has(name) ? colorMap[name] : undefined }}>
                {name} Fit Model
              </button>
            ))}
          </div>
        </div>

        {/* Metric Extrapolated Display cards */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ALL_FITS.map(name => {
            const val = results.zneExtrapolated[name as keyof typeof results.zneExtrapolated] as number
            return (
              <div key={name} className="text-center p-5 rounded-xl bg-quantum-950/10 border border-quantum-800/10 hover:border-quantum-500/30 transition-all duration-300">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{name} Fit</div>
                <div className="text-2xl font-bold font-mono" style={{ color: colorMap[name] }}>
                  {val.toFixed(isGrover ? 4 : 5)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {isGrover ? 'Extrapolated P(|11⟩)' : 'Extrapolated Fidelity'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Educational Note */}
        <div className="mt-8 p-5 bg-quantum-950/15 border border-quantum-500/20 rounded-2xl text-sm text-slate-300 leading-relaxed">
          {isGrover ? (
            <span>
              <strong className="text-quantum-300">Grover&apos;s ZNE Insight:</strong> Unmitigated Grover's search success probability is 0.8900 due to gate errors. As noise multiplies (folding from 1× to 9×), success decays down to 0.6815. Fits project that at 0× noise, Richardson extrapolation recovers 0.9217.
            </span>
          ) : (
            <span>
              <strong className="text-quantum-300">QFT Hellinger Fidelity Insight:</strong> For QFT, since the output states are superpositions, checking one state is inadequate. We calculate the Hellinger Fidelity between the measured state and the ideal uniform state. Even at 9× noise, fidelity remains high (~0.9993) due to shallow depth, and ZNE recovers 0.9996 fidelity.
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
