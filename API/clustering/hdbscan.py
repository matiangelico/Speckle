import hdbscan
from joblib import parallel_backend
import os
os.environ["LOKY_MAX_CPU_COUNT"] = "4"
os.environ["NUMBA_NUM_THREADS"] = "4" 

def hd (tensor, csize, epsilon):

    csize = int(csize)

    epsilon = float(epsilon)

    a,b,c = tensor.shape
    
    features = tensor.reshape(-1,c)
    with parallel_backend("loky", n_jobs=-1):
        db = hdbscan.HDBSCAN(min_cluster_size=csize,
                             cluster_selection_epsilon=epsilon,
                             cluster_selection_method='leaf').fit(features)
    
    labels = db.labels_

    n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
    n_noise_ = list(labels).count(-1)

    print("Estimated number of clusters: %d" % n_clusters_)
    print("Estimated number of noise points: %d" % n_noise_)

    return labels.reshape(a,b),n_clusters_
