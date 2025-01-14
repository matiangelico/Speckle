from sklearn.cluster import MiniBatchKMeans

def mbkm (tensor, nro_clusters):
    
    a,b,c = tensor.shape

    features = tensor.reshape(-1, tensor.shape[-1])  

    mini_kmeans = MiniBatchKMeans(n_clusters=nro_clusters, batch_size=1000, random_state=42)
    labels = mini_kmeans.fit_predict(features)

    return labels.reshape(a,b)
