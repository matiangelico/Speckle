const countElementsByIdDescriptor = (data) => {
  return data.filter((item) => "id_descriptor" in item).length;
};

const getMaxValueByIdClustering = (data) => {
  const item = data.find((item) => "id_clustering" in item);

  if (!item) {
    return null;
  }

  if (Array.isArray(item.matriz_clustering)) {
    let maxVal = -Infinity;

    for (let i = 0; i < item.matriz_clustering.length; i++) {
      if (item.matriz_clustering[i] > maxVal) {
        maxVal = item.matriz_clustering[i];
      }
    }

    return maxVal;
  } else {
    return null;
  }
};

export const readFileAndProcess = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContent = event.target.result;

      // Parse the JSON content
      const data = JSON.parse(fileContent);

      // Use the count and max value functions
      const count = countElementsByIdDescriptor(data);
      const maxClusteringValue = getMaxValueByIdClustering(data); // Example: 'sa' as id_clustering

      // Resolve the promise with the results
      resolve({ count, maxClusteringValue });
    };

    reader.onerror = function (error) {
      reject("Error reading file: " + error);
    };

    reader.readAsText(file);
  });
};
