import seaborn as sns
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import numpy as np

def cmcm(conf_matrix, Y_true, Y_pred):
    # Obtener las etiquetas únicas de las clases automáticamente
    etiquetas_clases = sorted(set(Y_true).union(set(Y_pred)))

    # Calcular porcentajes
    conf_matrix_percentage = conf_matrix.astype('float') / conf_matrix.sum(axis=1)[:, np.newaxis]

    # Configurar el mapa de calor
    plt.figure(figsize=(10, 7))
    sns.set(font_scale=1.2)
    imagen = sns.heatmap(conf_matrix_percentage, annot=True, cmap='jet', fmt=".2%", 
                         xticklabels=etiquetas_clases, yticklabels=etiquetas_clases)
    
    # Etiquetas de ejes
    plt.xlabel("Predicción")
    plt.ylabel("Etiqueta Verdadera")
    plt.title("Matriz de Confusión (Porcentajes)")

    # Guardar en buffer como imagen PNG
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
    buf.seek(0)

    # Convertir la imagen a base64
    imagen64 = base64.b64encode(buf.read()).decode('utf-8')

    buf.close()
    plt.close()

    return imagen64