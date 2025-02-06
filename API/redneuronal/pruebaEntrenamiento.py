import numpy as np
import scipy.io as sio
from descriptores import entropiaShannon,adri,fuzzy
import kmeans
import entrenamiento


data = sio.loadmat('matrizMoneda10.mat')
m = np.array(data['video_data']).transpose(1,2,0)

m1 = entropiaShannon(m)
m2 = adri(m)
m3 = fuzzy(m)

matrices = [m1,m2,m3]

tensor = np.stack(matrices, axis=-1) 

entrada = tensor.reshape(-1,3)

n_clusters=3

matriz = kmeans.km(tensor, n_clusters)

resultados = matriz.reshape(-1)

capas = [
    {"Neuronas" : "8","BatchNormalization" :"1","Dropout" : "0.1"},
    {"Neuronas" : "16","BatchNormalization" :"0","Dropout" : "0.1"},
    {"Neuronas" : "8","BatchNormalization" :"1","Dropout" : "0.15"}
]

parametros_entrenamiento = np.zeros((3,len(capas)))

for t,datos in enumerate(capas):      
    parametros_entrenamiento[t,0]=datos['Neuronas']
    parametros_entrenamiento[t,1]=datos['BatchNormalization']
    parametros_entrenamiento[t,2]=datos['Dropout']

print(entrada.shape)
print(resultados.shape)
print(parametros_entrenamiento)

entrenamiento.redEntrenamiento(entrada,resultados,parametros_entrenamiento)

