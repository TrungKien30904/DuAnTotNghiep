import axios from "axios";
import {refreshToken} from "./RefreshToken";

const BASE_URL = "http://localhost:8080";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

// Thêm Interceptor để kiểm tra lỗi 401
api.interceptors.response.use(
    response => response, // Trả về response nếu thành công
    async (error) => {
        if (error.response && error.response.status === 401) {
            const refreshed = await refreshToken();
            if (refreshed) {
                // Nếu refresh thành công, thử gửi lại request
                error.config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
                return api(error.config);
            } else {
                logoutUser();
            }
        }
        return Promise.reject(error);
    }
);

// Hàm logout người dùng
const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
    } else {
        window.location.href = "/login";
    }
};

export default api;
