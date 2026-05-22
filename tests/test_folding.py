from quantum_mitigation.circuits import grover_unitary
from quantum_mitigation.folding import fold_circuit, twirled_cz_circuit, TWIRL_PAIRS

def test_fold_circuit():
    qc = grover_unitary()
    folded_1 = fold_circuit(qc, 1)
    folded_3 = fold_circuit(qc, 3)
    assert folded_1.num_qubits == 2
    assert folded_3.num_qubits == 2

def test_twirled_cz_circuit():
    qc = twirled_cz_circuit(theta=0.1, twirl_pair=None)
    assert qc.num_qubits == 2
    
    pre, post = list(TWIRL_PAIRS.items())[0]
    qc_t = twirled_cz_circuit(theta=0.1, twirl_pair=(pre, post))
    assert qc_t.num_qubits == 2
