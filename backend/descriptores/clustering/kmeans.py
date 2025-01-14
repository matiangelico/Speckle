import numpy as np
from sklearn.cluster import KMeans
from joblib import parallel_backend
import os
os.environ["LOKY_MAX_CPU_COUNT"] = "4"

def km(tensor,nro_clusters):
    a,b,c = tensor.shape
    data = tensor.reshape(a*b,c)
    with parallel_backend("loky", n_jobs=1):
        kmeans = KMeans(n_clusters=nro_clusters, random_state=0).fit(data)
    labels = kmeans.labels_.reshape(a,b)

    return labels
