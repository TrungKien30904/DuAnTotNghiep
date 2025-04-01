import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../../security/Axios";
import { formatDateFromArray } from "../../../untils/FormatDate";

export default function PaymentHistoryDialog({ idHoaDon, open, onClose }) {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        if (idHoaDon) {
            const fetchInvoicePaymentHistory = async () => {
                const response = await api.get(`/admin/hoa-don/${idHoaDon}/lich-su-thanh-toan`);
                setPayments(response.data);
            };
            fetchInvoicePaymentHistory();
        }
    }, [idHoaDon]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Lịch sử thanh toán</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table className="min-w-full" aria-label="payment history table">
                        <TableHead>
                            <TableRow className="bg-gray-100 text-left">
                                <TableCell className="px-4 py-2">STT</TableCell>
                                <TableCell className="px-4 py-2">Ghi chú</TableCell>
                                <TableCell className="px-4 py-2">Hình thức thanh toán</TableCell>
                                <TableCell className="px-4 py-2">Ngày thanh toán</TableCell>
                                <TableCell className="px-4 py-2">Số tiền</TableCell>
                                <TableCell className="px-4 py-2">Trạng thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.length > 0 ? (
                                payments.map((payment, index) => (
                                    <TableRow key={payment.id} className="border-b hover:bg-gray-100">
                                        <TableCell className="px-4 py-2">{index + 1}</TableCell>
                                        <TableCell className="px-4 py-2">{payment.ghiChu}</TableCell>
                                        <TableCell className="px-4 py-2">{payment.hinhThucThanhToan}</TableCell>
                                        <TableCell className="px-4 py-2">{formatDateFromArray(payment.ngayTao)}</TableCell>
                                        <TableCell className="px-4 py-2">{payment.soTienThanhToan}</TableCell>
                                        <TableCell className="px-4 py-2">{payment.trangThai ? 'Đã thanh toán' : 'Chưa thanh toán'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-2">Chưa có dữ liệu thanh toán</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary">Đóng</Button>
            </DialogActions>
        </Dialog>
    );
}
