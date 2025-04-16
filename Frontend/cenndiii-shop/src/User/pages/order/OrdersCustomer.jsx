import React, { useState, useEffect } from 'react';
import { ArchiveX, FileText, FileX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Notification from "../../../components/Notification";
import { getUserId } from "../../../security/DecodeJWT";
import { formatDateFromArray } from "../../../untils/FormatDate";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
const statuses = ['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Chờ vận chuyển', 'Đang vận chuyển', 'Đã hoàn thành', 'Hủy'];

const OrdersCustomer = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      setSelectedCustomerId(userId);
    }
  }, []);

  useEffect(() => {
    if (selectedCustomerId) {
      axios.get(`http://localhost:8080/admin/hoa-don/hien-thi-hoa-don?idKhachHang=${selectedCustomerId}`, {
        withCredentials: true
      })
        .then(res => {
          setInvoices(res.data);
        })
        .catch(err => console.error("Lỗi khi lấy danh sách hóa đơn:", err));
    }
  }, [selectedCustomerId]);

  const changeStatusHandler = (status) => {
    setSelectedStatus(status);
  };

  const goToDetail = (id) => {
    navigate(`/detail-orders-customer/${id}`);
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  let filteredInvoices = invoices;
  if (selectedStatus !== 'Tất cả') {
    filteredInvoices = invoices.filter(invoice => invoice.trangThai === selectedStatus);
  }

  return (
    <div className="mt-16 mx-auto max-w-7xl p-6">
      <div className="">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <FileText className="mr-2 text-blue-500" /> ĐƠN HÀNG CỦA TÔI
          </h3>
        </div>

        <ul className="flex border-b border-gray-300 text-sm font-medium text-gray-500">
          {statuses.map((status, index) => (
            <li
              key={index}
              onClick={() => changeStatusHandler(status)}
              className="cursor-pointer group"
            >
              <a
                href="#"
                className={`relative px-11 py-2 inline-block transition-all duration-300 ease-in-out ${status === selectedStatus
                  ? "text-black font-semibold"
                  : "text-gray-400 group-hover:text-black"
                  }`}
              >
                {status}
                <span
                  className={`absolute left-0 bottom-0 w-full h-[2px] bg-black transition-all duration-300 ${status === selectedStatus ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Kiểm tra nếu không có hóa đơn nào */}
        <div className="mt-4 h-[560px] overflow-y-auto">
          {filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <FileX className="text-4xl text-gray-300 opacity-70" size={150} />
              <span className="mt-2 text-sm text-gray-600">Không có đơn hàng nào</span>
            </div>
          ) : (
            filteredInvoices.slice(0, showAll ? filteredInvoices.length : 5).map((invoice, index) => (
              <div
                key={invoice.idHoaDon}
                className="bg-gray-50 p-4 rounded-lg shadow-md mb-4 border border-gray-200 flex items-start justify-between cursor-pointer hover:bg-gray-100 transition"
                onClick={() => goToDetail(invoice.idHoaDon)}
              >
                <div className="text-xl font-bold text-gray-700 w-10 text-center pt-1">{index + 1}</div>
                <div className="border-l border-gray-300 px-4 flex-1 relative">
                  <div className="absolute top-0 right-0 text-sm text-black font-semibold">
                    {invoice.trangThai}
                  </div>
                  <p className="text-lg font-semibold">Mã Hóa Đơn: {invoice.maHoaDon}</p>
                  <p className="text-gray-500">Ngày Đặt Hàng: {formatDateFromArray(invoice.ngayTao)}</p>
                  <div className="mt-4">
                    <p className="text-black font-semibold text-xl absolute bottom-0 right-0">
                      <span className="text-sm text-gray-500 font-semibold">Tổng:</span> <span className='text-red-500'>{formatCurrency(invoice.tongTien ?? 0)}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredInvoices.length > 5 && (
          <div className="text-center mt-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Ẩn bớt" : "Xem tất cả"}
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default OrdersCustomer;
