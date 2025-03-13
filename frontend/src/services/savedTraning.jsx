import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

const getAll = async (token) => {
  try {
    const response = await axios.get(`${baseUrl}/experience/user/all `, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.experiencias || response.data;
  } catch (error) {
    console.error("Error al obtener experiencias:", error);
    throw new Error(
      error.response?.data?.error || "Error al obtener las experiencias."
    );
  }
};

const getTraining = async (token, id) => {
  try {
    const response = await axios.get(`${baseUrl}/experience/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener la experiencia:", error);
    throw new Error(
      error.response?.data?.error || "Error al obtener la experiencia."
    );
  }
};

const save = async (token, newTraining) => {
  try {
    const payload = {
      name: newTraining.name,
      video: newTraining.video,
      selectedDescriptors: newTraining.selectedDescriptors,
    };

    const response = await axios.post(`${baseUrl}/experience`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error al guardar experiencia:", error);
    throw new Error(
      error.response?.data?.error || "Error al guardar la experiencia."
    );
  }
};

const remove = async (token, id) => {
  try {
    const response = await axios.delete(`${baseUrl}/experience/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar experiencia:", error);
    throw new Error(
      error.response?.data?.error || "Error al eliminar la experiencia."
    );
  }
};

const trainingServices = {
  getAll,
  getTraining,
  save,
  remove,
};

export default trainingServices;
