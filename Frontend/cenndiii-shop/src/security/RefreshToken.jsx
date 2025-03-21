import axios from "axios";
export const refreshToken = async () => {
  const BASE_URL = "http://localhost:8080";
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
      console.log("Không có refresh token, cần đăng nhập lại.");
      return false;
  }

  try {
      const response = await axios.post(
          `${BASE_URL}/auth/get-token`,
          {},
          {
              headers: {
                  "Content-Type": "application/json",
                  Authorization : `Bearer ${refreshToken}`,
              }
          }
      );

      if (response.status === 200) {
          const result = response.data;
          if (result?.token && result?.refreshToken) {
              localStorage.setItem("token", result.token);
              localStorage.setItem("refreshToken", result.refreshToken);
              console.log("Token được làm mới thành công.");
              return true; 
          }
      }

      console.log(response);
      return false; 
  } catch (error) {
      console.log("Lỗi khi refresh token:", error);
      return false; 
  }
};
