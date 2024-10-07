import numpy as np
import scipy.io as sio
import descriptores as ds

data = sio.loadmat('matrizmoneda10.mat')
m = np.array(data['video_data']).transpose(1,2,0)
ds.setearDimensiones(m)

tensor = np.array([[[1,2,3,14],[42,5,6,7],[6,27,8,9]],[[110,11,12,13],[132,14,15,16],[172,17,18,19]],[[20,1,22,23],[23,24,25,26],[26,27,28,29]]])
#ds.setearDimensiones(tensor)

#a1 = np.array(ds.diferenciasPesadas(m))
#b2 = np.array(ds.diferenciasPromediadas(m))
#c3 = np.array(ds.fujii(m))
#d4 = np.array(ds.desviacionEstandar(m))
#e5 = np.array(ds.contrasteTemporal(m))
#f6 = np.array(ds.autoCorrelacion(m))
#g7 = np.array(ds.fuzzy(m,120))
#h8 = np.array(ds.frecuenciaMedia(m))
i9 = np.array(ds.entropiaShannon(m))
#j10 = np.array(ds.frecuenciaCorte(m))
#k11 = np.array(ds.waveletEntropy(m))
#l12 = np.array(ds.highLowRatio(m))
#n13 = np.array(ds.filtroBajo(m))
#o14 = np.array(ds.filtroMedio(m))
#p15 = np.array(ds.filtroAlto(m))


#print(timeit.timeit("ds.autoCorrelacion(m)",globals=globals(),number=1))
#print(timeit.timeit("ds.autocorrelacionFFT(m)",globals=globals(),number=1))

np.set_printoptions(suppress=True,precision=2)
#print(np.sum(tensor[0,0,:]))
#print (np.allclose(e,f))

#print('diferencias pesadas',a1.shape)
#print('diferencias promediadas ',b2.shape)
#print('fujii ',c3.shape)
#print('desviacion estandar ',d4.shape)
#print('contraste temporal ',e5.shape)
#print('autocorrelacion ',f6.shape)
#print('fuzzy ',g7.shape)
#print('frecuencia media ',h8.shape)
#print('entropia shannon ',i9.shape)
#print('frecuencia de corte ',j10.shape)
#print('wavelet entropy ',k11.shape)
#print('high-low ratio ',l12.shape)
#print('filtro bajo ',n13.shape)
#print('filtro medio ',o14.shape)
#print('filtro alto ',p15.shape)

descripMarcelo = sio.loadmat('Descriptores_M10.mat')
matriz= descripMarcelo['desc_es']

#print(ds.autoCorrelacion(tensor))
print(matriz[5][15], matriz[184][284])
print(i9[5][15], i9[184][284])
print(np.allclose(matriz,i9))
