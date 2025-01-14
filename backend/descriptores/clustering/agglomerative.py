from sklearn.cluster import AgglomerativeClustering
from sklearn.neighbors import kneighbors_graph

def agglo (tensor, nro_clusters):

    a,b,c = tensor.shape

    features = tensor.reshape(-1, tensor.shape[-1])

    connectivity = kneighbors_graph(features, n_neighbors=10, include_self=False)

    agglo = AgglomerativeClustering(n_clusters=nro_clusters, linkage='ward',connectivity=connectivity)
    labels = agglo.fit_predict(features)

    
    return labels.reshape(a, b)
