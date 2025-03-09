import axios from "axios";

const baseUrl = "http://localhost:5000";

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

const save = async (token, newExperience) => {
  try {
    const payload = {
      name: newExperience.name,
      video: newExperience.video,
      selectedDescriptors: newExperience.selectedDescriptors,
    };

    const response = await axios.post(`${baseUrl}/experience`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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

const experienceServices = {
  getAll,
  save,
  remove,
};

export default experienceServices;
