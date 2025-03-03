import axios from "axios";

const baseUrl = "http://localhost:5000/defaultValues";

const getAll = async (token) => {  
  try {
    const { data } = await axios.get(baseUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return data;
  } catch (error) {
    console.error(error);
    throw error; // O manejar el error según corresponda
  }
};

// const baseUrl = "http://localhost:3001/defaultValues";

// const getAll = async (token) => {
//   console.log(token);
  
//   const response = await axios.get(baseUrl);
//   return response.data;
// };

const defaultValuesServices = { getAll };

export default defaultValuesServices;
