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
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-quantum-950/60 border border-quantum-500/20 text-quantum-300 text-xs font-bold uppercase tracking-wider mb-4">
            Advanced Mitigation Stack
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Beyond ZNE:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-400 to-emerald-300">
              Advanced Techniques
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto mb-6">
            Zero-Noise Extrapolation is only one layer of the mitigation stack. Explore the passive pulse, randomized twirling, exact sampling, and filter layers that protect modern quantum computers.
          </p>
        </div>
        <div className="flex justify-center mb-12">
          <a
            href="https://github.com/AyushDocs/quantum-error-mitigation/blob/main/notebooks/04-AyushDocs-AdvancedErrorMitigation.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-slate-800 text-xs font-semibold text-slate-350 hover:text-white hover:border-slate-600 hover:bg-black/60 transition-all shadow-sm"
          >
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
            </svg>
            View Advanced Error Mitigation Notebook
          </a>
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
