from sklearn.cluster import SpectralClustering
from skimage.transform import resize
import numpy as np

def sc (tensor, nro_clusters):

    a,b,c = tensor.shape

    tensor_reducido = np.array([resize(img, (a//2, b//2)) for img in tensor.transpose(2, 0, 1)])
    tensor_reducido = tensor_reducido.transpose(1, 2, 0)  # Forma: (150, 150, N)
    
    features = tensor_reducido.reshape(-1,c)

    spectral = SpectralClustering(
        n_clusters=nro_clusters,
        affinity='nearest_neighbors',
        n_neighbors=10,
        assign_labels='kmeans',
        random_state=42
    )
    labels = spectral.fit_predict(features)

    labels_reducidos = labels.reshape(a//2,b//2)

    return resize(labels_reducidos, (a,b), order=0, preserve_range=True).astype(int)
