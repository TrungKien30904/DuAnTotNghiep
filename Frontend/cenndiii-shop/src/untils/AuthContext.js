import { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setUser(null);
        return;
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
