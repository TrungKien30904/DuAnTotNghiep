import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {FileText, ShoppingCart, Home, EyeIcon,} from 'lucide-react';
// import toast, {Toaster} from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import { FileSpreadsheet } from "lucide-react";
import Notification from '../components/Notification';

const statuses = ['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Chờ vận chuyển', 'Vận chuyển', 'Thanh toán', 'Hoàn thành', 'Hủy'];

export default function Invoices() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState('Tất cả');
    const [filter, setFilter] = useState({
        searchQuery: '',
        loaiDon: '',
        startDate: '',
        endDate: '',
    });
    const [statistics, setStatistics] = useState({
        totalInvoices: 0,
    });

    const fetchInvoices = async (filterParams = {}) => {
        try {
            const response = await axios.get('http://localhost:8080/admin/hoa-don', {
                params: {
                    loaiDon: filterParams.loaiDon || filter.loaiDon,
                    startDate: filterParams.startDate || filter.startDate,
                    endDate: filterParams.endDate || filter.endDate,
                    searchQuery: filterParams.searchQuery || filter.searchQuery,
                },
            });
            setInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    const fetchInvoiceStatistics = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/hoa-don/thong-ke');
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const changePageHandler = (page) => {
        if (page > totalPage || page < 1) {
            return;
        }
        setCurrentPage(page);
    }

    const changeStatusHandler = (status) => {
        setSelectedStatus(status);
        setCurrentPage(1);
    }

    const handleSearch = () => {
        const {startDate, endDate} = filter;
        if (new Date(endDate) < new Date(startDate)) {
            Notification.error('Ngày kết thúc không thể nhỏ hơn ngày bắt đầu','error');
        } else {
            fetchInvoices(filter);
        }
    };

    const handleReset = () => {
        setFilter({
            searchQuery: '',
            loaiDon: '',
            startDate: '',
            endDate: '',
        });
        fetchInvoices();
    };

    const goToDetail = (maHoaDon) => {
        navigate(`/invoice-detail/${maHoaDon}`);
    }

    const countByTrangThai = invoices.reduce((acc, hoaDon) => {
        acc[hoaDon.trangThai] = (acc[hoaDon.trangThai] || 0) + 1;
        return acc;
    }, {});

    useEffect(() => {
        fetchInvoiceStatistics();
        fetchInvoices();
    }, []);

    let filteredInvoices = invoices;


    if (selectedStatus !== 'Tất cả') {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.trangThai === selectedStatus)
    }

    const totalPage = filteredInvoices.length / 5 > 1 ? filteredInvoices.length / 5 : 1;
    filteredInvoices = filteredInvoices.slice((currentPage - 1) * 5, (currentPage - 1) * 5 + 5);

    return (
        <div className="p-6 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md ">
                <h1 className="my-2 text-lg font-semibold flex items-center">
                    {}
                    <Home className="mr-2"/> Quản Lý Hoá đơn
                </h1>
                <div className='grid grid-cols-3 gap-4'>
                    <div className='flex-1 flex justify-between items-center'>
                        <label>Tìm kiếm: </label>
                        <input
                            type="text"
                            placeholder="Nhập"
                            className="p-2 border rounded w-3/4"
                            value={filter.searchQuery}
                            onChange={(e) => setFilter({...filter, searchQuery: e.target.value})}
                        />

                    </div>
                    <div className='flex-1 flex justify-between items-center'>
                        <label>Ngày bắt đầu: </label>
                        <input
                            type="date"
                            className="p-2 border rounded w-3/4"
                            value={filter.startDate}
                            onChange={(e) => setFilter({...filter, startDate: e.target.value})}
                        />
                    </div>
                    <div className='flex-1 flex justify-between items-center'>
                        <label>Ngày kết thúc: </label>
                        <input
                            type="date"
                            className="p-2 border rounded w-3/4"
                            value={filter.endDate}
                            onChange={(e) => setFilter({...filter, endDate: e.target.value})}
                        />
                    </div>
                    <div className='flex-1 flex justify-between items-center'>
                        <label>Loại đơn: </label>
                        <select
                            className="p-2 border rounded w-3/4"
                            value={filter.loaiDon}
                            onChange={(e) => setFilter({...filter, loaiDon: e.target.value})}
                        >
                            <option value="">Loại đơn</option>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                    </div>
                    <div></div>
                    <div className='flex justify-end gap-10'>
                        <button
                            className="py-2 px-4 bg-blue-400 text-white rounded"
                            onClick={handleSearch}
                        >
                            Tìm kiếm
                        </button>
                        <button
                            className="py-2 px-4 bg-red-400 text-white rounded"
                            onClick={handleReset}
                        >
                            Làm mới
                        </button>
                    
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between">
                    <h3 className="text-lg font-semibold flex items-center">
                        {}
                        <FileText className="mr-2"/> Danh sách hoá đơn
                    </h3>
                    <div className='flex justify-end gap-10'>
                    <button className="p-2 bg-green-500 text-white rounded mb-4">
                        <div className='flex gap-2'>
                            <FileSpreadsheet className="mr-2"/>
                            <span>Xuất Excel</span>
                        </div>
                    </button>
                    <button className="p-2 bg-red-500 text-white rounded mb-4">
                        <div className='flex gap-2'>
                            <ShoppingCart className="mr-2"/>
                            <span>Tạo đơn hàng</span>
                        </div>
                    </button>
                    </div>
                  
                    
                </div>

                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-gray-200 dark:border-gray-700 dark:text-gray-400">
                    {statuses.map(status =>
                            <li className="me-2 relative inline-flex" onClick={() => changeStatusHandler(status)}>
                                <a href="#"
                                   className={`inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-300 dark:hover:bg-gray-400 dark:hover:text-white ${status === selectedStatus && 'active text-blue-600 bg-blue-50'}`}>{status}</a>
                                <span
                                    class="absolute  right-0.5 grid min-h-[12px] min-w-[24px] translate-x-1/4 -translate-y-1/8 place-items-center rounded-full bg-red-600 py-1 px-1 text-xs text-white">
                {status === 'Tất cả' ? invoices.length : (countByTrangThai[status] || 0)}
              </span>
                            </li>
                    )}
                </ul>

                <table className="min-w-full border-collapse">
                    <thead className=''>
                    <tr className="bg-gray-100 text-left ">
                        <th className="px-4 py-2 ">STT</th>
                        <th className="px-4 py-2 ">Mã hoá đơn</th>
                        <th className="px-4 py-2 ">Tên khách hàng</th>
                        <th className="px-4 py-2 ">Tên nhân viên</th>
                        <th className="px-4 py-2 ">Số điện thoại</th>
                        <th className="px-4 py-2 ">Email</th>
                        <th className="px-4 py-2 ">Tổng tiền</th>
                        <th className="px-4 py-2 ">Ngày tạo</th>
                        <th className="px-4 py-2 ">Loại đơn</th>
                        <th className="px-4 py-2 "></th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredInvoices.map((invoice, index) => (
                        <tr key={invoice.idHoaDon} className="border-b hover:bg-gray-100">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{invoice.maHoaDon}</td>
                            <td className="px-4 py-2">{invoice.tenNguoiNhan}</td>
                            <td className="px-4 py-2">{invoice.nhanVien.ten}</td>
                            <td className="px-4 py-2">{invoice.soDienThoai}</td>
                            <td className="px-4 py-2">{invoice.email}</td>
                            <td className="px-4 py-2">{invoice.tongTien}</td>
                            <td className="px-4 py-2">{invoice.ngayTao}</td>
                            <td className="px-4 py-2">{invoice.loaiDon}</td>
                            <td className="px-4 py-2"><EyeIcon className="hover:cursor-pointer"
                                                               onClick={() => goToDetail(invoice.maHoaDon)}/></td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className='mt-2 flex justify-center'>
                    <nav aria-label="Page navigation example">
                        <ul className="flex items-center -space-x-px h-8 text-sm">
                            <li onClick={() => changePageHandler(currentPage - 1)}>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-dark bg-gray-300 border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                    <span className="sr-only">Previous</span>
                                    <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="M5 1 1 5l4 4"/>
                                    </svg>
                                </a>
                            </li>
                            {Array.from({length: totalPage}, (_, i) => i + 1).map((page) =>
                                <li key={page} onClick={() => changePageHandler(page)}>
                                    <a href="#"
                                       className={`flex items-center justify-center px-3 h-8 leading-tight text-dark bg-gray-300 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${page === currentPage && 'z-10 leading-tight text-white border-blue-300 bg-blue-500'}`}>{page}</a>
                                </li>
                            )}
                            <li onClick={() => changePageHandler(currentPage + 1)}>
                                <a href="#"
                                   className="flex items-center justify-center px-3 h-8 leading-tight text-dark bg-gray-300 border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                    <span className="sr-only">Next</span>
                                    <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>

            </div>
            <ToastContainer />
        </div>
    );
}
