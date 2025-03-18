import { useState, useEffect } from "react";
import { Search, Eye, Edit, Plus } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Notification from "../components/Notification";
import "react-toastify/dist/ReactToastify.css";

export default function MuiGiayManagement() {
  const navigate = useNavigate();
  const [muiGiays, setMuiGiays] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [muiGiayToEdit, setMuiGiayToEdit] = useState(null);
  const [newMuiGiayName, setNewMuiGiayName] = useState("");
  const [newMuiGiayStatus, setNewMuiGiayStatus] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Bộ lọc
  const [searchName, setSearchName] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchMuiGiays();
  }, [searchName, filterStatus]); // Gọi lại khi giá trị tìm kiếm hoặc trạng thái thay đổi

  const fetchMuiGiays = async () => {
    try {
      const response = await axios.get("http://localhost:8080/admin/mui-giay/hien-thi", {
        params: {
          ten: searchName,
          trangThai: filterStatus === "all" ? null : filterStatus === "1" // Chuyển đổi trạng thái thành boolean
        }
      });

      if (Array.isArray(response.data)) {
        setMuiGiays(response.data);
      } else {
        console.error("Dữ liệu không phải là mảng:", response.data);
        setMuiGiays([]); // Đặt về mảng rỗng nếu không phải là mảng
      }
    } catch (error) {
      console.error("Lỗi khi lấy mũi giày:", error);
    }
  };

  const handleSaveChanges = async (id) => {
    if (!newMuiGiayName.trim()) {
      setErrorMessage("Tên mũi giày không được để trống!");
      return;
    } else {
      setErrorMessage("");
    }

    try {
      const response = await axios.post(`http://localhost:8080/admin/mui-giay/sua/${id}`, {
        ten: newMuiGiayName,
        trangThai: newMuiGiayStatus,
      });
      setMuiGiays(response.data);
      Notification("Sửa mũi giày thành công", "success");
      setIsEditModalOpen(false);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.ten || "Lỗi không xác định"); // Hiển thị thông báo lỗi
      } else {
        setErrorMessage("Sửa mũi giày thất bại"); // Thông báo lỗi chung
      }
      Notification("Sửa mũi giày thất bại", "error");
    }
  };

  const openEditModal = (muiGiay) => {
    setMuiGiayToEdit(muiGiay);
    setNewMuiGiayName(muiGiay.ten);
    setNewMuiGiayStatus(muiGiay.trangThai);
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setNewItemName(''); // Reset ô input tên mũi giày
  };

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      setErrorMessage("Tên mũi giày không được để trống!");
      return;
    } else {
      setErrorMessage("");
    }

    try {
      const response = await axios.post('http://localhost:8080/admin/mui-giay/them', {
        ten: newItemName,
        trangThai: true,
      });
      Notification("Thêm mũi giày thành công", "success");

      // Reset ô input sau khi thêm thành công
      setNewItemName(''); // Reset ô input tên mũi giày
      setIsAddModalOpen(false); // Đóng modal
      fetchMuiGiays(); // Cập nhật danh sách mũi giày
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.ten || "Lỗi không xác định"); // Hiển thị thông báo lỗi
      } else {
        setErrorMessage("Thêm mũi giày thất bại"); // Thông báo lỗi chung
      }
    }
  };

  // Tính toán các phần tử cần hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = muiGiays.slice(indexOfFirstItem, indexOfLastItem);

  // Tính toán số trang
  const totalPages = Math.ceil(muiGiays.length / itemsPerPage);

  // Hàm làm mới
  const handleRefresh = () => {
    setSearchName(""); // Reset ô input tìm kiếm
    setFilterStatus("all"); // Reset select trạng thái về "Tất cả trạng thái"
    setCurrentPage(1); // Reset về trang đầu tiên
    fetchMuiGiays(); // Gọi lại hàm fetchMuiGiays để lấy dữ liệu mới
  };

  return (
    <div className="p-2 space-y-4 text-sm">
      {/* Breadcrumb */}
      <nav className="text-gray-500 mb-4">
        <span className="cursor-pointer hover:underline" onClick={() => navigate("/dashboard")}>
          Trang chủ
        </span>{" "}
        &gt;{" "}
        <span className="font-semibold text-black">Quản lý Mũi Giày</span>
      </nav>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold mb-4">Bộ Lọc</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="relative text-sm">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm theo tên..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-10 p-2 border rounded-md"
            />
          </div>
          <div className="relative text-sm">
            <select
              className="border p-2 rounded-md w-full"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="1">Đang Bán</option>
              <option value="0">Ngừng Bán</option>
            </select>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleRefresh}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Làm mới
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Danh Sách Mũi Giày</h2>
          <div className="flex text-sm space-x-2">
            <button
              className="flex items-center justify-center border border-black rounded-full px-4 py-2 space-x-2"
              onClick={openAddModal}
            >
              <Plus size={16} stroke="black" />
              <span>Thêm mũi giày</span>
            </button>
          </div>
        </div>
        {currentItems.length === 0 ? ( // Kiểm tra nếu không có dữ liệu
          <p className="text-center text-gray-500">Không có dữ liệu</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">STT</th>
                <th className="p-2">Tên Mũi Giày</th>
                <th className="p-2">Trạng Thái</th>
                <th className="p-2">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((muiGiay, index) => (
                <tr key={muiGiay.idMuiGiay} className="border-t">
                  <td className="p-2">{index + 1 + indexOfFirstItem}</td>
                  <td className="p-2">{muiGiay.ten}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-white ${muiGiay.trangThai ? "bg-green-500" : "bg-red-500"}`}>
                      {muiGiay.trangThai ? "Đang Bán" : "Ngừng Bán"}
                    </span>
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button
                      className="text-black p-1 rounded"
                      onClick={() => openEditModal(muiGiay)}
                    >
                      <Edit size={18} stroke="black" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Phân trang */}
        {currentItems.length > 0 && ( // Chỉ hiển thị phân trang nếu có dữ liệu
          <div className="flex items-center justify-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded-md"
            >
              Trước
            </button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded-md"
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* Edit MuiGiay Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="fixed inset-0 flex items-start justify-center pt-10 z-50 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-1 text-left">Cập nhật thông tin mũi giày</h2>
          </div>
          <div className="mb-4">
            <label htmlFor="mui-giay-name" className="block text-sm font-semibold">
              Tên mũi giày mới
            </label>
            <input
              id="mui-giay-name"
              type="text"
              value={newMuiGiayName}
              onChange={(e) => setNewMuiGiayName(e.target.value)}
              placeholder="Nhập tên mũi giày mới..."
              className="w-full p-2 border rounded-md"
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          </div>

          <div className="mb-4">
            <label className="flex items-center text-sm">
              <span>Trạng thái</span>
              <input
                type="checkbox"
                checked={newMuiGiayStatus}
                onChange={(e) => setNewMuiGiayStatus(e.target.checked)}
                className="ml-2"
              />
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 border border-gray-400 text-gray-600 rounded-md"
              onClick={() => setIsEditModalOpen(false)}
            >
              Hủy
            </button>
            <button
              className="px-3 py-1 bg-black text-white rounded-md"
              onClick={() => handleSaveChanges(muiGiayToEdit.idMuiGiay)}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Dialog>

      {/* Add MuiGiay Modal */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Thêm thông tin mũi giày</h2>
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Nhập tên mũi giày mới..."
            className="w-full p-2 border rounded-md mb-2"
          />
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>} {/* Hiển thị thông báo lỗi */}
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 border border-gray-400 text-gray-600 rounded-md"
              onClick={() => {
                setIsAddModalOpen(false); // Đóng modal
                setNewItemName(''); // Reset ô input tên mũi giày
                setErrorMessage(''); // Reset thông báo lỗi
              }}
            >
              Hủy
            </button>
            <button
              className="px-3 py-1 bg-black text-white rounded-md"
              onClick={handleAddItem}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Dialog>
      <ToastContainer />
    </div>
  );
}