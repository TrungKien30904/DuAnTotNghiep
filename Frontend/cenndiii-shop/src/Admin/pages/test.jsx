import React, { useState, useEffect, useRef } from 'react';
import { Ticket } from "lucide-react";
import axios from 'axios';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    const [customers, setCustomers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [selectedVoucher, setSelectedVoucher] = useState('');
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const [bestVoucherApplied, setBestVoucherApplied] = useState(false);
    const [initialBestVoucherId, setInitialBestVoucherId] = useState(null);

    useEffect(() => {
        // Fetch orders data from API
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/hoa-don/listHoaDon');
                const ordersData = response.data;
                setOrders(ordersData);
                const newTabs = ordersData.map(order => ({
                    id: order.idHoaDon,
                    label: `Order ${order.maHoaDon}`,
                    maHoaDon: order.maHoaDon,
                    khachHang: null,
                    vouchers: []
                }));
                setTabs(newTabs);

                // Set the default active tab to the first tab
                if (newTabs.length > 0) {
                    setActiveTab(newTabs[0].id);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        // gọi danh sách khách hàng
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/khach-hang/hien-thi-customer');
                const customersData = response.data;
                const defaultCustomer = { idKhachHang: 0, hoTen: 'Khách Lẻ', soDienThoai: 'N/A' };
                // Chỉ thêm khách lẻ một lần nếu chưa có trong danh sách
                const updatedCustomers = [defaultCustomer, ...customersData.filter(c => c.idKhachHang !== 0)];
                setCustomers(updatedCustomers);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách khách hàng:', error);
            }
        };
        fetchCustomers();
        fetchOrders();
    }, []);

    // cập nhật thông tin tổng tiền, giảm giá và danh sách voucher hợp lệ mỗi khi người dùng chuyển tab (chọn hóa đơn khác).
    useEffect(() => {
        const activeOrder = orders.find(o => o.idHoaDon === activeTab);
        if (activeOrder) {
            const tongTien = activeOrder.tongTien || 0;
            setTotalAmount(tongTien);
            if (activeOrder.voucher) {
                const voucher = activeOrder.voucher;
                let discount = 0;
                if (voucher.hinhThuc === '%') {
                    discount = (tongTien * voucher.giaTri) / 100;
                    if (discount >= voucher.giaTriToiDa) {
                        discount = voucher.giaTriToiDa;
                    }
                } else if (voucher.hinhThuc === 'VNĐ') {
                    discount = voucher.giaTri;
                }
                setDiscountAmount(discount);
                setSelectedVoucher(voucher.id ? voucher.id.toString() : '');
            } else {
                setDiscountAmount(0);
                setSelectedVoucher('');
            }
            const activeTabData = tabs.find(tab => tab.id === activeTab);
            if (activeTabData) {
                const filteredVouchers = activeTabData.vouchers.filter(v => tongTien >= v.dieuKien);
                setFilteredVouchers(filteredVouchers);
            }
        } else {
            setTotalAmount(0);
            setDiscountAmount(0);
            setSelectedVoucher('');
            setFilteredVouchers([]);
        }
    }, [activeTab, orders]);

    // chọn khách hàng và hiển thị voucher của khách hàng đó đang có
    const handleSelectCustomer = async (customer) => {
        const selected = customer || customers.find(c => c.idKhachHang === 0);
        const updatedTabs = tabs.map(tab => tab.id === activeTab ? { ...tab, khachHang: selected } : tab);
        setTabs(updatedTabs);
        try {
            const khachHangId = selected.idKhachHang !== 0 ? selected.idKhachHang : null;
            const response = await axios.get('http://localhost:8080/admin/phieu-giam-gia/hien-thi-voucher', {
                params: { khachHangId }
            });
            const updatedTabsWithVouchers = updatedTabs.map(tab => tab.id === activeTab ? {
                ...tab,
                vouchers: response.data
            } : tab);
            setTabs(updatedTabsWithVouchers);
            const activeOrder = orders.find(o => o.idHoaDon === activeTab);
            applyBestVoucher(activeOrder, response.data);
        } catch (error) {
            console.error('Lỗi khi lấy phiếu giảm giá:', error);
        }
    };
    // áp dụng phiếu giảm có giá trị tốt nhất
    const applyBestVoucher = async (order, vouchers) => {
        if (!order || !vouchers?.length) {
            return;
        }
        const totalAmount = order.tongTien || 0;
        const validVouchers = vouchers.filter(v => totalAmount >= v.dieuKien);
        if (validVouchers.length === 0) {
            return;
        }
        let bestVoucher = null;
        let maxDiscount = 0;
        validVouchers.forEach(voucher => {
            let discount = 0;
            if (voucher.hinhThuc === '%') {
                discount = (totalAmount * voucher.giaTri) / 100;
                if (discount > voucher.giaTriToiDa) {
                    discount = voucher.giaTriToiDa;
                }
            } else if (voucher.hinhThuc === 'VNĐ') {
                discount = voucher.giaTri;
            }
            if (discount > maxDiscount) {
                maxDiscount = discount;
                bestVoucher = voucher;
            }
        });
        if (bestVoucher) {
            try {
                await axios.put(`http://localhost:8080/admin/hoa-don/update-voucher/${order.idHoaDon}`, {
                    voucherId: bestVoucher.id
                });
                const updatedOrder = { ...order, voucher: bestVoucher, discountAmount: maxDiscount };
                const updatedOrders = orders.map(o => o.idHoaDon === order.idHoaDon ? updatedOrder : o);
                setOrders(updatedOrders);
                setDiscountAmount(maxDiscount);
                setSelectedVoucher(bestVoucher.id ? bestVoucher.id.toString() : '');
                setBestVoucherApplied(true);
                setInitialBestVoucherId(bestVoucher.id);
                console.log('Best voucher applied:', bestVoucher);
            } catch (error) {
                console.error('Lỗi khi áp dụng voucher:', error);
            }
        } else {
            toast.warn('Không tìm được voucher phù hợp.');
        }
    };
    // Áp dụng phiếu giảm của người dùng chọn
    const applySelectedVoucher = async (order, voucher) => {
        if (!order || !voucher) {
            return;
        }
        let discount = 0;
        if (voucher.hinhThuc === '%') {
            discount = (order.tongTien * voucher.giaTri) / 100;
            if (discount > voucher.giaTriToiDa) {
                discount = voucher.giaTriToiDa;
            }
        } else if (voucher.hinhThuc === 'VNĐ') {
            discount = voucher.giaTri;
        }
        try {
            await axios.put(`http://localhost:8080/admin/hoa-don/update-voucher/${order.idHoaDon}`, {
                voucherId: voucher.id
            });
            const updatedOrder = { ...order, voucher: voucher, discountAmount: discount };
            const updatedOrders = orders.map(o => o.idHoaDon === order.idHoaDon ? updatedOrder : o);
            setOrders(updatedOrders);
            setDiscountAmount(discount);
            setSelectedVoucher(voucher.id.toString());
            setBestVoucherApplied(voucher.id === initialBestVoucherId);
            console.log('Selected voucher applied:', voucher);
        } catch (error) {
            console.error('Lỗi khi áp dụng voucher:', error);
        }
    };
    //Tìm pgg
    const searchVoucher = async (keyword) => {
        try {
            const response = await axios.get('http://localhost:8080/admin/phieu-giam-gia/tim-kiem-theo-ma', {
                params: {
                    idKhachHang: selectedCustomer?.idKhachHang, keyword2: keyword
                }
            });
            // const updatedTabs = tabs.map(tab => tab.id === activeTab ? { ...tab, vouchers: response.data } : tab);
            // setTabs(updatedTabs);
            setFilteredVouchers(response.data);
            if (response.data.length === 1) {
                const activeOrder = orders.find(o => o.idHoaDon === activeTab);
                if (activeOrder) {
                    applySelectedVoucher(activeOrder, response.data[0]);
                }
            }
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
        }
    };

    const getSelectedCustomer = () => {
        const activeTabData = tabs.find(tab => tab.id === activeTab);
        return activeTabData ? activeTabData.khachHang : null;
    };

    const getTabVouchers = () => {
        return filteredVouchers;
    };
    const selectedCustomer = getSelectedCustomer();


    return (<div className="p-6">
        <div className="flex gap-4">
            
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="font-semibold mb-2">Thông tin khách hàng</h2>
                <div className='p-5 rounded-lg  border border-gray-300'>
                    <select className="border p-2 rounded mb-4 w-full" onChange={(e) => {
                        const selected = customers.find(c => c.idKhachHang === parseInt(e.target.value));
                        handleSelectCustomer(selected || customers.find(c => c.idKhachHang === 0));
                    }}
                        value={selectedCustomer ? selectedCustomer.idKhachHang : ''}>
                        {customers.map(customer => (<option key={customer.idKhachHang} value={customer.idKhachHang}>
                            {customer.hoTen} - {customer.soDienThoai}
                        </option>))}
                    </select>
                </div>
                <h2 className="font-semibold mb-4 mt-4">Thông tin thanh toán</h2>
                <div className='p-5 rounded-lg  border border-gray-300'>
                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Tìm theo mã"
                            className="border p-2 rounded flex-1"
                            value={searchKeyword}
                            onChange={(e) => {
                                setSearchKeyword(e.target.value);
                                searchVoucher(e.target.value);
                            }}
                        />
                    </div>

                    <div className="p-5 rounded-lg border border-gray-300 max-h-60 overflow-y-auto">
                        <div className="flex items-center space-x-2 text-gray-700 font-medium">
                            <Ticket size={18} />
                            <span>Phiếu giảm giá</span>
                        </div>
                        {getTabVouchers().length > 0 ? (<select
                            className="border p-2 rounded w-full"
                            value={selectedVoucher || ''}
                            onChange={(e) => {
                                const selectedVoucherId = parseInt(e.target.value);
                                const selectedVoucher = getTabVouchers().find(v => v.id === selectedVoucherId);
                                const activeOrder = orders.find(o => o.idHoaDon === activeTab);
                                setSelectedVoucher(selectedVoucherId);

                                if (selectedVoucher && activeOrder) {
                                    applySelectedVoucher(activeOrder, selectedVoucher);
                                }
                            }}
                        >
                            {getTabVouchers()
                                .sort((a, b) => {
                                    const discountA = a.hinhThuc === '%' ? Math.min((totalAmount * a.giaTri) / 100, a.giaTriToiDa) : a.giaTri;
                                    const discountB = b.hinhThuc === '%' ? Math.min((totalAmount * b.giaTri) / 100, b.giaTriToiDa) : b.giaTri;
                                    return discountB - discountA;
                                })
                                .map((voucher) => (<option key={voucher.id} value={voucher.id}>
                                    {voucher.maKhuyenMai} - {voucher.giaTri} {voucher.hinhThuc}
                                </option>))}
                        </select>) : (<p className="text-gray-500">Không có phiếu giảm giá.</p>)}
                        {getTabVouchers().length > 0 && bestVoucherApplied && (
                            <p className="text-red-500 italic text-sm mt-2">
                                * Phiếu giảm giá có giá trị tốt nhất.
                            </p>
                        )}
                    </div>
                    <div className="mt-4 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Tổng tiền:</span>
                                <span className="font-semibold text-gray-900">{totalAmount.toLocaleString()} đ</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Số tiền giảm:</span>
                                <span className="text-red-500 font-semibold">-{discountAmount.toLocaleString()} đ</span>
                            </div>
                            <hr className="border-t border-dashed border-gray-300" />
                            <div className="flex justify-between items-center mt-1">
                                <span className="font-semibold text-lg text-gray-800">Tổng tiền sau giảm:</span>
                                <span className="text-xl font-bold text-red-600">
                                    {(totalAmount - discountAmount).toLocaleString()} đ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}