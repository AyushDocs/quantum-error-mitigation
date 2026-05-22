from quantum_mitigation.circuits import grover_unitary, qft_unitary

def test_grover_unitary():
    qc = grover_unitary()
    assert qc.num_qubits == 2
    assert qc.depth() > 0

def test_qft_unitary():
    qc = qft_unitary(3)
    assert qc.num_qubits == 3
    assert qc.depth() > 0
