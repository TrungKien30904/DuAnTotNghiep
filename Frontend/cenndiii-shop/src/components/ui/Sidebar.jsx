import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, ShoppingCart, User, Percent, Box, FileText, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleMenuClick = () => {
    setOpenMenu(null); // Đóng tất cả menu con khi chọn menu không có menu con
  };

  return (
    <aside className="w-64 h-screen bg-white p-4 shadow-md flex flex-col">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Cennai Logo" className="h-20 mx-auto" />
      </div>
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded text-sm transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-200"}`
          }
          onClick={handleMenuClick} // Đóng menu con khi chọn menu này
        >
          <Home size={20} />
          <span>Trang chủ</span>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded text-sm transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-200"}`
          }
          onClick={handleMenuClick} // Đóng menu con khi chọn menu này
        >
          <ShoppingCart size={20} />
          <span>Bán hàng</span>
        </NavLink>

        {/* Quản lý tài khoản */}
        <div>
          <button
            onClick={() => toggleMenu("account")}
            className="flex items-center justify-between p-2 w-full text-left rounded text-sm transition-all hover:bg-gray-200"
          >
            <div className="flex items-center space-x-2">
              <User size={20} />
              <span>Quản lý tài khoản</span>
            </div>
            <ChevronRight
              size={18}
              className={`transition-transform duration-300 ${openMenu === "account" ? "rotate-90" : ""}`}
            />
          </button>
          <div
            className={`pl-6 transition-all duration-300 overflow-hidden ${
              openMenu === "account" ? "max-h-64 overflow-y-auto opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Khách hàng
            </NavLink>
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Nhân viên
            </NavLink>
          </div>
        </div>

        {/* Giảm giá */}
        <div>
          <button
            onClick={() => toggleMenu("sales")}
            className="flex items-center justify-between p-2 w-full text-left rounded text-sm transition-all hover:bg-gray-200"
          >
            <div className="flex items-center space-x-2">
              <Percent size={20} />
              <span>Giảm giá</span>
            </div>
            <ChevronRight
              size={18}
              className={`transition-transform duration-300 ${openMenu === "sales" ? "rotate-90" : ""}`}
            />
          </button>
          <div
            className={`pl-6 transition-all duration-300 overflow-hidden ${
              openMenu === "sales" ? "max-h-64 overflow-y-auto opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <NavLink
              to="/discounts"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Đợt giảm giá
            </NavLink>
            <NavLink
              to="/coupons"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Phiếu giảm giá
            </NavLink>
          </div>
        </div>

        {/* Quản lý sản phẩm */}
        <div>
          <button
            onClick={() => toggleMenu("products")}
            className="flex items-center justify-between p-2 w-full text-left rounded text-sm transition-all hover:bg-gray-200"
          >
            <div className="flex items-center space-x-2">
              <Box size={20} />
              <span>Quản lý sản phẩm</span>
            </div>
            <ChevronRight
              size={18}
              className={`transition-transform duration-300 ${openMenu === "products" ? "rotate-90" : ""}`}
            />
          </button>
          <div
            className={`pl-6 transition-all duration-300 overflow-hidden ${
              openMenu === "products" ? "max-h-50 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Sản phẩm
            </NavLink>
            <NavLink
              to="/shoe-collar"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Cổ giày
            </NavLink>
            <NavLink
              to="/shoe-soles"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Đế giày
            </NavLink>
            <NavLink
              to="/toe"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Mũi giày
            </NavLink>
            <NavLink
              to="/brand"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Thương hiệu
            </NavLink>
            <NavLink
              to="/material"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Chất liệu
            </NavLink>
            <NavLink
              to="/suppliers"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Nhà cung cấp
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Danh mục
            </NavLink>
            <NavLink
              to="/color"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Màu sắc
            </NavLink>
            <NavLink
              to="/size"
              className={({ isActive }) =>
                `block p-2 rounded text-xs transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`
              }
            >
              Kích cỡ
            </NavLink>
          </div>
        </div>

        <NavLink
          to="/invoices"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded text-sm transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-200"}`
          }
          onClick={handleMenuClick} // Đóng menu con khi chọn menu này
        >
          <FileText size={20} />
          <span>Hóa đơn</span>
        </NavLink>
      </nav>
    </aside>
  );
}
