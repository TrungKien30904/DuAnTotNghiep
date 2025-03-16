import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/ui/Layout";
import Home from "./pages/Home";
import Shop from "./pages/shop/Shop";
import ProductDetails from "./pages/shop/ProductDetails";
import Cart from "./pages/cart/Cart"; 

export default function UserRoute(){
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path="" element={<Navigate to={"/home"}/>}/>
                <Route path="home" element={<Home/>}/>
                <Route path="shop" element={<Shop/>}/>
                <Route path="product-details" element={<ProductDetails/>}/>
                <Route path="cart" element={<Cart/>}/> 
            </Route>
        </Routes>
    )
}