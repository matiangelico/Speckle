import numpy as np
import matplotlib.pyplot as plt
import base64
from io import BytesIO

def colorMap(matriz): 
    fig, ax = plt.subplots()

    # Muestra la imagen sin colorbar
    imagen = ax.imshow(matriz, cmap='jet')
    
    # Obtener valores únicos y acotarlos a 10 si hay más
    valores_unicos = np.unique(matriz)
    if len(valores_unicos) > 10:
        valores_unicos = np.linspace(np.min(matriz), np.max(matriz), 18)

    # Obtener los colores asociados
    colores = [imagen.cmap(imagen.norm(v)) for v in valores_unicos]

    # Crear una lista de puntos vacíos con la leyenda a la derecha
    legend_handles = [plt.Line2D([0], [0], marker='o', color='w', markersize=10, 
                                 markerfacecolor=color, label=f"{int(valor+1)}") 
                      for i, (color, valor) in enumerate(zip(colores, valores_unicos+1), start=1)]

    # Agregar la leyenda fuera de la imagen, a la derecha
    ax.legend(handles=legend_handles, loc='center left', bbox_to_anchor=(1.05, 0.5), 
              title="Ref", fontsize=10, borderaxespad=0.)

    # Ajustar el tamaño de la figura para dejar espacio a la leyenda
    fig.tight_layout()

    # Guardar la imagen en base64
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.1)
    buf.seek(0)
    
    imagen64 = base64.b64encode(buf.read()).decode('utf-8')
    
    buf.close()
    plt.close()

    return imagen64
