import axios from "axios";

const baseUrl = "http://localhost:3001/resultadoDescriptores";

// Deprecated en el futuro =============
const getResults = async () => {
  const response = await axios.get(baseUrl);
  
  return response.data;
};
// ================

const trainingExperienceServices = { getResults };

export default trainingExperienceServices;
