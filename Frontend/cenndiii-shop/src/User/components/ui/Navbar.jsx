import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Badge, Avatar } from "@mui/material";
import { ShoppingCart, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useCart } from "../../pages/cart/CartContext"; // Import useCart

const Navbar = () => {
  const { cartCount } = useCart(); // Lấy cartCount từ context
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppBar position="fixed"
      sx={{
        backgroundColor: scrolling ? "rgba(255, 255, 255, 0.9)" : "transparent",
        backdropFilter: scrolling ? "blur(10px)" : "none",
        boxShadow: scrolling ? "0px 10px 30px rgba(0, 0, 0, 0.1)" : "none",
        borderBottom: scrolling ? "1px solid rgba(0, 0, 0, 0.2)" : "none",
        transition: "all 0.4s ease-in-out",
      }}>
      <Toolbar className="flex justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/home">
            <img src="/logo.png" alt="logo" className="h-10 transition-transform duration-300 hover:scale-110" />
          </Link>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex gap-6 text-lg text-black">
          {["Home", "Shop", "Blog", "Contact", "About"].map((item, index) => (
            <Link key={index} to={`/${item.toLowerCase()}`} className="relative group">
              {item}
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"></span>
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <IconButton className="transition-transform duration-300 hover:scale-110 text-black">
            <Search />
          </IconButton>
          <Link to="/cart">
            <IconButton className="transition-transform duration-300 hover:scale-110 text-black">
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCart fontSize="medium" />
              </Badge>
            </IconButton>
          </Link>
          <Avatar src="" alt="User Avatar" className="transition-transform duration-300 hover:scale-110" />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
