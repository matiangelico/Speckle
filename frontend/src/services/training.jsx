import axios from "axios";

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

const getDescriptorsMatrix = async (token, type, method) => {
  try {
    const response = await axios.get(`${baseUrl}/downloadMatrix`, {
      params: { type, method },
      headers: { Authorization: `Bearer ${token}` },
      // Indicamos que esperamos una respuesta en formato texto, ya que se envía la matriz formateada
      responseType: "text",
    });
    return response.data;
  } catch (error) {
    console.error("Error al descargar matriz:", error);
    throw new Error(
      error.response?.data?.error ||
        "Error al procesar la solicitud de descarga de matriz."
    );
  }
};

const trainingExperienceServices = {
  getDescriptorsResults,
  getClusteringResults,
  getTrainingResults,
  getDescriptorsMatrix,
};

export default trainingExperienceServices;
