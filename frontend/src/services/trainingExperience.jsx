import axios from "axios";

const baseUrl = "http://localhost:3002";

// Deprecated en el futuro =============
const getDescriptorsResults = async () => {
  const response = await axios.get(`${baseUrl}/resultadoDescriptores`);
  
  return response.data;
};

const getClusteringResults = async () => {
  const response = await axios.get(`${baseUrl}/resultadoClustering`);
  
  return response.data;
};
// ================

const trainingExperienceServices = { getDescriptorsResults, getClusteringResults };

export default trainingExperienceServices;
