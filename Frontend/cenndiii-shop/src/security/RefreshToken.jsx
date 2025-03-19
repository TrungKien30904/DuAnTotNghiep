import Axios from "axios";
export const refreshToken = async () => {
  const BASE_URL = "http://localhost:8080";
  const refreshToken = localStorage.getItem("refreshToken"); // Lấy refresh token từ localStorage

  try {
    const response = await Axios.post(
      BASE_URL+"/auth/get-token",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`, // Truyền refresh token vào header
        },
        validateStatus: (status) => status < 500,
      }
    );


    if (response.status === 200) {
      const result = response.data;
      // Lưu token mới vào localStorage
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("refreshToken", result.data.refreshToken);
      console.log("Token được làm mới thành công.");
      if (response?.data.status === 401) {
        return false;
      }
      return true; // Refresh thành công
    } else {
      console.log("Refresh token không hợp lệ hoặc đã hết hạn.");
      return false; // Refresh thất bại
    }

  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Refresh token không hợp lệ hoặc đã hết hạn.");
      return false;
    }
    return false;
  }
};