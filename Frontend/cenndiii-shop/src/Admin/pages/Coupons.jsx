import React, { useState, useEffect, useCallback } from "react";
import { Eye, Plus, ChevronLeft, ChevronRight, Repeat, Search, SquarePen, FileUp } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
// import "../index.css";
import { Dialog } from "@headlessui/react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import api from "../../security/Axios";
import { hasPermission } from "../../security/DecodeJWT";
export default function Coupons() {
    const [filters, setFilters] = useState({ keyword: "", trangThai: "all", startDate: "", endDate: "" });
    const [phieuGiamGias, setPhieuGiamGias] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // 'toggleStatus' hoặc 'exportExcel'
    

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if(localStorage.getItem("token")){
            if (!hasPermission("ADMIN") && !hasPermission("STAFF")) {
                navigate("/admin/login");
            }
        }
    }, [navigate]);
    useEffect(() => {
        if (location.state && location.state.message) {
            toast.success(location.state.message);
        }
    }, [location.state]);
    const fetchPhieuGiamGias = async () => {
        try {
            const response = await api.get("/admin/phieu-giam-gia/hien-thi");
            if (Array.isArray(response.data)) {
                setPhieuGiamGias(response.data);
            }
        } catch (error) {
            console.error("Error fetching initial data:", error);
            toast.error("Lỗi khi lấy dữ liệu ban đầu");
        }
    };
    
    const searchPhieuGiamGias = useCallback(async () => {
        setIsLoading(true);
        setError("");
        if (filters.endDate && filters.startDate && filters.endDate < filters.startDate) {
            setError("Ngày kết thúc phải lớn hơn ngày bắt đầu");
            setIsLoading(false);
            return;
        }
        try {
            const formattedKeyword = filters.keyword.replace(/\s+/g, '').toLowerCase();
            const response = await api.get("/admin/phieu-giam-gia/tim-kiem", {
                params: {
                    keyword: formattedKeyword,
                    trangThai: filters.trangThai === "all" ? null : filters.trangThai,
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                    page: currentPage,
                    size: 5,
                    sort: 'ngayTao,DESC'
                }
            });
            if (Array.isArray(response.data.content)) {
                setPhieuGiamGias(response.data.content);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("Error searching data:", error);
            toast.error("Lỗi khi tìm dữ liệu");
        } finally {
            setIsLoading(false);
        }
    }, [filters, currentPage]);
    
    // Xử lý chuyển trạng thái
    const handleStatusToggle = async () => {
        if (!selectedId) return;
        try {
            const response = await api.patch(`/admin/phieu-giam-gia/chuyen-doi-trang-thai/${selectedId}`);
            setPhieuGiamGias((prevPhieuGiamGias) => prevPhieuGiamGias.map((phieu) => phieu.id === selectedId ? {
                ...phieu,
                trangThai: response.data.trangThai,
                ngayBatDau: response.data.ngayBatDau,
                ngayKetThuc: response.data.ngayKetThuc
            } : phieu));
            toast.success("Chuyển đổi trạng thái thành công");
        } catch (error) {
            console.error("Error toggling status:", error);
            toast.error("Lỗi khi chuyển đổi trạng thái");
        } finally {
            setIsConfirmOpen(false);
        }
    };
    
    // Xử lý xuất Excel
    const handleExportExcel = async () => {
        toast.loading('Đang xuất Excel...');
        try {
            const response = await api.get("/admin/phieu-giam-gia/xuat-excel", {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'phieu_giam_gia.xlsx');
            document.body.appendChild(link);
            link.click();
            toast.dismiss();
            toast.success("Xuất file Excel thành công");
        } catch (error) {
            console.error("Error exporting Excel file:", error);
            toast.error("Lỗi khi xuất file Excel");
        } finally {
            setIsConfirmOpen(false);
        }
    };
    useEffect(() => {
        searchPhieuGiamGias();
    }, [filters, currentPage, searchPhieuGiamGias]);
    useEffect(() => {
        fetchPhieuGiamGias(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    // view detail
    const handleViewDetails = (id) => {
        navigate(`/admin/coupons/${id}`);
    };

    // làm mới bộ lọc
    const handleResetFilters = () => {
        setFilters({ keyword: "", trangThai: "all", startDate: "", endDate: "" });
        setError("");
    };

    const renderPageNumbers = () => {
        let pageNumbers = [];
        const maxPagesToShow = 6;

        if (totalPages <= maxPagesToShow) {
            pageNumbers = Array.from({ length: totalPages }, (_, index) => index);
        } else {
            if (currentPage <= 3) {
                pageNumbers = [0, 1, 2, 3, 4, '...', totalPages - 1];
            } else if (currentPage >= totalPages - 4) {
                pageNumbers = [0, '...', totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
            } else {
                pageNumbers = [0, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1];
            }
        }

        return pageNumbers.map((page, index) => {
            if (page === '...') {
                return <span key={`ellipsis-${index}`} className="mx-1 p-2">...</span>;
            } else {
                return (
                    <button
                        key={`page-${page}`}
                        className={`mx-1 p-1 rounded w-5 h-7 flex items-center justify-center text-sm ${currentPage === page ? "bg-blue-500 text-white" : ""}`}
                        onClick={() => handlePageChange(page)}
                        disabled={currentPage === page}
                    >
                        {page + 1}
                    </button>
                );
            }
        });
    };


    

    const openConfirmDialog = (id, action) => {
        setSelectedId(id);
        setConfirmAction(action);
        setIsConfirmOpen(true);
    };

    const closeConfirmDialog = () => {
        setIsConfirmOpen(false);
    };

    const handleConfirmAction = () => {
        if (confirmAction === 'toggleStatus') {
            handleStatusToggle();
        } else if (confirmAction === 'exportExcel') {
            handleExportExcel();
        }
    };
    // Hàm định dạng ngày tháng
    const formatDateTime = (dateTimeString) => {
        const [date, time] = dateTimeString.split(' ');
        const [day, month, year] = date.split('/');
        const isoDateTimeString = `${year}-${month}-${day}T${time}:00`;
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        };
        return new Date(isoDateTimeString).toLocaleString('vi-VN', options).replace(',', '');
    };
    // Hàm định dạng số tiền
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', '');
    };

    return (
        <div className="p-6 space-y-4">
            <ToastContainer />
            <h1 className="text-lg font-semibold mb-4">Phiếu Giảm Giá</h1>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-sm font-semibold mb-4">Bộ Lọc</h2>
                <div className="grid grid-cols-6 gap-4">
                    <div className="relative text-sm col-span-2">
                        <label className="block text-sm font-semibold mb-2">Tìm Kiếm</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="keyword"
                                value={filters.keyword}
                                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                placeholder="Tìm theo tên hoặc mã"
                                className="w-full pl-10 p-2 border rounded-md"
                            />
                        </div>
                    </div>
                    <div className="relative text-sm col-span-2">
                        <label className="block text-sm font-semibold mb-2">Ngày Bắt Đầu</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="border p-2 rounded-md w-full"
                        />
                    </div>
                    <div className="relative text-sm col-span-2">
                        <label className="block text-sm font-semibold mb-2">Ngày Kết Thúc</label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="border p-2 rounded-md w-full"
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                    <div className="relative text-sm col-span-2">
                        <select
                            name="trangThai"
                            value={filters.trangThai}
                            onChange={(e) => setFilters({ ...filters, trangThai: e.target.value })}
                            className="border p-2 rounded-md w-full"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="2">Chưa Bắt Đầu</option>
                            <option value="1">Đang Diễn Ra</option>
                            <option value="0">Đã Kết Thúc</option>
                        </select>
                    </div>
                    <div className="flex justify-end col-span-4">
                        <button
                            onClick={handleResetFilters}
                            className=" w-36 flex items-center justify-center border border-black rounded-full px-4 py-2 space-x-2 hover:border-green-800 hover:border-gray-500 hover:bg-gray-500 hover:text-white transition duration-300"                        >
                            Làm mới bộ lọc
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-semibold">Danh Sách Phiếu Giảm Giá</h2>
                    <div className="flex space-x-2">
                        <div className="custom-tooltip">
                            <button
                                className=" w-28 flex items-center justify-center border border-black rounded-full px-4 py-2 space-x-2 hover:border-green-800 hover:bg-green-800 hover:text-white transition duration-300"
                                onClick={() => openConfirmDialog(null, 'exportExcel')}
                            >
                                <FileUp size={20}/>
                            </button>
                            <span className="tooltip-text">Xuất Excel</span>
                        </div>
                        <div className="custom-tooltip">
                            <button
                                className=" w-28 flex items-center justify-center border border-black rounded-full px-4 py-2 space-x-2  hover:border-gray-500 hover:bg-gray-500 hover:text-white transition duration-300"
                                onClick={() => navigate('/admin/add-coupon')}
                            >
                                <Plus size={20} />
                            </button>
                            <span className="tooltip-text">Thêm mới</span>
                        </div>
                    </div>
                </div>
                <div className="overflow-auto flex-grow" style={{ height: '300px' }}>
                    {isLoading ? (<div className="text-center">Đang tải...</div>) : (
                        <table className="w-full border-collapse text-sm">
                            <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2">STT</th>
                                <th className="p-2">Mã</th>
                                <th className="p-2">Tên</th>
                                <th className="p-2">Loại</th>
                                <th className="p-2">Giá Trị Giảm</th>
                                <th className="p-2">Số Lượng</th>
                                <th className="p-2">Ngày Bắt Đầu</th>
                                <th className="p-2">Ngày Kết Thúc</th>
                                <th className="p-2">Trạng Thái</th>
                                <th className="p-2">Hành Động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Array.isArray(phieuGiamGias) && phieuGiamGias.length > 0 ? (phieuGiamGias.map((phieuGiamGia, index) => (
                                <tr key={phieuGiamGia.id} className="border-t">
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{phieuGiamGia.maKhuyenMai}</td>
                                    <td className="p-2">{phieuGiamGia.tenKhuyenMai}</td>
                                    <td className="p-2">{phieuGiamGia.loai}</td>
                                    <td className="p-2">{formatCurrency(phieuGiamGia.giaTri)} {phieuGiamGia.hinhThuc}</td>
                                    <td className="p-2">{phieuGiamGia.soLuong}</td>
                                    <td className="p-2">
                                        {formatDateTime(phieuGiamGia.ngayBatDau)}
                                    </td>
                                    <td className="p-2">
                                        {formatDateTime(phieuGiamGia.ngayKetThuc)}
                                    </td>
                                    <td className="p-2">
                                            <span
                                                className={`px-2 py-1 rounded text-white w-28 inline-block text-center ${phieuGiamGia.trangThai === 1 ? "bg-green-500" : phieuGiamGia.trangThai === 2 ? "bg-gray-500" : "bg-red-500"}`}
                                            >
                                                {phieuGiamGia.trangThai === 1 ? "Đang Diễn Ra" : phieuGiamGia.trangThai === 2 ? "Chưa Bắt Đầu" : "Đã Kết Thúc"}
                                            </span>
                                    </td>
                                    <td className="p-2 flex space-x-2">
                                        <div className="flex space-x-4">
                                            <div className="mb-0.5">
                                                {phieuGiamGia.trangThai !== 0 && (
                                                    <div className="custom-tooltip">
                                                        <button className="text-black p-1 rounded custom-tooltip"
                                                                onClick={() => openConfirmDialog(phieuGiamGia.id, 'toggleStatus')}>
                                                            <Repeat size={18} stroke="black" />
                                                        </button>
                                                        <span className="tooltip-text">Chuyển đổi trạng thái</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mb-0.5">
                                                <div className="custom-tooltip">
                                                    <button className="text-black p-1 rounded"
                                                            onClick={() => handleViewDetails(phieuGiamGia.id)}>
                                                        {phieuGiamGia.trangThai === 0 ? (
                                                            <Eye size={18} stroke="black" />
                                                        ) : (
                                                            <SquarePen size={18} stroke="black" />
                                                        )}
                                                    </button>
                                                    <span className="tooltip-text">Xem chi tiết</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>))) : (<tr>
                                <td className="p-2" colSpan="10">Không có dữ liệu</td>
                            </tr>)}
                            </tbody>
                        </table>)}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        className="mx-1 p-1  rounded w-7 h-7 flex items-center justify-center"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        <ChevronLeft size={21} stroke="black" />
                    </button>
                    {renderPageNumbers()}
                    <button
                        className="mx-1 p-1  rounded w-7 h-7 flex items-center justify-center"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                    >
                        <ChevronRight size={21} stroke="black" />
                    </button>
                </div>
            </div>

            <Dialog open={isConfirmOpen} onClose={closeConfirmDialog} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="bg-white rounded-lg shadow-md max-w-md w-full p-6">
                        <Dialog.Title className="text-lg font-semibold text-center">
                            {confirmAction === 'toggleStatus' ? 'Xác nhận chuyển đổi trạng thái' : 'Xác nhận xuất Excel'}
                        </Dialog.Title>
                        <div className="mt-4 flex justify-between w-full">
                            <button
                                onClick={closeConfirmDialog}
                                className="w-32 p-2 border-2 border-gray-600 text-black bg-white rounded-md"
                            >
                                Hủy
                            </button>
                            <div className="w-4"></div>
                            {/* Khoảng cách giữa 2 nút */}
                            <button
                                onClick={handleConfirmAction}
                                className="w-32  border-2 border-black bg-black text-white rounded-md text-center"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
  