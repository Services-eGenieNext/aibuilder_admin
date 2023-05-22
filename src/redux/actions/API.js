import axios from "axios";
const API = axios.create({
  baseURL: `${process.env.REACT_APP_API}/api/`,
});

export const postRequest = async (url, token, formData = {}) => {
  formData.token = token;
  return await API.post(`/${url}/`, formData)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error.response;
    });
};

export const getRequest = async (url, token) => {
  return await API.get(`/${url}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
