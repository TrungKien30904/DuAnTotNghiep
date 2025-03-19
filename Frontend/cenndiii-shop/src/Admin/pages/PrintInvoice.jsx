import { useEffect, useRef } from "react";

export default function InvoicePrinter({ invoiceData, listItem, onPrinted }) {
    const invoiceRef = useRef();
    console.log("Thong tin hd" + invoiceData);
    console.log("San pham:" + listItem);

    // useEffect(() => {
    //     if (invoiceData && Array.isArray(listItem) && listItem.length > 0) {
    //         const printContent = invoiceRef.current.innerHTML; // Lấy nội dung hóa đơn
    //         const originalContent = document.body.innerHTML; // Lưu nội dung cũ của trang
    
    //         document.body.innerHTML = printContent; // Thay đổi nội dung trang chỉ chứa hóa đơn
    //         window.print();
    //         document.body.innerHTML = originalContent; // Khôi phục lại nội dung ban đầu
    //         onPrinted(); // Gọi callback sau khi in xong
    //     }
    // }, [invoiceData, listItem]);

    return (
        <div className="hidden">
            <div ref={invoiceRef} className="p-6 w-[80mm] mx-auto bg-white shadow-lg border border-gray-300 rounded-md text-black">
                {/* Logo và tên shop */}
                <div className="text-center mb-4">
                    <img src="/logo.png" alt="CenndiiiShop" className="mx-auto w-16" />
                    <h2 className="text-lg font-bold">CenndiiiShop</h2>
                    <p className="text-xs">SĐT: 0123 456 789 - Địa chỉ: ABC, XYZ</p>
                </div>

                {/* Kiểm tra nếu invoiceData tồn tại */}
                {invoiceData ? (
                    <>
                        {/* Thông tin hóa đơn */}
                        <div className="mb-2">
                            <p className="text-sm">Mã hóa đơn: <span className="font-semibold">{invoiceData?.maHoaDon || "N/A"}</span></p>
                            <p className="text-sm">Khách hàng: <span className="font-semibold">{invoiceData?.tenNguoiNhan || "Khách lẻ"}</span></p>
                            <p className="text-sm">SĐT: <span className="font-semibold">{invoiceData?.soDienThoai || "N/A"}</span></p>
                            <p className="text-sm">Địa chỉ: <span className="font-semibold">{invoiceData?.diaChi || "N/A"}</span></p>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <table className="w-full text-sm border-t border-gray-300">
                            <thead>
                                <tr className="border-b border-gray-300">
                                    <th className="text-left p-1">SP</th>
                                    <th className="text-right p-1">SL</th>
                                    <th className="text-right p-1">Giá</th>
                                    <th className="text-right p-1">Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(Array.isArray(listItem) && listItem.length > 0) ? (
                                    listItem.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-200">
                                            <td className="p-1">{item?.nameProduct || "N/A"}</td>
                                            <td className="text-right p-1">{item?.quantity || 0}</td>
                                            <td className="text-right p-1">{item?.price?.toLocaleString() || 0}đ</td>
                                            <td className="text-right p-1">{((item?.quantity || 0) * (item?.price || 0)).toLocaleString()}đ</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center p-2 text-gray-500">Không có sản phẩm</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Tổng tiền */}
                        <div className="border-t border-gray-300 mt-2 pt-2 text-sm">
                            <p className="flex justify-between"><span>Tổng cộng:</span> <span className="font-semibold">{invoiceData?.tongTien?.toLocaleString() || 0}đ</span></p>
                            <p className="flex justify-between"><span>Phí vận chuyển:</span> <span>{invoiceData?.phiVanChuyen?.toLocaleString() || 0}đ</span></p>
                            <p className="flex justify-between font-bold text-lg"><span>Thành tiền:</span> <span>{((invoiceData?.tongTien || 0) + (invoiceData?.phiVanChuyen || 0)).toLocaleString()}đ</span></p>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500">Đang tải dữ liệu hóa đơn...</p>
                )}

                {/* Cảm ơn */}
                <p className="text-center text-xs mt-4">Cảm ơn quý khách đã mua hàng!</p>
            </div>
        </div>
    );
}
