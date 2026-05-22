'use client'

import Link from 'next/link'

interface Technique {
  title: string
  subtitle: string
  description: string
  link: string
  badge: string
  color: string // For visual accents
}

const TECHNIQUES: Technique[] = [
  {
    title: "Dynamical Decoupling (DD)",
    subtitle: "Passive Idle-Time Protection",
    description: "Inserts periodic sequences of fast, reversing pulses (e.g. CPMG, XY4) during qubit idle periods to decouple them from environmental dephasing and crosstalk.",
    link: "/dd",
    badge: "Passive",
    color: "from-emerald-500/20 to-teal-500/5 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/50"
  },
  {
    title: "Randomized Compiling (RC)",
    subtitle: "Coherent Noise Twirling",
    description: "Twirls coherent systematic errors (over-rotations) into stochastic Pauli noise using randomized single-qubit gates, creating smooth, exponential decay curves for ZNE.",
    link: "/rc",
    badge: "Twirling",
    color: "from-teal-500/20 to-cyan-500/5 border-teal-500/20 text-teal-400 hover:border-teal-500/50"
  },
  {
    title: "Probabilistic Error Cancellation (PEC)",
    subtitle: "Exact expectation values",
    description: "Decomposes ideal gates into a quasi-probability distribution over a noisy basis. Cancels error bias exactly, trading off exponential sampling cost (shot overhead).",
    link: "/pec",
    badge: "Active",
    color: "from-cyan-500/20 to-blue-500/5 border-cyan-500/20 text-cyan-400 hover:border-cyan-500/50"
  },
  {
    title: "Symmetry Verification",
    subtitle: "Post-Selection Filtering",
    description: "Mitigates state preparation and computational leakage errors by checking mathematical symmetries (like parity) and discarding invalid measurement trials.",
    link: "/verification",
    badge: "Verification",
    color: "from-blue-500/20 to-indigo-500/5 border-blue-500/20 text-blue-400 hover:border-blue-500/50"
  }
]

export default function AdvancedTechniques() {
  return (
    <section id="advanced-techniques" className="py-24 px-6 bg-[#020905] border-t border-slate-900/80">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-quantum-950/60 border border-quantum-500/20 text-quantum-300 text-xs font-bold uppercase tracking-wider mb-4">
            Advanced Mitigation Stack
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Beyond ZNE:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-400 to-emerald-300">
              Advanced Techniques
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Zero-Noise Extrapolation is only one layer of the mitigation stack. Explore the passive pulse, randomized twirling, exact sampling, and filter layers that protect modern quantum computers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {TECHNIQUES.map((tech) => (
            <div
              key={tech.title}
              className={`p-8 rounded-2xl border bg-gradient-to-br ${tech.color} flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-quantum-950/20`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">{tech.subtitle}</span>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-black/40 border border-slate-800 uppercase tracking-widest">{tech.badge}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{tech.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">{tech.description}</p>
              </div>
              <div className="pt-4 border-t border-slate-900/60">
                <Link
                  href={tech.link}
                  className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-quantum-300 transition-colors group"
                >
                  Explore Technique
                  <span className="transform transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
