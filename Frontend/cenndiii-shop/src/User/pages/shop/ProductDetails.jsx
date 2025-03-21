import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import ImageGallery from "./ProductImage";
import { useCart } from "../cart/CartContext";
import Notification from "../../../components/Notification";
import { ToastContainer } from "react-toastify";
export default function ProductDetails() {
    const location = useLocation();
    const product = location.state?.product;

    const [productImage, setProductImage] = useState([]);
    const [colorSelected, setColorSelected] = useState([]);
    const [productSelected, setProductSelected] = useState(null);
    const [listImageByColor, setListImageByColor] = useState([]);
    const [selectedColorId, setSelectedColorId] = useState(null); // ✅ Màu đang chọn
    const [selectedSizeId, setSelectedSizeId] = useState(null); // ✅ Size đang chọn
    const [quantity, setQuantity] = useState(0);

    const { cartCount, setCartCount } = useCart(); // Lấy hàm cập nhật số lượng giỏ hàng

    const handleAddToCart = async () => {
        if (!productSelected?.idChiTietSanPham) {
            Notification("Vui lòng chọn size sản phẩm", "error");
            return;
        }

        const item = {
            productId: productSelected.idChiTietSanPham,
            productName: productSelected.sanPham,
            img: productImage[0]?.lienKet || "",
            price: productSelected.giaSauGiam || productSelected.gia,
            soLuong: 1,
            mauSac: productSelected.mauSac?.ten,
            kichCo: productSelected.kichCo?.ten
        };

        try {
            await fetch("http://localhost:8080/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(item),
            });

            // Cập nhật số lượng giỏ hàng ngay lập tức
            setCartCount(prev => prev + 1);
            Notification("Thêm vào giỏ hàng thành công", "success");
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
        }
    };


    // Lấy danh sách ảnh sản phẩm
    const getAllProductImage = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/hinh-anh/hien-thi/${product.idSanPham}`);
            setProductImage(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
    };

    // Lấy chi tiết sản phẩm theo màu sắc
    const getProductDetailsByColor = async (idSanPham, idMauSac) => {
        try {
            const response = await axios.get(`http://localhost:8080/admin/chi-tiet-san-pham/hien-thi/online/${idSanPham}/${idMauSac}`);
            setColorSelected(response.data.chiTietSanPham);
            setListImageByColor(response.data.listAnh);
            setProductSelected(null);
            setSelectedColorId(idMauSac);
            setSelectedSizeId(null);
            setQuantity(0);
        } catch (error) {
            console.log("Chọn màu thất bại");
        }
    };

    // Lấy sản phẩm theo size
    const getSelectedProductDetails = async (idChiTietSanPham) => {
        try {
            const response = await axios.get(`http://localhost:8080/admin/chi-tiet-san-pham/dot-giam/hien-thi/${idChiTietSanPham}`);
            setProductSelected(response.data[0]);
            setSelectedSizeId(idChiTietSanPham);
            setQuantity(response.data[0].soLuong);
        } catch (error) {
            console.log("Chọn size thất bại");
        }
    };

    useEffect(() => {
        getAllProductImage();
    }, [product]);

    useEffect(() => {
        if (productImage.length > 0) {
            getProductDetailsByColor(productImage[0].sanPham.idSanPham, productImage[0].mauSac.idMauSac);
        }
    }, [productImage]);




    return (
        <div className="mt-24 mx-24">
            <div className="grid grid-cols-2 gap-10">
                {/* Phần hiển thị ảnh */}
                <div className="border rounded-lg p-4 shadow-lg">
                    {listImageByColor.length > 0 ? (
                        <ImageGallery images={listImageByColor} />
                    ) : (
                        <p className="text-center text-gray-500">Không có ảnh</p>
                    )}
                </div>

                {/* Phần thông tin sản phẩm */}
                <div className="flex flex-col">
                    <div className="flex-none h-[56px]">
                        <h1 className="text-2xl font-bold">{productSelected?.sanPham ?? product?.tenSanPham}</h1>
                        <p className="text-gray-600">{productSelected?.danhMucSanPham || ""}</p>
                        <p className="text-gray-600">{quantity != 0 ? `Kho: ${quantity}` : ""}</p>
                    </div>

                    {/* Giá sản phẩm */}
                    <div className="my-4 flex-none">
                        {productSelected ? (
                            productSelected.gia === productSelected.giaSauGiam ? (
                                <p className="text-xl font-semibold text-red-600">
                                    {productSelected.gia?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                </p>
                            ) : (
                                <p className="text-xl font-semibold">
                                    <span className="text-red-600">
                                        {productSelected.giaSauGiam?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                    </span>{" "}
                                    <span className="line-through text-gray-500">
                                        {productSelected.gia?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                    </span>
                                </p>
                            )
                        ) : (
                            <p className="text-xl font-semibold">
                                {product?.min.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} -{" "}
                                {product?.max.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                            </p>
                        )}
                    </div>

                    {/* Chọn màu sản phẩm */}
                    <div className="grid grid-cols-7 gap-2 my-6 flex-auto">
                        {productImage.map((img, index) => (
                            <img
                                key={index}
                                src={img.lienKet}
                                alt="img"
                                className={`h-[70px] w-[70px] object-cover cursor-pointer rounded-lg transition-all duration-300 hover:scale-105 hover:ring-2 
                                    ${selectedColorId === img.mauSac.idMauSac ? "border-2 border-black" : "hover:ring-black"}`}
                                onClick={() => getProductDetailsByColor(img.sanPham.idSanPham, img.mauSac.idMauSac)}
                            />
                        ))}
                    </div>

                    {/* Chọn kích cỡ */}
                    <div className="flex-auto">
                        <h1 className="text-lg font-semibold ">Chọn kích cỡ</h1>
                        <div className="grid grid-cols-9 gap-2 mt-2">
                            {colorSelected.length > 0 &&
                                colorSelected.map((size) => (
                                    <button
                                        key={size.idChiTietSanPham}
                                        className={`py-2 border rounded-lg text-center 
                                            ${selectedSizeId === size.idChiTietSanPham ? "bg-black text-[#FFFFFF]" : "hover:bg-gray-200"}`}
                                        onClick={() => getSelectedProductDetails(size.idChiTietSanPham)}
                                    >
                                        {size.kichCo.ten}
                                    </button>
                                ))}
                        </div>
                    </div>
                    <div>
                        <button
                            className="p-4 border rounded-lg text-center my-6 bg-black text-white hover:bg-blue-600 w-full"
                            onClick={handleAddToCart}
                        >
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
