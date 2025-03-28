import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderStatus from '../components/ui/OrderStatus';
import Notification from '../../components/Notification';
import { ToastContainer } from 'react-toastify';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
import api from '../../security/Axios';
import { hasPermission } from "../../security/DecodeJWT";
import { useNavigate } from 'react-router-dom';
import { formatDateFromArray } from '../../untils/FormatDate';
import Alert from '../../components/Alert';
import { set } from 'react-hook-form';
import Stepper from "../components/stepper/Stepper"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tabs,
    Tab,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    TextField,
    Badge,
    Box,
    TablePagination
} from "@mui/material";
import { Trash, Ticket } from "lucide-react";
import { Add, Remove } from '@mui/icons-material';
export default function InvoiceDetail() {
    const { id, idHd } = useParams();
    const [invoice, setInvoice] = useState();
    const [payment, setPayment] = useState();
    const [showHistory, setShowHistory] = useState(false);
    const [histories, setHistories] = useState([]);
    const [invoiceDetails, setInvoiceDetails] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (!hasPermission("ADMIN") && !hasPermission("STAFF")) {
                navigate("/admin/login");
            }
        }
    }, [navigate]);
    useEffect(() => {
        fetchInvoice(id);
        fetchInvoicePaymentHistory(id);
        getProductFromDetailsInvoice();
    }, [id]);

    const fetchInvoice = async (maHoaDon) => {
        const response = await api.get(`/admin/hoa-don/${maHoaDon}`);
        setInvoice(response.data);
    };

    const fetchInvoicePaymentHistory = async (maHoaDon) => {
        const response = await api.get(`/admin/hoa-don/${maHoaDon}/lich-su-thanh-toan`);
        setPayment(response.data);
    };

    const handleRemoveOrderItem = async (idHdct, idCtsp) => {
        try {

            const requestData = {
                idHoaDonChiTiet: idHdct,
                idChiTietSanPham: idCtsp
            };

            await api.post("/admin/chi-tiet-san-pham/xoa-sp", requestData);
            getProductFromDetailsInvoice();

        } catch (error) {
            console.log(error);
        }
    };

    // phần chọn sản phẩm

    const [orderItemsByTab, setOrderItemsByTab] = useState({}); // Thêm state này
    const [removeItem, setRemoveItem] = useState([]);
    const [openDeleteProductDialog, setOpenDeleteProductDialog] = useState(false);

    useEffect(() => {

        getProductFromDetailsInvoice()
    }, [])
    const getProductFromDetailsInvoice = async () => {
        try {
            const response = await api.get(`/admin/hdct/get-cart/${idHd}`);
            setOrderItemsByTab(response.data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };
    const handleCloseDialog = (confirm) => {
        setOpenDeleteProductDialog(false);
        if (confirm) {
            handleRemoveOrderItem(removeItem.idHdct, removeItem.idCtsp)
        }
    }
    const handleOpenDialog = (idHdct, idCtsp) => {
        setRemoveItem({ idHdct: idHdct, idCtsp: idCtsp });
        setOpenDeleteProductDialog(true);
    }
    const [openDialogProduct, setOpenDialogProduct] = useState(false);
    const [productDetails, setProductDetails] = useState([]);
    const [productDetailSelected, setProductDetailSelected] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [openSelectQuantity, setOpenSelectQuantity] = useState(false);
    const handleOpenDialogProduct = () => {
        api
            .get("/admin/chi-tiet-san-pham/dot-giam/hien-thi/-1")
            .then((response) => {
                setProductDetails(response.data);
            })
            .catch((error) => {
                console.error("Error fetching product details:", error);
            });

        setOpenDialogProduct(true);
    };
    const handleCloseDialogProduct = () => {
        setOpenDialogProduct(false);
    };
    const handleCloseSelectQuantity = () => {
        setOpenSelectQuantity(false);
    };
    const handleOpenSelectQuantity = (item) => {
        setProductDetailSelected(item);
        setSelectedQuantity(1);
        setOpenSelectQuantity(true);
    };
    const handleAddProduct = async () => {
        try {
            if (!productDetailSelected) {
                Notification("Vui lòng chọn sản phẩm để thêm!", "warning");
                return;
            }

            const requestData = {
                idHoaDon: idHd,
                idChiTietSanPham: productDetailSelected.idChiTietSanPham,
                soLuongMua: selectedQuantity,
                giaSauGiam: productDetailSelected.giaSauGiam
            };

            const response = await api.post(
                "/admin/chi-tiet-san-pham/them-sp",
                requestData

            );

            if (response.status === 200) {
                getProductFromDetailsInvoice();
                Notification(`Sản phẩm ${productDetailSelected.sanPham} đã được thêm thành công!`, "success");

                api
                    .get("/admin/chi-tiet-san-pham/dot-giam/hien-thi/-1")
                    .then((response) => {
                        setProductDetails(response.data);
                    })
                    .catch((error) => {
                        console.error("Error fetching product details:", error);
                    });

                setOpenSelectQuantity(false);
            }

        } catch (error) {
            console.error("Error adding product:", error);
            Notification("Đã có lỗi xảy ra khi thêm sản phẩm, vui lòng thử lại!", "error");
        }
    };
    const handleQuantityChange = async (idHoaDonChiTiet, idChiTietSanPham, newQuantity, giaDuocTinh) => {
        if (newQuantity == "tru" || newQuantity == "cong") {
            try {
                const requestData = {
                    idHoaDonChiTiet: idHoaDonChiTiet,
                    idChiTietSanPham: idChiTietSanPham,
                    soLuongMua: newQuantity == "tru" ? Number(-1) : Number(1),
                    giaDuocTinh: giaDuocTinh
                };
                // console.log(newQuantity);
                await api.post("/admin/chi-tiet-san-pham/cap-nhat-sl", requestData);
                getProductFromDetailsInvoice()
            } catch (error) {
                console.error("Error updating product quantity:", error);
                Notification("Đã có lỗi xảy ra khi cập nhật số lượng sản phẩm, vui lòng thử lại!", "error");
            }
        } else if (typeof (Number(newQuantity)) == "number") {
            try {
                const requestData = {
                    idHoaDonChiTiet: idHoaDonChiTiet,
                    idChiTietSanPham: idChiTietSanPham,
                    soLuongMua: Number(newQuantity),
                    giaDuocTinh: giaDuocTinh
                };
                // console.log(newQuantity);
                await api.post("/admin/chi-tiet-san-pham/sua-sp", requestData);

                getProductFromDetailsInvoice()

            } catch (error) {
                console.error("Error updating product quantity:", error);
                Notification("Đã có lỗi xảy ra khi cập nhật số lượng sản phẩm, vui lòng thử lại!", "error");
            }
        }

    };
    return (
        <div className="p-6 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md ">
                <h1 className="my-2 text-lg font-semibold flex items-center mb-4">Trạng thái đơn hàng</h1>
                <Stepper order={invoice} />
            </div>
            {
                invoice &&
                <div className="bg-white p-4 rounded-lg shadow-md ">
                    <h1 className="my-2 text-lg font-semibold flex items-center mb-4">Thông tin khách hàng</h1>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div className='flex gap-4'>
                            <h2 className='font-bold'>Mã: </h2>
                            <p>{invoice.maHoaDon ?? "Không có"}</p>
                        </div>
                        <div className='flex gap-4'>
                            <h2 className='font-bold'>Tên khách hàng: </h2>
                            <p>{invoice.khachHang ? invoice.khachHang.hoTen : "Không có"}</p>
                        </div>
                        <div className='flex gap-4'>
                            <h2 className='font-bold'>SĐT người nhận: </h2>
                            <p>{invoice.khachHang ? invoice.khachHang.soDienThoai : "Không có"}</p>
                        </div>
                        <div className='flex gap-4'>
                            <h2 className='font-bold'>Email người nhận: </h2>
                            <p>{invoice.khachHang ? invoice.khachHang.email : "Không có"}</p>
                        </div>
                        <div className='flex gap-4'>
                            <h2 className='font-bold'>Tên nhân viên: </h2>
                            <p>{invoice.nhanVien ? invoice.nhanVien.ten : "Không có"}</p>
                        </div>
                        <div className='flex gap-4'>
                            <h2 className='font-bold'>SĐT nhân viên: </h2>
                            <p>{invoice.nhanVien ? invoice.nhanVien.soDienThoai : "Không có"}</p>
                        </div>
                        <div className='flex gap-4'>
                            <h2 className='font-bold'>Tổng tiền: </h2>
                            <p>{invoice.tongTien}</p>
                        </div>
                        <div className='flex gap-4'>
                            <h2 className='font-bold'>Trạng thái: </h2>
                            <div className='border border-solid border-orange-200 px-2'>
                                <p className='text-orange-200'>{invoice.trangThai}</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                payment &&
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h1 className="my-2 text-lg font-semibold flex items-center mb-4">Lịch sử thanh toán</h1>
                    <table className="min-w-full border-collapse">
                        <thead className=''>
                            <tr className="bg-gray-100 text-left ">
                                <th className="px-4 py-2 ">STT</th>
                                <th className="px-4 py-2 ">Ghi chú</th>
                                <th className="px-4 py-2 ">Hình thức thanh toán</th>
                                <th className="px-4 py-2 ">Ngày thanh toán</th>
                                <th className="px-4 py-2 ">Số tiền</th>
                                <th className="px-4 py-2 ">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b hover:bg-gray-100">
                                <td className="px-4 py-2 ">{payment.id}</td>
                                <td className="px-4 py-2 ">{payment.ghiChu}</td>
                                <td className="px-4 py-2 ">{payment.hinhThucThanhToan}</td>
                                <td className="px-4 py-2 ">{formatDateFromArray(payment.ngayTao)}</td>
                                <td className="px-4 py-2 ">{payment.soTienThanhToan}</td>
                                <td className="px-4 py-2 ">{payment.trangThai ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            }

            <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg font-semibold">Thông tin đơn hàng có mã hóa đơn: {id}</h1>
                    {invoice?.trangThai === "Chờ xác nhận" && (
                        <button
                            className="p-2 bg-blue-600 text-white rounded-md"
                            onClick={handleOpenDialogProduct}
                        >
                            Thêm sản phẩm
                        </button>
                    )}
                </div>
                <div className="my-2">
                    <TableContainer component={Paper} sx={{ maxHeight: "530px" }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ height: "40px" }}> {/* Giảm chiều cao của header */}
                                    {[
                                        "Sản phẩm",
                                        "Số lượng",
                                        "Kho",
                                        "Giá hiện tại",
                                        "Giá được tính",
                                        "Tổng",
                                    ].map((header) => (
                                        <TableCell
                                            key={header}
                                            align="center"
                                            sx={{
                                                position: "sticky",
                                                top: 0,
                                                backgroundColor: "white",
                                                zIndex: 2,
                                                padding: "8px", // Giảm padding
                                                fontSize: "12px", // Giảm font chữ
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                    <TableCell
                                        align="center"
                                        sx={{
                                            width: "10px",
                                            position: "sticky",
                                            top: 0,
                                            backgroundColor: "white",
                                            zIndex: 2,
                                            padding: "8px", // Giảm padding
                                            fontSize: "12px", // Giảm font chữ
                                        }}>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderItemsByTab && orderItemsByTab.length > 0 ? (
                                    orderItemsByTab.map((item) => (
                                        <TableRow key={item.idHoaDonChiTiet}>
                                            <TableCell align="center" sx={{ width: "200px" }}>
                                                <div className="flex justify-content-center relative">
                                                    <div>
                                                        <img
                                                            src={item.lienKet}
                                                            alt={item.tenSanPham}
                                                            className="w-12 h-12 object-cover inset-0 rounded-md inline-block"
                                                        />
                                                    </div>
                                                    <div className="ms-1">
                                                        <p>{item.tenSanPham}</p>
                                                        <p className="text-[10px] text-[#8d8674]">{item.tenMau}</p>
                                                        <p className="text-[10px] text-[#8d8674]">{item.tenKichCo}</p>
                                                    </div>
                                                    {!item.trangThai ? (
                                                        <p className="text-red-500 absolute -bottom-5 left-0 w-[500px] text-left">
                                                            *Sản phẩm đã ngừng hoạt động! Chỉ có thể trả lại hoặc thanh toán!
                                                        </p>
                                                    ) : (
                                                        item.giaDuocTinh && (
                                                            <p className="text-red-500 absolute -bottom-5 left-0 w-[500px] text-left">
                                                                *Sản phẩm có sự thay đổi về giá {item.giaDuocTinh.toLocaleString()} đ → {" "}
                                                                {item.donGia.toLocaleString()} đ
                                                            </p>
                                                        )
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontSize: "12px" }}>
                                                <div className='relative'>
                                                    <div className='absolute -left-3 top-0 bottom-0'>
                                                        {invoice?.trangThai === "Chờ xác nhận" &&
                                                            item.trangThai && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (Number(item.soLuongMua) > 1) {
                                                                            handleQuantityChange(
                                                                                item.idHoaDonChiTiet,
                                                                                item.idChiTietSanPham,
                                                                                "tru",
                                                                                item.giaDuocTinh
                                                                            );
                                                                        } else {
                                                                            Notification("Đã là số lượng nhỏ nhất !", "warning");
                                                                            return;
                                                                        }
                                                                    }}
                                                                >
                                                                    <Remove sx={{ fontSize: 15 }} />
                                                                </button>
                                                            )}
                                                    </div>
                                                    <div>
                                                        {invoice?.trangThai === "Chờ xác nhận" &&
                                                            item.trangThai ? (
                                                            <input
                                                                type="number"
                                                                value={item.soLuongMua}
                                                                onChange={(e) => {
                                                                    if (
                                                                        e.target.value > 0 &&
                                                                        e.target.value <= item.soLuongMua + item.kho
                                                                    ) {
                                                                        if (e.target.value - item.soLuongMua <= item.kho) {
                                                                            handleQuantityChange(
                                                                                item.idHoaDonChiTiet,
                                                                                item.idChiTietSanPham,
                                                                                e.target.value,
                                                                                item.giaDuocTinh
                                                                            );
                                                                        }
                                                                    } else {
                                                                        Notification("Chọn số lượng hợp lệ", "error");
                                                                        return;
                                                                    }
                                                                }}
                                                                className="text-center w-8"
                                                            />
                                                        ) : (
                                                            <span>{item.soLuongMua}</span>
                                                        )}
                                                    </div>
                                                    <div className='absolute -right-3 top-0 bottom-0'>
                                                        {invoice?.trangThai === "Chờ xác nhận" &&
                                                            item.trangThai && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (item.kho > 0) {
                                                                            if (!item.giaDuocTinh) {
                                                                                handleQuantityChange(
                                                                                    item.idHoaDonChiTiet,
                                                                                    item.idChiTietSanPham,
                                                                                    "cong",
                                                                                    item.giaDuocTinh
                                                                                );
                                                                            } else {
                                                                                Notification(
                                                                                    "Sản phẩm đã thay đổi giá chỉ có thể mua hoặc trả lại!",
                                                                                    "warning"
                                                                                );
                                                                            }
                                                                        } else {
                                                                            Notification("Đã hết hàng trong kho!", "warning");
                                                                            return;
                                                                        }
                                                                    }}
                                                                >
                                                                    <Add sx={{ fontSize: 15 }} />
                                                                </button>
                                                            )}
                                                    </div>
                                                </div>

                                            </TableCell>
                                            <TableCell align="center" sx={{ fontSize: "12px" }}>{item.kho}</TableCell>
                                            <TableCell align="center" sx={{ fontSize: "12px" }}>{item.donGia.toLocaleString()} đ</TableCell>
                                            <TableCell align="center" sx={{ fontSize: "12px" }}>
                                                {(item.giaDuocTinh ?? item.donGia).toLocaleString()} đ
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontSize: "12px" }}>{item.thanhTien.toLocaleString()} đ</TableCell>
                                            <TableCell sx={{ width: "10px", padding: "4px", }}>
                                                {invoice?.trangThai === "Chờ xác nhận" && (
                                                    <button
                                                        onClick={() =>
                                                            handleOpenDialog(item.idHoaDonChiTiet, item.idChiTietSanPham)
                                                        }
                                                    >
                                                        <Trash size={16} sx={{ width: "10px" }} className="text-red-600" />
                                                    </button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            Chưa có sản phẩm nào
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>
            </div>
            <Alert
                open={openDeleteProductDialog}
                message={"Bạn có chắc chắn muốn xóa sản phẩm này không?"}
                onClose={handleCloseDialog}
            />
            <Dialog
                open={openDialogProduct}
                onClose={handleCloseDialogProduct}
                maxWidth="xl"
                fullWidth
            >
                <DialogTitle>Danh sách sản phẩm</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table >
                            <TableHead >
                                <TableRow>
                                    {/* <TableCell>Ảnh</TableCell> */}
                                    <TableCell sx={{ width: "400px" }}>Sản phẩm</TableCell>
                                    <TableCell>Màu sắc</TableCell>
                                    <TableCell>Kích cỡ</TableCell>
                                    {/* <TableCell>Cổ giày</TableCell>
                                                <TableCell>Mũi giày</TableCell>
                                                <TableCell>Thương hiệu</TableCell>
                                                <TableCell>Chất liệu</TableCell>
                                                <TableCell>Nhà cung cấp</TableCell>
                                                <TableCell>Danh mục sản phẩm</TableCell> */}
                                    <TableCell sx={{ width: "150px", textAlign: "center" }}>Giá</TableCell>
                                    <TableCell sx={{ width: "50px", textAlign: "center" }}>Số lượng</TableCell>
                                    <TableCell sx={{ width: "10px", textAlign: "center" }}>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productDetails && productDetails.length > 0 ? (
                                    productDetails.map((item) => (
                                        item.trangThai && (
                                            !item.giaDuocTinh && (
                                                Number(item.soLuong) > 0 && (
                                                    <TableRow key={item.idChiTietSanPham} >
                                                        <TableCell sx={{ width: "400px" }}>
                                                            <div className='flex justify-content-center gap-x-2'>
                                                                <img
                                                                    src={item.lienKet}
                                                                    alt={item.sanPham.ten}
                                                                    className={`w-12 h-12 object-cover inset-0 rounded-md inline-block`}
                                                                />
                                                                {item.sanPham}
                                                                {/* <span className="flex items-center space-x-2">
                                                                                <span>{item.sanPham} &#91;</span>
                                                                                <span
                                                                                    className="w-4 h-4 rounded-full"
                                                                                    style={{ backgroundColor: item.mauSac }}
                                                                                ></span>
                                                                                <span>{item.kichCo} &#93;</span>
                                                                            </span> */}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="flex items-center space-x-2">
                                                                <span
                                                                    className="w-4 h-4 rounded-full"
                                                                    style={{ backgroundColor: item.mauSac }}
                                                                ></span>
                                                                <span className=''> {item.mauSac}</span>
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>{item.kichCo}</TableCell>
                                                        {/* <TableCell>{item.coGiay}</TableCell>
                                                                    <TableCell>{item.muiGiay}</TableCell>
                                                                    <TableCell>{item.deGiay}</TableCell>
                                                                    <TableCell>{item.thuongHieu}</TableCell>
                                                                    <TableCell>{item.chatLieu}</TableCell>
                                                                    <TableCell>{item.nhaCungCap}</TableCell>
                                                                    <TableCell>{item.danhMucSanPham}</TableCell> */}
                                                        <TableCell sx={{ textAlign: "center" }}>{item.giaSauGiam.toLocaleString()} đ</TableCell>
                                                        <TableCell sx={{ textAlign: "center" }}>{item.soLuong}</TableCell>
                                                        <TableCell sx={{ width: "10px", textAlign: "center" }}>
                                                            <Button
                                                                variant="contained"
                                                                onClick={() => {
                                                                    // if (item.soLuong <= 0) {
                                                                    // Notification(
                                                                    // "Hàng đã hết! Xin vui lòng chọn sản phẩm khác !",
                                                                    // "warning"
                                                                    // );
                                                                    // } else {
                                                                    handleOpenSelectQuantity(item);
                                                                    // }
                                                                }}
                                                            >
                                                                Chọn
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )
                                        )
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={12} align="center">
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogProduct}>Đóng</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog chọn số lượng sản phẩm */}
            <Dialog
                open={openSelectQuantity}
                onClose={handleCloseSelectQuantity}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>Chọn số lượng sản phẩm</DialogTitle>
                <DialogContent>
                    {productDetailSelected && (
                        <div className="space-y-4">
                            <div className="flex flex-row items-center gap-2">
                                <div className="w-2/3 grid grid-cols-2">
                                    <div>
                                        <img
                                            src={
                                                productDetailSelected.lienKet
                                            }
                                            alt={productDetailSelected.sanPham}
                                            className="size-60 object-cover rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold">
                                            Tên sản phẩm: {productDetailSelected.sanPham}
                                        </h2>
                                        <p>Cổ giày: {productDetailSelected.coGiay}</p>
                                        <p>Mũi giày: {productDetailSelected.muiGiay}</p>
                                        <p>Đế giày: {productDetailSelected.deGiay}</p>
                                        <p>Thương hiệu: {productDetailSelected.thuongHieu}</p>
                                        <p>Chất liệu: {productDetailSelected.chatLieu}</p>
                                        <p>Nhà cung cấp: {productDetailSelected.nhaCungCap}</p>
                                        <p>Danh mục: {productDetailSelected.danhMucSanPham}</p>
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <p>
                                        Giá: {Number(productDetailSelected.giaSauGiam) !== Number(productDetailSelected.gia) ? (
                                            <span>
                                                <span className='text-red-500 text-lg'> {productDetailSelected.giaSauGiam.toFixed(2)}đ </span>
                                                <span className="line-through text-[#929292] text-sm"> {productDetailSelected.gia.toFixed(2)}đ</span>
                                            </span>
                                        ) : (
                                            <span>{productDetailSelected.gia} <span className='ordinal'>đ</span> </span>
                                        )}
                                    </p>

                                    <p>Số lượng còn lại: {productDetailSelected.soLuong}</p>
                                </div>
                            </div>
                            <TextField
                                id="outlined-number"
                                label="Số lượng đặt"
                                type="number"
                                value={selectedQuantity}
                                onChange={(e) => {
                                    let value = Number(e.target.value);
                                    if (value < 1) value = 1;
                                    else if (value > productDetailSelected.soLuong)
                                        value = productDetailSelected.soLuong;
                                    setSelectedQuantity(value);
                                }}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                                fullWidth
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleAddProduct}>
                        Thêm
                    </Button>
                    <Button onClick={handleCloseSelectQuantity}>Hủy</Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </div >
    )
}