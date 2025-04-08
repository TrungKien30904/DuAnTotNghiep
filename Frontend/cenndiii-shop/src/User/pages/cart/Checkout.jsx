import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPinCheck, Ticket, CreditCard, ChevronLeft } from "lucide-react";
import { useCart } from "../cart/CartContext";
import { Dialog } from "@headlessui/react";
import Button from "@mui/material/Button";
import AddAddress from "./AddAddress"; // Import form nhập thông tin
import Notification from "../../../components/Notification";
import { ToastContainer } from "react-toastify";
import { getUserId } from "../../../security/DecodeJWT";
import { calculateShippingFee } from "./calculateShippingFee";
import SelectAddress from "./SelectAddress"; // Import SelectAddress component
import UpdateAddress from "./UpdateAddress";
import axios from "axios";

const Checkout = () => {
    const location = useLocation();
    const { selectedItems, totalPrice, discountAmount, selectedVoucher } = location.state || {};
    const [customerData, setCustomerData] = useState();
    const [shippingFee, setShippingFee] = useState(0);
    const [address, setAddress] = useState("");
    const { cartCount, setCartCount } = useCart();
    const [estimatedTime, setEstimatedTime] = useState("");
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

    const [isUpdateAddressDialogOpen, setIsUpdateAddressDialogOpen] = useState(false);
    const [customerAddresses, setCustomerAddresses] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);



    // Add a function to handle opening the update address dialog
    const handleUpdateAddress = () => {
        setIsUpdateAddressDialogOpen(true);
    };

    useEffect(() => {
        // Lấy userId từ JWT
        const userId = getUserId();
        if (userId) {
            setSelectedCustomerId(userId);
        }
    }, []);

    const isLoggedIn = Boolean(selectedCustomerId);

    useEffect(() => {
        if (isLoggedIn) {
            const token = localStorage.getItem("token");
        }
    }, [isLoggedIn]);

    const handleConfirmPayment = () => {
        setIsConfirmOpen(true);
        setIsUpdateAddressDialogOpen(false);
    };

    const closeConfirmDialog = () => {
        setIsConfirmOpen(false);
    };

    const handleSelectAddress = () => {
        setIsAddressDialogOpen(true); // Hiển thị dialog
    };

    useEffect(() => {
        if (customerData?.diaChi) {
            fetchAddressData();
        }
    }, [customerData, selectedItems]);

    const fetchAddressData = async () => {
        try {
            const fee = await calculateShippingFee(customerData.diaChi, selectedItems);
            console.log("Phí ship nhận được:", fee);
            setShippingFee(fee);
        } catch (error) {
            console.error("Lỗi khi tính phí vận chuyển:", error);
            setShippingFee(34000);
        }

        const formattedAddress = await convertAddress(customerData.diaChi);
        setAddress(formattedAddress);
    };

    // Thêm hàm lấy địa chỉ cập nhật từ backend
    useEffect(() => {

        axios.get(`http://localhost:8080/admin/khach-hang/detail-client/${selectedCustomerId}`, {
            withCredentials: true
        })
            .then(response => {
                setCustomerData(response.data);
                setCustomerAddresses(response.data.addressMappers);
                console.log("Dữ liệu KH từ BE:" + response.data)
            })
            .catch(err => console.error("Lỗi khi lấy thông tin khách hàng:", err));

    }, [selectedCustomerId]);

    // Thêm hàm fetchUpdatedCustomerData để cập nhật dữ liệu khách hàng từ backend
    const fetchUpdatedCustomerData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/admin/khach-hang/detail-client/${selectedCustomerId}`);
            setCustomerAddresses(response.data.addressMappers);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu khách hàng:", error);
        }
    };



    // Cập nhật hàm handleAddressUpdate để đặt cờ isAddressUpdated
    const handleAddressUpdate = (updatedData) => {
        setCustomerData(updatedData);
        setIsUpdateAddressDialogOpen(false);
        fetchUpdatedCustomerData();
    };

    const handleAddressSelect = async (address) => {
        setSelectedAddress(address);
        setIsAddressDialogOpen(false); // Đóng dialog sau khi chọn địa chỉ

        // Tính phí vận chuyển dựa trên địa chỉ mới
        try {
            console.log('Address to send for shipping fee calculation:', address.fullInfo);
            const fee = await calculateShippingFee(address.fullInfo, selectedItems);
            setShippingFee(fee);
        } catch (error) {
            console.error("Lỗi khi tính phí vận chuyển:", error);
            setShippingFee(34000); // Giá trị mặc định nếu tính phí thất bại
        }

        // Cập nhật địa chỉ hiển thị
        const formattedAddress = await convertAddress(`${address.provinceId}, ${address.districtId}, ${address.wardId}`);
        setAddress(formattedAddress);
        setCustomerData({
            ...customerData,
            diaChi: `${address.provinceId}, ${address.districtId}, ${address.wardId}`,
            detail: address.addressDetail,
            hoTen: address.nameReceive,
            soDienThoai: address.phoneNumber,
            selectedAddressId: address.id // Lưu ID của địa chỉ đã chọn
        });
    };

    const handleConfirmCustomerInfo = (data) => {
        setCustomerData(data);
        setShippingFee(data.phiVanChuyen || 0);
        setEstimatedTime(data.thoiGianNhanHang && data.thoiGianNhanHang !== "Không xác định" ? data.thoiGianNhanHang : null);
        setIsEditingAddress(false);
        setSelectedAddress({
            provinceId: data.provinceID,
            districtId: data.districtID,
            wardId: data.wardCode,
            addressDetail: data.diaChiHienThi
        });
    };

    const GHN_HEADERS = {
        token: "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
        "Content-Type": "application/json",
    };

    const convertAddress = async (addressCode) => {
        const [provinceId, districtId, wardCode] = addressCode.split(", ").map(code => code.trim());

        try {
            const [provinceRes, districtRes, wardRes] = await Promise.all([
                axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", { headers: GHN_HEADERS }),
                axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", { headers: GHN_HEADERS, params: { province_id: provinceId } }),
                axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", { headers: GHN_HEADERS, params: { district_id: districtId } })
            ]);

            const province = provinceRes.data.data.find(p => p.ProvinceID == provinceId);
            const district = districtRes.data.data.find(d => d.DistrictID == districtId);
            const ward = wardRes.data.data.find(w => w.WardCode == wardCode);

            return `${ward?.WardName || ""}, ${district?.DistrictName || ""}, ${province?.ProvinceName || ""}`;
        } catch (error) {
            console.error("Lỗi khi chuyển đổi địa chỉ:", error);
            return "Địa chỉ không xác định";
        }
    };

    const navigate = useNavigate();

    const handlePlaceOrder = async () => {
        setIsConfirmOpen(false);
        const token = localStorage.getItem("token");
        const isGuest = !token;

        const orderData = {
            khachHang: isGuest ? null : customerData?.id,
            tenNguoiNhan: customerData?.hoTen || "Khách vãng lai",
            soDienThoai: customerData?.soDienThoai || "",
            email: customerData?.email || "",
            tinhThanhPho: customerData?.provinceID || selectedAddress?.provinceId || customerData?.diaChi?.split(", ")[0],  // Lấy từ provinceID nếu có
            quanHuyen: customerData?.districtID || selectedAddress?.districtId || customerData?.diaChi?.split(", ")[1],     // Lấy từ districtID nếu có
            xaPhuong: customerData?.wardCode || selectedAddress?.wardId || customerData?.diaChi?.split(", ")[2],           // Lấy từ wardCode nếu có
            ghiChu: customerData?.ghiChu || "",
            ngayGiaoHang: null,
            tongTien: totalPrice - discountAmount + shippingFee,
            phiVanChuyen: shippingFee,
            trangThai: "Chờ xác nhận",
            loaiDon: "Online",
            idPhieuGiamGia: selectedVoucher ? selectedVoucher.id : null,
            danhSachSanPham: selectedItems.map(item => ({
                idChiTietSanPham: item.productId,
                soLuongMua: item.soLuong,
                giaSauGiam: item.gia,
                tenSanPham:item.tenSanPham,
                anhSanPham:item.img,
            }))
        };
        console.log("dữ liệu gửi lên:"+orderData)

        try {
            let response;
            if (paymentMethod === "COD") {
                response = await fetch("http://localhost:8080/admin/hoa-don/thanh-toan-cod", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "Authorization": `Bearer ${token}` })
                    },
                    body: JSON.stringify(orderData)
                });
            } else if (paymentMethod === "VNPAY") {
                response = await fetch("http://localhost:8080/admin/hoa-don/thanh-toan-vnpay", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "Authorization": `Bearer ${token}` })
                    },
                    body: JSON.stringify(orderData)
                });
            }

            const result = await response.json();
            if (response.ok) {
                if (paymentMethod === "COD") {
                    await fetch("http://localhost:8080/api/cart/clear", {
                        method: "POST",
                        credentials: "include",
                        headers: { ...(token && { "Authorization": `Bearer ${token}` }) }
                    });

                    setCartCount(prev => prev === 0);
                    navigate("/home", { state: { success: true } });
                } else if (paymentMethod === "VNPAY") {
                    window.location.href = result.paymentUrl;
                }
            } else {
                Notification(result.error || "Đặt hàng thất bại", "error");
            }
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            Notification("Có lỗi xảy ra, vui lòng thử lại.", "error");
        }
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm max-w-5xl mx-auto mt-[64px] space-y-6">
            <button
                className="flex items-center gap-1 w-fit px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-black transition duration-300"
                onClick={() => navigate("/cart")}
            >
                <ChevronLeft size={16} /> Quay lại
            </button>
            {isAddressDialogOpen && (
                <SelectAddress
                    customerAddresses={customerAddresses}
                    onSelect={handleAddressSelect}
                    onClose={() => setIsAddressDialogOpen(false)}
                    currentAddress={selectedAddress}
                />
            )}
            {isUpdateAddressDialogOpen && (
                <UpdateAddress
                    onClose={() => setIsUpdateAddressDialogOpen(false)}
                    existingData={customerData}
                    onUpdate={handleAddressUpdate}
                />
            )}
            <ToastContainer />
            <div className="border-t-4 border-red-600 p-4 bg-white rounded-md shadow-md">
                <h2 className="text-red-600 text-lg font-bold flex items-center gap-2">
                    <MapPinCheck size={30} />  ĐỊA CHỈ NHẬN HÀNG
                </h2>

                {customerData && !isEditingAddress ? (
                    <div className="text-lg text-gray-700 mt-2">
                        <div className="flex items-center justify-between">
                            {/* Thông tin khách hàng */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{customerData.hoTen}</span>
                                    <span className="font-semibold">|</span>
                                    <span className="text-gray-600">{customerData.soDienThoai}</span>
                                </div>

                                <div className="mt-1">
                                    <p>{customerData.ghiChu} {customerData.detail || selectedAddress?.addressDetail} {address}</p>
                                </div>
                            </div>

                            {/* Nhóm nút bấm */}
                            {isLoggedIn && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        className="border border-blue-500 text-blue-500 px-3 py-1 rounded-md hover:bg-blue-100 transition"
                                        onClick={handleUpdateAddress}
                                    >
                                        Sửa địa chỉ
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        className="border border-blue-500 text-blue-500 px-3 py-1 rounded-md hover:bg-blue-100 transition"
                                        onClick={handleSelectAddress}
                                    >
                                        Chọn địa chỉ khác
                                    </Button>
                                </div>
                            )}
                            {!isLoggedIn && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        className="border border-blue-500 text-blue-500 px-3 py-1 rounded-md hover:bg-blue-100 transition"
                                        onClick={() => setIsEditingAddress(true)}
                                    >
                                        Sửa địa chỉ
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mt-4">
                        <p className="text-gray-500 italic"> Vui lòng nhập thông tin để tiếp tục.</p>
                        <AddAddress onConfirm={handleConfirmCustomerInfo} existingData={customerData} />
                    </div>
                )}
            </div>

            <div className="border shadow-md border-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-bold mb-3">SẢN PHẨM ĐÃ CHỌN</h2>

                <table className="w-full text-sm mb-2">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left p-2">Sản phẩm</th>
                            <th className="text-left p-2">Màu / Size</th>
                            <th className="text-left p-2">Đơn giá</th>
                            <th className="text-left p-2">Số lượng</th>
                            <th className="text-left p-2">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedItems?.map((item, idx) => (
                            <tr key={idx} className="border-b">
                                <td className="p-2 flex gap-2 items-center">
                                    <img src={item.img} alt="product" className="w-14 h-14 object-cover rounded" />
                                    <span>{item.tenSanPham}</span>
                                </td>
                                <td className="p-2">{item.mauSac} / {item.kichCo}</td>
                                <td className="p-2">{item.gia.toLocaleString()} VND</td>
                                <td className="p-2">{item.soLuong}</td>
                                <td className="p-2">{(item.gia * item.soLuong).toLocaleString()} VND</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-right text-sm font-medium text-gray-700">
                    Tổng tiền ({selectedItems.reduce((acc, item) => acc + item.soLuong, 0)} sản phẩm):
                    <span className="text-lg font-semibold text-red-500 ml-2">
                        {totalPrice.toLocaleString()} VND
                    </span>
                </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-4 shadow-md bg-white">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-black-700">
                    <Ticket size={25} /> PHIẾU GIẢM GIÁ
                </h2>

                {selectedVoucher ? (
                    <div className=" border border-green-200 rounded-lg p-3 flex justify-between items-center text-sm text-green-800 font-medium">
                        <span className="uppercase tracking-wide">Mã: <b>{selectedVoucher.maKhuyenMai}</b></span>
                        <span className="text-red-500 font-bold">-{discountAmount.toLocaleString()} VND</span>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">Không có phiếu giảm giá được áp dụng</p>
                )}
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-md w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-black-700">
                        <CreditCard size={25} />PHƯƠNG THỨC THANH TOÁN
                    </h2>

                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                        <button
                            className={`w-full sm:w-auto border px-4 py-2 rounded-md font-medium transition ${paymentMethod === "COD" ? "bg-blue-500 text-white border-blue-500" : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"}`}
                            onClick={() => setPaymentMethod("COD")}
                        >
                            Thanh toán khi nhận hàng
                        </button>

                        <button
                            className={`w-full sm:w-auto border px-4 py-2 rounded-md flex items-center justify-center space-x-2 font-medium transition ${paymentMethod === "VNPAY" ? "bg-blue-500 text-white border-blue-500" : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"}`}
                            onClick={() => setPaymentMethod("VNPAY")}
                        >
                            <img src="/images/vnpay-logo-vinadesign-25-12-57-55.jpg" alt="VNPAY" className="h-5" />
                            <span>Thanh toán VnPay</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <img
                        src="https://product.hstatic.net/1000405368/product/giao_hang_nhanh_toan_quoc_color.b7d18fe5_39425b03ee544ab2966d465756a00f89_small.png"
                        alt="GHN Express"
                        className="h-8"
                    />
                    <p className="text-gray-700 text-sm">
                        Thời gian nhận hàng dự kiến: <strong>{estimatedTime || "Không xác định"}</strong>
                    </p>
                </div>

                <div className="border-t border-gray-300 pt-4 space-y-3 text-sm">
                    <div className="flex justify-between text-lg text-gray-800">
                        <span>Tổng tiền:</span>
                        <span className="font-semibold">{totalPrice.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between text-lg text-gray-800">
                        <span>Phí vận chuyển:</span>
                        <span className="font-semibold">{shippingFee.toLocaleString()} VND</span>
                    </div>

                    <div className="flex justify-between text-lg text-gray-800">
                        <span>Mức giảm giá:</span>
                        <span className="text-red-500 font-semibold">-{discountAmount.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-red-500">
                        <span>Tổng thanh toán:</span>
                        <span>{(totalPrice - discountAmount + shippingFee).toLocaleString()} VND</span>
                    </div>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        className="mt-4"
                        onClick={handleConfirmPayment}
                    >
                        {paymentMethod === "COD" ? "ĐẶT HÀNG (COD)" : "THANH TOÁN VNPAY"}
                    </Button>
                    <Dialog
                        open={isConfirmOpen}
                        onClose={closeConfirmDialog}
                        className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
                    >
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 mx-4">
                            <Dialog.Title className="text-xl font-semibold text-center text-gray-800">
                                Xác nhận đặt đơn hàng
                            </Dialog.Title>

                            <p className="text-center text-sm text-gray-500 mt-2">
                                Bạn có chắc chắn muốn đặt đơn hàng này không?
                            </p>

                            <div className="mt-6 flex justify-center gap-4">
                                <button
                                    onClick={closeConfirmDialog}
                                    className="w-32 py-2 border border-gray-400 text-gray-600 rounded-md hover:bg-gray-100 transition"
                                >
                                    Hủy
                                </button>

                                <button
                                    onClick={handlePlaceOrder}
                                    className="w-32 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </Dialog>


                </div>
            </div>
        </div>
    );
};

export default Checkout;