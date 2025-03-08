import axios from "axios";

const baseUrlOrigin = "http://localhost:3002";
const baseUrl = "http://localhost:5000";

const getDescriptorsResults = async (token, videoFile, selectedDescriptors) => {
  const formData = new FormData();
  formData.append("video", videoFile);

  // Crear un archivo .json a partir del objeto selectedDescriptors
  const descriptorsFile = new File(
    [JSON.stringify(selectedDescriptors)],
    "selectedDescriptors.json",
    { type: "application/json" }
  );
  formData.append("selectedDescriptors", descriptorsFile);

  try {
    const response = await axios.post(`${baseUrl}/uploadVideo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al subir archivos:", error);
    throw new Error(
      error.response?.data?.error ||
        "Error al subir los archivos. Inténtalo de nuevo."
    );
  }
};

// Deprecated en el futuro =============
const getDescriptorsMatrix = async () => {
  const response = await axios.get(
    `${baseUrlOrigin}/ejemploMatrizDescriptores`
  );

  const unaMatriz = response.data[0].matriz_descriptor;

  return unaMatriz;
};

const getClusteringResults = async (
  token,
  selectedDescriptors,
  selectedClustering
) => {
  const payload = {
    selectedDescriptors,
    selectedClustering,
  };

  try {
    const response = await axios.post(`${baseUrl}/clustering`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error en el clustering:", error);
    throw new Error(
      error.response?.data?.error ||
        "Error al procesar la solicitud de clustering."
    );
  }
};

const getTrainingResults = async (
  token,
  neuralNetworkLayers,
  neuralNetworkParams,
  selectedClustering
) => {
  const payload = {
    neuralNetworkLayers,
    neuralNetworkParams,
    selectedClustering,
  };

  console.log("payload", payload);

  try {
    const response = await axios.post(`${baseUrl}/training`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error en training:", error);
    throw new Error(
      error.response?.data?.error ||
        "Error al procesar la solicitud de training."
    );
  }
};

const trainingExperienceServices = {
  getDescriptorsResults,
  getDescriptorsMatrix,
  getClusteringResults,
  getTrainingResults,
};

export default trainingExperienceServices;
