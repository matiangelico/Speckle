from sklearn.cluster import AgglomerativeClustering

def bc(tensor, n_clusters):
    a, b, c = tensor.shape
    features = tensor.reshape(-1, c)

    agglo = AgglomerativeClustering(n_clusters=n_clusters, linkage='average')
    labels = agglo.fit_predict(features)

    return labels.reshape(a, b)
