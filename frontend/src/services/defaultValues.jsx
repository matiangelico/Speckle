import axios from "axios";

const baseUrl = "http://localhost:5000";

const getAll = async (token) => {  
  try {
    const { data } = await axios.get(`${baseUrl}/defaultValues`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return data;
  } catch (error) {
    console.error(error);
    throw error; // O manejar el error según corresponda
  }
};

const defaultValuesServices = { getAll };

export default defaultValuesServices;
