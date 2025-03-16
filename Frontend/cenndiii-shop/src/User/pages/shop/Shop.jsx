import ProductCard from "./Product";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Shop() {
    const [listProduct, setListProduct] = useState([]);
    const [listSize, setListSize] = useState([]);
    const [listColor, setListColor] = useState([]);

    useEffect(() => {
        const getDataProduct = async () => {
            try {
                const response = await axios.get("http://localhost:8080/admin/san-pham/hien-thi/online");
                setListProduct(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getDataProduct();

        const getColor = async () => {
            try {
                const response = await axios.get("http://localhost:8080/admin/mau-sac/hien-thi");
                setListColor(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getColor();

        const getSize = async () => {
            try {
                const response = await axios.get("http://localhost:8080/admin/kich-co/hien-thi");
                setListSize(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getSize();
    }, []);

    return (
        <div className="mt-[100px] mx-24 ">
            
            <div className="flex justify-center gap-8">
                <div className="w-1/4 p-6 bg-white border">
                    {/* Color Filter */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Color</h2>
                        <ul className="space-y-2">
                            {listColor.map((color) => (
                                <li key={color.idMauSac} className="flex items-center gap-2">
                                    <input type="checkbox" id={`color-${color.idMauSac}`} className="accent-black" />
                                    <label htmlFor={`color-${color.idMauSac}`} className="cursor-pointer">
                                        {color.ten}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Size Filter */}
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Size</h2>
                        <ul className="space-y-2">
                            {listSize.map((size) => (
                                <li key={size.idKichCo} className="flex items-center gap-2">
                                    <input type="checkbox" id={`size-${size.idKichCo}`} className="accent-black" />
                                    <label htmlFor={`size-${size.idKichCo}`} className="cursor-pointer">
                                        {size.ten}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Product List */}
                <div className="w-3/4">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <p className="text-gray-600">Showing 1-9 of 252 result</p>
                        <select className="border px-3 py-2 rounded-md bg-gray-100 focus:ring focus:ring-gray-300">
                            <option value="">Default sort</option>
                            <option value="">Sort by price: Low - High</option>
                            <option value="">Sort by price: High - Low</option>
                            <option value="">Sort by latest</option>
                            <option value="">Sort by oldest</option>
                        </select>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-4 gap-6">
                        {listProduct.map((item, index) => (
                            <div key={index}
                            // className="bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105"
                            >
                                <ProductCard item={item} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
