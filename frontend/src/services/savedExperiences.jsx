import axios from "axios";

const baseUrl = "http://localhost:3001";

const getAll = async () => {
  const response = await axios.get(`${baseUrl}/defaultValues`);

  return response.data.experiencias;
};

const create = async (newObject) => {
  console.log(newObject);

  // const response = await axios.post(baseUrl, newObject, config())
  // return response.data
}

const remove = (id) => {
  console.log(id);

  // return axios.delete(`${baseUrl}/${id}`, config())
}

export default { getAll, create, remove }
// export default { getAll, create, remove }