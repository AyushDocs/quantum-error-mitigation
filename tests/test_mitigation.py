import numpy as np
from quantum_mitigation.mitigation import (
    zne_extrapolate,
    build_calibration_matrix,
    apply_measurement_mitigation,
    total_variation_distance,
    hellinger_fidelity,
    run_pec_simulation,
    run_parity_verified_grover
)
from quantum_mitigation.noise import ideal_simulator

def test_zne_extrapolate():
    # Simple linear test: y = -0.5 * x + 1.0 -> at x=0, y=1.0
    x = np.array([1.0, 3.0, 5.0])
    y = np.array([0.5, -0.5, -1.5])
    results = zne_extrapolate(x, y)
    assert 'Linear' in results
    val, r2 = results['Linear']
    assert np.isclose(val, 1.0)
    assert np.isclose(r2, 1.0)

def test_measurement_mitigation():
    sim = ideal_simulator()
    cal_matrix = build_calibration_matrix(sim, n_qubits=2, shots=100)
    assert cal_matrix.shape == (4, 4)
    # Check that diagonal elements dominate
    assert np.diag(cal_matrix).mean() > 0.9

    raw_counts = {'00': 100}
    corrected = apply_measurement_mitigation(raw_counts, cal_matrix)
    assert len(corrected) == 4
    assert corrected[0] > 0.9

def test_metrics():
    p1 = np.array([0.5, 0.5])
    p2 = np.array([0.5, 0.5])
    assert total_variation_distance(p1, p2) == 0.0
    assert np.isclose(hellinger_fidelity(p1, p2), 1.0)

def test_pec_simulation():
    mit, raw, gamma = run_pec_simulation(p_noise=0.10, shots=10)
    assert -2.0 <= mit <= 2.0
    assert np.isclose(raw, 0.80)

def test_parity_verified_grover():
    unmit, mit, discard = run_parity_verified_grover(p_bit_flip=0.08, shots=50)
    assert 0.0 <= unmit <= 1.0
    assert 0.0 <= mit <= 1.0
    assert 0.0 <= discard <= 1.0
