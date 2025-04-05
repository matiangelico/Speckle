import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const getDescriptorsMatrix = async (
  token,
  type,
  methodId,
  videoWidth,
  videoHeight
) => {
  try {
    const response = await axios.get(
      `${baseUrl}/download/?type=${type}&method=${methodId}&width=${videoWidth}&height=${videoHeight}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "text",
      }
    );

    return JSON.parse(response.data);
  } catch (error) {
    console.error("Error al descargar matriz:", error);
    throw new Error(
      error.response?.data?.error ||
        "Error al procesar la solicitud de descarga de matriz."
    );
  }
};

const matrixServices = {
  getDescriptorsMatrix,
};

export default matrixServices;
