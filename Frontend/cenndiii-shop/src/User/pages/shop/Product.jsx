import React from "react";
import { NavLink } from "react-router-dom";
const ProductCard = ({ item }) => {


    return (
        <div className="bg-white">
            <NavLink
                to={`/product-details`}
                state={{ product: item }}
            >
                <img
                    src={item?.lienKet || "https://via.placeholder.com/300"}
                    alt={item?.tenSanPham || "Product"}
                    className="w-full h-40 object-cover"
                />
                <div className="mt-2 items-center">
                    <h4 className="text-lg font-semibold mb-2">{item?.tenSanPham || "Product Name"}</h4>
                    {/* <p className="text-gray-500">{item?.giaSauGiam ?}</p> */}
                    <p className="">
                        <span>{item?.min.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} - {item?.max.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                    </p>
                </div>
            </NavLink>
        </div >
    );
};

export default ProductCard;
