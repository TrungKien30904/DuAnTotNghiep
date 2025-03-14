import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/ui/Layout";
import Home from "./pages/Home";

export default function UserRoute(){
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path="" element={<Navigate to={"/home"}/>}/>
                <Route path="/home" element={<Home/>}/>
            </Route>
        </Routes>
    )
}