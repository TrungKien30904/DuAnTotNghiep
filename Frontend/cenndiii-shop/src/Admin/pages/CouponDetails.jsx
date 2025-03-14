import React, {useState, useEffect, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import moment from "moment";
import {ChevronLeft, ChevronRight, Search} from "lucide-react";
import {Dialog} from "@headlessui/react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CouponDetails() {
    const {id} = useParams();
    const [coupon, setCoupon] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    const [isUpdating, setIsUpdating] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({keyword: ""});
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        const fetchCouponDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/admin/phieu-giam-gia/${id}`);
                const couponData = response.data;
                setCoupon({
                    ...couponData,
                    ngayBatDau: moment(couponData.ngayBatDau, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DDTHH:mm'),
                    ngayKetThuc: moment(couponData.ngayKetThuc, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DDTHH:mm'),
                });

                if (couponData.loai === "Cá Nhân" && couponData.danhSachKhachHang) {
                    setSelectedCustomers(couponData.danhSachKhachHang.map(kh => kh.khachHang.idKhachHang));
                }

                fetchCustomers(0); // Fetch initial customers
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết phiếu giảm giá:", error);
                toast.error("Lỗi khi lấy chi tiết phiếu giảm giá");
            }
        };

        fetchCouponDetails();
    }, [id]);

    const fetchCustomers = async (page) => {
        try {
            const response = await axios.get(`http://localhost:8080/admin/phieu-giam-gia/hien-thi-khach-hang?page=${page}&size=5`);
            setCustomers(Array.isArray(response.data.content) ? response.data.content : []);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách khách hàng:', error);
            toast.error('Lỗi khi lấy danh sách khách hàng');
        }
    };

    const searchKhachHangs = useCallback(async () => {

        try {
            const response = await axios.get("http://localhost:8080/admin/phieu-giam-gia/tim-kiem-khach-hang", {
                params: {
                    keyword: filters.keyword,
                    page: currentPage,
                    size: 5,
                }
            });
            if (Array.isArray(response.data.content)) {
                setCustomers(response.data.content);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("Error searching data:", error);
            toast.error("Lỗi khi tìm kiếm khách hàng");
        }
    }, [filters, currentPage]);

    useEffect(() => {
        searchKhachHangs();
    }, [filters, currentPage, searchKhachHangs]);

    useEffect(() => {
        fetchCustomers(currentPage);
    }, [currentPage]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCoupon((prevCoupon) => ({...prevCoupon, [name]: value}));
        validateField(name, value);
    };

    const handleCustomerSelect = (customerId) => {
        setSelectedCustomers(prevState => {
            const newSelectedCustomers = prevState.includes(customerId)
                ? prevState.filter(id => id !== customerId)
                : [...prevState, customerId];
            setCoupon(prevFormData => ({
                ...prevFormData,
                soLuong: newSelectedCustomers.length
            }));
            return newSelectedCustomers;
        });
    };

    const handleSelectAll = () => {
        if (selectedCustomers.length === customers.length) {
            setSelectedCustomers([]);
            setCoupon(prevState => ({
                ...prevState,
                soLuong: 0
            }));
        } else {
            setSelectedCustomers(customers.map(customer => customer.idKhachHang));
            setCoupon(prevState => ({
                ...prevState,
                soLuong: customers.length
            }));
        }
    };

    const validateField = (name, value) => {
        let tempErrors = {...errors};
        const startDate = new Date(coupon.ngayBatDau);
        const maxTenKhuyenMaiLength = 255;

        switch (name) {
            case 'tenKhuyenMai':
                if (!value.trim()) tempErrors.tenKhuyenMai = "Tên Phiếu Giảm Giá Không Được Để Trống";
                else if (value.length > maxTenKhuyenMaiLength) tempErrors.tenKhuyenMai = `Tên Phiếu Giảm Giá Không Được Vượt Quá ${maxTenKhuyenMaiLength} Ký Tự`;
                else delete tempErrors.tenKhuyenMai;
                break;

            case 'hinhThuc':
                if (!value) tempErrors.hinhThuc = "Kiểu Không Được Để Trống";
                else {
                    // Kiểm tra nếu kiểu thay đổi từ % sang VNĐ
                    if (coupon.hinhThuc === '%' && value === 'VNĐ') {
                        coupon.giaTriToiDa = ''; // Xóa giá trị giảm tối đa
                    }
                    delete tempErrors.hinhThuc;
                }
                break;

            case 'giaTri':
                if (!value) tempErrors.giaTri = "Giá Trị Không Được Để Trống";
                else if (coupon.hinhThuc === '%' && (value < 1 || value > 100)) tempErrors.giaTri = "Giá Trị Phải Từ 1 Đến 100 Khi Chọn %";
                else if (coupon.hinhThuc === 'VNĐ' && value < 1) tempErrors.giaTri = "Giá Trị Phải Lớn Hơn 0";
                else delete tempErrors.giaTri;
                break;

            case 'soLuong':
                if (!value) tempErrors.soLuong = "Số Lượng Không Được Để Trống";
                else if (value <= 0) tempErrors.soLuong = "Số Lượng Phải Lớn Hơn 0";
                else delete tempErrors.soLuong;
                break;

            case 'dieuKien':
                const dieuKienNumber = Number(value);
                if (value < 0) tempErrors.dieuKien = "Giá Trị Đơn Hàng Tối Thiểu Không Được Âm";
                else if (coupon.hinhThuc === 'VNĐ' && (dieuKienNumber < coupon.giaTri)) tempErrors.dieuKien = "Giá trị đơn hàng tối thiểu không được nhỏ hơn Giá Trị Giảm";
                else delete tempErrors.dieuKien;
                break;

            case 'giaTriToiDa':
                if (coupon.hinhThuc === '%' && (!value)) tempErrors.giaTriToiDa = "Giá Trị Giảm Tối Đa Không Được Để Trống";
                else if (value < 0) tempErrors.giaTriToiDa = "Giá Trị Giảm Tối Đa Không Được Âm";
                else delete tempErrors.giaTriToiDa;
                break;

            case 'ngayBatDau':
                if (!value) tempErrors.ngayBatDau = "Ngày Bắt Đầu Không Được Để Trống";
                else delete tempErrors.ngayBatDau;
                break;

            case 'ngayKetThuc':
                if (!value) tempErrors.ngayKetThuc = "Ngày Kết Thúc Không Được Để Trống";
                else if (new Date(value) <= startDate) tempErrors.ngayKetThuc = "Ngày Kết Thúc phải lớn hơn Ngày Bắt Đầu";
                else delete tempErrors.ngayKetThuc;
                break;

            case 'selectedCustomers':
                if (coupon.loai === 'Cá Nhân' && value.length === 0) tempErrors.selectedCustomers = "Phải chọn ít nhất một khách hàng cho loại Cá Nhân";
                else delete tempErrors.selectedCustomers;
                break;

            default:
                break;
        }

        setErrors(tempErrors);
    };

    const validate = () => {
        let tempErrors = {};
        const startDate = new Date(coupon.ngayBatDau);
        const endDate = new Date(coupon.ngayKetThuc);
        const maxTenKhuyenMaiLength = 255;

        if (!coupon.tenKhuyenMai?.trim()) tempErrors.tenKhuyenMai = "Tên Phiếu Giảm Giá Không Được Để Trống";
        else if (coupon.tenKhuyenMai.length > maxTenKhuyenMaiLength) tempErrors.tenKhuyenMai = `Tên Phiếu Giảm Giá không được vượt quá ${maxTenKhuyenMaiLength} ký tự`;
        if (!coupon.hinhThuc) tempErrors.hinhThuc = "Kiểu Không Được Để Trống";
        if (!coupon.giaTri) tempErrors.giaTri = "Giá Trị Không Được Để Trống";
        else if (coupon.hinhThuc === '%' && (coupon.giaTri < 1 || coupon.giaTri > 100)) tempErrors.giaTri = "Giá Trị phải từ 1 đến 100 khi chọn %";
        else if (coupon.hinhThuc === 'VNĐ' && coupon.giaTri < 1) tempErrors.giaTri = "Giá Trị Phải Lớn Hơn 0";
        if (!coupon.soLuong) tempErrors.soLuong = "Số Lượng Không Được Để Trống";
        else if (coupon.soLuong <= 0) tempErrors.soLuong = "Số Lượng Phải Lớn Hơn 0";
        if (coupon.dieuKien < 0) tempErrors.dieuKien = "Giá Trị Đơn Hàng Tối Thiểu Không Được Âm";
        if (coupon.hinhThuc === '%' && (!coupon.giaTriToiDa)) tempErrors.giaTriToiDa = "Giá Trị Giảm Tối Đa Không Được Để Trống";
        else if (coupon.giaTriToiDa < 0) tempErrors.giaTriToiDa = "Giá Trị Tối Đa Không Được Âm";
        if (!coupon.ngayBatDau) tempErrors.ngayBatDau = "Ngày Bắt Đầu Không Được Để Trống";
        if (!coupon.ngayKetThuc) tempErrors.ngayKetThuc = "Ngày Kết Thúc Không Được Để Trống";
        else if (endDate <= startDate) tempErrors.ngayKetThuc = "Ngày Kết Thúc phải lớn hơn Ngày Bắt Đầu";
        if (coupon.loai === 'Cá Nhân' && selectedCustomers.length === 0) tempErrors.selectedCustomers = "Phải chọn ít nhất một khách hàng cho loại Cá Nhân";
        if (coupon.hinhThuc === 'VNĐ') {
            coupon.giaTriToiDa = ''; // Xóa giá trị giảm tối đa khi chuyển sang VNĐ
        }
        const dieuKienNumber = Number(coupon.dieuKien);
        if (coupon.hinhThuc === 'VNĐ') {
            if (dieuKienNumber < coupon.giaTri ) tempErrors.dieuKien = "Giá trị đơn hàng tối thiểu không được nhỏ hơn Giá Trị Giảm";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };


    const handleUpdateCoupon = async () => {
        if (validate()) {
            let phieuGiamGiaChiTiet = [];
            if (coupon.loai === 'Cá Nhân') {
                phieuGiamGiaChiTiet = selectedCustomers.map(customerId => ({
                    khachHang: {idKhachHang: customerId},
                }));
            }

            const requestData = {
                ...coupon,
                dieuKien: coupon.dieuKien === '' ? 0 : coupon.dieuKien,
                danhSachKhachHang: phieuGiamGiaChiTiet,
                ngayBatDau: moment(coupon.ngayBatDau).format('DD/MM/YYYY HH:mm'),
                ngayKetThuc: moment(coupon.ngayKetThuc).format('DD/MM/YYYY HH:mm')
            };

            try {
                setIsUpdating(true);
                await axios.post(`http://localhost:8080/admin/phieu-giam-gia/sua/${id}`, requestData);
                toast.success("Cập nhật phiếu giảm giá thành công");
                navigate('/admin/coupons', { state: { message: `Cập nhật thành công phiếu giảm giá có mã: ${coupon.maKhuyenMai}` } });
            } catch (error) {
                if (error.response && error.response.data) {
                    setErrors(error.response.data);
                    toast.error("Lỗi khi cập nhật phiếu giảm giá");
                } else {
                    console.error('Lỗi khi cập nhật phiếu giảm giá:', error.message);
                    toast.error("Lỗi khi cập nhật phiếu giảm giá");
                }
            } finally {
                setIsUpdating(false);
            }
        } else {
            toast.error("Vui lòng kiểm tra lại thông tin");
        }
        closeModal();
    };

    const handleCreateNewCoupon = () => {
        const newCouponData = {
            ...coupon,
            id: undefined,
            ngayBatDau: moment().add(2, 'minutes').format('YYYY-MM-DDTHH:mm'),
            ngayKetThuc: moment().add(1, 'days').format('YYYY-MM-DDTHH:mm'),
            soLuong:undefined,
            ngaySua: undefined,
            trangThai: 2,
        };
        navigate('/admin/add-coupon', {state: {couponData: newCouponData}});
    };

    const isCouponEnded = coupon ? coupon.trangThai === 0 : false;

    //page
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
                        onClick={() => setCurrentPage(page)}
                        disabled={currentPage === page}
                    >
                        {page + 1}
                    </button>
                );
            }
        });
    };


    if (!coupon) {
        return <div>Không tìm thấy phiếu giảm giá</div>;
    }

    const openModal = () => {
        setIsConfirmOpen(true);
    };

    const closeModal = () => {
        setIsConfirmOpen(false);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const form = e.target.form;
            const index = Array.prototype.indexOf.call(form, e.target);
            form.elements[index + 1]?.focus();
        }
    };

    return (
        <div className="p-6 space-y-4">
            <ToastContainer />
            <div className="flex items-center font-semibold mb-4">
                <h1>Phiếu Giảm Giá /</h1>
                <h2 className="ml-1 font-normal">Chi Tiết Phiếu Giảm Giá</h2>
            </div>
            <Dialog open={isConfirmOpen} onClose={closeModal} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="bg-white rounded-lg shadow-md max-w-md w-full p-6">
                        <Dialog.Title className="text-lg font-semibold">Xác nhận cập nhật phiếu giảm giá</Dialog.Title>
                        <div className="mt-4 flex justify-between w-full">
                            <button
                                onClick={closeModal}
                                className="flex-1 p-2 border-2 border-gray-600 text-black bg-white rounded-md"
                            >
                                Hủy
                            </button>
                            <div className="w-4"></div>
                            <button
                                onClick={handleUpdateCoupon}
                                className="flex-1 p-2 border-2 border-black bg-black text-white rounded-md text-center"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
            <div className="flex space-x-4">
                <div className="bg-white p-4 rounded-lg shadow-md"
                     style={{width: coupon.loai === 'Cá Nhân' ? '60%' : '100%'}}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        openModal();
                    }}>
                        <div className="flex space-x-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-2">Mã Giảm Giá</label>
                                <input
                                    type="text"
                                    name="maKhuyenMai"
                                    value={coupon.maKhuyenMai}
                                    readOnly
                                    className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-2">Tên Giảm Giá</label>
                                <input
                                    type="text"
                                    name="tenKhuyenMai"
                                    value={coupon.tenKhuyenMai}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    className={`w-full p-2 border rounded-md ${errors.tenKhuyenMai ? 'border-red-500' : ''} ${isCouponEnded ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    readOnly={isCouponEnded}
                                />
                                {errors.tenKhuyenMai &&
                                    <p className="text-red-500 text-xs mt-1">{errors.tenKhuyenMai}</p>}
                            </div>
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-2">Hình Thức</label>
                                <div>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="hinhThuc"
                                            value="VNĐ"
                                            checked={coupon.hinhThuc === 'VNĐ'}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            className="form-radio"
                                        />
                                        <span className="ml-2">VNĐ</span>
                                    </label>
                                    <label className="inline-flex items-center ml-4">
                                        <input
                                            type="radio"
                                            name="hinhThuc"
                                            value="%"
                                            checked={coupon.hinhThuc === '%'}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            className="form-radio"
                                        />
                                        <span className="ml-2">%</span>
                                    </label>
                                </div>
                                {errors.hinhThuc && <p className="text-red-500 text-xs mt-1">{errors.hinhThuc}</p>}
                            </div>
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-2">Giá Trị Giảm</label>
                                <input
                                    type="number"
                                    name="giaTri"
                                    value={coupon.giaTri}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    className={`w-full p-2 border rounded-md ${errors.giaTri ? 'border-red-500' : ''} ${isCouponEnded ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    readOnly={isCouponEnded}
                                />
                                {errors.giaTri && <p className="text-red-500 text-xs mt-1">{errors.giaTri}</p>}
                            </div>
                            {coupon.hinhThuc === '%' && (
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold mb-2">Giá Trị Giảm Tối Đa</label>
                                    <input
                                        type="number"
                                        name="giaTriToiDa"
                                        value={coupon.giaTriToiDa}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        className={`w-full p-2 border rounded-md ${isCouponEnded ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        readOnly={isCouponEnded}
                                    />
                                    {errors.giaTriToiDa &&
                                        <p className="text-red-500 text-xs mt-1">{errors.giaTriToiDa}</p>}
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-2">Số Lượng</label>
                                <input
                                    type="number"
                                    name="soLuong"
                                    value={coupon.soLuong}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    className={`w-full p-2 border rounded-md ${errors.soLuong ? 'border-red-500' : ''} ${isCouponEnded ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    disabled={coupon.loai === 'Cá Nhân'}
                                    readOnly={isCouponEnded}
                                />
                                {errors.soLuong && <p className="text-red-500 text-xs mt-1">{errors.soLuong}</p>}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-2">Áp Dụng Cho Đơn Hàng Giá Trị Tối
                                    Thiểu</label>
                                <input
                                    type="number"
                                    name="dieuKien"
                                    value={coupon.dieuKien}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    onBlur={() => {
                                        if (coupon.dieuKien === '') {
                                            setCoupon(prevState => ({
                                                ...prevState,
                                                dieuKien: 0
                                            }));
                                        }
                                    }}
                                    className={`w-full p-2 border rounded-md ${isCouponEnded ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    readOnly={isCouponEnded}
                                />
                                {errors.dieuKien && <p className="text-red-500 text-xs mt-1">{errors.dieuKien}</p>}

                            </div>
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-2">Ngày Bắt Đầu</label>
                                <input
                                    type="datetime-local"
                                    name="ngayBatDau"
                                    value={coupon.ngayBatDau}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    className={`w-full p-2 border rounded-md ${errors.ngayBatDau ? 'border-red-500' : ''} ${isCouponEnded ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    readOnly={isCouponEnded}
                                />
                                {errors.ngayBatDau &&
                                    <p className="text-red-500 text-xs mt-1">{errors.ngayBatDau}</p>}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-2">Ngày Kết Thúc</label>
                                <input
                                    type="datetime-local"
                                    name="ngayKetThuc"
                                    value={coupon.ngayKetThuc}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    className={`w-full p-2 border rounded-md ${errors.ngayKetThuc ? 'border-red-500' : ''} ${isCouponEnded ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    readOnly={isCouponEnded}
                                />
                                {errors.ngayKetThuc &&
                                    <p className="text-red-500 text-xs mt-1">{errors.ngayKetThuc}</p>}
                            </div>
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-2">Người Tạo</label>
                                <input
                                    type="text"
                                    name="nguoiTao"
                                    value={coupon.nguoiTao}
                                    onKeyDown={handleKeyDown}
                                    readOnly
                                    className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-2">Ngày Tạo</label>
                                <input
                                    type="text"
                                    name="ngayTao"
                                    value={coupon.ngayTao}
                                    onKeyDown={handleKeyDown}
                                    readOnly
                                    className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-2">Người Sửa</label>
                                <input
                                    type="text"
                                    name="nguoiSua"
                                    value={coupon.nguoiSua|| ""}
                                    onKeyDown={handleKeyDown}
                                    readOnly
                                    className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-2">Ngày Sửa</label>
                                <input
                                    type="text"
                                    name="ngaySua"
                                    value={coupon.ngaySua}
                                    onKeyDown={handleKeyDown}
                                    readOnly
                                    className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-semibold mb-2">Loại</label>
                            <div>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="loai"
                                        value="Công Khai"
                                        checked={coupon.loai === 'Công Khai'}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">Công Khai</span>
                                </label>
                                <label className="inline-flex items-center ml-4">
                                    <input
                                        type="radio"
                                        name="loai"
                                        value="Cá Nhân"
                                        checked={coupon.loai === 'Cá Nhân'}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">Cá Nhân</span>
                                </label>
                            </div>
                        </div>
                        {coupon.trangThai !== 0 ? (
                            <div className="flex justify-end mt-4 gap-4">
                                <button
                                    className="w-28 py-2 border-2 border-gray-500 text-black bg-white rounded-md hover:border-gray-500 hover:bg-gray-500 hover:text-white transition duration-300"
                                    onClick={() => navigate("/admin/coupons")}
                                >
                                    Quay lại
                                </button>
                                <button
                                    type="submit"
                                    className="w-28 py-2 border-2 border-blue-500 bg-blue-500 text-white rounded-md text-center hover:bg-blue-700 hover:border-blue-700 transition duration-300"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-end mt-4 gap-4">
                                <button
                                    className="w-28 py-2 border-2 border-gray-500 text-black bg-white rounded-md hover:border-gray-500 hover:bg-gray-500 hover:text-white transition duration-300"
                                     onClick={() => navigate("/admin/coupons")}
                                >
                                    Quay lại
                                </button>
                                <button
                                    className="w-28 py-2 border-2 border-green-500 bg-green-500 text-white rounded-md text-center hover:bg-green-700 hover:border-green-700 transition duration-300"
                                      onClick={handleCreateNewCoupon}
                                >
                                    Tạo Nhanh
                                </button>
                            </div>
                        )}
                    </form>
                </div>
                {coupon.loai === 'Cá Nhân' && (
                    <div className="bg-white flex flex-col p-4 rounded-lg shadow-md" style={{width: '40%'}}>
                        <div className="relative text-sm col-span-2">
                            <label className="block text-sm font-semibold mb-2">Tìm Kiếm</label>
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/3 -mx-1 transform -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="text"
                                    name="keyword"
                                    value={filters.keyword}
                                    onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                                    placeholder="Tìm theo tên hoặc số điện thoại, email"
                                    className="w-full pl-10 mb-4 p-2 border rounded-md"
                                />
                            </div>
                        </div>
                        <h2 className="text-sm font-semibold mb-4">Danh Sách Khách Hàng</h2>
                        <div className="flex-grow overflow-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedCustomers.length === customers.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="p-2">STT</th>
                                    <th className="p-2">Tên</th>
                                    <th className="p-2">Số Điện Thoại</th>
                                    <th className="p-2">Email</th>
                                </tr>
                                </thead>
                                <tbody>
                                {customers.map((customer, index) => (
                                    <tr key={customer.idKhachHang} className="border-t">
                                        <td className="p-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedCustomers.includes(customer.idKhachHang)}
                                                onChange={() => handleCustomerSelect(customer.idKhachHang)}
                                            />
                                        </td>
                                        <td className="p-2">{index + 1}</td>
                                        <td className="p-2">{customer.hoTen}</td>
                                        <td className="p-2">{customer.soDienThoai}</td>
                                        <td className="p-2">{customer.email}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        {errors.selectedCustomers &&
                            <p className="text-red-500 text-xs mt-1">{errors.selectedCustomers}</p>}
                        <div className="flex justify-center mt-4">
                            <button
                                className="mx-1 p-1  rounded w-7 h-7 flex items-center justify-center"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 0}
                            >
                                <ChevronLeft size={21} stroke="black"/>
                            </button>
                            {renderPageNumbers()}
                            <button
                                className="mx-1 p-1  rounded w-7 h-7 flex items-center justify-center"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                            >
                                <ChevronRight size={21} stroke="black"/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}