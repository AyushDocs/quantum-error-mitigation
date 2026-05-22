export const groverResults = {
  ideal: 1.0,
  foldFactors: [1, 3, 5, 7, 9],
  measured: [0.8900, 0.8325, 0.7814, 0.7316, 0.6815],
  zneExtrapolated: {
    Linear: 0.9129,
    Quadratic: 0.9178,
    Exponential: 0.9180,
    Richardson: 0.9217,
  },
  mitigation: {
    unmitigated: 0.8900,
    zne: 0.9217,
    measurement: 0.9631,
    combined: 1.0054,
  },
  errors: {
    unmitigated: 0.1100,
    zne: 0.0783,
    measurement: 0.0369,
    combined: 0.0054,
  },
  reductions: {
    zne: 28.8,
    measurement: 67.6,
    combined: 95.1,
  },
}

export const qftResults = {
  idealTVD: 0.0,
  idealFidelity: 1.0,
  foldFactors: [1, 3, 5, 7, 9],
  tvd: [0.0209, 0.0193, 0.0167, 0.0150, 0.0218],
  hellingerFidelity: [0.9995, 0.9995, 0.9996, 0.9997, 0.9993],
  zneExtrapolated: {
    Linear: 0.9996,
    Quadratic: 0.9993,
    Exponential: 0.9592,
    Richardson: 0.9996,
  },
  mitigationTVD: {
    unmitigated: 0.0109,
    mitigated: 0.0073,
  },
  mitigationFidelity: {
    unmitigated: 0.9998,
    mitigated: 0.9999,
  }
}

export const calibrationMatrix = [
  [0.9607, 0.0386, 0.0399, 0.0018],
  [0.0192, 0.9401, 0.0008, 0.0411],
  [0.0195, 0.0012, 0.9404, 0.0375],
  [0.0006, 0.0201, 0.0190, 0.9196],
]

export const noiseModel = {
  singleQubit: 0.001,
  twoQubit: 0.02,
  readoutP0to1: 0.02,
  readoutP1to0: 0.04,
}

export const fitModels = [
  {
    name: 'Linear',
    formula: 'a·x + b',
    description: 'Simplest model — assumes linear degradation with noise.',
    params: 'a = -0.0261, b = 0.9129',
  },
  {
    name: 'Quadratic',
    formula: 'a·x² + b·x + c',
    description: 'Captures curvature from coherent gate errors.',
    params: 'a = 0.0004, b = -0.0298, c = 0.9178',
  },
  {
    name: 'Exponential',
    formula: 'a·exp(b·x) + c',
    description: 'Models exponential decay of success probability.',
    params: 'a = 0.2010, b = -0.3218, c = 0.7170',
  },
  {
    name: 'Richardson',
    formula: 'a·x³ + b·x² + c·x + d',
    description: 'Higher-order polynomial for complex noise profiles.',
    params: 'a = 0.0001, b = 0.0002, c = -0.0289, d = 0.9217',
  },
]

export const colorMap: Record<string, string> = {
  Linear: '#10b981',      // Emerald Green
  Quadratic: '#34d399',   // Mint Green
  Exponential: '#059669', // Dark Emerald
  Richardson: '#a7f3d0',  // Light Mint/Sage
  Measured: '#f59e0b',    // Amber
  Ideal: '#64748b',       // Muted Slate
}

export const techniqueColors: Record<string, string> = {
  Unmitigated: '#ef4444',  // Red
  ZNE: '#34d399',         // Mint Green
  'Meas. Mit.': '#fbbf24', // Amber
  Combined: '#10b981',     // Emerald Green
  Ideal: '#64748b',        // Muted Slate
}

