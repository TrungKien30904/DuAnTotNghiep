import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPinCheck, Ticket, CreditCard } from "lucide-react";
import { useCart } from "../cart/CartContext";
import Button from "@mui/material/Button";
import AddAddress from "./AddAddress"; // Import form nhập thông tin
import Notification from "../../../components/Notification";
import { ToastContainer } from "react-toastify";
import { getUserId } from "../../../security/DecodeJWT";
import { calculateShippingFee } from "./calculateShippingFee"; 
import axios from "axios";

const Checkout = () => {
    const location = useLocation();
    const { selectedItems, totalPrice, discountAmount, selectedVoucher, customerInfo } = location.state || {};
    const [customerData, setCustomerData] = useState(customerInfo || null);
    const [shippingFee, setShippingFee] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState("");
    const { cartCount, setCartCount } = useCart();
    const [estimatedTime, setEstimatedTime] = useState("");
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const userId = getUserId();
    const isLoggedIn = Boolean(userId);

    useEffect(() => {
        if (isLoggedIn) {
            const token = localStorage.getItem("token");
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (customerData?.diaChi) {
            const fetchAddress = async () => {
                try {
                    console.log("Fetching shipping fee for address:", customerData.diaChi);
                    const fee = await calculateShippingFee(customerData.diaChi, selectedItems);
                    console.log("Shipping fee calculated:", fee);
                    setShippingFee(fee);
                } catch (error) {
                    console.error("Lỗi khi tính phí vận chuyển:", error);
                    setShippingFee(34000); 
                }

                const formattedAddress = await convertAddress(customerData.diaChi);
                setAddress(formattedAddress);
            };
            fetchAddress();
        }
    }, [customerData, selectedItems]);

    const handleConfirmCustomerInfo = (data) => {
        setCustomerData(data);
        setShippingFee(data.phiVanChuyen || 0);
        setEstimatedTime(data.thoiGianNhanHang && data.thoiGianNhanHang !== "Không xác định" ? data.thoiGianNhanHang : null);
        setIsEditingAddress(false);
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
        const token = localStorage.getItem("token");
        const isGuest = !token;

        const orderData = {
            khachHang: isGuest ? null : customerData?.id,
            tenNguoiNhan: customerData?.hoTen || "Khách vãng lai",
            soDienThoai: customerData?.soDienThoai || "",
            email: customerData?.email || "",
            diaChi: address || "",
            ghiChu: customerData?.ghiChu || "",
            ngayGiaoHang: estimatedTime ? new Date(estimatedTime).toISOString() : null,
            tongTien: totalPrice - discountAmount + shippingFee,
            phiVanChuyen: shippingFee,
            trangThai: "Chờ xác nhận",
            loaiDon: "Online",
            voucher: selectedVoucher ? selectedVoucher.maKhuyenMai : null,
            danhSachSanPham: selectedItems.map(item => ({
                idChiTietSanPham: item.productId,
                soLuongMua: item.soLuong,
                giaSauGiam: item.gia
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

                    navigate("/home", { state: { successMessage: "Đặt hàng thành công!" } });
                } else if (paymentMethod === "VNPAY") {
                    localStorage.setItem("paymentSuccess", "Đặt hàng thành công!");
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
            <ToastContainer />
            <div className="border-t-4 border-red-600 p-4 bg-white rounded-md shadow-md">
                <h2 className="text-red-600 text-lg font-bold flex items-center gap-2">
                    <MapPinCheck size={30} />  ĐỊA CHỈ NHẬN HÀNG
                </h2>

                {customerData && !isEditingAddress ? (
                    <div className="text-sm text-gray-700 mt-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{customerData.hoTen}</span>
                                    <span className="font-semibold">|</span>
                                    <span className="text-gray-600">{customerData.soDienThoai}</span>
                                </div>
                                <div className="mt-1">
                                    <p>{customerData.ghiChu} {address}</p>
                                </div>
                            </div>
                            {!isLoggedIn && (
                                <Button variant="outlined" color="primary" size="small" onClick={() => setIsEditingAddress(true)}>
                                    Sửa địa chỉ
                                </Button>
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
                <h2 className="text-lg font-semibold mb-3">SẢN PHẨM ĐÃ CHỌN</h2>

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
                            className={`w-full sm:w-auto border px-4 py-2 rounded-md font-medium transition ${paymentMethod === "COD" ? "bg-red-500 text-white border-red-500" : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"}`}
                            onClick={() => setPaymentMethod("COD")}
                        >
                            Thanh toán khi nhận hàng
                        </button>

                        <button
                            className={`w-full sm:w-auto border px-4 py-2 rounded-md flex items-center justify-center space-x-2 font-medium transition ${paymentMethod === "VNPAY" ? "bg-red-500 text-white border-red-500" : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"}`}
                            onClick={() => setPaymentMethod("VNPAY")}
                        >
                            <img src="/vnpay-logo.png" alt="VNPAY" className="h-5" />
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
                        onClick={handlePlaceOrder}
                    >
                        {paymentMethod === "COD" ? "ĐẶT HÀNG (COD)" : "THANH TOÁN VNPAY"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;