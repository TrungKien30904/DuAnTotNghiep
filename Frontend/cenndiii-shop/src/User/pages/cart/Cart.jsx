import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "./CartContext"; // Import context
import axios from "axios";
import InvoiceForm from "./InvoiceForm";
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const {setCartCount } = useCart(); // Lấy hàm cập nhật giỏ hàng từ context
    const [totalPrice, setTotalPrice] = useState(0);

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


    const handleQuantityChange = async (id, delta) => {
        const updated = cartItems.map(item =>
            item.productId === id ? { ...item, soLuong: Math.max(1, item.soLuong + delta) } : item
        );
        setCartItems(updated);

        const cartToSend = updated.map(item => ({
            productId: item.productId,
            soLuong: item.soLuong
        }));

        await fetch("http://localhost:8080/api/cart/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(cartToSend),
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
        const totalPrice = cartItems.reduce((total, item) => total + item.gia * item.soLuong, 0);
        setTotalPrice(totalPrice);
    }, [cartItems]);


    return (
        <div className="mt-[64px] mx-24 flex justify-content-center">
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
                                        <button onClick={() => handleQuantityChange(item.productId, -1)} className="px-2 border">-</button>
                                        <span className="px-3">{item.soLuong}</span>
                                        <button onClick={() => handleQuantityChange(item.productId, 1)} className="px-2 border">+</button>
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

                    <InvoiceForm
                        total={totalPrice}
                        cartItem={cartItems}
                    />
                </div>
            </div>
        </div>
    );
};

export default Cart;
