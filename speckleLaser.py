import numpy as np
import scipy.io as sio
import descriptores as ds

data = sio.loadmat('matrizmoneda10.mat')
m = np.array(data['video_data']).transpose(1,2,0)

a = np.array(ds.diferenciasPromediadas(m))
b = np.array(ds.fujii(m))
c = np.array(ds.entropiaShannon(m))

<<<<<<< HEAD
tensor = np.array([[[1,2,3,14],[42,5,6,7],[6,27,8,9]],[[110,11,12,13],[132,14,15,16],[172,17,18,19]],[[20,1,22,23],[23,24,25,26],[26,27,28,29]]])

def correlacion_cruzada_1d(arr):
    return np.correlate(arr, arr, mode='full')

#print(tensor[:,:,0:4])
print(np.array(ds.correlacionCruzada(tensor)))
=======

print(b)


print("ENTROPIA DE SHANNON")
print(c)
>>>>>>> 8c215df5dd93d320fdcc03ceca99e757d9356d31
