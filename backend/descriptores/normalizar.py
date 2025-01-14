import numpy as np

def n(matriz):
    return np.array((matriz - matriz.min()) / (matriz.max()- matriz.min())).astype(np.float16)

