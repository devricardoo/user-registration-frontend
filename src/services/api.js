import axios from "axios";

const api = axios.create({
  headers: {
    Accept: "application/json",
  },
});

// Adiciona o token antes de cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
