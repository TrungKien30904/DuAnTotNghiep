import { useState, useEffect } from "react";
import { Search, Eye, Edit, Plus } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Notification from '../../../../components/Notification';
import "react-toastify/dist/ReactToastify.css";
// import Alert from "../../components/Alert";
import api from "../../../../security/Axios";
import { formatDateFromArray } from "../../../../untils/FormatDate";
import { hasPermission } from "../../../../security/DecodeJWT";
export default function ProductManagement() {
  const navigate = useNavigate();
  // const [filters, setFilters] = useState({ search: "", trangThai: "all", soLuong: "all" });
  const [sanPhams, setSanPhams] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [newProductName, setNewProductName] = useState("");
  const [newProductStatus, setNewProductStatus] = useState(false);

  // const [alertOpen, setAlertOpen] = useState(false); // mở alert
  // const [alertMessage, setAlertMessage] = useState(''); // thông báo alert
  useEffect(() => {
      if (!hasPermission("ADMIN") && !hasPermission("STAFF")) {
          navigate("/admin/login");
      }
  }, [navigate]);
  useEffect(() => {
    fetchSanPhams();
  }, []);

  const fetchSanPhams = async () => {
    try {
        const response = await api.get("/admin/san-pham/hien-thi");
        setSanPhams(response.data);
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
    }
};

const handleSaveChanges = async (id) => {
    try {
        const response = await api.post(`/admin/san-pham/sua/${id}`, {
            ten: newProductName,
            trangThai: newProductStatus,
        });

        setSanPhams(response.data);
        Notification("Sửa sản phẩm thành công", "success");
    } catch (error) {
        Notification("Sửa sản phẩm thất bại", "error");
    }
    setIsEditModalOpen(false);
};


  const formatDate = (date) => {
    if (!date) return "Chưa có"; // Handle cases where the date is missing

    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0'); // Add leading zero for single digit
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = d.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  };

  const openEditModal = (product) => {
    setProductToEdit(product);
    setNewProductName(product.ten);
    setNewProductStatus(Number(product.trangThai) === 1);
    setIsEditModalOpen(true);
  };


  return (
    <div className="p-2 space-y-4 text-sm">
      {/* Breadcrumb */}
      <nav className="text-gray-500 mb-4">
        <span className="cursor-pointer hover:underline" onClick={() => navigate("/admin/dashboard")}>
          Trang chủ
        </span>{" "}
        &gt;{" "}
        <span className="font-semibold text-black">Sản phẩm</span>
      </nav>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold mb-4">Bộ Lọc</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="relative text-sm">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              name="search"
              // value={filters.search}
              // onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Tìm theo tên..."
              className="w-full pl-10 p-2 border rounded-md"
            />
          </div>

          <div className="relative text-sm">
            <select
              name="trangThai"
              // value={filters.trangThai}
              // onChange={(e) => setFilters({ ...filters, trangThai: e.target.value })}
              className="border p-2 rounded-md w-full"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="1">Đang Bán</option>
              <option value="0">Ngừng Bán</option>
            </select>
          </div>

          <div className="relative text-sm">
            <select
              name="soLuong"
              // value={filters.soLuong}
              // onChange={(e) => setFilters({ ...filters, soLuong: e.target.value })}
              className="border p-2 rounded-md w-full"
            >
              <option value="all">Tất cả số lượng</option>
              <option value="<50">&lt; 50</option>
              <option value="50-100">50 - 100</option>
              <option value=">100">&gt; 100</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Danh Sách Sản Phẩm</h2>
          <div className="flex text-sm space-x-2">
            <NavLink
              to={"/admin/product-details"}
              className="flex items-center justify-center border border-black rounded-full px-4 py-2 space-x-2"
            >
              <Plus size={16} stroke="black" />
              <span>Thêm Sản Phẩm Chi Tiết</span>
            </NavLink>
          </div>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">STT</th>
              <th className="p-2">Mã Sản Phẩm</th>
              <th className="p-2">Sản Phẩm</th>
              <th className="p-2">Số Lượng</th>
              <th className="p-2">Ngày tạo</th>
              <th className="p-2">Ngày sửa</th>
              <th className="p-2">Trạng Thái</th>
              <th className="p-2">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {sanPhams.map((sanPham, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{sanPham.maSanPham}</td>
                <td className="p-2">{sanPham.ten}</td>
                <td className="p-2">{sanPham.soLuong ?? 0}</td>
                <td className="p-2">{formatDateFromArray(sanPham.ngayTao)}</td>
                <td className="p-2">{formatDateFromArray(sanPham.ngaySua)}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white w-28 inline-block text-center ${Number(sanPham.trangThai) === 1 ? "bg-green-500" : "bg-red-500"}`}>
                    {Number(sanPham.trangThai) === 1 ? "Đang Bán" : "Ngừng Bán"}
                  </span>
                </td>
                <td className="p-2 flex space-x-2">
                  <NavLink to={`/admin/product-details-manager/phan-trang/${sanPham.idSanPham}`} className="text-black p-1 rounded">
                    <Eye size={18} stroke="black" />
                  </NavLink>
                  <button
                    className="text-black p-1 rounded"
                    onClick={() => openEditModal(sanPham)}
                  >
                    <Edit size={18} stroke="black" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Edit Product Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="fixed inset-0 flex items-start justify-center pt-10 z-50 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1 text-left">Cập nhật thông tin sản phẩm</h2>
          </div>
          {/* Input Field for New Product Name */}
          <div className="mb-4">
            <label htmlFor="product-name" className="block text-sm font-semibold">
              Tên sản phẩm mới
            </label>
            <input
              id="product-name"
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Nhập tên sản phẩm mới..."
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Checkbox for Product Status */}
          <div className="mb-4">
            <label className="flex items-center text-sm">
              <span>Trạng thái</span>
              <input
                type="checkbox"
                checked={newProductStatus}
                onChange={(e) => setNewProductStatus(e.target.checked)}
                className="ml-2"
              />
            </label>
          </div>

          {/* Modal Footer with Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 border border-gray-400 text-gray-600 rounded-md"
              onClick={() => setIsEditModalOpen(false)}
            >
              Hủy
            </button>
            <button
              className="px-3 py-1 bg-black text-white rounded-md"
              onClick={() => handleSaveChanges(productToEdit.idSanPham)}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Dialog>
      <ToastContainer/>
    </div>
  );
}
