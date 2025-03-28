import ImageSlider from "../components/slide/ImageSlider";
import { useLocation } from "react-router-dom";
import Notification from "../../components/Notification";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
export default function Home() {
    const location = useLocation();
    const successMessage = location.state?.successMessage || localStorage.getItem("paymentSuccess");

    useEffect(() => {
        if (successMessage) {
            Notification(successMessage, "success");
            localStorage.removeItem("paymentSuccess"); // Xóa sau khi hiển thị để tránh lặp lại
        }
    }, [successMessage]);

    return (
        <div>
            <ToastContainer/>
            <div className="w-full">
                <ImageSlider />
            </div>
        </div>
    );
}
