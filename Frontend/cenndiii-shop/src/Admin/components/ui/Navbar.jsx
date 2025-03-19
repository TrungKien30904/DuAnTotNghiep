import { Globe, Sun, Bell } from "lucide-react";
import { useAuth } from "../../../untils/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Avatar, IconButton } from "@mui/material";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    logout(user.permission);
    handleClose();
    navigate("/admin/login");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="h-16 bg-gray-200 flex items-center justify-between px-4 shadow">
      <div></div>
      <div className="flex items-center space-x-4 relative">
        <IconButton>
          <Globe size={20} />
        </IconButton>
        <IconButton>
          <Sun size={20} />
        </IconButton>
        <IconButton>
          <Bell size={20} />
        </IconButton>

        <div className="flex items-center space-x-4 border border-black px-2 rounded-lg">
          {/* Thông tin user */}
          {user?.username && (
            <div>
              <p className="text-black">{user.username}</p>
              <p className="text-gray-700 text-xs">{user.permission}</p>
            </div>
          )}

          {/* Avatar với menu */}
          <IconButton onClick={handleClick}>
            <Avatar sx={{ width: 32, height: 32, backgroundColor: "gray" }}>
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </Avatar>
          </IconButton>
        </div>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleLogout} sx={{ color: "red" }}>Đăng xuất</MenuItem>
        </Menu>
      </div>
    </header>
  );
}
