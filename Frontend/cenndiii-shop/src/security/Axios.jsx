import axios from "axios";

const BASE_URL = "http://localhost:8080"; // URL của backend API

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            console.warn("⚠️ No refresh token found. Redirecting to login...");
            throw new Error("No refresh token available");
        }

        console.log("🔄 Refreshing token...");
        const response = await axios.post(`${BASE_URL}/auth/get-token`, { refreshToken });

        if (!response.data.accessToken) {
            throw new Error("⚠️ Invalid refresh token response");
        }

        const newAccessToken = response.data.accessToken;
        console.log("✅ New access token received:", newAccessToken);
        localStorage.setItem("token", newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error("❌ Refresh token failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login if refresh fails
        throw error;
    }
};


// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            console.warn("🔄 Token expired! Trying to refresh...");
            
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newToken) => {
                        console.log("✅ Using new token from refresh process");
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshToken();
                console.log("🔁 Retrying original request with new token...");
                isRefreshing = false;
                onRefreshed(newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);



export default api;
