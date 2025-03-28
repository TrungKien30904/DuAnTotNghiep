import { Globe, Sun, Bell } from "lucide-react";
import { useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Avatar, IconButton } from "@mui/material";

import { getPermissions,getUserName,logout } from "../../../security/DecodeJWT";
export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [user, setUser] = useState("")
  const [userName, setUserName] = useState("");
  useEffect(() => {
    setUser(getPermissions());
    setUserName(getUserName())
  }, [])

  const handleLogout = () => {
    handleClose();
    logout(user)
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
          <div>
            <p className="text-black">{userName}</p>
            <p className="text-gray-700 text-xs">{user}</p>
          </div>

          {/* Avatar với menu */}
          <IconButton onClick={handleClick}>
            <Avatar sx={{ width: 32, height: 32, backgroundColor: "gray" }}>

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
