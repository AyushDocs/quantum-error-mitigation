from qiskit_aer import AerSimulator
from qiskit_aer.noise import NoiseModel, depolarizing_error, ReadoutError

def hardware_noise_model():
    """Realistic fixed noise model simulating IBM-class hardware.

    Includes:
      - 0.1%  single-qubit depolarizing (h, x)
      - 2%    two-qubit depolarizing (cz, cp, swap)
      - 3%    readout error (asymmetric: P(0→1) = 2%, P(1→0) = 4%)
    """
    noise_model = NoiseModel()
    noise_model.add_all_qubit_quantum_error(depolarizing_error(0.001, 1), ['h', 'x'])
    noise_model.add_all_qubit_quantum_error(depolarizing_error(0.02, 2), ['cz', 'cp', 'swap'])

    readout_err = ReadoutError([[0.98, 0.02], [0.04, 0.96]])
    noise_model.add_all_qubit_readout_error(readout_err)

    return noise_model

def ideal_simulator():
    """Returns a noiseless Aer simulator."""
    return AerSimulator(noise_model=None)

def noisy_simulator():
    """Returns an Aer simulator configured with the realistic hardware noise model."""
    return AerSimulator(noise_model=hardware_noise_model())
