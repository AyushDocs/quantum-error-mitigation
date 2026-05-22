from .noise import (
    hardware_noise_model,
    ideal_simulator,
    noisy_simulator
)

from .circuits import (
    grover_unitary,
    qft_unitary
)

from .folding import (
    fold_circuit,
    TWIRL_PAIRS,
    twirled_cz_circuit,
    apply_pauli_gate
)

from .mitigation import (
    run_circuit,
    run_zne_scan,
    zne_extrapolate,
    build_calibration_matrix,
    apply_measurement_mitigation,
    total_variation_distance,
    hellinger_fidelity,
    run_pec_simulation,
    run_parity_verified_grover
)

from .plots import (
    plot_zne_curves,
    plot_calibration_matrix,
    plot_comparison_bar
)

__version__ = "0.1.0"
__all__=[
    "hardware_noise_model",
    "ideal_simulator",
    "noisy_simulator",
    "grover_unitary",
    "qft_unitary",
    "fold_circuit",
    "TWIRL_PAIRS",
    "twirled_cz_circuit",
    "apply_pauli_gate",
    "run_circuit",
    "run_zne_scan",
    "zne_extrapolate",
    "build_calibration_matrix",
    "apply_measurement_mitigation",
    "total_variation_distance",
    "hellinger_fidelity",
    "run_pec_simulation",
    "run_parity_verified_grover",
    "plot_zne_curves",
    "plot_calibration_matrix",
    "plot_comparison_bar"
]