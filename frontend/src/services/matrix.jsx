import axios from "axios";

const baseUrl = "http://localhost:5000";

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

const matrixServices = {
  getDescriptorsMatrix,
};

export default matrixServices;
