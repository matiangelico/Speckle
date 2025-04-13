import numpy as np
import matplotlib.pyplot as plt
import base64
from io import BytesIO

def colorMap(matriz): 
    fig, ax = plt.subplots()

    imagen = ax.imshow(matriz, cmap='jet')
    
    valores_unicos = np.unique(matriz)
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
