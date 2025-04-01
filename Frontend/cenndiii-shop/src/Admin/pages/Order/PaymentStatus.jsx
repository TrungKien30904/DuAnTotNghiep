import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import api from "../../../security/Axios";

export default function PaymentStatus() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const sendPaymentDataToBE = async () => {
            try {
                const params = Object.fromEntries(queryParams.entries());
                const res = await api.get("/api/payment/VNPay-return", { params });

                if (res.status === 200) {
                    setSuccess(res.data);
                    if (res.data === true) {
                        localStorage.setItem("paymentSuccess", "true");
                    }
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra thanh toán:", error);
                setSuccess(false);
            }
        };

        sendPaymentDataToBE();
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5" }}>
            <Card sx={{ width: 400, textAlign: "center", padding: 3, boxShadow: 3 }}>
                <CardHeader title={success === true ? "Thanh toán thành công!" : success === false ? "Thanh toán thất bại!" : "Đang kiểm tra..."} />
                <CardContent>
                    {success === true ? (
                        <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
                    ) : success === false ? (
                        <CancelIcon color="error" sx={{ fontSize: 60 }} />
                    ) : (
                        <Typography variant="body1" sx={{ color: "gray" }}>Vui lòng chờ...</Typography>
                    )}

                    <Typography variant="body1" sx={{ marginTop: 1, color: "gray" }}>
                        {success === true ? "Cảm ơn bạn đã mua hàng 💖" : success === false ? "Có lỗi xảy ra, vui lòng thử lại! 😢" : ""}
                    </Typography>

                    <Button
                        variant="contained"
                        color={success ? "success" : "error"}
                        sx={{ marginTop: 2 }}
                        onClick={() => {
                            navigate("/admin/orders", { state: { success } });
                        }}
                    >
                        {success ? "Tiếp tục" : "Thử lại"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
