'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'
import { groverResults, qftResults, techniqueColors } from '@/lib/data'
import { useState } from 'react'

const groverData = [
  { name: 'Unmitigated', val: groverResults.mitigation.unmitigated, err: groverResults.errors.unmitigated, red: 0 },
  { name: 'ZNE (gate fold)', val: groverResults.mitigation.zne, err: groverResults.errors.zne, red: groverResults.reductions.zne },
  { name: 'Meas. Mit.', val: groverResults.mitigation.measurement, err: groverResults.errors.measurement, red: groverResults.reductions.measurement },
  { name: 'Combined', val: groverResults.mitigation.combined, err: groverResults.errors.combined, red: groverResults.reductions.combined },
  { name: 'Ideal', val: groverResults.ideal, err: 0, red: 100 },
]

const qftTVDData = [
  { name: 'Unmitigated', val: qftResults.mitigationTVD.unmitigated, red: 0 },
  { name: 'Meas. Mit.', val: qftResults.mitigationTVD.mitigated, red: 33.0 },
  { name: 'Ideal', val: qftResults.idealTVD, red: 100 },
]

export default function ComparisonChart() {
  const [compTab, setCompTab] = useState<'grover' | 'qft'>('grover')

  const isGrover = compTab === 'grover'
  const activeData = isGrover ? groverData : qftTVDData

  const getColor = (name: string) => {
    if (name.includes('Unmitigated')) return techniqueColors.Unmitigated
    if (name.includes('ZNE')) return techniqueColors.ZNE
    if (name.includes('Meas. Mit.')) return techniqueColors['Meas. Mit.']
    if (name.includes('Combined')) return techniqueColors.Combined
    return techniqueColors.Ideal
  }

  return (
    <section id="results" className="py-24 px-6 bg-[#030d07] border-t border-slate-900">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Mitigation Stack{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-400 to-emerald-300">
            Comparisons
          </span>
        </h2>
        <p className="text-slate-400 text-center mb-8 max-w-2xl mx-auto">
          Compare how stacking Zero-Noise Extrapolation and Measurement Mitigation improves logic outputs for Grover&apos;s Search and QFT.
        </p>

        {/* Chart tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl bg-black/40 border border-slate-800/80">
            <button
              onClick={() => setCompTab('grover')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isGrover
                  ? 'bg-quantum-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Grover: P(|11⟩) (Higher is Better)
            </button>
            <button
              onClick={() => setCompTab('qft')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                !isGrover
                  ? 'bg-quantum-500 text-black font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              QFT: Total Variation Distance (Lower is Better)
            </button>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="gradient-border rounded-2xl p-6 bg-quantum-950/10 mb-12 shadow-inner">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={activeData} margin={{ top: 40, right: 30, left: 30, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#12241a" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis
                domain={isGrover ? [0, 1.15] : [0, 0.025]}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{
                  value: isGrover ? 'P(|11⟩)' : 'Total Variation Distance (TVD)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#94a3b8',
                  offset: -10,
                  fontSize: 12
                }}
              />
              <Tooltip
                contentStyle={{ background: '#05180f', border: '1px solid #10b981', borderRadius: '12px', color: '#e2e8f0' }}
                formatter={(value: number, name: string) => [value.toFixed(isGrover ? 4 : 5), isGrover ? 'Success Prob' : 'TVD']}
              />
              <Bar dataKey="val" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {activeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                ))}
                <LabelList dataKey="val" position="top" formatter={(v: number) => v.toFixed(isGrover ? 4 : 4)}
                           fill="#94a3b8" fontSize={11} fontWeight={600} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Small stats cards */}
        {isGrover ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {groverData.filter(d => d.name !== 'Ideal').map((d) => (
              <div key={d.name} className="gradient-border rounded-xl p-5 bg-quantum-950/10 text-center">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{d.name}</div>
                <div className="text-2xl font-bold font-mono" style={{ color: getColor(d.name) }}>
                  {d.red.toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-400">error reduction</div>
                <div className="mt-2 text-xs text-slate-500 font-mono">
                  error: {d.err.toFixed(4)} → prob: {d.val.toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="gradient-border rounded-xl p-5 bg-quantum-950/10 text-center">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Unmitigated TVD</div>
              <div className="text-2xl font-bold font-mono text-rose-400">
                {qftResults.mitigationTVD.unmitigated.toFixed(4)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Raw hardware readout error</div>
            </div>
            <div className="gradient-border rounded-xl p-5 bg-quantum-950/10 text-center">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Mitigated TVD</div>
              <div className="text-2xl font-bold font-mono text-quantum-400">
                {qftResults.mitigationTVD.mitigated.toFixed(4)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">33.0% improvement in output state</div>
            </div>
            <div className="gradient-border rounded-xl p-5 bg-quantum-950/10 text-center">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Ideal TVD</div>
              <div className="text-2xl font-bold font-mono text-slate-400">
                0.0000
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Noiseless simulation limit</div>
            </div>
          </div>
        )}

        {/* Detailed comparison tables */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {/* Grover search table */}
          <div className="gradient-border rounded-2xl p-6 bg-quantum-950/5">
            <h3 className="text-base font-bold text-white mb-4">Grover&apos;s Search results</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-slate-500">
                    <th className="pb-2 font-medium">Technique</th>
                    <th className="pb-2 text-right font-medium">P(|11⟩)</th>
                    <th className="pb-2 text-right font-medium">Error</th>
                    <th className="pb-2 text-right font-medium">Reduction</th>
                  </tr>
                </thead>
                <tbody>
                  {groverData.map((d) => (
                    <tr key={d.name} className="border-b border-slate-900/60 last:border-0 hover:bg-quantum-950/10 transition-colors">
                      <td className="py-2 text-white font-medium">{d.name}</td>
                      <td className="py-2 text-right font-mono text-quantum-300">{d.val.toFixed(4)}</td>
                      <td className="py-2 text-right font-mono text-rose-400/80">{d.err.toFixed(4)}</td>
                      <td className="py-2 text-right font-mono text-slate-400">{d.red.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* QFT table */}
          <div className="gradient-border rounded-2xl p-6 bg-quantum-950/5">
            <h3 className="text-base font-bold text-white mb-4">3-Qubit QFT results</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-slate-500">
                    <th className="pb-2 font-medium">Technique</th>
                    <th className="pb-2 text-right font-medium">QFT TVD</th>
                    <th className="pb-2 text-right font-medium">QFT H.Fid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-900/60 hover:bg-quantum-950/10 transition-colors">
                    <td className="py-2 text-white font-medium">Unmitigated (fold=1)</td>
                    <td className="py-2 text-right font-mono text-quantum-300">{qftResults.mitigationTVD.unmitigated.toFixed(4)}</td>
                    <td className="py-2 text-right font-mono text-quantum-400">{qftResults.mitigationFidelity.unmitigated.toFixed(4)}</td>
                  </tr>
                  <tr className="border-b border-slate-900/60 hover:bg-quantum-950/10 transition-colors">
                    <td className="py-2 text-white font-medium">+ Measurement Mitigation</td>
                    <td className="py-2 text-right font-mono text-quantum-300">{qftResults.mitigationTVD.mitigated.toFixed(4)}</td>
                    <td className="py-2 text-right font-mono text-quantum-400">{qftResults.mitigationFidelity.mitigated.toFixed(4)}</td>
                  </tr>
                  <tr className="hover:bg-quantum-950/10 transition-colors">
                    <td className="py-2 text-white font-medium">ZNE on Fidelity (best fit)</td>
                    <td className="py-2 text-right font-mono text-slate-400">N/A</td>
                    <td className="py-2 text-right font-mono text-quantum-400">{qftResults.zneExtrapolated.Linear.toFixed(4)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
              *H.Fid = Hellinger Fidelity (ideal = 1.0). TVD = Total Variation Distance (ideal = 0.0). ZNE is evaluated on Fidelity. Stacking measurement mitigation yields 0.9999 Hellinger Fidelity!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
