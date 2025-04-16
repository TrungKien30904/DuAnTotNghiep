import React, { useState, useEffect } from "react";
import {
    Stepper, Step, StepLabel, Button, Typography, Dialog,
    DialogActions, DialogContent, DialogTitle, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import api from "../../../security/Axios"
import { formatDateFromArray } from "../../../untils/FormatDate"
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

const OrderStepper = ({ order,showHistory,onClose}) => {
    const [histories, setHistories] = useState([]);

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

    return (
        <div>
            <div
                className="w-full flex justify-center"
            >
                <Stepper
                    className="overflow-x-auto max-w-[1030px]"
                    activeStep={histories.length}
                    alternativeLabel
                    connector={<QontoConnector />}
                >
                    {histories.map((history, index) => (
                        history.hanhDong !== "CREATE" && (
                            <Step key={index} sx={{ minWidth: "150px", flex: 1 }}>
                                <StepLabel StepIconComponent={QontoStepIcon}>
                                    <div className="text-center">
                                        <Typography variant="body2">{history.ghiChu}</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {formatDateFromArray(history.ngayTao)}
                                        </Typography>
                                    </div>
                                </StepLabel>
                            </Step>
                        )
                    ))}
                </Stepper>
            </div>

            {/* Dialog hiển thị lịch sử đơn hàng */}
            <Dialog open={showHistory} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Lịch sử hóa đơn</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><b>STT</b></TableCell>
                                    <TableCell><b>Hành động</b></TableCell>
                                    <TableCell><b>Ghi chú</b></TableCell>
                                    <TableCell><b>Ngày</b></TableCell>
                                    <TableCell><b>Người xác nhận</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {histories.length > 0 ? histories.map((history, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{history.hanhDong}</TableCell>
                                        <TableCell>{history.ghiChu}</TableCell>
                                        <TableCell>{formatDateFromArray(history.ngayTao)}</TableCell>
                                        <TableCell>{(history.nguoiTao)}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">Không có lịch sử nào</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">Đóng</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default OrderStepper;
