import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from io import BytesIO

def cmcm(conf_matrix, Y_true, Y_pred):
    etiquetas_clases = sorted(set(Y_true).union(set(Y_pred)))

    # Calcular porcentaje
    conf_matrix_percentage = conf_matrix.astype('float') / conf_matrix.sum(axis=1)[:, np.newaxis]

    # Calcular el accuracy global
    total_aciertos = np.trace(conf_matrix)  # Suma de la diagonal
    total_muestras = conf_matrix.sum()     # Suma total de todas las celdas
    accuracy = total_aciertos / total_muestras

    # Crear anotaciones combinadas
    annot_text = np.array([
        [f"{conf_matrix_percentage[i, j]:.2%}\n{conf_matrix[i, j]}/{conf_matrix[i].sum()}" 
         for j in range(conf_matrix.shape[1])]
        for i in range(conf_matrix.shape[0])
    ])

    # Crear la figura y el gráfico
    plt.figure(figsize=(12, 8))  # Tamaño de la figura para más espacio
    sns.set(font_scale=1.2)

    # Crear el heatmap
    imagen = sns.heatmap(conf_matrix_percentage, annot=False, cmap='jet', fmt="", 
                         xticklabels=etiquetas_clases, yticklabels=etiquetas_clases, 
                         cbar=False)

    # Modificar la apariencia de los porcentajes y las cantidades
    for i in range(conf_matrix.shape[0]):
        for j in range(conf_matrix.shape[1]):
            porcentaje = f"{conf_matrix_percentage[i, j]:.2%}"
            cantidad = f"{conf_matrix[i, j]}/{conf_matrix[i].sum()}"
            # Colocar el porcentaje con tamaño mayor
            imagen.text(j + 0.5, i + 0.5, porcentaje, ha='center', va='center', fontsize=18, color="black")
            # Colocar la cantidad con tamaño menor debajo
            imagen.text(j + 0.5, i + 0.5 + 0.1, cantidad, ha='center', va='center', fontsize=12, color="black")

    # Agregar la leyenda de Accuracy fuera de la matriz
    # Ajustar la posición de la leyenda para que no tape la matriz
    plt.xlabel("Prediction")
    plt.ylabel("True label")
    plt.figtext(0.75, -0.05, f'Accuracy: {accuracy*100:.2f}% ({total_aciertos}/{total_muestras})', 
                fontsize=16, ha='center', va='center', backgroundcolor='white')

    # Ajustar márgenes para dar más espacio en la parte superior y evitar superposición
    plt.subplots_adjust(top=0.7, bottom=0.05)  # Aumenta el margen superior y ajusta el inferior

    # Guardar la imagen en buffer
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.1)
    buf.seek(0)

    plt.close()
    return buf
