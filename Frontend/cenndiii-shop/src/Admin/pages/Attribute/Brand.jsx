import { useState, useEffect } from "react";
import { Search, Eye, Edit, Plus } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Notification from '../../../components/Notification';
import "react-toastify/dist/ReactToastify.css";
// import Alert from "../../components/Alert";
import api from "../../../security/Axios";
import { hasPermission } from "../../../security/DecodeJWT";
export default function Brand() {
  const navigate = useNavigate();
  // const [filters, setFilters] = useState({ search: "", trangThai: "all", soLuong: "all" });
  const [thuongHieu, setThuongHieu] = useState([]);
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
    getBrands();
  }, []);

  const getBrands = async () => {
    try {
        const response = await api.get("/admin/thuong-hieu/hien-thi");
        setThuongHieu(response.data);
    } catch (error) {
        console.error("Lỗi khi lấy thương hiệu:", error);
    }
};

const handleSaveChanges = async (id) => {
    try {
        const response = await api.post(`/admin/thuong-hieu/sua/${id}`, {
            ten: newProductName,
            trangThai: newProductStatus,
        });

        setThuongHieu(response.data);
        Notification("Sửa thương hiệu thành công", "success");
    } catch (error) {
        Notification("Sửa thương hiệu thất bại", "error");
    }
    setIsEditModalOpen(false);
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
        <span className="font-semibold text-black">thương hiệu</span>
      </nav>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold mb-4">Bộ Lọc</h2>
        <div className="grid grid-cols-2 gap-4">
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
              <option value="1">Đang hoạt động</option>
              <option value="0">Ngừng hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Danh sách thương hiệu</h2>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">STT</th>
              <th className="p-2">Tên</th>
              <th className="p-2">Trạng Thái</th>
              <th className="p-2">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {thuongHieu.map((sanPham, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{sanPham.ten}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white w-46 inline-block text-center ${Number(sanPham.trangThai) === 1 ? "bg-green-500" : "bg-red-500"}`}>
                    {Number(sanPham.trangThai) === 1 ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </span>
                </td>
                <td className="p-2 flex space-x-2">
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
            <h2 className="text-xl font-bold mb-1 text-left">Cập nhật thông tin thương hiệu</h2>
          </div>
          {/* Input Field for New Product Name */}
          <div className="mb-4">
            <label htmlFor="product-name" className="block text-sm font-semibold">
              Tên thương hiệu mới
            </label>
            <input
              id="product-name"
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Nhập tên thương hiệu mới..."
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
