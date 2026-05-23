import matplotlib.pyplot as plt
from qiskit import QuantumCircuit
import numpy as np

# 1. Grover's Search (2-Qubit) Circuit
qc_grover = QuantumCircuit(2)
qc_grover.h(0)
qc_grover.h(1)
qc_grover.barrier() # add a barrier for visual separation of oracle
# Oracle (target |11>)
qc_grover.cz(0, 1)
qc_grover.barrier()
# Diffuser
qc_grover.h(0)
qc_grover.h(1)
qc_grover.x(0)
qc_grover.x(1)
qc_grover.cz(0, 1)
qc_grover.x(0)
qc_grover.x(1)
qc_grover.h(0)
qc_grover.h(1)
qc_grover.measure_all()

# 2. 3-Qubit QFT Circuit
qc_qft = QuantumCircuit(3)
qc_qft.h(0)
qc_qft.cp(np.pi/2, 1, 0)
qc_qft.cp(np.pi/4, 2, 0)
qc_qft.barrier()
qc_qft.h(1)
qc_qft.cp(np.pi/2, 2, 1)
qc_qft.barrier()
qc_qft.h(2)
qc_qft.barrier()
qc_qft.swap(0, 2)
qc_qft.measure_all()

# Style configuration matching our website's dark green mode
style = {
    "backgroundcolor": "#040e09",
    "linecolor": "#10b981",
    "textcolor": "#e2e8f0",
    "gatetextcolor": "#e2e8f0",
    "gatefacecolor": "#062416",
    "barrierfacecolor": "#12241a",
}

# Draw Grover
fig_grover = qc_grover.draw(output='mpl', style=style)
fig_grover.savefig('frontend/public/grover_circuit.png', dpi=200, bbox_inches='tight', transparent=True)
plt.close(fig_grover)

# Draw QFT
fig_qft = qc_qft.draw(output='mpl', style=style)
fig_qft.savefig('frontend/public/qft_circuit.png', dpi=200, bbox_inches='tight', transparent=True)
plt.close(fig_qft)

print("Circuits generated successfully!")
