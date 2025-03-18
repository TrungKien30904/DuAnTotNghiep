import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import axios from "axios";
import {Decode,getDecodedToken} from "./DecodeJWT";
import { useNavigate } from "react-router-dom";
export default function LoginForm() {
  const [phoneNum, setPhoneNum] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      axios.post("http://localhost:8080/auth/login", {
        username: phoneNum,
        password: password,
        isCustomer: false,
      }).then((res) => {
        if (res.status === 200) {
          const token = res.data.token;
          const refreshToken = res.data.refreshToken;
          
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
          

          const decodedToken = Decode(token);

          if (decodedToken.permissions[0] === "ADMIN" || decodedToken.permissions[0] === "STAFF") {
            navigate("/admin");
          } else if (decodedToken.permissions[0] === "CUSTOMER") {
            navigate("/home"); 
          }else{
            navigate("/login");
          }
          
        }
      });

      console.log(res);
    } catch (error) {
      
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-4 relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="number"
              value={phoneNum}
              onChange={(e) => setPhoneNum(e.target.value)}
              className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Password Input */}
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
            {/* <button
              type="button"
              className="absolute right-3 top-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button> */}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-all"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
