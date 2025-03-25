import React from "react";
import { useLocation } from "react-router-dom";
import { CreditCard, MapPinCheck, Ticket, Trash2 } from "lucide-react";
import Button from "@mui/material/Button";

const Checkout = () => {
    const location = useLocation();
    const { selectedItems, totalPrice, discountAmount, selectedVoucher,customerInfo } = location.state || {};

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm max-w-5xl mx-auto mt-[64px] space-y-6">
            {/* Thông tin khách hàng và địa chỉ */}
            <div className="border-t-4 border-red-600 p-4 bg-white rounded-md shadow-md">
                <h2 className="text-red-600 text-lg font-bold flex items-center gap-2">
                    <MapPinCheck size={30} />  ĐỊA CHỈ NHẬN HÀNG
                </h2>

                <div className="text-sm text-gray-700 mt-2">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{customerInfo?.hoTen || "Chưa có tên"}</span>
                        <span className="font-semibold">|</span>
                        <span className="text-gray-600">{customerInfo?.soDienThoai || "Chưa có số điện thoại"}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-sm">
                            {customerInfo?.diaChi || "Chưa có địa chỉ"}
                            {customerInfo?.macDinh && (
                                <span className="ml-2 text-xs text-red-600 border border-red-600 px-2 py-0.5 rounded-md">
                                    Mặc định
                                </span>
                            )}
                        </p>
                        <button className="text-xs text-blue-600 hover:underline whitespace-nowrap">
                            Thay đổi
                        </button>
                    </div>
                </div>
            </div>


            {/* Danh sách sản phẩm */}
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

                {/* ✅ Tổng tiền bên phải */}
                <div className="text-right text-sm font-medium text-gray-700">
                    Tổng tiền ({selectedItems.reduce((acc, item) => acc + item.soLuong, 0)} sản phẩm):
                    <span className="text-lg font-semibold text-red-500 ml-2">
                        {totalPrice.toLocaleString()} VND
                    </span>
                </div>
            </div>


            {/* Phiếu giảm giá */}
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

            {/* Tổng Tiền */}
            <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-md w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-black-700">
                        <CreditCard size={25} />PHƯƠNG THỨC THANH TOÁN
                    </h2>

                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                        <button className="w-full sm:w-auto border border-red-500 text-red-500 px-4 py-2 rounded-md font-medium transition hover:bg-red-500 hover:text-white">
                            Thanh toán khi nhận hàng
                        </button>

                        <button className="w-full sm:w-auto border border-gray-300 px-4 py-2 rounded-md flex items-center justify-center space-x-2 font-medium text-gray-700 hover:bg-gray-200 transition">
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
                        Thời gian nhận hàng dự kiến: <strong>CHƯA CÓ PHẢI LÀM</strong>
                    </p>
                </div>

                <div className="border-t border-gray-300 pt-4 space-y-3 text-sm">
                    <div className="flex justify-between text-lg text-gray-800">
                        <span>Tổng tiền:</span>
                        <span className="font-semibold">{totalPrice.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between text-lg text-gray-800">
                        <span>Phí vận chuyển:</span>
                        <span className="font-semibold">0 VND</span>
                    </div>
                    <div className="flex justify-between text-lg text-gray-800">
                        <span>Mức giảm giá:</span>
                        <span className="text-red-500 font-semibold">-{discountAmount.toLocaleString()} VND</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-red-500">
                        <span>Tổng thanh toán:</span>
                        <span>{(totalPrice - discountAmount).toLocaleString()} VND</span>
                    </div>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        className="mt-4"
                    >
                        ĐẶT HÀNG
                    </Button>

                </div>
            </div>

        </div>
    );
};

export default Checkout;
