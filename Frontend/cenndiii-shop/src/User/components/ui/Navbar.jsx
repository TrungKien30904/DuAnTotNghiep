import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AppBar, Toolbar, IconButton, Badge, Avatar } from "@mui/material";
import { ShoppingCart, Search } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../pages/cart/CartContext"; // Import useCart
import { useAuth } from "../../../untils/AuthContext";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const { cartCount } = useCart(); // Lấy cartCount từ context
  const [scrolling, setScrolling] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth(); // Lấy user từ context
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const navLinks = [
    { link: "home", name: "Trang chủ" },
    { link: "shop", name: "Sản phẩm" },
    { link: "contact", name: "Liên hệ" },
    { link: "about", name: "Về chúng tôi" }
  ];
  const handleAvatarClick = (event) => {
    if (!user) {
      navigate("/login");
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ AuthContext
    handleClose();
    navigate("/home"); // Chuyển hướng sau khi logout
  };



  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => setScrolling(window.scrollY > 400));
  }, []);

  useEffect(() => {
    if (location.pathname === "/home") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setScrolling(false); // Reset trạng thái khi không ở /home
    }
  }, [handleScroll, location.pathname]);

  return (
    <AppBar position="fixed"
      sx={{
        backgroundColor:
          location.pathname === "/home"
            ? scrolling
              ? "rgba(255, 255, 255, 0.9)"
              : "transparent"
            : "white", // Các trang khác thì để màu trắng luôn
        backdropFilter: location.pathname === "/home" && scrolling ? "blur(10px)" : "none",
        boxShadow:
          location.pathname === "/home"
            && scrolling
            ? "0px 7px 10px rgba(0, 0, 0, 0.1)" // Home chỉ có boxShadow khi scroll xuống 400px
            : "none",
        borderBottom: location.pathname === "/home"
          ? scrolling
            ? "1px solid rgba(0, 0, 0, 0.2)"
            : "none"
          : "1px solid rgba(0, 0, 0, 0.2)",
        transition: "all 0.4s ease-in-out",
      }}>
      <Toolbar className="flex justify-between">
        <div className="text-2xl font-bold">
          <Link to="/home">
            <img src="/logo.png" alt="logo" className="h-10 transition-transform duration-300 hover:scale-110" />
          </Link>
        </div>
        <div className="hidden md:flex gap-6 text-lg text-black">
          {navLinks.map((item, index) => (
            <Link key={index} to={`/${item.link.toLowerCase()}`} className="relative group">
              {item.name}
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <IconButton
            className="transition-transform duration-300 hover:scale-110 text-black"
            aria-label="Search"
          >
            <Search />
          </IconButton>
          <Link to="/cart">
            <IconButton className="transition-transform duration-300 hover:scale-110 text-black">
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCart fontSize="medium" />
              </Badge>
            </IconButton>
          </Link>
          <IconButton onClick={handleAvatarClick} className="transition-transform duration-300 hover:scale-110">
            <Avatar src={user ? user.avatarUrl : ""} alt="User Avatar" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            disablePortal
            disableScrollLock
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>
              {user?.username}
            </MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
