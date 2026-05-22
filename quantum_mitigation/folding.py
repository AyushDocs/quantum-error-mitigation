from qiskit import QuantumCircuit

def fold_circuit(unitary, fold_factor):
    """Fold a unitary circuit to amplify noise.

    Barriers between blocks prevent the transpiler from cancelling
    inverse gate pairs — the noise must actually accumulate.

    fold_factor = 1  → U                   (baseline)
    fold_factor = 3  → U | U† | U          (3× noise)
    fold_factor = 5  → U | U† | U | U† | U (5× noise)
    etc.
    """
    nq = unitary.num_qubits
    folded = QuantumCircuit(nq)

    if fold_factor == 1:
        folded.append(unitary, range(nq))
    elif fold_factor % 2 == 1:
        k = (fold_factor - 1) // 2
        folded.append(unitary, range(nq))
        for _ in range(k):
            folded.barrier()
            inv = unitary.inverse()
            folded.append(inv, range(nq))
            folded.barrier()
            folded.append(unitary, range(nq))
    else:
        k = fold_factor // 2
        for _ in range(k):
            folded.append(unitary, range(nq))
            folded.barrier()
            inv = unitary.inverse()
            folded.append(inv, range(nq))
            folded.barrier()

    return folded

# twirling set relations for CZ gate
TWIRL_PAIRS = {
    ('I', 'I'): ('I', 'I'),
    ('X', 'I'): ('X', 'Z'),
    ('Y', 'I'): ('Y', 'Z'),
    ('Z', 'I'): ('Z', 'I'),
    ('I', 'X'): ('Z', 'X'),
    ('I', 'Y'): ('Z', 'Y'),
    ('I', 'Z'): ('I', 'Z'),
    ('X', 'X'): ('Y', 'Y'),
    ('Z', 'Z'): ('Z', 'Z'),
}

def apply_pauli_gate(qc, name, qubit):
    """Applies named Pauli gate to a qubit."""
    if name == 'X': qc.x(qubit)
    elif name == 'Y': qc.y(qubit)
    elif name == 'Z': qc.z(qubit)

def twirled_cz_circuit(theta=0.15, twirl_pair=None):
    """Creates a 2-qubit circuit with a noisy CZ gate and optional twirling."""
    qc = QuantumCircuit(2, 2)
    qc.h([0, 1])  # Prepare superposition
    
    if twirl_pair:
        p_pre, p_post = twirl_pair
        apply_pauli_gate(qc, p_pre[0], 0)
        apply_pauli_gate(qc, p_pre[1], 1)
        qc.barrier()
        # Noisy CZ gate (simulated over-rotation)
        qc.cz(0, 1)
        qc.cp(theta, 0, 1)
        qc.barrier()
        apply_pauli_gate(qc, p_post[0], 0)
        apply_pauli_gate(qc, p_post[1], 1)
    else:
        qc.cz(0, 1)
        qc.cp(theta, 0, 1)
        
    qc.h([0, 1])
    qc.measure([0, 1], [0, 1])
    return qc
