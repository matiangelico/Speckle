import axios from "axios";

const baseUrl = "http://localhost:3002";

// Deprecated en el futuro =============
const getDescriptorsResults = async () => {
  const response = await axios.get(`${baseUrl}/resultadoDescriptores`);

  return response.data;
};

const getDescriptorsMatrix = async () => {
  const response = await axios.get(`${baseUrl}/ejemploMatrizDescriptores`);

  const unaMatriz = response.data[0].matriz_descriptor;

  return unaMatriz;
};

const getClusteringResults = async () => {
  const response = await axios.get(`${baseUrl}/resultadoClustering`);

  return response.data;
};

const getTrainingResults = async () => {
  const response = await axios.get(`${baseUrl}/resultadoEntrenamiento`);

  return response.data;
};

// ================

const trainingExperienceServices = {
  getDescriptorsResults,
  getDescriptorsMatrix,
  getClusteringResults,
  getTrainingResults,
};

export default trainingExperienceServices;
