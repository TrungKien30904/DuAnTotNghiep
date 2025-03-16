import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AppBar, Toolbar, IconButton, Badge, Avatar } from "@mui/material";
import { ShoppingCart, Search } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const location = useLocation();

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

  const menuItems = useMemo(() => ["Home", "Shop", "Blog", "Contact", "About"], []);

  return (
    <AppBar
      position="fixed"
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
      }}
    >
      <Toolbar className="flex justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/home">
            <img src="/logo.png" alt="logo" className="h-10 transition-transform duration-300 hover:scale-110" />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 text-lg text-black">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={`/${item.toLowerCase()}`}
              className="relative group"
            >
              {item}
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <IconButton
            className="transition-transform duration-300 hover:scale-110 text-black"
            aria-label="Search"
          >
            <Search />
          </IconButton>
          <IconButton
            className="transition-transform duration-300 hover:scale-110 text-black"
            aria-label="Shopping Cart"
          >
            <Badge badgeContent={0} color="primary" invisible={0 === 0}>
              <ShoppingCart />
            </Badge>
          </IconButton>
          <Avatar
            src="/default-avatar.png"
            alt="User Avatar"
            className="transition-transform duration-300 hover:scale-110"
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
