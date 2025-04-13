from sklearn.cluster import KMeans
from joblib import parallel_backend
import os
os.environ["LOKY_MAX_CPU_COUNT"] = "4"

def km(tensor,nro_clusters):
    nro_clusters = int(nro_clusters)
    a,b,c = tensor.shape
    data = tensor.reshape(a*b,c)
    with parallel_backend("loky", n_jobs=1):
        kmeans = KMeans(n_clusters=nro_clusters, 
                        init='k-means++', 
                        n_init='auto', 
                        max_iter=300, 
                        tol=0.0001, 
                        verbose=0, 
                        random_state=None, 
                        copy_x=True, 
                        algorithm='lloyd').fit(data)
    labels = kmeans.labels_.reshape(a,b)

    labels +=1  

    return labels, nro_clusters
