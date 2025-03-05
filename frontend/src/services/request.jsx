import axios from "axios";

const baseUrl = "http://localhost:5000/experience";

// Deprecated en el futuro =============
const getTraining = async (id) => {
  const response = await axios.post(`${baseUrl}/${id}`);

  return response.data;
};

const createRequest = async () => {
  const response = await axios.get(`${baseUrl}/ejemploMatrizDescriptores`);

  const unaMatriz = response.data[0].matriz_descriptor;

  return unaMatriz;
};
// ================

const trainingExperienceServices = {
  getTraining,
  createRequest,
};

export default trainingExperienceServices;
