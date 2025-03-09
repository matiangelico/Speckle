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

// Crea (guarda) una nueva experiencia
const create = async (newExperience, token) => {
  try {
    // newExperience debe incluir las propiedades: name, video y selectedDescriptors.
    // Si 'video' es un archivo y se debe enviar como multipart/form-data,
    // puedes crear un FormData, por ejemplo:
    const formData = new FormData();
    formData.append("name", newExperience.name);
    // Suponiendo que newExperience.video es un File, lo agregamos directamente
    formData.append("video", newExperience.video);
    // Si selectedDescriptors es un objeto o array, lo convertimos a JSON
    formData.append(
      "selectedDescriptors",
      new Blob([JSON.stringify(newExperience.selectedDescriptors)], {
        type: "application/json",
      })
    );
    const response = await axios.post(`${baseUrl}/savedExperience`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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

// Elimina una experiencia según su ID
const remove = async (id, token) => {
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
  create,
  remove,
};

export default experienceServices;
