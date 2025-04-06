import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, Typography, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";


export default function PaymentStatus() {
    const navigate = useNavigate();
    const location = useLocation();


    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get("success") === "true";



    return (
        <div className="payment-container">
        <Card className="payment-card">
            <CardHeader title={
                success === true ? "Thanh toán thành công!" :
                    success === false ? "Thanh toán thất bại!" :
                        "Đang kiểm tra..."
            } className="payment-header" />
            <CardContent>
                {success === null ? (
                    <CircularProgress color="primary" />
                ) : success === true ? (
                    <CheckCircleIcon color="success"  className="payment-icon" />
                ) : (
                    <CancelIcon color="error" className="payment-icon" />
                )}
    
                <Typography variant="body1" className="payment-message">
                    {success === true
                        ? "Cảm ơn bạn đã mua hàng của chúng tôi 💖"
                        : success === false
                            ? "Bạn đã hủy thanh toán "
                            : ""}
                </Typography>
    
                <button
                    className={`payment-button ${success === true ? "success" : success === false ? "error" : "loading"}`}
                    onClick={() => navigate("/home", { state: { success } })}
                >
                    {success === true ? "Tiếp tục" : success === false ? "Thử lại" : "Đang tải..."}
                </button>
            </CardContent>
        </Card>
    </div>    
    );
}
