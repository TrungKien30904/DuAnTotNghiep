import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import axios from "axios";
import { Decode } from "../../../security/DecodeJWT";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [phoneNum, setPhoneNum] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        username: phoneNum,
        password: password,
        isCustomer: false,
      });
      if (res.status === 200) {
        const token = res.data.token;
        const refreshToken = res.data.refreshToken;

        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);

        const decodedToken = Decode(token);
        navigate(decodedToken.permissions[0] === "ADMIN" || decodedToken.permissions[0] === "STAFF" ? "/admin" : "/home");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Banner bên trái */}
      <div className="w-2/3 bg-black flex items-center justify-center text-white text-4xl font-bold">
        Welcome to Our Platform
      </div>

      {/* Form đăng nhập bên phải */}
      <div className="w-1/3 flex justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
          <form onSubmit={handleLogin}>
            {/* Số điện thoại */}
            <div className="mb-4 relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="number"
                placeholder="Số điện thoại"
                value={phoneNum}
                onChange={(e) => setPhoneNum(e.target.value)}
                className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            
            {/* Mật khẩu */}
            <div className="mb-4 relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Nút đăng nhập */}
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-all"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}