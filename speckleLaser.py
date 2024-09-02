import numpy as np
import scipy.io as sio
import descriptores as ds

data = sio.loadmat('matrizmoneda10.mat')
m = np.array(data['video_data']).transpose(1,2,0)

a = np.array(ds.diferenciasPromediadas(m))
b = np.array(ds.fujii(m))
c = np.array(ds.entropiaShannon(m))


print(b)


print("ENTROPIA DE SHANNON")
print(c)