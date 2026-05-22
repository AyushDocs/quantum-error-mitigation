# Quantum Error Mitigation Study Package

A professional, modular Python package and research suite for simulating and validating gate-level and readout-level **Quantum Error Mitigation (QEM)** techniques. Designed to emulate IBM-class NISQ hardware, this repository provides both a solid Python library core (`quantum_mitigation`) and a series of interactive Jupyter notebooks demonstrating advanced mitigation algorithms.

---

## 🚀 Features

### 1. Unified QEM Library (`quantum_mitigation`)
- **`noise`**: Realistic IBM-class noise modeling (depolarizing and asymmetric readout errors) & Aer simulator setups.
- **`circuits`**: Parameterized benchmark circuit generators (2-qubit Grover's Search, $N$-qubit Quantum Fourier Transform).
- **`folding`**: Exact unitary gate-folding logic for noise scaling with barrier isolation.
- **`mitigation`**:
  - Zero-Noise Extrapolation (ZNE) curve-fitting engines (Linear, Quadratic, Exponential, and Richardson extrapolation).
  - Readout error confusion matrix calibration and pseudo-inverse SPAM mitigation with physical projection.
  - Probabilistic Error Cancellation (PEC) via quasi-probability sampling.
  - Symmetry Verification and post-selection via ancilla parity checks.
- **`plots`**: Stylized visualization templates using curated modern color palettes.

### 2. Scientific Research Notebooks
The study is split into four progressive, exploration-style Jupyter notebooks under `notebooks/`:
- **`01-AyushDocs-ZeroNoiseExtrapolation.ipynb`**: Principles of Gate-Folding noise scaling and curve fitting extrapolation on Grover and QFT.
- **`02-AyushDocs-MeasurementErrorMitigation.ipynb`**: SPAM noise matrix calibration and pseudo-inverse readout correction.
- **`03-AyushDocs-CombinedMitigationStacking.ipynb`**: Stacking orthogonal techniques (readout correction + ZNE) to recover near-ideal expectations.
- **`04-AyushDocs-AdvancedErrorMitigation.ipynb`**: Advanced protocols including Dynamical Decoupling (Spin Echo), Randomized Compiling (Pauli Twirling), PEC, and Symmetry Verification.

### 3. Industrial-Grade Project Infrastructure
- Modern Setuptools build configuration (`pyproject.toml`, `setup.py`).
- Automated development workflows (`Makefile`).
- Comprehensive unit test suite (`tests/` using `pytest`).

---

## 🛠️ Installation & Getting Started

Onboard in one command using the provided automated `Makefile`:

```bash
# Set up virtual environment, install dependencies, and install the library in editable mode
make install
```

---

## 💻 Developer Workflows

Execute standard project commands using the automation suite:

### Run Unit Tests
Validate the mathematical correctness and structure of the library modules:
```bash
make test
```

### Verify Research Notebooks
Execute all Jupyter notebooks end-to-end to verify that all mathematical derivations, simulations, and plots render cleanly without execution errors:
```bash
make verify
```

### Clean Build Artifacts
Remove caches, compiled wheels, and temporary virtual environments:
```bash
make clean
```

---

## 📊 Summary of Mitigation Performance (Grover's Search)

Our stacked mitigation framework yields a **98.2% reduction in error** under realistic IBM-class noise simulation:

| Mitigation Level | Success Probability $P(|11\rangle)$ | Error vs. Ideal ($1.0$) | Error Reduction (%) |
|:---|:---:|:---:|:---:|
| **Ideal Noiseless** | `1.0000` | `0.0000` | *Baseline Ideal* |
| **Unmitigated Noisy** | `0.8886` | `0.1114` | *Baseline Noisy* |
| **ZNE (Gate-Folding Only)** | `0.9187` | `0.0813` | **27.0%** |
| **Measurement Correction** | `0.9627` | `0.0373` | **66.5%** |
| **Stacked (ZNE + Readout)** | `1.0020` | `0.0020` | **98.2%** |

---

## 🔬 Physics and Mathematical Insights

- **Coherent vs. Stochastic Dephasing**: Slow systematic frequency detuning (coherent dephasing) is perfectly refocused using **Dynamical Decoupling (Spin Echo)**. Stochastic dephasing (Markovian noise) cannot be refocused this way but can be addressed via twirling.
- **Randomized Compiling (Pauli Twirling)**: Converts structured coherent gate calibration drift into simple stochastic depolarizing noise by inserting random single-qubit Pauli gates around entangling gates, flattening worst-case error rates.
- **Sampling Overhead in PEC**: Probabilistic Error Cancellation yields exact expectation values at the cost of scaling the number of shots by $\gamma^2$, where $\gamma$ is the sum of the absolute values of the quasi-probabilities.

---

## 📋 License
This project is configured as a professional research template and library. All code is modularized and formatted under clean-code principles.
