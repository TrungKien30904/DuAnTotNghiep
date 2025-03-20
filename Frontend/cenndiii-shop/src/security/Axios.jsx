import axios from "axios";
import { refreshToken } from "./RefreshToken";

const BASE_URL = "http://localhost:8080";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// 🔹 Luôn lấy token trước mỗi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("⚠️ Không tìm thấy token, API có thể bị lỗi!");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🔹 Xử lý lỗi 401 và refresh token
api.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) {
                const newToken = localStorage.getItem("token"); // Lấy token mới
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return api(error.config);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
