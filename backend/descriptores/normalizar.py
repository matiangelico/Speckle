import numpy as np

def normalizar(matriz):
    return np.array((matriz - matriz.min()) / (matriz.max()- matriz.min())).astype(np.float16)