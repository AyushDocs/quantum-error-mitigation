from quantum_mitigation.noise import hardware_noise_model, ideal_simulator, noisy_simulator
from qiskit_aer.noise import NoiseModel

def test_noise_model():
    model = hardware_noise_model()
    assert isinstance(model, NoiseModel)
    assert len(model.basis_gates) > 0

def test_simulators():
    ideal = ideal_simulator()
    noisy = noisy_simulator()
    assert ideal is not None
    assert noisy is not None
