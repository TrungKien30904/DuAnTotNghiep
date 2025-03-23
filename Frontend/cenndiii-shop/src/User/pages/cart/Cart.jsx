import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "./CartContext"; // Import context
import axios from "axios";
import InvoiceForm from "./InvoiceForm";
import VoucherModal from "./VoucherModal";
import { getUserId } from "../../../security/DecodeJWT"; // Import hàm lấy userId
import Notification from "../../../components/Notification";
import { ToastContainer } from "react-toastify";
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const { setCartCount } = useCart(); // Lấy hàm cập nhật giỏ hàng từ context
    const [totalPrice, setTotalPrice] = useState(0);
    const [voucherList, setVoucherList] = useState([]);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null); // giả định sẽ lấy được từ đâu đó
    const [bestVoucherId, setBestVoucherId] = useState(null);


    useEffect(() => {
        // Lấy userId từ JWT
        const userId = getUserId();
        if (userId) {
            setSelectedCustomerId(userId);
        }
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/api/cart", {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                setCartItems(data)
                console.log(data);
            })
            .catch(err => console.error("Lỗi lấy giỏ hàng:", err));
    }, []);


    useEffect(() => {
        if (selectedCustomerId != null) {
            axios.get(`http://localhost:8080/admin/phieu-giam-gia/hien-thi-voucher?khachHangId=${selectedCustomerId}`, {
                withCredentials: true
            })
                .then(res => setVoucherList(res.data))
                .catch(err => console.error("Lỗi khi lấy danh sách voucher:", err));
        } else {
            axios.get(`http://localhost:8080/admin/phieu-giam-gia/hien-thi-voucher`, {
                withCredentials: true
            })
                .then(res => setVoucherList(res.data))
                .catch(err => console.error("Lỗi khi lấy danh sách voucher:", err));
        }
    }, [selectedCustomerId]);

    useEffect(() => {
        if (voucherList.length > 0) {
            const eligibleVouchers = voucherList.filter(v => totalPrice >= (v.dieuKien || 0));
            eligibleVouchers.sort((a, b) => {
                const value = (v) => v.hinhThuc === "%"
                    ? Math.min(totalPrice * (v.giaTri / 100), v.giaTriToiDa || totalPrice)
                    : v.giaTri;
                return value(b) - value(a);
            });
            if (eligibleVouchers.length > 0) {
                setBestVoucherId(eligibleVouchers[0].id);
            }
        }
    }, [voucherList, totalPrice]);


    useEffect(() => {
        const selectedVoucher = voucherList.find(v => v.id === selectedVoucherId);
        if (selectedVoucher) {
            if (totalPrice >= (selectedVoucher.dieuKien || 0)) {
                let discount = 0;
                if (selectedVoucher.hinhThuc === "%") {
                    discount = totalPrice * (selectedVoucher.giaTri / 100);
                    if (selectedVoucher.giaTriToiDa) {
                        discount = Math.min(discount, selectedVoucher.giaTriToiDa);
                    }
                } else {
                    discount = selectedVoucher.giaTri;
                }
                setDiscountAmount(discount);
            } else {
                //Không đủ điều kiện -> tự bỏ áp dụng voucher
                setDiscountAmount(0);
                setSelectedVoucherId(null);
                handleRemoveVoucher(); // gọi backend xóa luôn
            }
        } else {
            setDiscountAmount(0);
        }
    }, [selectedVoucherId, totalPrice, voucherList]);


    useEffect(() => {
        fetch("http://localhost:8080/api/cart/get-select-voucher", {
            credentials: "include"
        })
            .then(res => res.text())
            .then(id => {
                const parsedId = parseInt(id);
                if (!isNaN(parsedId)) setSelectedVoucherId(parsedId);
            });
    }, []);


    const handleRemoveVoucher = async () => {
        try {
            await fetch("http://localhost:8080/api/cart/remove-voucher", {
                method: "POST",
                credentials: "include"
            });
            setSelectedVoucherId(null); // reset trên frontend
        } catch (error) {
            console.error("Lỗi khi xóa phiếu giảm giá:", error);
        }
    };


    const handleSelectItem = (productId) => {
        if (selectedItems.includes(productId)) {
            setSelectedItems(selectedItems.filter(id => id !== productId));
        } else {
            setSelectedItems([...selectedItems, productId]);
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            const allIds = cartItems.map(item => item.productId);
            setSelectedItems(allIds);
        }
        setSelectAll(!selectAll);
    };


    const handleQuantityChange = async (id, delta, stock) => {
        const updatedItems = cartItems.map(item => {
            if (item.productId === id) {
                const newQuantity = item.soLuong + delta;
                if (newQuantity > stock) {
                    Notification("Đã là số lượng lớn nhất", "warning");
                    return item;
                }
                return { ...item, soLuong: Math.max(1, newQuantity) };
            }
            return item;
        });

        // Cập nhật lại cartItems để hiển thị đúng trên frontend
        setCartItems(updatedItems);

        // Lấy cart mới đúng số lượng sau khi đã cập nhật
        const updatedCart = updatedItems.map(item => ({
            productId: item.productId,
            soLuong: item.soLuong
        }));

        // Gửi cart mới lên backend
        await fetch("http://localhost:8080/api/cart/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatedCart),
        });
    };

    const handleDelete = async (id) => {
        try {
            await fetch("http://localhost:8080/api/cart/remove", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId: id, soLuong: 1 })
            });

            // Cập nhật danh sách giỏ hàng
            const updated = cartItems.filter(item => item.productId !== id);
            setCartItems(updated);

            // Cập nhật số lượng giỏ hàng trong Navbar
            setCartCount(prev => Math.max(0, prev - 1)); // Đảm bảo không xuống dưới 0
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    };


    useEffect(() => {
        const total = cartItems.reduce((sum, item) => {
            if (selectedItems.includes(item.productId)) {
                return sum + item.gia * item.soLuong;
            }
            return sum;
        }, 0);
        setTotalPrice(total);
    }, [cartItems, selectedItems]);



    return (
        <div className="mt-[64px] mx-24 flex justify-content-center">
            <ToastContainer />
            <div className="container mx-auto p-4">
                <h2 className="text-3xl font-bold text-center mb-16">🛒 Giỏ Hàng</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex border-b px-4 pb-2 font-semibold text-gray-700">
                            <div className="w-6 mr-3">
                                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                            </div>
                            <div className="w-24">Ảnh</div>
                            <div className="flex-1 ml-4">Sản phẩm</div>
                            <div className="w-32 text-right">Tổng cộng</div>
                        </div>
                        {cartItems.map(item => (
                            <div key={item.productId} className="flex border rounded-lg p-4 items-center justify-between">
                                <input
                                    type="checkbox"
                                    className="mr-3"
                                    checked={selectedItems.includes(item.productId)}
                                    onChange={() => handleSelectItem(item.productId)}
                                />

                                <img src={item.img} alt={item.tenSanPham} className="w-24 h-24 object-cover" />
                                <div className="flex-1 ml-4">
                                    <h4 className="font-semibold">Tên: {item.tenSanPham} -- Màu Sắc: {item.mauSac} -- Kích Cỡ: {item.kichCo}</h4>
                                    {/* <p className="text-gray-500 line-through text-sm">Giá: {(item.gia).toLocaleString()} VND</p> thay vào đây giá trước khi giảm */}
                                    <p className="text-red-500 font-medium">{item.trangThai}</p>
                                    <div className="flex items-center mt-2">
                                        <button onClick={() => handleQuantityChange(item.productId, -1, item.stock)} className="px-2 border">-</button>
                                        <span className="px-3">{item.soLuong}</span>
                                        <button onClick={() => handleQuantityChange(item.productId, 1, item.stock)} className="px-2 border">+</button>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between items-end h-full">
                                    <p className="font-semibold text-lg">{(item.gia * item.soLuong).toLocaleString()} VND</p>
                                    <button
                                        className="text-red-500 text-sm mt-auto"
                                        onClick={() => handleDelete(item.productId)}
                                    >
                                        <Trash2 size={21} stroke="red" className="mt-8" />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                    {showVoucherModal && (
                        <VoucherModal
                            voucherList={voucherList}
                            totalPrice={totalPrice}
                            selectedVoucherId={selectedVoucherId}
                            setSelectedVoucherId={setSelectedVoucherId}
                            onClose={() => setShowVoucherModal(false)}
                            onApply={(id) => {
                                setShowVoucherModal(false);
                                // Gửi lên backend để lưu session
                                fetch("http://localhost:8080/api/cart/set-select-voucher", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    credentials: "include",
                                    body: JSON.stringify(id),
                                });
                                console.log("Đã áp dụng phiếu id: " + id)

                            }}
                            customerId={selectedCustomerId}
                        />
                    )}

                    <div className="border border-gray-300 rounded-xl p-4 shadow-md">
                        <InvoiceForm
                            total={totalPrice}
                            cartItem={cartItems.filter(item => selectedItems.includes(item.productId))}
                            selectedVoucher={voucherList.find(v => v.id === selectedVoucherId)}
                            discountAmount={discountAmount}
                            bestVoucherId={bestVoucherId}
                            onOpenVoucherModal={() => setShowVoucherModal(true)}
                            onRemoveVoucher={handleRemoveVoucher}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;
