import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const getVideoDimensions = async (token, videoFile) => {
  const formData = new FormData();
  formData.append("video", videoFile);

  try {
    const response = await axios.post(`${baseUrl}/dimensions`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al subir archivo:", error);
    throw new Error(
      error.response?.data?.error ||
        "Error al subir los archivos. Inténtalo de nuevo."
    );
  }
};

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
  selectedClustering,
  videoDimension
) => {
  const payload = {
    selectedDescriptors,
    selectedClustering,
    videoDimension,
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
        "Error al procesar la solicitud de entrenamiento."
    );
  }
};

const getTrainingJSONResults = async (token, neuralNetwork, file) => {
  const formData = new FormData();
  formData.append("characteristicMatrix", file);
  formData.append("neuralNetwork", JSON.stringify(neuralNetwork));

  try {
    const response = await axios.post(`${baseUrl}/training/json`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error en training JSON:", error);
    throw new Error(
      error.response?.data?.error ||
        "Error al procesar la solicitud de entrenamiento JSON."
    );
  }
};

const trainingExperienceServices = {
  getVideoDimensions,
  getDescriptorsResults,
  getClusteringResults,
  getTrainingResults,
  getTrainingJSONResults,
};

export default trainingExperienceServices;
