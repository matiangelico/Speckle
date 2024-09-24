import numpy as np
import scipy.io as sio
import descriptores as ds

#data = sio.loadmat('matrizmoneda10.mat')
#m = np.array(data['video_data']).transpose(1,2,0)
#ds.setearFrames(m.shape[2])

tensor = np.array([[[1,2,3,14],[42,5,6,7],[6,27,8,9]],[[110,11,12,13],[132,14,15,16],[172,17,18,19]],[[20,1,22,23],[23,24,25,26],[26,27,28,29]]])
ds.setearFrames(4)

#a = np.array(ds.diferenciasPromediadas(m))
#b = np.array(ds.fujii(m))
#c = np.array(ds.entropiaShannon(m))
#d = np.array(ds.diferenciasPesadas(m))
#e = np.array(ds.autocorrelacionFFT(m))
#f = np.array(ds.autoCorrelacion(m))
#g = np.array(ds.frecuenciaMedia(m))
#h = np.array(ds.entropiaShannon1(m))


#print(timeit.timeit("ds.autoCorrelacion(m)",globals=globals(),number=1))
#print(timeit.timeit("ds.autocorrelacionFFT(m)",globals=globals(),number=1))

np.set_printoptions(suppress=True,precision=2)
#print(tensor[0,0,:])
#print (ds.diferenciasPesadas(tensor))
#print (np.sum(np.stack([tensor[:,:,:ki-1] for ki in range(4)],axis=2 ),axis=2))
#print(e.shape)
#print(e)
#print(f)
#print (np.allclose(e,f))

#print (ds.fuzzy(tensor,10))
print(ds.frecuenciaCorte(tensor))

#print(tensor[:,:,0:4])
print(np.array(ds.entropiaShannon(tensor)))

