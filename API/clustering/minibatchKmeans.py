from sklearn.cluster import MiniBatchKMeans

def mbkm (tensor, nro_clusters):
    
    nro_clusters = int(nro_clusters)

    a,b,c = tensor.shape

    features = tensor.reshape(-1,c)  

    mini_kmeans = MiniBatchKMeans(n_clusters=nro_clusters, batch_size=1000, random_state=42)
    labels = mini_kmeans.fit_predict(features)

    labels +=1

    return labels.reshape(a,b), nro_clusters
