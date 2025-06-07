import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap, BoundaryNorm
from io import BytesIO
import base64
import seaborn as sns  # Necesario para generar la paleta de colores

def colorMap(matriz,capa_salida): 
    valores_unicos = [x+1 for x in range(capa_salida)] #np.unique(matriz)
    n_clases = capa_salida#len(valores_unicos)
    
    # Generar al menos 30 colores bien diferenciados
    colores = sns.color_palette("hsv", n_clases)
    cmap = ListedColormap(colores)

    # Definir límites para cada clase
    bounds = np.append(valores_unicos, valores_unicos[-1] + 1)
    norm = BoundaryNorm(bounds, ncolors=n_clases)

    # Crear figura e imagen sin interpolación
    fig, ax = plt.subplots()
    imagen = ax.imshow(matriz, cmap=cmap, norm=norm, interpolation='nearest', aspect='auto')

   # Crear leyenda con círculos de colores y etiquetas
    legend_handles = [
        plt.Line2D([0], [0], marker='o', color='w', markersize=10,
                   markerfacecolor=cmap(i), label=f"{int(v)}")
        for i, v in enumerate(valores_unicos)
    ]
    ax.legend(handles=legend_handles, loc='center left', bbox_to_anchor=(1.05, 0.5),
              title="Ref", fontsize=10, borderaxespad=0.)

    fig.tight_layout()

    # Convertir la imagen a base64
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.1)
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