import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap, BoundaryNorm
from io import BytesIO
import base64
import seaborn as sns  # Necesario para generar la paleta de colores

def colorMap(matriz): 
    valores_unicos = np.unique(matriz)

    n_clases = len(valores_unicos)

    # Generar al menos 30 colores bien diferenciados
    colores = sns.color_palette("hsv", n_clases)
    cmap = ListedColormap(colores)

    # Definir límites para cada clase
    bounds = np.append(valores_unicos, valores_unicos[-1] + 1)
    norm = BoundaryNorm(bounds, ncolors=n_clases)

    # Crear figura e imagen sin interpolación
    fig, ax = plt.subplots()
    imagen = ax.imshow(matriz, cmap=cmap, norm=norm, interpolation='nearest', aspect='auto')

    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_xticklabels([])
    ax.set_yticklabels([])
    ax.tick_params(length=0)

    # Agregar barra de color con etiquetas
    cbar = plt.colorbar(imagen, ticks=valores_unicos, ax=ax)
    cbar.ax.set_yticklabels([str(int(v)) for v in valores_unicos])

    # Guardar la imagen como base64
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.2)
    buf.seek(0)

    imagen64 = base64.b64encode(buf.read()).decode('utf-8')
    
    buf.close()
    plt.close()

    return imagen64

'''
import matplotlib.pyplot as plt
from io import BytesIO
import base64

def colorMap(matriz): 
    
    imagen = plt.imshow(matriz, cmap='jet')

    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.2)
    buf.seek(0)
    
    imagen64 = base64.b64encode(buf.read()).decode('utf-8')
    
    buf.close()
    plt.close()

    return imagen64

'''