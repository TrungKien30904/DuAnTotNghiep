import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../components/Notification";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
const DeliveryForm = ({ total, orderItems, reloadTab }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [formData, setFormData] = useState({
        id: 0,
        maKhachHang: '',
        hoTen: '',
        gioiTinh: true,
        soDienThoai: '',
        email: '',
        matKhau: '',
        trangThai: true,
        provinceId: 0,
        districtId: 0,
        wardId: 0,
        addressDetails: "",
        addressMappers: [],
        image: "",
        imageBase64: ""
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [amount, setAmount] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [customers, setCustomers] = useState([]);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [lastTotal, setLastTotal] = useState(total);
    const [deliveryMethod, setDeliveryMethod] = useState("taiquay");
    const [paymentMethod, setPaymentMethod] = useState("tienmat");
    const [cashAmount, setCashAmount] = useState(0);
    const [transferAmount, setTransferAmount] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const [orders, setOrders] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [selectedVoucher, setSelectedVoucher] = useState('');
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const [bestVoucherApplied, setBestVoucherApplied] = useState(false);
    const [initialBestVoucherId, setInitialBestVoucherId] = useState(null);


    const headers = {
        token: "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
        "Content-Type": "application/json",
    };

    const navigate = useNavigate();
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(
                    "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
                    { headers }
                );
                if (Array.isArray(response.data.data)) {
                    setProvinces(response.data.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tỉnh:", error);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        if (deliveryMethod === "taiquay") {
            setLastTotal(total);
        } else {
            setLastTotal(total + Number(amount));
        }
    }, [total, amount, deliveryMethod]);

    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        setDistricts([]);
        setSelectedDistrict("");
        setWards([]);
        setSelectedWard("");
        setAmount("");
        try {
            const response = await axios.get(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
                {
                    headers,
                    params: { province_id: provinceId },
                }
            );

            if (Array.isArray(response.data.data)) {
                setDistricts(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách district:", error);
        }
    };

    const handleDistrictChange = async (e) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        setWards([]);
        setSelectedWard("");
        setAmount("");
        try {
            const response = await axios.get(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
                {
                    headers,
                    params: { district_id: districtId },
                }
            );

            if (Array.isArray(response.data.data)) {
                setWards(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ward:", error);
        }
    };

    const handleWardChange = (e) => {
        setSelectedWard(e.target.value);
    };

    useEffect(() => {
        if (selectedWard && selectedDistrict) {
            const requestData = {
                "service_id": 53321,
                "insurance_value": 500000,
                "coupon": null,
                "from_district_id": 1542,
                "to_district_id": Number(selectedDistrict),
                "to_ward_code": selectedWard,
                "height": 15,
                "length": 15,
                "weight": 1000,
                "width": 15
            };

            axios.post(
                "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                requestData,
                {
                    headers: {
                        token: "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
                        "shop_id": "5652920",
                        "Content-Type": "application/json"
                    }
                }
            )
                .then(response => {
                    if (response.data.data) {
                        setAmount(response.data.data.total);
                    } else {
                        setAmount(31000);
                    }
                })
                .catch(error => {
                    setAmount(31000);
                });
        }
    }, [selectedWard, selectedDistrict]);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/khach-hang');
            setCustomers(response.data);
            setShowCustomerModal(true);
        } catch (error) {
            console.error("Error fetching customers: ", error);
        }
    };

    const handleCustomerSelect = (customer) => {
        setFormData({
            ...formData,
            maKhachHang: customer.maKhachHang,
            hoTen: customer.hoTen,
            soDienThoai: customer.soDienThoai,
            email: customer.email,
        });
        setShowCustomerModal(false);
    };

    const onSubmit = async (data) => {

        if (!orderItems) {
            navigate("/orders", { state: { message: "Chưa chọn sản phẩm", type: "error" } });
            return;
        }
        if (paymentMethod === "cahai" && (Number(cashAmount) + Number(transferAmount) !== lastTotal)) {
            console.log(Number(cashAmount), Number(transferAmount), Number(discountAmount));
            console.log(lastTotal);

            navigate("/orders", { state: { message: "Tổng tiền chưa đủ", type: "error" } });
            return;
        }

        const requestData = {
            idHoaDon: orderItems.idHoaDon,
            maHoaDon: orderItems.maHoaDon,
            phieuGiamGia: null,
            khachHang: null,
            nhanVien: null,
            tongTien: lastTotal,
            tenNguoiNhan: deliveryMethod === "giaohang" ? data.hoten : null,
            soDienThoai: deliveryMethod === "giaohang" ? data.sodienthoai : null,
            email: deliveryMethod === "giaohang" ? data.email : null,
            ngayGiaoHang: null,
            phiVanChuyen: deliveryMethod === "giaohang" ? amount : null,
            trangThai: "Đã thanh toán",
            ngaySua: new Date().toISOString(),
            nguoiSua: null,
            loaiDon: deliveryMethod,
            hinhThucThanhToan: paymentMethod,
            tienMat: paymentMethod === "cahai" ? cashAmount : null,
            chuyenKhoan: paymentMethod === "cahai" ? transferAmount : null,
        };

        if (lastTotal <= 0) {
            navigate("/orders", { state: { message: "Chưa chọn sản phẩm", type: "error" } });
            return;
        }
        try {
            const response = await axios.post(
                'http://localhost:8080/admin/hoa-don/thanh-toan',
                requestData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                const fetchOrders = async () => {
                    try {
                        const response = await axios.get('http://localhost:8080/admin/hoa-don/listHoaDon');
                        const ordersData = response.data;
                        setOrders(ordersData);
        
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
                reloadTab(); // Gọi hàm reload tab sau khi thanh toán thành công
                navigate("/orders", { state: { message: "Thanh toán thành công", type: "success" } });
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            navigate("/orders", { state: { message: "Lỗi khi thanh toán", type: "error" } });
        }
    };

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
    useEffect(() => {
        const activeOrder = orders.find(o => o.idHoaDon === activeTab);
        if (activeOrder) {
            const tongTien = total;
            let discount = 0;
            if (activeOrder.voucher) {
                const voucher = activeOrder.voucher;
                if (voucher.hinhThuc === '%') {
                    discount = (tongTien * voucher.giaTri) / 100;
                    if (discount >= voucher.giaTriToiDa) {
                        discount = voucher.giaTriToiDa;
                    }
                } else if (voucher.hinhThuc === 'VNĐ') {
                    discount = voucher.giaTri;
                }
            }
            const finalTotal = Math.max(tongTien + Number(amount) - discount, 0); // Đảm bảo finalTotal không nhỏ hơn 0
            setLastTotal(finalTotal);
            setDiscountAmount(discount);
            setSelectedVoucher(activeOrder.voucher ? activeOrder.voucher.id.toString() : '');
        } else {
            setLastTotal(0);
            setDiscountAmount(0);
            setSelectedVoucher('');
        }
    }, [activeTab, orders, total, amount]);

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
        const lastTotal = order.tongTien || 0;
        const validVouchers = vouchers.filter(v => lastTotal >= v.dieuKien);
        if (validVouchers.length === 0) {
            return;
        }
        let bestVoucher = null;
        let maxDiscount = 0;
        validVouchers.forEach(voucher => {
            let discount = 0;
            if (voucher.hinhThuc === '%') {
                discount = (lastTotal * voucher.giaTri) / 100;
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

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
                maxWidth: "100%",
                margin: "auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
            }}
        >
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
            <div className="flex items-center gap-4 mb-4">
                <label>
                    <input
                        type="radio"
                        value="taiquay"
                        checked={deliveryMethod === "taiquay"}
                        onChange={() => {
                            setDeliveryMethod("taiquay")
                            setAmount(0)
                        }}
                    />
                    Tại quầy
                </label>
                <label>
                    <input
                        type="radio"
                        value="giaohang"
                        checked={deliveryMethod === "giaohang"}
                        onChange={() => setDeliveryMethod("giaohang")}
                    />
                    Giao hàng
                </label>
            </div>
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
                            const discountA = a.hinhThuc === '%' ? Math.min((lastTotal * a.giaTri) / 100, a.giaTriToiDa) : a.giaTri;
                            const discountB = b.hinhThuc === '%' ? Math.min((lastTotal * b.giaTri) / 100, b.giaTriToiDa) : b.giaTri;
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
            <div className="flex items-center justify-between w-full mt-4">
                <div>Hình thức thanh toán:</div>
                <div className="flex items-center gap-4">
                    <label>
                        <input
                            type="radio"
                            value="tienmat"
                            checked={paymentMethod === "tienmat"}
                            onChange={() => setPaymentMethod("tienmat")}
                        />
                        Tiền mặt
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="chuyenkhoan"
                            checked={paymentMethod === "chuyenkhoan"}
                            onChange={() => setPaymentMethod("chuyenkhoan")}
                        />
                        Chuyển khoản
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="cahai"
                            checked={paymentMethod === "cahai"}
                            onChange={() => setPaymentMethod("cahai")}
                        />
                        Cả hai
                    </label>
                </div>
            </div>
            {paymentMethod === "cahai" && (
                <div className="flex items-center gap-4 mt-4">
                    <div>
                        <label>Tiền mặt:</label>
                        <input
                            type="number"
                            value={cashAmount}
                            onChange={(e) => setCashAmount(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                        />
                    </div>
                    <div>
                        <label>Chuyển khoản:</label>
                        <input
                            type="number"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                        />
                    </div>
                </div>
            )}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {deliveryMethod === "giaohang" && (
                <>
                    {["hoten", "sodienthoai", "email", "diachi"].map((name) => (
                        <div key={name}>
                            <label>{name.charAt(0).toUpperCase() + name.slice(1)}:</label>
                            <input
                                {...register(name, { required: `Vui lòng nhập ${name}` })}
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                            />
                            {errors[name] && <p style={{ color: "red" }}>{errors[name].message}</p>}
                        </div>
                    ))}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {[{ label: "Tỉnh/Thành Phố", value: selectedProvince, onChange: handleProvinceChange, options: provinces, key: "ProvinceID", name: "ProvinceName" }, { label: "Quận/Huyện", value: selectedDistrict, onChange: handleDistrictChange, options: districts, key: "DistrictID", name: "DistrictName", disabled: !selectedProvince }, { label: "Xã/Phường", value: selectedWard, onChange: handleWardChange, options: wards, key: "WardCode", name: "WardName", disabled: !selectedDistrict }].map(({ label, value, onChange, options, key, name, disabled }) => (
                            <div key={label}>
                                <label>{label}:</label>
                                <select value={value} onChange={onChange} disabled={disabled} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}>
                                    <option value="">Chọn {label.toLowerCase()}</option>
                                    {options.map((option) => (
                                        <option key={option[key]} value={option[key]}>{option[name]}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                    <div>
                        <label>Ghi Chú:</label>
                        <textarea {...register('note')} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
                    </div>

                </>
            )}
            <div className="mt-4 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Tổng tiền:</span>
                        <span className="font-semibold text-gray-900">{total.toLocaleString()} đ</span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <label>Phí vận chuyển:</label>
                            <img
                                src="https://product.hstatic.net/1000405368/product/giao_hang_nhanh_toan_quoc_color.b7d18fe5_39425b03ee544ab2966d465756a00f89_small.png"
                                alt="Giao Hàng Nhanh"
                                className="w-24 h-12"
                            />
                        </div>

                        <div className="text-red-500">
                            <span className=""> + </span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="p-2 h-4 w-20 text-right border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Số tiền giảm:</span>
                        <span className="text-red-500 font-semibold">-{discountAmount.toLocaleString()} đ</span>
                    </div>
                    <hr className="border-t border-dashed border-gray-300" />
                    <div className="flex justify-between items-center mt-1">
                        <span className="font-semibold text-lg text-gray-800">Tổng tiền sau giảm:</span>
                        <span className="text-xl font-bold text-red-600">
                            {(lastTotal).toLocaleString()} đ
                        </span>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    width: "100%",
                }}
            >
                Thanh Toán
            </button>
            {/* <ToastContainer/> */}
        </form>
    );
};

export default DeliveryForm;