import React, { useState, useEffect, useRef } from 'react';
import { Ticket } from "lucide-react";
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    const [warning, setWarning] = useState('');
    const [customers, setCustomers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [selectedVoucher, setSelectedVoucher] = useState('');
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const [bestVoucherApplied, setBestVoucherApplied] = useState(false);
    const [initialBestVoucherId, setInitialBestVoucherId] = useState(null);
    const tabsRef = useRef(null);

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
            const updatedTabs = tabs.map(tab => tab.id === activeTab ? { ...tab, vouchers: response.data } : tab);
            setTabs(updatedTabs);
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


    const handleEdit = (id) => {
        // Handle edit action
        console.log(`Edit order with id: ${id}`);
    };

    const handleDelete = (id) => {
        // Handle delete action
        console.log(`Delete order with id: ${id}`);
    };

    const handleAdd = async () => {
        if (tabs.length >= 10) {
            setWarning('Bạn chỉ có thể tạo tối đa 10 hóa đơn chờ.');
            return;
        }

        try {
            const newOrder = {
                maHoaDon: "", // Let the backend generate if needed
                khachHang: customers.find(c => c.idKhachHang === 0), // Gán khách hàng mặc định là "Khách lẻ"
                phieuGiamGia: null,
                nhanVien: null,
                tongTien: null,
                tenNguoiNhan: null,
                soDienThoai: null,
                email: null,
                ngayGiaoHang: null,
                phiVanChuyen: null,
                trangThai: null,
                ngayTao: null,
                ngaySua: null,
                nguoiTao: null,
                nguoiSua: null
            };

            const response = await axios.post("http://localhost:8080/admin/hoa-don/create", newOrder, // Send JSON body
                {
                    headers: {
                        "Content-Type": "application/json", // Ensure JSON format
                    },
                });

            const createdOrder = response.data;
            const newTabId = createdOrder.idHoaDon;
            setTabs([...tabs, {
                id: newTabId,
                label: `Hóa Đơn ${createdOrder.maHoaDon}`,
                maHoaDon: createdOrder.maHoaDon,
                khachHang: customers.find(c => c.idKhachHang === 0),
                vouchers: []
            }]);
            setActiveTab(newTabId);
            setWarning(''); // Clear any previous warning
        } catch (error) {
            console.error("Error creating new order:", error);
        }
    };

    const handleRemoveTab = async (tabId) => {
        const tabToRemove = tabs.find(tab => tab.id === tabId);
        if (!tabToRemove) return;

        confirmAlert({
            title: 'Xác nhận xóa', message: `Bạn có muốn Hủy hóa đơn chờ hiện tại ${tabToRemove.maHoaDon}?`, buttons: [{
                label: 'Yes', onClick: async () => {
                    try {
                        // Gọi API xóa hóa đơn
                        await axios.get(`http://localhost:8080/admin/hoa-don/delete/${tabId}`);

                        // Cập nhật danh sách tabs sau khi xóa thành công
                        const newTabs = tabs.filter(tab => tab.id !== tabId);
                        setTabs(newTabs);

                        // Nếu tab đang active bị xóa, chuyển active sang tab đầu tiên còn lại
                        if (activeTab === tabId) {
                            setActiveTab(newTabs.length > 0 ? newTabs[0].id : '');
                        }

                        // Hiển thị thông báo thành công bằng toast
                        toast.success(`Bạn đã xóa thành công Hóa đơn chờ có mã ${tabToRemove.maHoaDon}`, {
                            position: 'top-right', autoClose: 3000
                        });
                    } catch (error) {
                        console.error('Error deleting order:', error);
                        toast.error('Xóa hóa đơn thất bại! Vui lòng thử lại.');
                    }
                }
            }, {
                label: 'No', onClick: () => {
                }
            }]
        });
    };

    const scrollTabs = (direction) => {
        if (tabsRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            tabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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

    const filteredOrders = orders.filter(order => order.idHoaDon === activeTab);

    return (<div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Bán hàng tại quầy</h1>
        <div className="flex gap-4">
            <div className="w-[70%] bg-white p-4 rounded-lg shadow-md" style={{ height: '1000px' }}>
                <div className="flex justify-end items-center mb-4">
                    <button
                        onClick={handleAdd}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Tạo hóa đơn chờ
                    </button>
                </div>
                {warning && (<div className="mb-4 text-red-500">
                    {warning}
                </div>)}
                <hr />
                <div className="mb-4 flex items-center">
                    <button onClick={() => scrollTabs('left')} className="text-blue-500 hover:text-blue-700">
                        &lt;
                    </button>
                    <ul ref={tabsRef} className="flex border-b overflow-x-auto scrollbar-hide">
                        {tabs.map(tab => (<li key={tab.id}
                            className={`mr-1 flex items-center ${activeTab === tab.id ? 'border-blue-500' : ''}`}>
                            <button
                                className={`bg-white inline-block py-2 px-4 text-blue-500 ${activeTab === tab.id ? 'font-semibold' : ''}`}
                                onClick={() => setActiveTab(tab.id)}>
                                {tab.label}
                            </button>
                            <button className="ml-2 text-red-500" onClick={() => handleRemoveTab(tab.id)}>
                                &times;
                            </button>
                        </li>))}
                    </ul>
                    <button onClick={() => scrollTabs('right')} className="text-blue-500 hover:text-blue-700">
                        &gt;
                    </button>
                </div>
                {tabs.map(tab => (
                    <div key={tab.id} className={`tab-content ${activeTab === tab.id ? 'block' : 'hidden'}`}
                        style={{ height: '1000px', overflowY: 'auto' }}>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{tab.label}</h3>

                        </div>
                    </div>))}
            </div>
            <div className="w-[30%] bg-white p-4 rounded-lg shadow-md" style={{ height: '1000px' }}>
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
                    {tabs.map(tab => (
                        <div key={tab.id} className={`tab-content ${activeTab === tab.id ? 'block' : 'hidden'}`}>
                            <h3 className="text-lg font-semibold">{tab.label}</h3>
                            <p>Khách
                                hàng: {tab.khachHang ? `${tab.khachHang.hoTen}` : 'Chưa chọn'}</p>
                        </div>))}
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

                                console.log("Selected Voucher ID:", selectedVoucherId);
                                console.log("Found Voucher:", selectedVoucher);

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