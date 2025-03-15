import ProductCard from "./Product"
import { useEffect, useState } from "react"
import axios from "axios";
export default function Shop() {

    const [listProduct, setListProduct] = useState([]);

    useEffect(() => {
        const getDataProduct = async () => {
            try {
                const response = await axios.get("http://localhost:8080/admin/san-pham/hien-thi/online");
                setListProduct(response.data); // Set the fetched data to state
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getDataProduct();
    }, []);

    return (

        <div className="mt-[64px] mx-24 flex justify-content-center">
            <div className="w-1/4">
                <div>
                    <h2>Color</h2>
                    <ul>
                        <li>Black</li>
                        <li>White</li>
                        <li>Blue</li>
                        <li>Yellow</li>
                        <li>Brown</li>
                        <li>Green</li>
                        <li>Grey</li>
                        <li>Pink</li>
                        <li>Red</li>
                    </ul>
                </div>
                <div>
                    <h2>Size</h2>
                    <ul>
                        <li>39</li>
                        <li>40</li>
                        <li>41</li>
                    </ul>
                </div>
            </div>
            <div className="w-3/4">
                <div className='flex justify-between'>
                    <p>Showing 1-9 of 252 result</p>
                    {/* <select name="" id="">
                        <option value="">Default sort</option>
                        <option value="">Sort by price: Low - High</option>
                        <option value="">Sort by price: High - Low</option>
                        <option value="">Sort by lastest</option>
                        <option value="">Sort by oldest</option>
                    </select> */}
                </div>
                <div className='my-4 grid grid-cols-4'>
                    {listProduct.map((item,index) => (
                        <div key={index} className="m-2">
                            <ProductCard
                                item={item}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}