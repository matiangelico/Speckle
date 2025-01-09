import numpy as np
import matplotlib.pyplot as plt
import scipy.io as sio
from descriptores import entropiaShannon,adri,fuzzy
import spectralClustering
import kmeans
import minibatchKmeans
import agglomerative
import gmm
import hdb
import sustractivo

data = sio.loadmat('matrizMoneda10.mat')
m = np.array(data['video_data']).transpose(1,2,0)

m1 = entropiaShannon(m)
m2 = adri(m)
m3 = fuzzy(m)

'''
plt.imshow(m1, cmap='jet') 
plt.colorbar()
plt.title("entropia shannon")
plt.show()

plt.imshow(m2, cmap='jet') 
plt.colorbar()
plt.title("adri")
plt.show()

plt.imshow(m3, cmap='jet') 
plt.colorbar()
plt.title("fuzzy")
plt.show()
'''

matrices = [m1,m2,m3]

tensor = np.stack(matrices, axis=-1) 

n_clusters=3

modulos_ia = {
    "Kmeans" : kmeans.km,
    "MiniBatch Kmeans" : minibatchKmeans.mbkm,
    "GMM" : gmm.gmm,
    "Spectral Clustering" : spectralClustering.sc,
    "Agglometarive Clustering" : agglomerative.agglo,
    "Hdbscan" : hdb.hello,
    "Sustractive Clustering": sustractivo.sus,
}

n_clustering_methods = len(modulos_ia)
n_cols = 3 
n_rows = 3

fig, axes = plt.subplots(n_rows, n_cols, figsize=(15,15))  # Ajustar el tamaño de la figura
axes = axes.flatten()  # Aplanar la matriz de ejes para iterar fácilmente

for i, (index, function) in enumerate(modulos_ia.items()):
    matriz = function(tensor, n_clusters)
    ax = axes[i]  # Seleccionar el subplot correspondiente
    im = ax.imshow(matriz, cmap='jet')
    ax.set_title(index, fontsize=5,pad =5)
    fig.colorbar(im, ax=ax, orientation='vertical')

# Ocultar subplots vacíos si hay más subplots que imágenes
for ax in axes[n_clustering_methods:]:
    ax.axis('off')

# Mostrar la figura completa
fig.subplots_adjust(hspace=0.25, wspace=0.15)
plt.show()
'''
for index, function in modulos_ia.items():
    matriz = function(tensor, n_clusters)
    plt.imshow(matriz, cmap='jet') 
    plt.colorbar()
    plt.title(index)
    plt.show()

'''