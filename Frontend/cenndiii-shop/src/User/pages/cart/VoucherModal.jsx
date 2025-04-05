import React, { useState, useEffect } from "react";

const VoucherModal = ({ voucherList, onClose, onApply, selectedVoucherId, setSelectedVoucherId, totalPrice }) => {
    const [searchText, setSearchText] = useState("");
    const [filteredVouchers, setFilteredVouchers] = useState(voucherList);
    const [tempSelectedVoucherId, setTempSelectedVoucherId] = useState(selectedVoucherId);
    const [bestVoucherId, setBestVoucherId] = useState(null);

    // Tách hàm tính giảm giá ra ngoài để dùng chung
    const calculateDiscountValue = (voucher) => {
        if (voucher.hinhThuc === "%") {
            const discount = totalPrice * (voucher.giaTri / 100);
            return Math.min(discount, voucher.giaTriToiDa || discount);
        }
        return voucher.giaTri || 0;
    };

    useEffect(() => {
        setTempSelectedVoucherId(selectedVoucherId);
    }, [selectedVoucherId]);

    useEffect(() => {
        const cleanedKeyword = searchText.trim().toLowerCase().replace(/\s+/g, "");

        let newFilteredVouchers = voucherList.filter(v =>
            v.maKhuyenMai.toLowerCase().includes(cleanedKeyword)
        );

        newFilteredVouchers.sort((a, b) => {
            const isEligibleA = totalPrice >= (a.dieuKien || 0);
            const isEligibleB = totalPrice >= (b.dieuKien || 0);

            if (isEligibleA !== isEligibleB) return isEligibleB - isEligibleA;
            return calculateDiscountValue(b) - calculateDiscountValue(a);
        });

        setFilteredVouchers(newFilteredVouchers);

        // Auto select best voucher nếu không có voucher nào đang áp dụng
        if (!selectedVoucherId && newFilteredVouchers.length > 0) {
            const bestVoucher = newFilteredVouchers.find(v => totalPrice >= (v.dieuKien || 0));
            if (bestVoucher) {
                setTempSelectedVoucherId(bestVoucher.id);
            }
        }

        // Xác định bestVoucherId để hiển thị dòng "(Phiếu giảm giá tốt nhất)"
        const bestVoucher = newFilteredVouchers.find(v => totalPrice >= (v.dieuKien || 0));
        if (bestVoucher) {
            setBestVoucherId(bestVoucher.id);
        }
    }, [searchText, voucherList, totalPrice, selectedVoucherId]);

    const selectedVoucher = voucherList.find(v => v.id === tempSelectedVoucherId);
    const discountAmount = selectedVoucher ? calculateDiscountValue(selectedVoucher) : 0;
    const finalPrice = totalPrice - discountAmount;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-[600px] rounded-lg shadow-lg max-h-[80vh] flex flex-col">
                {/* Header: Tiêu đề + Tìm kiếm */}
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold mb-4">Chọn mã khuyến mãi</h2>

                    {/* Tìm kiếm voucher */}
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Nhập mã voucher..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                    <p className="text-sm text-gray-600">Chọn 1 voucher</p>
                </div>

                {/* Content: Danh sách scroll */}
                <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
                    {filteredVouchers.length > 0 ? (
                        filteredVouchers.map((voucher) => {
                            const isEligible = totalPrice >= (voucher.dieuKien || 0);
                            const amountMissing = voucher.dieuKien ? voucher.dieuKien - totalPrice : 0;

                            return (
                                <div
                                    key={voucher.id}
                                    className={`border rounded-lg p-4 cursor-pointer ${!isEligible ? 'opacity-60' : 'hover:border-blue-500'} ${tempSelectedVoucherId === voucher.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                                    onClick={() => isEligible && setTempSelectedVoucherId(voucher.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <img
                                                src="/logo.png"
                                                alt="logo"
                                                className="w-17 h-17 object-contain transition-transform duration-300 hover:scale-110"
                                            />
                                            <div className="flex flex-col">
                                                <p className=" text-lg font-medium">
                                                    {voucher.tenKhuyenMai}
                                                    {searchText.trim().length<=3 && bestVoucherId === voucher.id && (
                                                        <span className="text-sm text-red-500 font-semibold ml-2">(Phiếu giảm giá tốt nhất)</span>
                                                    )}

                                                </p>

                                                <p className="text-xs text-gray-700">Mã: {voucher.maKhuyenMai}</p>
                                                <p className="text-sm text-gray-700">
                                                    Giảm: {voucher.giaTri?.toLocaleString()} {voucher.hinhThuc}
                                                    {voucher.hinhThuc === '%' && (
                                                        <> (Giảm tối đa: {voucher.giaTriToiDa?.toLocaleString()} VNĐ)</>
                                                    )}
                                                </p>
                                                <p className="text-sm text-red-600">
                                                    Đơn tối thiểu: {voucher.dieuKien?.toLocaleString()} VND
                                                </p>
                                                <p className="text-sm text-gray-500">HSD: {voucher.ngayKetThuc}</p>
                                                {!isEligible && (
                                                    <p className="text-sm text-gray-500">
                                                        Cần thêm {amountMissing.toLocaleString()} VND để áp dụng
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                name="voucher"
                                                value={voucher.id}
                                                disabled={!isEligible}
                                                checked={tempSelectedVoucherId === voucher.id}
                                                onChange={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500">Không tìm thấy voucher phù hợp</p>
                    )}
                </div>

                {/* Footer: Nút Hủy và Chọn */}
                <div className="p-6 border-t flex justify-end gap-4">
                    {tempSelectedVoucherId && selectedVoucher && (
                        <div className="flex flex-col justify-center text-sm text-red-500 mr-auto">
                            <p>* Số tiền giảm: {discountAmount.toLocaleString()} VND</p>
                            <p>* Tổng tiền sau giảm: {finalPrice.toLocaleString()} VND</p>
                        </div>
                    )}

                    <button
                        className="px-5 py-2 border rounded hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => {
                            setSelectedVoucherId(tempSelectedVoucherId);
                            onApply(tempSelectedVoucherId);
                        }}
                        disabled={!tempSelectedVoucherId}
                    >
                       Xác Nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoucherModal;
