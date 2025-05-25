import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import base64
from io import BytesIO
from matplotlib.colors import ListedColormap, BoundaryNorm

def colorMap(matriz): 
    fig, ax = plt.subplots()

    valores_unicos = np.unique(matriz)

    n_clases = len(valores_unicos)

    # Generar una paleta de al menos 30 colores bien diferenciados
    colores = sns.color_palette("hsv", n_colors=n_clases)
    cmap = ListedColormap(colores)

    # Definir límites para cada clase
    bounds = np.append(valores_unicos, valores_unicos[-1] + 1)
    norm = BoundaryNorm(bounds, ncolors=n_clases)

    # Mostrar imagen sin interpolación
    imagen = ax.imshow(matriz, cmap=cmap, norm=norm, interpolation='nearest')

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
import numpy as np
import matplotlib.pyplot as plt
import base64
from io import BytesIO

def colorMap(matriz): 
    fig, ax = plt.subplots()

    imagen = ax.imshow(matriz, cmap='jet')
    
    valores_unicos = np.unique(matriz)
    print ('valore unicos ',valores_unicos)
    if len(valores_unicos) > 10:
        valores_unicos = np.linspace(np.min(matriz), np.max(matriz), 18)

    colores = [imagen.cmap(imagen.norm(v)) for v in valores_unicos]

    legend_handles = [plt.Line2D([0], [0], marker='o', color='w', markersize=10, 
                                 markerfacecolor=color, label=f"{int(valor)}") 
                      for i, (color, valor) in enumerate(zip(colores, valores_unicos), start=0)]
    
    ax.legend(handles=legend_handles, loc='center left', bbox_to_anchor=(1.05, 0.5), 
              title="Ref", fontsize=10, borderaxespad=0.)

    fig.tight_layout()

    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.1)
    buf.seek(0)
    
    imagen64 = base64.b64encode(buf.read()).decode('utf-8')
    
    buf.close()
    plt.close()

    return imagen64
'''
