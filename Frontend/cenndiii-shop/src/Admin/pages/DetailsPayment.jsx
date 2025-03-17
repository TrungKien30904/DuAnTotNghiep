import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddCircleOutline, EditLocationAlt } from '@mui/icons-material';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
} from '@mui/material';
import CustomerDialog from "./AddCustomerDialog";
import Delivery from "./Delivery";

const DeliveryForm = ({ total, orderItems, reloadTab }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
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
    const [totalAmount, setTotalAmount] = useState(0);
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
    const [manualVoucherSelected, setManualVoucherSelected] = useState(false);
    const [originalVouchers, setOriginalVouchers] = useState([]);
    const [voucherSearched, setVoucherSearched] = useState(false);

    // dialog them kh
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
    const handleOpenCustomerDialog = () => {
        setOpenCustomerDialog(true);
    };

    const handleCloseCustomerDialog = () => {
        setOpenCustomerDialog(false);
    };
    // >


    const headers = {
        token: "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
        "Content-Type": "application/json",
    };

    // giao hang khach le

    const [openDeliveryForm, setOpenDeliveryForm] = useState(false);
    const [deliveryData, setDeliveryData] = useState([]);
    const handleShippingFeeUpdate = (confirm, data, error) => {
        if (error) {
            navigate("/admin/orders", { state: { message: error.message, type: error.type } });
            return;
        }
        if (confirm) {
            setDeliveryData(data);
            setAmount(data.amount)
        } else {
            setDeliveryData(data);
            setDeliveryMethod("taiquay")
        }
        setOpenDeliveryForm(false);
    };

    useEffect(() => {
        setLastTotal(calculateLastTotal(total, amount, discountAmount));
    }, [total, amount, discountAmount]);

    useEffect(() => {
        setFilteredVouchers(total > 0 ? originalVouchers.filter(v => total >= v.dieuKien) : originalVouchers);
    }, [total]);




    const onSubmit = async () => {
        if (!orderItems) {
            navigate("/admin/orders", { state: { message: "Chưa chọn sản phẩm", type: "error" } });
            return;
        }
        if (paymentMethod === "cahai" && (Number(cashAmount) + Number(transferAmount) !== lastTotal)) {
            navigate("/admin/orders", { state: { message: "Tổng tiền chưa đủ hoặc đang lớn hơn", type: "error" } });
            return;
        }
        const thanhToanHoaDon = [];
        if (paymentMethod === "tienmat") {
            thanhToanHoaDon.push({ hinhThucThanhToan: "tienmat", soTien: lastTotal });
        } else if (paymentMethod === "chuyenkhoan") {
            thanhToanHoaDon.push({ hinhThucThanhToan: "chuyenkhoan", soTien: lastTotal });
        } else if (paymentMethod === "cahai") {
            thanhToanHoaDon.push({ hinhThucThanhToan: "tienmat", soTien: cashAmount });
            thanhToanHoaDon.push({ hinhThucThanhToan: "chuyenkhoan", soTien: transferAmount });
        }

        const requestData = {
            idHoaDon: orderItems.idHoaDon,
            maHoaDon: orderItems.maHoaDon,
            khachHang: selectedCustomer?.idKhachHang ?? -1,
            tongTien: lastTotal,
            phiVanChuyen: deliveryMethod === "giaohang" ? amount : 0,
            trangThai: "Đã thanh toán",
            ngaySua: new Date().toISOString(),
            nguoiSua: null,
            loaiDon: deliveryMethod,
            thanhToanHoaDon: thanhToanHoaDon,
            tenNguoiNhan: deliveryMethod === "giaohang" ? (deliveryData?.hoTen || null) : null,
            soDienThoai: deliveryMethod === "giaohang" ? (deliveryData?.soDienThoai || null) : null,
            email: deliveryMethod === "giaohang" ? (deliveryData?.email || null) : null,
            ghiChu: deliveryMethod === "giaohang" ? (deliveryData?.ghiChu || "") : "",
            diaChi: selectedCustomer?.diaChi || deliveryData?.diaChi || "",
        };


        if (lastTotal <= 0) {
            navigate("/admin/orders", { state: { message: "Chưa chọn sản phẩm", type: "error" } });
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
                if (selectedVoucher) {
                    try {
                        await axios.patch(`http://localhost:8080/admin/phieu-giam-gia/tru-so-luong-pgg/${selectedVoucher}`);
                    } catch (voucherError) {
                        console.error("Lỗi khi cập nhật số lượng phiếu giảm giá:", voucherError);
                    }
                }
                const fetchOrders = async () => {
                    try {
                        const response = await axios.get('http://localhost:8080/admin/hoa-don/hd-ban-hang');
                        const ordersData = response.data;
                        setOrders(ordersData);
                    } catch (error) {
                        console.error('Error fetching orders:', error);
                    }
                };
                fetchOrders();
                reloadTab();
                navigate("/admin/orders", { state: { message: "Thanh toán thành công", type: "success" } });
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            navigate("/admin/orders", { state: { message: "Lỗi khi thanh toán", type: "error" } });
        }
    };
    useEffect(() => {
        const fetchPublicVouchers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/phieu-giam-gia/hien-thi-voucher', {
                    params: { khachHangId: null } // null => lấy phiếu công khai
                });

                const validVouchers = total > 0
                    ? response.data.filter(v => total >= v.dieuKien)
                    : response.data;

                setOriginalVouchers(validVouchers);
                setFilteredVouchers(validVouchers);

                const { bestVoucher, maxDiscount } = calculateBestVoucher(total + Number(amount), validVouchers);
                if (bestVoucher) {
                    setSelectedVoucher(bestVoucher.id);
                    setDiscountAmount(maxDiscount);
                    setLastTotal(calculateLastTotal(total, amount, maxDiscount));
                    setBestVoucherApplied(true);
                }
            } catch (error) {
                console.error("Lỗi khi lấy phiếu giảm giá công khai:", error);
            }
        };

        fetchPublicVouchers();
    }, []);
    useEffect(() => {
        // Nếu chưa chọn khách hàng thì tự động tính lại PGG tốt nhất
        if (total === 0) return;
        const selectedCustomer = getSelectedCustomer();
        if (!manualVoucherSelected && (!selectedCustomer || selectedCustomer?.idKhachHang === 0)) {
            const validVouchers = total > 0
                ? originalVouchers.filter(v => total >= v.dieuKien)
                : originalVouchers;

            setFilteredVouchers(validVouchers);

            const { bestVoucher, maxDiscount } = calculateBestVoucher(total + Number(amount), validVouchers);
            setSelectedVoucher(bestVoucher?.id || '');
            setDiscountAmount(maxDiscount);
            setLastTotal(calculateLastTotal(total, amount, maxDiscount));
            setBestVoucherApplied(true);
        }
    }, [total, amount]);




    //tính toán lại khi có sự thay đổi tổng tiền
    const calculateBestVoucher = (total, vouchers) => {
        let bestVoucher = null;
        let maxDiscount = 0;

        vouchers.forEach(voucher => {
            if (total >= voucher.dieuKien) {
                let discount = 0;
                if (voucher.hinhThuc === '%') {
                    discount = (total * voucher.giaTri) / 100;
                    if (discount > voucher.giaTriToiDa) discount = voucher.giaTriToiDa;
                } else if (voucher.hinhThuc === 'VNĐ') {
                    discount = voucher.giaTri;
                }

                if (discount > maxDiscount) {
                    maxDiscount = discount;
                    bestVoucher = voucher;
                }
            }
        });

        return { bestVoucher, maxDiscount };
    };

    useEffect(() => {
        const currentVoucher = filteredVouchers.find(v => v.id === selectedVoucher);

        if (manualVoucherSelected && currentVoucher) {
            // Đã chọn tay, kiểm tra xem voucher có còn hợp lệ với tổng tiền mới không
            if (total + Number(amount) < currentVoucher.dieuKien) {
                // Không còn hợp lệ => bỏ chọn và reset
                setSelectedVoucher('');
                setDiscountAmount(0);
                setManualVoucherSelected(false);
                setBestVoucherApplied(false);
            } else {
                // Còn hợp lệ => tính lại giảm giá theo voucher đang chọn
                let discount = 0;
                if (currentVoucher.hinhThuc === '%') {
                    discount = (total * currentVoucher.giaTri) / 100;
                    if (discount > currentVoucher.giaTriToiDa) {
                        discount = currentVoucher.giaTriToiDa;
                    }
                } else if (currentVoucher.hinhThuc === 'VNĐ') {
                    discount = currentVoucher.giaTri;
                }
                setDiscountAmount(discount);
                setLastTotal(total + Number(amount) - discount);
                setBestVoucherApplied(false); // Không phải tốt nhất do chọn tay
                return;
            }
        }

        // Nếu không chọn tay hoặc phiếu tay không hợp lệ, chọn lại phiếu tốt nhất
        const { bestVoucher, maxDiscount } = calculateBestVoucher(total + Number(amount), filteredVouchers);
        setSelectedVoucher(bestVoucher?.id || '');
        setDiscountAmount(maxDiscount);
        setLastTotal(total + Number(amount) - maxDiscount);
        setBestVoucherApplied(true);
    }, [total, amount, filteredVouchers]);



    const getProvinceName = async (provinceId) => {
        try {
            const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", { headers });
            const provinces = response.data.data || [];  // Nếu null thì trả về mảng rỗng
            const province = provinces.find(p => p.ProvinceID === Number(provinceId));  // Ép kiểu số
            return province ? province.ProvinceName : 'Không tìm thấy';
        } catch (error) {
            console.error("Lỗi khi lấy tỉnh:", error);
            return 'Lỗi API';
        }
    };


    const getDistrictName = async (districtId, provinceId) => {
        try {
            const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", {
                headers,
                params: { province_id: Number(provinceId) }  // Ép kiểu số
            });
            const districts = response.data.data || [];
            const district = districts.find(d => d.DistrictID === Number(districtId));
            return district ? district.DistrictName : 'Không tìm thấy';
        } catch (error) {
            console.error("Lỗi khi lấy quận/huyện:", error);
            return 'Lỗi API';
        }
    };


    const getWardName = async (wardId, districtId) => {
        try {
            const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", {
                headers,
                params: { district_id: Number(districtId) }  // Ép kiểu số
            });

            const wards = response.data.data || [];

            const ward = wards.find(w => w.WardCode == wardId);

            return ward ? ward.WardName : 'Không tìm thấy';
        } catch (error) {
            console.error("Lỗi khi lấy xã:", error);
            return 'Lỗi API';
        }
    };

    const calculateShippingFee = async () => {
        if (!selectedWard || !selectedDistrict) return;  // Kiểm tra địa chỉ đã chọn chưa

        const requestData = {
            "service_type_id": 2, // cái này
            "from_district_id": 1542,
            "from_ward_code": "1A0607",
            "to_district_id": Number(selectedDistrict),
            "to_ward_code": selectedWard,
            "length": 40,
            "width": 20,
            "height": 20,
            "weight": 2000,
            "insurance_value": 0,
            "coupon": null,
            "items": [
                {
                    "name": "TEST1",
                    "quantity": 1,
                    "length": 200,
                    "width": 200,
                    "height": 200,
                    "weight": 1000
                }
            ]
        }

        try {
            const response = await axios.post(
                "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                requestData,
                {
                    headers: {
                        "token": "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
                        "shop_id": 5652920,
                        "Content-Type": "application/json",
                    }
                }
            );
            if (response.status === 200) {
                setAmount(response.data.data.total);
            } else {
                setAmount(31000);  // Nếu API không trả về dữ liệu, mặc định 31k
            }
        } catch (error) {
            if (error.response) {
                console.error("Phản hồi lỗi từ API:", error.response.data);
            }
            setAmount(32000);
        }
    };

    useEffect(() => {
        if (customers.length > 0) {
            handleSelectCustomer(customers[0]);
        }
    }, [customers]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/hoa-don/hd-ban-hang');
                const ordersData = response.data;
                setOrders(ordersData);
                const newTabs = ordersData.map(order => ({
                    id: order.idHoaDon,
                    label: `Order ${order.maHoaDon}`,
                }));
                setTabs(newTabs);
                if (newTabs.length > 0) {
                    setActiveTab(newTabs[0].id);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/admin/khach-hang/hien-thi-customer');
                const customersData = response.data;

                // Định nghĩa khách hàng mặc định
                const defaultCustomer = {
                    idKhachHang: -1,
                    hoTen: 'Khách Lẻ',
                    soDienThoai: 'N/A',
                    diaChi: 'Không xác định'
                };

                const updatedCustomers = await Promise.all(customersData
                    .filter(c => c.idKhachHang !== 0)
                    .map(async (customer) => {
                        if (customer.diaChi && customer.diaChi.includes(',')) {
                            const [provinceId, districtId, wardId] = customer.diaChi.split(',').map(id => id.trim());
                            const provinceName = await getProvinceName(provinceId);
                            const districtName = await getDistrictName(districtId, provinceId);
                            const wardName = await getWardName(wardId, districtId);
                            return {
                                ...customer,
                                diaChi: `${wardName}, ${districtName}, ${provinceName}`,
                                idDiaChi: customer.diaChi
                            };
                        } else {
                            // Nếu diaChi bị null hoặc không hợp lệ, đặt giá trị mặc định
                            return { ...customer, diaChi: "Không xác định" };
                        }
                    })
                );

                setCustomers([defaultCustomer, ...updatedCustomers]);
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
            const tongTien = total || 0;
            setTotalAmount(tongTien);

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
                setDiscountAmount(discount);
                setSelectedVoucher(voucher.id ? voucher.id : '');
            } else {
                setDiscountAmount(0);
                setSelectedVoucher('');
            }

            const activeTabData = tabs.find(tab => tab.id === activeTab);
            const selectedCustomer = getSelectedCustomer();

            if (activeTabData && activeTabData.vouchers && selectedCustomer && selectedCustomer?.idKhachHang !== 0) {
                const filtered = activeTabData.vouchers.filter(v => tongTien >= v.dieuKien);
                setFilteredVouchers(filtered);
            }


            const finalTotal = Math.max(tongTien + Number(amount) - discount, 0);
            setLastTotal(finalTotal);
        } else {
            setTotalAmount(0);
            setLastTotal(0);
            setDiscountAmount(0);
            setSelectedVoucher('');
            setFilteredVouchers([]);
        }
    }, [activeTab, orders, total, amount]);


    const handleSelectCustomer = async (customer) => {
        const updatedTabs = tabs.map(tab => tab.id === activeTab ? { ...tab, khachHang: customer } : tab);
        setTabs(updatedTabs);

        // Lấy thông tin khách hàng được chọn hoặc mặc định là khách lẻ
        const selected = customer || customers.find(c => c.idKhachHang === 0);

        // Kiểm tra xem khách hàng có địa chỉ hợp lệ hay không
        if (customer.idKhachHang !== -1 && selected.idDiaChi && selected.idDiaChi.includes(',')) {
            const [province, district, ward] = selected.idDiaChi.split(',').map(id => id.trim());
            setSelectedDistrict(district);
            setSelectedWard(ward);
        } else {
            setSelectedDistrict(null);
            setSelectedWard(null);
        }

        setDiscountAmount(0);
        setSelectedVoucher('');
        setFilteredVouchers([]);
        setBestVoucherApplied(false);
        setManualVoucherSelected(false);
        setVoucherSearched(false);

        try {
            const khachHangId = selected?.idKhachHang !== 0 ? selected?.idKhachHang : null;
            const response = await axios.get('http://localhost:8080/admin/phieu-giam-gia/hien-thi-voucher', {
                params: { khachHangId }
            });

            // Lọc phiếu giảm giá hợp lệ theo tổng tiền đơn hàng
            const validVouchers = total > 0 ? response.data.filter(v => total >= v.dieuKien) : response.data;

            setOriginalVouchers(validVouchers);  // Lưu danh sách voucher gốc
            setFilteredVouchers(validVouchers);  // Hiển thị danh sách voucher đã lọc

            // Cập nhật vouchers cho tab hiện tại
            const updatedTabsWithVouchers = updatedTabs.map(tab => tab.id === activeTab ? {
                ...tab,
                vouchers: response.data
            } : tab);
            setTabs(updatedTabsWithVouchers);

            // Tìm hóa đơn tương ứng với tab hiện tại
            const activeOrder = orders.find(o => o.idHoaDon === activeTab);
            applyBestVoucher(activeOrder, response.data).then((bestDiscount) => {
                setLastTotal(calculateLastTotal(total, amount, bestDiscount));
            });

        } catch (error) {
            console.error('Lỗi khi lấy phiếu giảm giá:', error);
            setLastTotal(calculateLastTotal(total, amount, 0));
        }
    };

    const reload = async (newCustomer = null) => {
        try {
            const response = await axios.get('http://localhost:8080/admin/khach-hang/hien-thi-customer');
            const customersData = response.data;

            const defaultCustomer = {
                idKhachHang: 0,
                hoTen: 'Khách Lẻ',
                soDienThoai: 'N/A',
                diaChi: 'Không xác định'
            };

            const updatedCustomers = await Promise.all(customersData
                .filter(c => c.idKhachHang !== 0)
                .map(async (customer) => {
                    if (customer.diaChi && customer.diaChi.includes(',')) {
                        const [provinceId, districtId, wardId] = customer.diaChi.split(',').map(id => Number(id.trim()));
                        const provinceName = await getProvinceName(provinceId);
                        const districtName = await getDistrictName(districtId, provinceId);
                        const wardName = await getWardName(wardId, districtId);
                        return {
                            ...customer,
                            diaChi: `${wardName}, ${districtName}, ${provinceName}`
                        };
                    } else {
                        return { ...customer, diaChi: "Không xác định" };
                    }
                })
            );

            setCustomers([defaultCustomer, ...updatedCustomers]);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách khách hàng:', error);
        }
    };


    const calculateLastTotal = (totalAmount, deliveryFee, discount) => {
        return Math.max(totalAmount + Number(deliveryFee) - discount, 0);
    };



    const applyBestVoucher = async (order, vouchers) => {
        if (!order || !vouchers?.length) return 0;
        if (total <= 0) return 0;

        const totalAmount = total || 0;
        const validVouchers = vouchers.filter(v => totalAmount >= v.dieuKien);

        if (validVouchers.length === 0) return 0;

        let bestVoucher = null;
        let maxDiscount = 0;

        validVouchers.forEach(voucher => {
            let discount = 0;
            if (voucher.hinhThuc === '%') {
                discount = (totalAmount * voucher.giaTri) / 100;
                if (discount > voucher.giaTriToiDa) discount = voucher.giaTriToiDa;
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
                setSelectedVoucher(bestVoucher.id ? bestVoucher.id : '');
                setBestVoucherApplied(true);
                setInitialBestVoucherId(bestVoucher.id);
                return maxDiscount; // <-- Trả về giảm giá tốt nhất
            } catch (error) {
                console.error('Lỗi khi áp dụng voucher:', error);
                return 0; // Nếu lỗi thì không giảm
            }
        } else {

            return 0;
        }
    };


    const applySelectedVoucher = async (order, voucher) => {
        if (!order || !voucher) return;

        let discount = 0;
        if (total === 0) {
            return;
        }
        const totalAmount = total || 0;
        if (voucher.hinhThuc === '%') {
            discount = (totalAmount * voucher.giaTri) / 100;
            if (discount > voucher.giaTriToiDa) discount = voucher.giaTriToiDa;
        } else if (voucher.hinhThuc === 'VNĐ') {
            discount = voucher.giaTri;
        }

        try {
            await axios.put(`http://localhost:8080/admin/hoa-don/update-voucher/${order.idHoaDon}`, {
                voucherId: voucher.id
            });

            const updatedOrder = { ...order, voucher, discountAmount: discount };
            const updatedOrders = orders.map(o => o.idHoaDon === order.idHoaDon ? updatedOrder : o);
            setOrders(updatedOrders);
            setDiscountAmount(discount);
            setLastTotal(calculateLastTotal(total, amount, discount));
            setSelectedVoucher(voucher.id);

            // Tính lại phiếu tốt nhất hiện tại
            const { bestVoucher } = calculateBestVoucher(total + Number(amount), filteredVouchers);

            // So sánh phiếu được chọn với phiếu tốt nhất hiện tại
            if (voucher.id === bestVoucher?.id) {
                setBestVoucherApplied(true); // Hiện lại dòng chữ
                setManualVoucherSelected(false); // Vì chọn lại đúng auto voucher
            } else {
                setBestVoucherApplied(false); // Ẩn dòng chữ vì chọn tay
                setManualVoucherSelected(true);  // Xác nhận chọn tay
            }

        } catch (error) {
            console.error('Lỗi khi áp dụng voucher:', error);
        }
    };



    //Tìm pgg

    const searchVoucher = (keyword) => {
        const cleanedKeyword = keyword.trim().toLowerCase().replace(/\s+/g, '');

        // Nếu xóa hết, reset về danh sách gốc
        if (cleanedKeyword === '') {
            setFilteredVouchers(originalVouchers.filter(v => total >= v.dieuKien));
            setVoucherSearched(false);  // Không phải đang tìm nữa
            setManualVoucherSelected(false); // Reset chọn tay vì quay về auto tốt nhất
            applyBestVoucher(orders.find(o => o.idHoaDon === activeTab), originalVouchers); // Áp lại voucher tốt nhất
            return;
        }

        // Nếu đủ 9 ký tự mới thực hiện tìm kiếm theo yêu cầu
        if (cleanedKeyword.length === 9) {
            const filtered = originalVouchers.filter(v =>
                v.maKhuyenMai.toLowerCase().replace(/\s+/g, '').includes(cleanedKeyword) && total >= v.dieuKien
            );

            setFilteredVouchers(filtered);
            setVoucherSearched(filtered.length > 0);

            if (filtered.length === 0) {
                toast.warn("Không có phiếu giảm giá hoặc chưa đủ điều kiện áp dụng");
            }
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
        <div>
            <div
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
                    <div className="flex justify-content-center mb-4 gap-2">
                        <select className="border p-2 rounded w-full h-8" onChange={(e) => {
                            const selected = customers.find(c => c.idKhachHang === parseInt(e.target.value));
                            handleSelectCustomer(selected || customers.find(c => c.idKhachHang === 0));
                            if (selected?.idKhachHang != -1) {
                                setDeliveryData(null);
                                calculateShippingFee();
                            } else {
                                setDeliveryMethod("taiquay")
                                setAmount(0);
                            }
                        }}
                                value={selectedCustomer ? selectedCustomer?.idKhachHang : ''}
                        >
                            {customers.map(customer => (
                                <option key={customer?.idKhachHang} value={customer?.idKhachHang}>
                                    {customer?.hoTen} - {customer?.soDienThoai}
                                </option>))}
                        </select>

                        <div className="relative w-48 h-8">
                            <AddCircleOutline fontSize="small" className="absolute top-1.5 left-1" />
                            <button
                                onClick={handleOpenCustomerDialog}
                                className="w-full h-8 border border-black rounded-md align-middle ps-4"
                            >
                                Thêm khách
                            </button>
                        </div>
                    </div>
                    {selectedCustomer && selectedCustomer.diaChi && (
                        <div className="relative">
                            <input className="mt-2 text-gray-600 w-full p-2 border rounded "
                                   readOnly
                                   value={selectedCustomer.diaChi}
                            />
                            <button className="absolute right-2 bottom-1.5">
                                <EditLocationAlt />
                            </button>
                        </div>
                    )}
                </div>

                <label>
                    <input
                        type="radio"
                        value="taiquay"
                        checked={deliveryMethod === "taiquay"}
                        readOnly
                        onClick={() => {
                            setDeliveryMethod("taiquay");
                            setAmount(0);  // Tại quầy thì không có phí ship
                        }}
                    />
                    Tại quầy
                </label>

                <label>
                    <input
                        type="radio"
                        value="giaohang"
                        checked={deliveryMethod === "giaohang"}
                        readOnly
                        onClick={() => {
                            setDeliveryMethod("giaohang");
                            if (selectedCustomer?.idKhachHang != -1) {
                                calculateShippingFee();
                            } else {
                                setOpenDeliveryForm(true);
                            }
                        }}
                    />
                    Giao Hàng
                </label>


                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Hãy nhập mã phiếu có 9 ký tự"
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
                            setManualVoucherSelected(true); // Đánh dấu là người dùng chọn tay

                            if (selectedVoucher && activeOrder) {
                                applySelectedVoucher(activeOrder, selectedVoucher);
                            }
                        }}
                    >
                        {getTabVouchers()
                            .sort((a, b) => {
                                const calculateDiscount = (voucher, total) => {
                                    if (voucher.hinhThuc === '%') {
                                        const discount = (total * voucher.giaTri) / 100;
                                        return Math.min(discount, voucher.giaTriToiDa);
                                    } else if (voucher.hinhThuc === 'VNĐ') {
                                        return voucher.giaTri;
                                    }
                                    return 0;
                                };

                                const discountA = calculateDiscount(a, lastTotal);
                                const discountB = calculateDiscount(b, lastTotal);
                                return discountB - discountA;
                            })
                            .map((voucher) => (
                                <option key={voucher.id} value={voucher.id}>
                                    {voucher.maKhuyenMai} - {voucher.giaTri.toLocaleString({ style: 'currency', currency: 'VND' })} {voucher.hinhThuc}
                                    {voucher.hinhThuc === '%' && ` - Tối đa ${voucher.giaTriToiDa.toLocaleString({ style: 'currency', currency: 'VND' })} VNĐ`}
                                </option>
                            ))
                        }
                    </select>) : (<p className="text-red-500">Không có phiếu giảm giá phù hợp.</p>)}
                    {getTabVouchers().length > 0 && bestVoucherApplied && !voucherSearched && total > 0 && (
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
                                <span className="text-red-500"> đ </span>
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
                    type="button"
                    onClick={handleSubmit(onSubmit)}
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
            </div>
            <CustomerDialog
                open={openCustomerDialog}
                onClose={() => setOpenCustomerDialog(false)}
                reload={(newCustomer) => reload(newCustomer)}
            />
            <Delivery
                open={openDeliveryForm}
                onClose={() => setOpenDeliveryForm(false)}
                onShippingFeeUpdate={handleShippingFeeUpdate}
            />
        </div>
    );
};

export default DeliveryForm;