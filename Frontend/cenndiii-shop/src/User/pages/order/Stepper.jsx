import React, { useState, useEffect } from "react";
import {
    Stepper, Step, StepLabel, Button, Typography, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText
} from "@mui/material";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import api from "../../../security/Axios"
import { formatDateFromArray } from "../../../untils/FormatDate"
import { useNavigate } from "react-router-dom";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}, &.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#784af4',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
}));


const QontoStepIconRoot = styled('div')(({ theme }) => ({
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    '& .QontoStepIcon-completedIcon': {
        color: '#784af4',
        zIndex: 1,
        fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
}));

function QontoStepIcon(props) {
    const { active, completed } = props;
    return (
        <QontoStepIconRoot ownerState={{ active }}>
            {completed || active ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}
        </QontoStepIconRoot>
    );
}

QontoStepIcon.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    completed: PropTypes.bool,
};

const OrderStepper = ({ order, id }) => {
    const [histories, setHistories] = useState([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistories();
    }, [order]);

    const fetchHistories = async () => {
        if (order) {
            try {
                const response = await api.get(`/admin/hoa-don/${order.idHoaDon}/lich-su-hoa-don`);
                setHistories(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
            }
        }
    }

    const handleCancelOrder = () => {
        setIsConfirmOpen(true);
    }

    const cancelOrder = async () => {
        try {
            const response = await api.put(`/admin/hoa-don/${order.maHoaDon}/huy`);
            if (response.data !== "") {
                fetchHistories();
                navigate("/ordersCustomer");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsConfirmOpen(false);
        }
    }

    const closeConfirmDialog = () => {
        setIsConfirmOpen(false);
    };

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Stepper activeStep={[histories.length - 1]} alternativeLabel connector={<QontoConnector />}>
                {histories.map((history, index) => (
                    history.hanhDong !== "CREATE" && (
                        <Step key={index}>
                            <StepLabel StepIconComponent={QontoStepIcon}>
                                <div>
                                    <Typography variant="body2">{history.ghiChu}</Typography>
                                    <Typography variant="caption" color="textSecondary">{formatDateFromArray(history.ngayTao)}</Typography>
                                </div>
                            </StepLabel>
                        </Step>
                    )
                ))}
            </Stepper>

            {order.trangThai === "Chờ xác nhận" && (
                <div className="flex justify-end w-full mt-4">
                    <Button variant="contained" color="primary" onClick={handleCancelOrder}>
                        Hủy đơn hàng
                    </Button>
                </div>
            )}

            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 mx-4">
                        <h2 className="text-xl font-semibold text-center text-gray-800">
                            Xác nhận hủy đơn hàng
                        </h2>
                        <p className="text-sm text-gray-600 text-center mt-2">
                            Bạn có chắc chắn muốn hủy đơn hàng này không?
                        </p>

                        <div className="mt-6 flex justify-center gap-4">
                                <button
                                    onClick={closeConfirmDialog}
                                    className="w-32 py-2 border border-gray-400 text-gray-600 rounded-md hover:bg-gray-100 transition"
                                >
                                    Hủy
                                </button>

                                <button
                                    onClick={cancelOrder}
                                    className="w-32 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    Xác nhận
                                </button>
                            </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default OrderStepper;