import axios from "axios";

export const fetchDescriptors = async () => {
  const response = await fetch("http://localhost:5000/descriptor");
  if (!response.ok) throw new Error("Error en la red");
  return response.json();
};

export const uploadVideoWithDescriptors = async (formData) => {
  const response = await axios.post("http://localhost:5000/uploadVideo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
