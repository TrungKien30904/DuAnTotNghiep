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

export default function InvoiceDetail() {
    const { id } = useParams();
    const [invoice, setInvoice] = useState();
    const [payment, setPayment] = useState();
    const [showHistory, setShowHistory] = useState(false);
    const [histories, setHistories] = useState([]);
    const [invoiceDetails, setInvoiceDetails] = useState([]);
    const navigate = useNavigate();
    const [productDetailsId, setProductDetailsId] = useState(-1);
    const [openDeleteProductDialog, setOpenDeleteProductDialog] = useState(false);
    const handleCloseDialog = (confirm) => {
        setOpenDeleteProductDialog(false);
        if (confirm) {
            handleDelete(productDetailsId);
        }
    }
    const handleOpenDialog = (id) => {
        setProductDetailsId(id);
        setOpenDeleteProductDialog(true);
    }
    useEffect(() => {
        if (!hasPermission("ADMIN") && !hasPermission("STAFF")) {
            navigate("/admin/login");
        }
    }, [navigate]);
    useEffect(() => {
        fetchInvoice(id);
        fetchInvoicePaymentHistory(id);
        fetchHistories();
        fetchInvoiceDetails();
    }, [id]);

    const getProgressPercent = () => {
        if (!invoice) return;
        if (invoice.trangThai === 'Chờ xác nhận') return 0;
        if (invoice.trangThai === 'Đã xác nhận') return 25;
        if (invoice.trangThai === 'Chờ vận chuyển') return 50;
        if (invoice.trangThai === 'Đã thanh toán') return 75;
        if (invoice.trangThai === 'Giao thành công') return 100;
    };

    const fetchInvoice = async (maHoaDon) => {
        const response = await api.get(`/admin/hoa-don/${maHoaDon}`);
        console.log("Dữ liệu hóa đơn:", response.data);
        setInvoice(response.data);
    };

    const fetchInvoicePaymentHistory = async (maHoaDon) => {
        const response = await api.get(`/admin/hoa-don/${maHoaDon}/lich-su-thanh-toan`);
        setPayment(response.data);
    };

    const fetchHistories = async () => {
        const response = await api.get(`/admin/hoa-don/${id}/lich-su-hoa-don`);
        setHistories(response.data);
    };

    const fetchInvoiceDetails = async () => {
        try {
            const response = await api.get(`/admin/hdct/listHoaDonChiTiet?maHoaDon=${id}`);
            setInvoiceDetails(response.data);
            console.log(response.data);

        } catch (error) {
            console.error('Error fetching invoice details:', error);
        }
    };

    const xacNhanDonHang = () => {
        api.put(`/admin/hoa-don/${id}/xac-nhan`)
            .then(() => fetchInvoice(id));
    };

    const huyDonHang = () => {
        api.put(`/admin/hoa-don/${id}/huy`)
            .then(() => fetchInvoice(id));
    };

    const quayLai = () => {
        api.put(`/admin/hoa-don/${id}/quay-lai`)
            .then(() => fetchInvoice(id));
    };

    const hienThiLichSu = () => {
        setShowHistory(true);
    };

    const handleEdit = (id) => {
        // Handle edit action
        console.log(`Edit item with id: ${id}`);
    };

    const handleDelete = (id) => {
        try {
            // api.get(`/admin/hdct/delete/${id}`);
            setInvoiceDetails(invoiceDetails.filter(detail => detail.idHoaDonChiTiet !== id));
            Notification("Xóa thành công", "success")
        } catch (error) {
            console.error('Error deleting item:', error);
            Notification("Xóa thất bại", "error")
        }
    };

    const handleAdd = () => {
        // Handle add action
        console.log('Add new item');
    };

    return (
        <div className="p-6 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md ">
                <h1 className="my-2 text-lg font-semibold flex items-center mb-4">Trạng thái đơn hàng</h1>
                {invoice?.trangThai !== 'Hủy' ? <>
                    <div className="mt-8 flex justify-between items-center">
                        <OrderStatus status="Chờ xác nhận" />
                        <OrderStatus status="Đã xác nhận" />
                        <OrderStatus status="Chờ vận chuyển" />
                        <OrderStatus status="Đã thanh toán" />
                        <OrderStatus status="Giao thành công" />
                    </div>
                    <div className="mt-8 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                        <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${getProgressPercent()}%` }}> {getProgressPercent()}%</div>
                    </div>
                    <div className='mt-8 flex justify-between items-center'>
                        <div className='flex gap-16'>
                            <button
                                onClick={xacNhanDonHang}
                                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
                                Xác nhận
                            </button>
                            {invoice?.trangThai === 'Đã xác nhận' && <button
                                onClick={quayLai}
                                className='focus:outline-none text-white bg-orange-500 hover:bg-orange-500 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>
                                Quay lại
                            </button>}
                            <button
                                onClick={huyDonHang}
                                className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>
                                Hủy
                            </button>
                        </div>
                        <button
                            onClick={hienThiLichSu}
                            className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>
                            Lịch sử
                        </button>
                    </div>
                </> : <h2 className='text-red-200'>Đơn hàng đã bị hủy</h2>}
            </div>
            {
                invoice &&
                <div className="bg-white p-4 rounded-lg shadow-md ">
                    <h1 className="my-2 text-lg font-semibold flex items-center mb-4">Thông tin khách hàng</h1>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                        {/* Thông tin khách hàng */}
                        <div className='flex flex-col gap-4'>
                            <div className='flex gap-4'>
                                <h2 className='font-bold'>Tên khách hàng: </h2>
                                <p>{invoice?.khachHang?.hoTen ?? invoice?.tenNguoiNhan ?? "Không có"}</p>
                            </div>
                            <div className='flex gap-4'>
                                <h2 className='font-bold'>SĐT người nhận: </h2>
                                <p>{invoice?.khachHang?.soDienThoai ?? invoice?.soDienThoai ?? "Không có"}</p>
                            </div>
                            <div className='flex gap-4'>
                                <h2 className='font-bold'>Email người nhận: </h2>
                                <p>{invoice?.khachHang?.email ?? invoice?.email ?? "Không có"}</p>
                            </div>
                            <div className='flex gap-4'>
                                <h2 className='font-bold'>Địa chỉ nhận hàng: </h2>
                                <p>{invoice?.khachHang?.diaChi ?? invoice?.diaChi ?? "Không có"}</p>
                            </div>
                            <div className='flex gap-4'>
                                <h2 className='font-bold'>Ghi chú: </h2>
                                <p>{invoice?.khachHang?.ghiChu ?? invoice?.ghiChu ?? "Không có"}</p>
                            </div>
                        </div>


                        {/* Thông tin khác */}
                        <div className='flex flex-col gap-4'>
                            <div className='flex gap-4'>
                                <h2 className='font-bold'>Mã: </h2>
                                <p>{invoice.maHoaDon ?? "Không có"}</p>
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
            {showHistory &&
                <div className=" flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative p-4 w-full max-w-5xl max-h-full">
                        <div className="shadow-2xl relative bg-white rounded-lg dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Lịch sử đơn hàng
                                </h3>
                                <button onClick={() => setShowHistory(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div class="relative overflow-x-auto">
                                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" class="px-6 py-3">
                                                STT
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Trạng thái
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Ngày
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Người xác nhận
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {histories && histories.map((history, index) => (
                                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {index + 1}
                                                </th>
                                                <td class="px-6 py-4">
                                                    {history.hanhDong}
                                                </td>
                                                <td class="px-6 py-4">
                                                    {history.ngayTao}
                                                </td>
                                                <td class="px-6 py-4">
                                                    {history.nguoiTao}
                                                </td>
                                            </tr>

                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                <button onClick={() => setShowHistory(false)} data-modal-hide="default-modal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Close</button>
                            </div>

                        </div>
                    </div>
                </div>
            }

            <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg font-semibold">Thông tin đơn hàng có mã hóa đơn: {id}</h1>

                </div>
                <table className="min-w-full border-collapse">
                    <thead className=''>
                        <tr className="bg-gray-100 text-left ">
                            <th className="px-4 py-2 ">STT</th>
                            <th className="px-4 py-2 ">Tên sản phẩm</th>
                            <th className="px-4 py-2 ">Kích cỡ</th>
                            <th className="px-4 py-2 ">Màu sắc</th>
                            <th className="px-4 py-2 ">Số lượng</th>
                            <th className="px-4 py-2 ">Thành tiền</th>
                            <th className="px-4 py-2 ">Trạng thái</th>
                            <th className="px-4 py-2 ">Hành động</th>

                        </tr>
                    </thead>
                    <tbody>
                        {invoiceDetails.map((detail, index) => (
                            <tr key={detail.idHoaDonChiTiet} className="border-b hover:bg-gray-100">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{detail.chiTietSanPham.sanPham.ten}</td>
                                <td className="px-4 py-2">{detail.chiTietSanPham.kichCo.ten}</td>

                                <td className="px-4 py-2">{detail.chiTietSanPham.mauSac.ten}</td>
                                <td className="px-4 py-2">{detail.soLuong}</td>
                                <td className="px-4 py-2">{detail.soLuong * detail.chiTietSanPham.gia + 'VND'}</td>
                                <td className="px-4 py-2">{detail.chiTietSanPham.sanPham.trangThai ? "Còn hàng" : "Hết hàng"}</td>
                                <td className="px-4 py-2 flex gap-2">
                                    {invoice.trangThai === 'Chờ xác nhận' && (
                                        <button
                                            onClick={(e) => handleOpenDialog(detail.idHoaDonChiTiet)}
                                            className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-400 dark:hover:bg-red-500 focus:outline-none dark:focus:ring-red-600">
                                            Xóa
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Alert
                open={openDeleteProductDialog}
                message={"Bạn có chắc chắn muốn xóa sản phẩm này không?"}
                onClose={handleCloseDialog}
            />
            <ToastContainer />
        </div >
    )
}