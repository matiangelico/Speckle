import numpy as np

def normalizar(matriz):
    matriz_normalizada = np.array((matriz - matriz.min()) / (matriz.max()- matriz.min()))
    return matriz_normalizada.astype(np.float16)