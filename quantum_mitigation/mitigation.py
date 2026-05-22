import numpy as np
import random
from scipy.optimize import curve_fit
from qiskit import QuantumCircuit, transpile
from .folding import fold_circuit, TWIRL_PAIRS, twirled_cz_circuit

# Fitting Functions
def linear(x, a, b):
    return a * x + b

def quadratic(x, a, b, c):
    return a * x ** 2 + b * x + c

def exponential(x, a, b, c):
    return a * np.exp(b * x) + c

def richardson(x, a, b, c, d):
    return a * x ** 3 + b * x ** 2 + c * x + d

FIT_MODELS = {
    'Linear': (linear, [0.5, -0.02]),
    'Quadratic': (quadratic, [0.5, -0.02, 0.001]),
    'Exponential': (exponential, [0.5, -0.5, 0.05]),
    'Richardson': (richardson, [0.5, -0.02, 0.001, -0.0001]),
}

def run_circuit(qc, simulator, shots=16384):
    """Run a circuit and return both counts dict and probability vector."""
    tqc = transpile(qc, simulator, optimization_level=0)
    result = simulator.run(tqc, shots=shots).result()
    counts = result.get_counts()
    n_qubits = qc.num_qubits
    total = sum(counts.values())
    probs = np.array([counts.get(f'{i:0{n_qubits}b}', 0) / total
                      for i in range(2 ** n_qubits)])
    return counts, probs

def run_zne_scan(unitary, fold_factors, simulator, shots=16384):
    """Run a unitary at multiple fold factors. Returns probs for each."""
    nq = unitary.num_qubits
    results = []
    for ff in fold_factors:
        folded = fold_circuit(unitary, ff)
        folded.measure_all()
        _, probs = run_circuit(folded, simulator, shots)
        results.append(probs)
    return np.array(results)

def zne_extrapolate(fold_factors, measured_values):
    """Fit multiple models and return extrapolated values at fold=0."""
    results = {}
    for name, (func, p0) in FIT_MODELS.items():
        try:
            popt, pcov = curve_fit(func, fold_factors, measured_values, p0=p0, maxfev=10000)
            # Calculate R^2 goodness of fit
            residuals = measured_values - func(fold_factors, *popt)
            ss_res = np.sum(residuals ** 2)
            ss_tot = np.sum((measured_values - np.mean(measured_values)) ** 2)
            r2 = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 0.0
            
            val_extrap = float(func(0.0, *popt))
            results[name] = (val_extrap, r2)
        except Exception:
            results[name] = (None, 0.0)
    return results

# Readout Calibration & Mitigation
def build_calibration_matrix(simulator, n_qubits, shots=16384):
    """Build an (2^n × 2^n) measurement confusion matrix."""
    n_basis = 2 ** n_qubits
    cal_matrix = np.zeros((n_basis, n_basis))

    for prepared in range(n_basis):
        qc = QuantumCircuit(n_qubits, n_qubits)
        for q in range(n_qubits):
            if (prepared >> q) & 1:
                qc.x(q)
        qc.measure(range(n_qubits), range(n_qubits))

        tqc = transpile(qc, simulator, optimization_level=0)
        result = simulator.run(tqc, shots=shots).result()
        counts = result.get_counts()
        total = sum(counts.values())

        for measured_str, count in counts.items():
            measured = int(measured_str, 2)
            cal_matrix[measured, prepared] = count / total

    return cal_matrix

def apply_measurement_mitigation(raw_counts, cal_matrix):
    """Apply measurement error correction via pseudo-inverse with physical projection."""
    n_basis = cal_matrix.shape[0]
    total = sum(raw_counts.values())
    n_qubits = int(np.log2(n_basis))

    measured_probs = np.array([
        raw_counts.get(f'{i:0{n_qubits}b}', 0) / total
        for i in range(n_basis)
    ])

    M_inv = np.linalg.pinv(cal_matrix)
    corrected = M_inv @ measured_probs
    corrected = np.maximum(corrected, 0)
    corrected /= corrected.sum()

    return corrected

# Metrics
def total_variation_distance(probs, ideal_probs):
    return 0.5 * np.sum(np.abs(probs - ideal_probs))

def hellinger_fidelity(probs, ideal_probs):
    return (np.sqrt(probs * ideal_probs).sum()) ** 2

# Advanced Algorithms: PEC & Parity
def run_pec_simulation(p_noise=0.10, shots=500):
    """Runs a single-qubit phase flip PEC experiment."""
    from qiskit_aer import AerSimulator
    sim = AerSimulator()
    gamma = (1 + p_noise) / (1 - 2 * p_noise)
    p_id = (1 / (1 - 2 * p_noise)) / gamma
    
    outcomes = []
    for _ in range(shots):
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        
        # Physical noise
        if random.random() < p_noise:
            qc.z(0)
            
        # PEC correction
        if random.random() < p_id:
            sign = 1
        else:
            qc.z(0)
            sign = -1
            
        qc.h(0)
        qc.measure(0, 0)
        
        res = sim.run(transpile(qc, sim), shots=1).result().get_counts()
        measured_val = 1 if '0' in res else -1
        outcomes.append(sign * measured_val)
        
    return gamma * np.mean(outcomes), (1 - 2 * p_noise), gamma

def run_parity_verified_grover(p_bit_flip=0.08, shots=15000):
    """Runs unmitigated and parity post-selected Grover's search."""
    from qiskit_aer import AerSimulator
    sim = AerSimulator()
    
    # 1. Unmitigated Grover
    qc_unmit = QuantumCircuit(2, 2)
    qc_unmit.h([0, 1])
    qc_unmit.cz(0, 1)
    qc_unmit.h([0, 1])
    qc_unmit.x([0, 1])
    qc_unmit.cz(0, 1)
    qc_unmit.x([0, 1])
    qc_unmit.h([0, 1])
    if p_bit_flip > 0:
        qc_unmit.x(0)
    qc_unmit.measure([0, 1], [0, 1])
    
    # 2. Symmetry verified Grover
    qc_mit = QuantumCircuit(3, 3)
    qc_mit.h([0, 1])
    qc_mit.cz(0, 1)
    qc_mit.h([0, 1])
    qc_mit.x([0, 1])
    qc_mit.cz(0, 1)
    qc_mit.x([0, 1])
    qc_mit.h([0, 1])
    if p_bit_flip > 0:
        qc_mit.x(0)
    qc_mit.barrier()
    qc_mit.cx(0, 2)
    qc_mit.cx(1, 2)
    qc_mit.barrier()
    qc_mit.measure([0, 1, 2], [0, 1, 2])
    
    c_unmit = sim.run(transpile(qc_unmit, sim), shots=shots).result().get_counts()
    c_mit = sim.run(transpile(qc_mit, sim), shots=shots).result().get_counts()
    
    valid_shots = 0
    success_shots_mit = 0
    for state_str, count in c_mit.items():
        ancilla = state_str[0]
        grover_state = state_str[1:]
        if ancilla == '0':
            valid_shots += count
            if grover_state == '11':
                success_shots_mit += count
                
    unmit_success = c_unmit.get('11', 0) / shots
    mit_success = success_shots_mit / valid_shots if valid_shots > 0 else 0.0
    discard_rate = (1 - valid_shots / shots)
    
    return unmit_success, mit_success, discard_rate
