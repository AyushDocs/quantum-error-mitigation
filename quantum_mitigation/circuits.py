import numpy as np
from qiskit import QuantumCircuit

def grover_unitary():
    """2-qubit Grover's search unitary (target |11>), no measurements."""
    qc = QuantumCircuit(2)
    qc.h([0, 1])
    qc.cz(0, 1)
    qc.h([0, 1])
    qc.x([0, 1])
    qc.cz(0, 1)
    qc.x([0, 1])
    qc.h([0, 1])
    return qc

def qft_unitary(n=3):
    """n-qubit QFT unitary (no measurements)."""
    qc = QuantumCircuit(n)
    for j in range(n):
        qc.h(j)
        for k in range(j + 1, n):
            qc.cp(np.pi / 2 ** (k - j), k, j)
    for i in range(n // 2):
        qc.swap(i, n - 1 - i)
    return qc
