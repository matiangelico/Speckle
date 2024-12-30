import axios from "axios";

const baseUrl = "http://localhost:3001/descriptors";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

// TERMINAR ====
const update = async (id, defaultValue) => {
  const defaultValueChanged = {
    ...defaultValue,
    votes: defaultValue.votes + 1,
  };
  const response = await axios.put(`${baseUrl}/${id}`, defaultValueChanged);
  return response.data;
};
// ====

const defaultValuesServices = { getAll, update };

export default defaultValuesServices;
