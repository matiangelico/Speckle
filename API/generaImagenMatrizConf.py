import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO

def cmcm(conf_matrix, Y_true, Y_pred):
    etiquetas_clases = sorted(set(Y_true).union(set(Y_pred)))
    n_clases = len(etiquetas_clases)  # Número de clases

    # Evitar divisiones por cero (cuando una fila de conf_matrix es toda ceros)
    conf_matrix_percentage = np.nan_to_num(conf_matrix.astype(float) / conf_matrix.sum(axis=1, keepdims=True))

    # Calcular el accuracy global
    total_aciertos = np.trace(conf_matrix)
    total_muestras = conf_matrix.sum()
    accuracy = total_aciertos / total_muestras

    # Ajustar tamaño de la figura dinámicamente
    fig, ax = plt.subplots(figsize=(max(10, n_clases * 0.6), max(8, n_clases * 0.6)), dpi=300)  
    sns.set(font_scale=1.2)

    # Crear el heatmap
    sns.heatmap(conf_matrix_percentage, annot=False, cmap='jet', fmt="", 
                xticklabels=etiquetas_clases, yticklabels=etiquetas_clases, 
                cbar=False, ax=ax)

    # Ajustar tamaño del texto en función de la cantidad de clases
    factor = max(8, -n_clases + 20)
    font_size_large = factor  
    font_size_small = max(6, factor - 5)
    offset = 0.2  

    # Agregar textos dentro de cada celda
    for i in range(conf_matrix.shape[0]):
        for j in range(conf_matrix.shape[1]):
            total_fila = conf_matrix[i].sum()
            porcentaje = "0.00%" if total_fila == 0 else f"{conf_matrix_percentage[i, j] * 100:.2f}%"
            cantidad = f"{conf_matrix[i, j]}/{total_fila}"

            ax.text(j + 0.5, i + 0.5 - offset, porcentaje, ha='center', va='center', 
                    fontsize=font_size_large, color="white", fontweight='bold')
            
            ax.text(j + 0.5, i + 0.5 + offset, cantidad, ha='center', va='center', 
                    fontsize=font_size_small, color="white")

    # Etiquetas de los ejes
    ax.set_xlabel("Prediction", fontsize=14)
    ax.set_ylabel("True label", fontsize=14)

    # Agregar la leyenda de Accuracy
    plt.figtext(0.5, -0.05, f'Accuracy: {accuracy*100:.2f}% ({total_aciertos}/{total_muestras})', 
                fontsize=16, ha='center', va='center', backgroundcolor='white')

    # Ajustar márgenes
    plt.subplots_adjust(left=0.15, right=0.85, top=0.9, bottom=0.2)

    # Guardar la imagen en un buffer con alta resolución
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.1, dpi=300)
    buf.seek(0)

    plt.close()
    return buf
