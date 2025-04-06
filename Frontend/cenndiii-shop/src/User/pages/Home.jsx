import ImageSlider from "../components/slide/ImageSlider";
import { useLocation } from "react-router-dom";
import Notification from "../../components/Notification";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
export default function Home() {
    const location = useLocation();
    const success = location.state?.success; // Nhận true hoặc false
    useEffect(() => {
        if (success !== undefined) {
            Notification(
                success ? "Đặt hàng thành công!" : "Đặt hàng thất bại",
                success ? "success" : "error"
            );
        }
    }, [success]);

    return (
        <div>
            <ToastContainer/>
            <div className="w-full">
                <ImageSlider />
            </div>
        </div>
    );
}
