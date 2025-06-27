import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
    },
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
api.interceptors.response.use((response) => response, (error) => {
    console.error("Erro na API:", error.response || error.message);
    return Promise.reject(error);
});
export const servicos = {
    async get(endpoint, params = {}) {
        const response = await api.get(endpoint, { params });
        return response.data;
    },
    async post(endpoint, data) {
        const response = await api.post(endpoint, data);
        return response.data;
    },
    async put(endpoint, data) {
        const response = await api.put(endpoint, data);
        return response.data;
    },
    async delete(endpoint) {
        const response = await api.delete(endpoint);
        return response.data;
    },
};
export default api;
