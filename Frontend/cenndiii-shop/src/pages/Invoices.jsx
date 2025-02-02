import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { FileText, ShoppingCart, User, Percent, Box, Home, ChevronRight } from 'lucide-react';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
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

  useEffect(() => {
    fetchInvoiceStatistics();
    fetchInvoices();
  }, []);

  const handleSearch = () => {
    fetchInvoices(filter);
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center">
        {}
        <Home className="mr-2" /> Hoá đơn
      </h1>
      
      <div className="my-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="p-2 border rounded"
            value={filter.searchQuery}
            onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
          />
          <select
            className="p-2 border rounded"
            value={filter.loaiDon}
            onChange={(e) => setFilter({ ...filter, loaiDon: e.target.value })}
          >
            <option value="">Tất cả loại đơn</option>
            <option value="online">Online</option>
            <option value="Tại quầy">Tại quầy</option>
          </select>
          <input
            type="date"
            className="p-2 border rounded"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
          />
          <input
            type="date"
            className="p-2 border rounded"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
          />
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>
          <button
            className="p-2 bg-gray-300 text-black rounded"
            onClick={handleReset}
          >
            Làm mới
          </button>
        </div>
      </div>

      <div className="my-4">
        <h3 className="text-xl font-semibold flex items-center">
          {}
          <FileText className="mr-2" /> Tổng hợp hoá đơn
        </h3>
      </div>

      <div className="my-4">
        <button className="p-2 bg-green-500 text-white rounded mb-4">
          {}
          <ShoppingCart className="mr-2" /> Tạo đơn hàng
        </button>

        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">STT</th>
              <th className="px-4 py-2">Tên khách hàng</th>
              <th className="px-4 py-2">Số điện thoại</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Tổng tiền</th>
              <th className="px-4 py-2">Ngày tạo</th>
              <th className="px-4 py-2">Loại đơn</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.idHoaDon} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{invoice.idHoaDon}</td>
                <td className="px-4 py-2">{invoice.tenNguoiNhan}</td>
                <td className="px-4 py-2">{invoice.soDienThoai}</td>
                <td className="px-4 py-2">{invoice.email}</td>
                <td className="px-4 py-2">{invoice.tongTien}</td>
                <td className="px-4 py-2">{invoice.ngayTao}</td>
                <td className="px-4 py-2">{invoice.loaiDon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
