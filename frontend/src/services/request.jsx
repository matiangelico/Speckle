import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const getExperiencePrediction = async (token, experienceId, videoDimension) => {
  const payload = { videoDimension };

  try {
    const response = await axios.post(
      `${baseUrl}/prediction/${experienceId}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error en la predicción de experiencia:", error);
    throw new Error(
      error.response?.data?.error ||
        "Error al realizar la predicción de experiencia. Inténtalo de nuevo."
    );
  }
};


const experienceServices = {
  getExperiencePrediction,
};

export default experienceServices;
