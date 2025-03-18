import { jwtDecode } from 'jwt-decode';

export const Decode = (token) => {
    const decodedToken = jwtDecode(token);
    return decodedToken;
};

export const getDecodedToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

export const getPermissions = () => {
    const decodedToken = getDecodedToken();
    if (!decodedToken || !decodedToken.permissions) return [];
    return decodedToken.permissions[0];
};

export const hasPermission = (permission) => {
    const permissionsArray = getPermissions(); // Lấy danh sách permissions từ token
    return permissionsArray.includes(permission); // Kiểm tra xem quyền có trong danh sách không
};
