import React, { useState, useEffect, useRef } from 'react';
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
    const tabsRef = useRef(null);

    useEffect(() => {
        // Fetch orders data from API
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/hoa-don/listHoaDon');
                const ordersData = response.data;
                setOrders(ordersData);

                // Create tabs from the orders data
                const newTabs = ordersData.map(order => ({
                    id: order.idHoaDon,
                    label: `Order ${order.maHoaDon}`,
                    maHoaDon: order.maHoaDon
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

        fetchOrders();
    }, []);

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
                khachHang: null,
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

            const response = await axios.post(
                "http://localhost:8080/admin/hoa-don/create",
                newOrder, // Send JSON body
                {
                    headers: {
                        "Content-Type": "application/json", // Ensure JSON format
                    },
                }
            );

            const createdOrder = response.data;
            const newTabId = createdOrder.idHoaDon;
            setTabs([...tabs, { id: newTabId, label: `Order ${createdOrder.maHoaDon}`, maHoaDon: createdOrder.maHoaDon }]);
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
            title: 'Xác nhận xóa',
            message: `Bạn có muốn Hủy hóa đơn chờ hiện tại ${tabToRemove.maHoaDon}?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
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
                                position: 'top-right',
                                autoClose: 3000
                            });
                        } catch (error) {
                            console.error('Error deleting order:', error);
                            toast.error('Xóa hóa đơn thất bại! Vui lòng thử lại.');
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    };

    const scrollTabs = (direction) => {
        if (tabsRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            tabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const filteredOrders = orders.filter(order => order.idHoaDon === activeTab);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Bán hàng tại quầy</h1>
            <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '1000px' }}>
                <div className="flex justify-end items-center mb-4">
                    <button
                        onClick={handleAdd}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Tạo hóa đơn chờ
                    </button>
                </div>
                {warning && (
                    <div className="mb-4 text-red-500">
                        {warning}
                    </div>
                )}
              
                <div className="mb-4 flex items-center">
                    <button onClick={() => scrollTabs('left')} className="text-blue-500 hover:text-blue-700">
                        &lt;
                    </button>
                    <ul ref={tabsRef} className="flex border-b overflow-x-auto scrollbar-hide">
                        {tabs.map(tab => (
                            <li key={tab.id} className={`mr-1 flex items-center ${activeTab === tab.id ? 'border-blue-500' : ''}`}>
                                <button
                                    className={`bg-white inline-block py-2 px-4 text-blue-500 ${activeTab === tab.id ? 'font-semibold' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}>
                                    {tab.label}
                                </button>
                                <button
                                    className="ml-2 text-red-500"
                                    onClick={() => handleRemoveTab(tab.id)}>
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => scrollTabs('right')} className="text-blue-500 hover:text-blue-700">
                        &gt;
                    </button>
                </div>
                {tabs.map(tab => (
                    <div key={tab.id} className={`tab-content ${activeTab === tab.id ? 'block' : 'hidden'}`} style={{ height: '1000px', overflowY: 'auto' }}>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{tab.label}</h3>
                            <p>Content for {tab.label} tab panel.</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}