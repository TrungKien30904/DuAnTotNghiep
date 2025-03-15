import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ImageGallery from "./ProductImage";
import { useLocation, NavLink } from "react-router-dom";

export default function ProductDetails() {
    const location = useLocation();

    const product = location.state?.product;
    const [productImage, setProductImage] = useState([]);
    const [colorSelected, setColorSelected] = useState([]);
    const [productSelected, setProductSelected] = useState({});

    const getAllProductImage = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/hinh-anh/hien-thi/${product.idSanPham}`);
            setProductImage(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
    };

    const getProductDetailsByColor = async (idSanPham, idMauSac) => {
        try {
            const response = await axios.get(`http://localhost:8080/admin/chi-tiet-san-pham/hien-thi/online/${idSanPham}/${idMauSac}`)
            setColorSelected(response.data)
        } catch (error) {
            console.log("chọn màu thất bại");
        }
    }

    const getSelectedProductDetails = async (idChiTietSanPham) => {
        try {
            const response = await axios.get(`http://localhost:8080/admin/chi-tiet-san-pham/dot-giam/hien-thi/${idChiTietSanPham}`)
            setProductSelected(response.data[0])
        } catch (error) {
            console.log("chọn màu thất bại");
        }
    }
    useEffect(() => {
        getAllProductImage();
    }, [product]);

    return (
        <div className="mt-[64px] mx-24 grid grid-cols-2 gap-10">
            <div>
                {productImage.length > 0 ? (
                    <ImageGallery images={productImage} />
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <div>
                <div>
                    <h1>{productSelected?.sanPham ?? product?.tenSanPham}</h1>
                    <p>{productSelected?.danhMucSanPham || ""}</p>
                    {productSelected ? (
                        productSelected?.gia === productSelected?.giaSauGiam ? (
                            <p>{productSelected?.gia?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
                        ) : (
                            <p>
                                {productSelected?.giaSauGiam?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}{" "}
                                <span className="line-through">{productSelected?.gia?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                            </p>
                        )
                    ) : (
                        <p>{product?.min.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} - {product?.max.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
                    )}
                </div>
                <div className="grid grid-cols-5 gap-2 my-6">
                    {productImage.map((img, index) => (
                        <img
                            key={index}
                            src={img.lienKet}
                            alt="img"
                            className="size-24 object-cover cursor-pointer rounded-lg"
                            onClick={() => getProductDetailsByColor(img.sanPham.idSanPham, img.mauSac.idMauSac)}
                        />
                    ))}
                </div>
                <div>
                    <h1>Select size</h1>
                    <div className="grid grid-cols-6 gap-2">
                        {colorSelected.length > 0 && (
                            colorSelected.map((size) => (
                                <button
                                    key={size.idChiTietSanPham}
                                    className="py-2 border rounded-lg"
                                    onClick={() => getSelectedProductDetails(size.idChiTietSanPham)}
                                >
                                    {size.kichCo.ten}
                                </button>
                            ))
                        )}
                    </div>
                </div>
                <div>
                    <NavLink>
                        <div className="p-4 border  rounded-lg text-center my-6">
                            Thêm vào giỏ hàng
                        </div>
                    </NavLink>
                </div>
            </div>

        </div>
    );
}