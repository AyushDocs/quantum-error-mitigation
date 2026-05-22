import matplotlib.pyplot as plt
import numpy as np

COLORS = ['#10b981', '#ef4444', '#fbbf24', '#3b82f6', '#8b5cf6']

def plot_zne_curves(fold_factors, measured_values, fit_curves, title="Zero-Noise Extrapolation Fit", xlabel="Noise Scale (Fold Factor)", ylabel="Success Probability"):
    """Plots ZNE measured points and corresponding fit lines."""
    plt.figure(figsize=(8, 5))
    plt.scatter(fold_factors, measured_values, color=COLORS[1], marker='o', s=80, label='Measured Data', zorder=5)
    
    # Generate fine x-axis for plotting smooth curves
    x_fine = np.linspace(0, max(fold_factors), 100)
    for model_name, (val_extrap, popt, func) in fit_curves.items():
        if popt is not None:
            plt.plot(x_fine, func(x_fine, *popt), label=f'{model_name} Fit (Extrapolated = {val_extrap:.4f})', linewidth=2)
            plt.scatter(0.0, val_extrap, marker='x', s=100, linewidth=2, zorder=6)

    plt.axhline(y=1.0, color='gray', linestyle=':', label='Ideal Limit')
    plt.xlabel(xlabel, fontsize=12)
    plt.ylabel(ylabel, fontsize=12)
    plt.title(title, fontsize=14, fontweight='bold')
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.ylim(min(measured_values) - 0.1, 1.1)
    plt.tight_layout()
    return plt.gcf()

def plot_calibration_matrix(matrix, labels=None, title="Readout Error Calibration Matrix"):
    """Plots a calibration confusion matrix heatmap."""
    n = matrix.shape[0]
    if labels is None:
        labels = [f'|{i:0{int(np.log2(n))}b}⟩' for i in range(n)]

    fig, ax = plt.subplots(figsize=(6, 5))
    im = ax.imshow(matrix, cmap='Greens', vmin=0, vmax=1)
    
    # Show values inside the cells
    for i in range(n):
        for j in range(n):
            text_color = "white" if matrix[i, j] > 0.5 else "black"
            ax.text(j, i, f"{matrix[i, j]:.4f}", ha="center", va="center", color=text_color, fontweight='semibold')

    ax.set_xticks(np.arange(n))
    ax.set_yticks(np.arange(n))
    ax.set_xticklabels(labels)
    ax.set_yticklabels(labels)
    ax.set_xlabel("Prepared State", fontsize=12)
    ax.set_ylabel("Measured State", fontsize=12)
    ax.set_title(title, fontsize=13, fontweight='bold')
    fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    plt.tight_layout()
    return fig

def plot_comparison_bar(labels, values, title="Mitigation Performance Comparison", ylabel="Value"):
    """Plots a comparison bar chart."""
    plt.figure(figsize=(7, 4.5))
    bars = plt.bar(labels, values, color=[COLORS[1], COLORS[3], COLORS[2], COLORS[0], 'gray'][:len(labels)], edgecolor='black', alpha=0.8, width=0.5)
    
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 0.02, f'{height:.4f}', ha='center', va='bottom', fontweight='semibold')
        
    plt.ylabel(ylabel, fontsize=12)
    plt.title(title, fontsize=13, fontweight='bold')
    plt.ylim(0, max(values) * 1.15)
    plt.grid(True, alpha=0.2, axis='y')
    plt.tight_layout()
    return plt.gcf()
