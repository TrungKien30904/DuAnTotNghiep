import { useState, useEffect } from "react";
import { Search, Eye, Edit, Plus } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Notification from "../../../components/Notification";
import "react-toastify/dist/ReactToastify.css";

export default function CoGiayManagement() {
    const navigate = useNavigate();
    const [coGiays, setCoGiays] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [coGiayToEdit, setCoGiayToEdit] = useState(null);
    const [newCoGiayName, setNewCoGiayName] = useState("");
    const [newCoGiayStatus, setNewCoGiayStatus] = useState(true);

    useEffect(() => {
        fetchCoGiays();
    }, []);

    const fetchCoGiays = async () => {
        try {
            const response = await axios.get("http://localhost:8080/admin/co-giay/hien-thi");
            setCoGiays(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy giày:", error);
        }
    };

    const handleSaveChanges = async (id) => {
        try {
            const response = await axios.post(`http://localhost:8080/admin/co-giay/sua/${id}`, {
                ten: newCoGiayName,
                trangThai: newCoGiayStatus,
            });
            setCoGiays(response.data);
            Notification("Sửa giày thành công", "success");
        } catch (error) {
            Notification("Sửa giày thất bại", "error");
        }
        setIsEditModalOpen(false);
    };

    const openEditModal = (coGiay) => {
        setCoGiayToEdit(coGiay);
        setNewCoGiayName(coGiay.ten);
        setNewCoGiayStatus(coGiay.trangThai);
        setIsEditModalOpen(true);
    };

    return (
        <div className="p-2 space-y-4 text-sm">
            {/* Breadcrumb */}
            <nav className="text-gray-500 mb-4">
                <span className="cursor-pointer hover:underline" onClick={() => navigate("/dashboard")}>
                    Trang chủ
                </span>{" "}
                &gt;{" "}
                <span className="font-semibold text-black">Quản lý Giày</span>
            </nav>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-sm font-semibold mb-4">Bộ Lọc</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="relative text-sm">
                        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Tìm theo tên..."
                            className="w-full pl-10 p-2 border rounded-md"
                        />
                    </div>
                    <div className="relative text-sm">
                        <select className="border p-2 rounded-md w-full">
                            <option value="all">Tất cả trạng thái</option>
                            <option value="1">Đang Bán</option>
                            <option value="0">Ngừng Bán</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-semibold">Danh Sách Giày</h2>
                    <div className="flex text-sm space-x-2">
                        <NavLink
                            to={"/co-giay-details"}
                            className="flex items-center justify-center border border-black rounded-full px-4 py-2 space-x-2"
                        >
                            <Plus size={16} stroke="black" />
                            <span>Thêm Giày Chi Tiết</span>
                        </NavLink>
                    </div>
                </div>
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2">STT</th>
                            <th className="p-2">Tên Giày</th>
                            <th className="p-2">Trạng Thái</th>
                            <th className="p-2">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coGiays.map((coGiay, index) => (
                            <tr key={coGiay.idCoGiay} className="border-t">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{coGiay.ten}</td>
                                <td className="p-2">
                                    <span className={`px-2 py-1 rounded text-white ${coGiay.trangThai ? "bg-green-500" : "bg-red-500"}`}>
                                        {coGiay.trangThai ? "Đang Bán" : "Ngừng Bán"}
                                    </span>
                                </td>
                                <td className="p-2 flex space-x-2">
                                    <button
                                        className="text-black p-1 rounded"
                                        onClick={() => openEditModal(coGiay)}
                                    >
                                        <Edit size={18} stroke="black" />
                                    </button>
                                    <button
                                        className="text-red-500 p-1 rounded"
                                        onClick={async () => {
                                            // Xử lý xóa sản phẩm
                                            if (window.confirm("Bạn có chắc chắn muốn xóa giày này không?")) {
                                                try {
                                                    await axios.delete(`http://localhost:8080/admin/co-giay/xoa/${coGiay.idCoGiay}`);
                                                    Notification("Xóa giày thành công", "success");
                                                    fetchCoGiays(); // Cập nhật danh sách giày sau khi xóa
                                                } catch (error) {
                                                    Notification("Xóa giày thất bại", "error");
                                                }
                                            }
                                        }}
                                    >
                                        <span>Xóa</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit CoGiay Modal */}
            <Dialog
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                className="fixed inset-0 flex items-start justify-center pt-10 z-50 bg-black bg-opacity-50"
            >
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold mb-1 text-left">Cập nhật thông tin giày</h2>
                    </div>
                    {/* Input Field for New CoGiay Name */}
                    <div className="mb-4">
                        <label htmlFor="co-giay-name" className="block text-sm font-semibold">
                            Tên giày mới
                        </label>
                        <input
                            id="co-giay-name"
                            type="text"
                            value={newCoGiayName}
                            onChange={(e) => setNewCoGiayName(e.target.value)}
                            placeholder="Nhập tên giày mới..."
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    {/* Checkbox for CoGiay Status */}
                    <div className="mb-4">
                        <label className="flex items-center text-sm">
                            <span>Trạng thái</span>
                            <input
                                type="checkbox"
                                checked={newCoGiayStatus}
                                onChange={(e) => setNewCoGiayStatus(e.target.checked)}
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
                            onClick={() => handleSaveChanges(coGiayToEdit.idCoGiay)}
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