import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from "../../../components/Alert";
import Notification from '../../../components/Notification';
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
    TablePagination,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { Trash, Ticket, Search } from "lucide-react";
import CloseIcon from '@mui/icons-material/Close';
import { Add, Remove } from '@mui/icons-material';
import DetailsPayment from "./DetailsPayment";
import { hasPermission } from '../../../security/DecodeJWT';
import api from '../../../security/Axios';
import DetailPaymentsV2 from './DetailsPaymentV2';
import { DataGrid } from '@mui/x-data-grid';

const vietnameseLocaleText = {
    noRowsLabel: 'Không có dữ liệu',
    columnMenuLabel: 'Menu',
    columnMenuShowColumns: 'Hiển thị cột',
    columnMenuFilter: 'Bộ lọc',
    columnMenuHideColumn: 'Ẩn cột',
    columnMenuUnsort: 'Bỏ sắp xếp',
    columnMenuSortAsc: 'Sắp xếp tăng dần',
    columnMenuSortDesc: 'Sắp xếp giảm dần',
    footerRowsPerPage: 'Số hàng mỗi trang:',
    MuiTablePagination: {
        labelRowsPerPage: 'Số hàng mỗi trang:',
        labelDisplayedRows: ({ from, to, count }) => `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
    }
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function Orders() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token") || "";

    useEffect(() => {
        if (localStorage.getItem("token")) {
            if (!hasPermission("ADMIN") && !hasPermission("STAFF")) {
                navigate("/admin/login");
            }
        }
    }, [navigate]);

    useEffect(() => {
        if (location.state && location.state.message) {
            Notification(location.state.message, location.state.type)

        }
    }, [location.state]);

    const [orders, setOrders] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [activeTab, setActiveTab] = useState(0); // Set the default active tab index
    const [orderItemsByTab, setOrderItemsByTab] = useState({}); // Thêm state này
    const [orderId, setOrderId] = useState(-1);

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const [tabId, setTabId] = useState(0);

    const [hoverBadge, setHoverBadge] = useState(false);

    // phần chọn sản phẩm
    const [openDialog, setOpenDialog] = useState(false);
    const [productDetails, setProductDetails] = useState([]);
    const [openSelectQuantity, setOpenSelectQuantity] = useState(false);
    const [productDetailSelected, setProductDetailSelected] = useState(null);
    const [invoiceId, setInvoiceId] = useState([]);
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const [isFirstLoad, setIsFirstLoad] = useState(true); // Thêm state này

    //  Tong tien
    const [total, setTotal] = useState(0);

    // Thêm hàm lọc dữ liệu
    const filteredProducts = productDetails.filter((item) => {
        if (!item.trangThai || item.giaDuocTinh || Number(item.soLuong) <= 0) return false;
        return true;
    });

    // Thêm state cho search
    const [searchText, setSearchText] = useState('');

    // Thêm các state cho combobox
    const [shoeCollars, setShoeCollars] = useState([]);
    const [shoeSoles, setShoeSoles] = useState([]);
    const [shoeToes, setShoeToes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [brands, setBrands] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);

    // State cho giá trị được chọn
    const [selectedShoeCollar, setSelectedShoeCollar] = useState(null);
    const [selectedShoeSole, setSelectedShoeSole] = useState(null);
    const [selectedShoeToe, setSelectedShoeToe] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Định nghĩa columns cho DataGrid
    const columns = [
        {
            field: 'sanPham',
            headerName: 'Sản phẩm',
            flex: 1,
            minWidth: 250,
            renderCell: (params) => (
                <div className='flex items-center gap-2'>
                    <img
                        src={params.row.lienKet}
                        alt={params.row.sanPham}
                        className='w-10 h-10 object-cover rounded-md'
                    />
                    <span className='font-medium text-sm'>{params.row.sanPham}</span>
                </div>
            ),
        },
        {
            field: 'sp',
            headerName: 'Màu sắc/Kích cỡ',
            flex: 0.8,
            minWidth: 120,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span
                        style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: params.row.mauSac,
                            border: '1px solid #ddd'
                        }}
                    />
                    <span className='text-gray-600 text-sm'>
                        {params.row.mauSac} / {params.row.kichCo}
                    </span>
                </Box>
            ),
        },
        {
            field: 'thongTinSanPham',
            headerName: 'Thông tin sản phẩm',
            flex: 2,
            minWidth: 300,
            renderCell: (params) => (
                <span className='text-gray-600 text-sm'>
                    {`${params.row.coGiay}, ${params.row.muiGiay}, ${params.row.deGiay}, ${params.row.thuongHieu}, ${params.row.chatLieu}, ${params.row.nhaCungCap}, ${params.row.danhMucSanPham}`}
                </span>
            ),
        },
        {
            field: 'giaSauGiam',
            headerName: 'Giá',
            flex: 0.8,
            minWidth: 120,
            renderCell: (params) => (
                <div className="flex flex-col">
                    {Number(params.row.giaSauGiam) !== Number(params.row.gia) ? (
                        <div className="flex flex-col">
                            <span className='font-medium text-red-500 text-sm'>
                                {params.row.giaSauGiam.toLocaleString()} đ
                            </span>
                            <span className="line-through text-[#929292] text-xs">
                                {params.row.gia.toLocaleString()} đ
                            </span>
                        </div>
                    ) : (
                        <span className='font-medium text-sm'>
                            {params.row.gia.toLocaleString()} đ
                        </span>
                    )}
                </div>
            ),
        },
        {
            field: 'soLuong',
            headerName: 'Số lượng',
            flex: 0.6,
            minWidth: 100,
            renderCell: (params) => (
                <span className='font-medium text-sm'>
                    {params.row.soLuong}
                </span>
            ),
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            flex: 0.6,
            minWidth: 100,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpenSelectQuantity(params.row)}
                    className='bg-blue-500 hover:bg-blue-600 text-sm'
                >
                    Chọn
                </Button>
            ),
        },
    ];

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/admin/hoa-don/hd-ban-hang'); // filepath: f:\feat(orders)\DuAnTotNghiep\Frontend\cenndiii-shop\src\Admin\pages\Orders.jsx
                const ordersData = response.data;
                setOrders(ordersData);

                // Create tabs from the orders data
                const newTabs = ordersData.map((order) => ({
                    id: order.idHoaDon,
                    label: `${order.maHoaDon}`,
                    maHoaDon: order.maHoaDon,
                    content: `Hóa đơn ${order.maHoaDon}` // Mỗi tab sẽ có một nội dung riêng
                }));
                setTabs(newTabs);

            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();

        const dataProduct = async () => {
            try {
                const response = await api.get("/admin/chi-tiet-san-pham/dot-giam/hien-thi/-1"); // filepath: f:\feat(orders)\DuAnTotNghiep\Frontend\cenndiii-shop\src\Admin\pages\Orders.jsx
                setProductDetails(response.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };
        dataProduct();

    }, []);

    useEffect(() => {
        if (orders.length > 0 && isFirstLoad) {
            getProductFromDetailsInvoice(orders[0].idHoaDon);
            setOrderId(orders[0].idHoaDon)
            setInvoiceId(orders[0]);
            setIsFirstLoad(false); // Đánh dấu lần đầu tiên đã hoàn thành
        }
    }, [orders, isFirstLoad]);

    const getProductFromDetailsInvoice = async (idHoaDon) => {

        try {
            const response = await api.get(`/admin/hdct/get-cart/${idHoaDon}`);
            setOrderItemsByTab(response.data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const handleAdd = async () => {
        if (tabs.length >= 10) {
            Notification('Bạn chỉ có thể tạo tối đa 10 hóa đơn chờ.', "error");
            return;
        }

        try {
            const response = await api.get("/admin/hoa-don/create");
            const createdOrder = response.data;
            const newTabId = createdOrder.idHoaDon;
            setTabs([...tabs, { id: newTabId, label: `${createdOrder.maHoaDon}`, maHoaDon: createdOrder.maHoaDon, content: `Hóa đơn ${createdOrder.maHoaDon}` }]);
            setActiveTab(tabs.length);
            setOrders([...orders, createdOrder]);
            setOrderId(newTabId);
            setInvoiceId(createdOrder);
            getProductFromDetailsInvoice(createdOrder.idHoaDon);

        } catch (error) {
            console.error("Error creating new order:", error);
        }
    };

    const handleAlertClose = (confirm) => {
        setOpenAlert(false);
        if (confirm) {
            handleRemoveTab();
        }
    }

    const handleOpenAlert = () => {
        setAlertMessage("Xác nhận xóa hóa đơn ?");
        setOpenAlert(true);
    }

    const handleRemoveTab = async () => {
        const tabToRemove = tabs.find(tab => tab.id === tabId);
        if (!tabToRemove) return;

        try {
            const response = await api.get(`/admin/hoa-don/delete/${tabId}`);


            // Sau khi xóa, cập nhật lại danh sách orders và tabs
            const updatedOrders = orders.filter(order => order.idHoaDon !== tabId);
            setOrders(updatedOrders);

            const newTabs = updatedOrders.map((order, index) => ({
                id: order.idHoaDon,
                label: `${order.maHoaDon}`,
                maHoaDon: order.maHoaDon,
                content: `Hóa đơn ${order.maHoaDon}`
            }));
            setTabs(newTabs);
            setInvoiceId(updatedOrders[0])
            setActiveTab(0);
            setOrderId(updatedOrders[0].idHoaDon);
            getProductFromDetailsInvoice(updatedOrders[0].idHoaDon);

            if (response.status === 200) {
                Notification(`Bạn đã xóa thành công Hóa đơn chờ có mã ${tabToRemove.maHoaDon}`, "success");
            }
        } catch (error) {
            // console.log("Xóa hóa đơn thất bại! Vui lòng thử lại.", "error");
        }
    };


    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
        setOrderId(orders[newValue].idHoaDon)
        getProductFromDetailsInvoice(orders[newValue].idHoaDon)
        setInvoiceId(orders[newValue])
    };

    const handleOpenDialog = () => {
        if (!token) {
            console.error("Token không tồn tại.");
            window.location.href = "/login"; // Điều hướng về trang đăng nhập
            return;
        }
        api
            .get("/admin/chi-tiet-san-pham/dot-giam/hien-thi/-1")
            .then((response) => {
                setProductDetails(response.data);
            })
            .catch((error) => {
                console.error("Error fetching product details:", error);
            });

        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenSelectQuantity = (item) => {
        setProductDetailSelected(item);
        setSelectedQuantity(1);
        setOpenSelectQuantity(true);
    };

    const handleCloseSelectQuantity = () => {
        setOpenSelectQuantity(false);
    };

    const handleAddProduct = async () => {
        try {
            if (!productDetailSelected) {
                Notification("Vui lòng chọn sản phẩm để thêm!", "warning");
                return;
            }

            const requestData = {
                idHoaDon: orderId,
                idChiTietSanPham: productDetailSelected.idChiTietSanPham,
                soLuongMua: selectedQuantity,
                giaSauGiam: productDetailSelected.giaSauGiam
            };

            const response = await api.post(
                "/admin/chi-tiet-san-pham/them-sp",
                requestData

            );

            if (response.status === 200) {
                getProductFromDetailsInvoice(orderId);
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


    const handleRemoveOrderItem = async (idHdct, idCtsp) => {
        try {
            // const currentOrderItems = orderItemsByTab[activeTab] || [];

            const requestData = {
                idHoaDonChiTiet: idHdct,
                idChiTietSanPham: idCtsp
            };

            await api.post("/admin/chi-tiet-san-pham/xoa-sp", requestData);


            getProductFromDetailsInvoice(orderId)
        } catch (error) {
            console.log(error);
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
                await api.post("/admin/chi-tiet-san-pham/cap-nhat-sl", requestData);
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
                await api.post("/admin/chi-tiet-san-pham/sua-sp", requestData);
            } catch (error) {
                console.error("Error updating product quantity:", error);
                Notification("Đã có lỗi xảy ra khi cập nhật số lượng sản phẩm, vui lòng thử lại!", "error");
            }
        }
        getProductFromDetailsInvoice(orderId);

    };

    useEffect(() => {
        if (orderItemsByTab && orderItemsByTab.length > 0) {
            const totalAmount = orderItemsByTab.reduce((acc, item) => acc + item.thanhTien, 0);
            setTotal(totalAmount);
        } else {
            setTotal(0);
        }
    }, [orderItemsByTab]);

    const reloadTab = async () => {
        if (!token) {
            console.error("Token không tồn tại.");
            window.location.href = "/login"; // Điều hướng về trang đăng nhập
            return;
        }
        try {
            const response = await api.get('/admin/hoa-don/hd-ban-hang');
            const ordersData = response.data;
            setOrders(ordersData);

            const newTabs = ordersData.map((order) => ({
                id: order.idHoaDon,
                label: `${order.maHoaDon}`,
                maHoaDon: order.maHoaDon,
                content: `Hóa đơn ${order.maHoaDon}` // Mỗi tab sẽ có một nội dung riêng
            }));
            setTabs(newTabs);
            getProductFromDetailsInvoice(ordersData[0].idHoaDon);
            setActiveTab(0);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Thêm hàm filter
    const getFilteredRows = () => {
        let filtered = filteredProducts;

        // Lọc theo text search
        if (searchText) {
            filtered = filtered.filter((row) => {
                return Object.keys(row).some((field) => {
                    const value = row[field];
                    if (value == null) return false;
                    return value.toString().toLowerCase().includes(searchText.toLowerCase());
                });
            });
        }

        // Lọc theo các thuộc tính được chọn
        if (selectedShoeCollar) {
            filtered = filtered.filter(row => row.coGiay === selectedShoeCollar.ten);
        }
        if (selectedShoeSole) {
            filtered = filtered.filter(row => row.deGiay === selectedShoeSole.ten);
        }
        if (selectedShoeToe) {
            filtered = filtered.filter(row => row.muiGiay === selectedShoeToe.ten);
        }
        if (selectedMaterial) {
            filtered = filtered.filter(row => row.chatLieu === selectedMaterial.ten);
        }
        if (selectedBrand) {
            filtered = filtered.filter(row => row.thuongHieu === selectedBrand.ten);
        }
        if (selectedSupplier) {
            filtered = filtered.filter(row => row.nhaCungCap === selectedSupplier.ten);
        }
        if (selectedCategory) {
            filtered = filtered.filter(row => row.danhMucSanPham === selectedCategory.ten);
        }

        return filtered;
    };

    // Thêm useEffect để lấy dữ liệu cho combobox
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coGiayRes, deGiayRes, muiGiayRes, chatLieuRes, thuongHieuRes, nhaCungCapRes, danhMucRes] = await Promise.all([
                    api.get("/admin/co-giay/hien-thi/true"),
                    api.get("/admin/de-giay/hien-thi/true"),
                    api.get("/admin/mui-giay/hien-thi/true"),
                    api.get("/admin/chat-lieu/hien-thi/true"),
                    api.get("/admin/thuong-hieu/hien-thi/true"),
                    api.get("/admin/nha-cung-cap/hien-thi/true"),
                    api.get("/admin/danh-muc/hien-thi/true")
                ]);

                setShoeCollars(coGiayRes.data);
                setShoeSoles(deGiayRes.data);
                setShoeToes(muiGiayRes.data);
                setMaterials(chatLieuRes.data);
                setBrands(thuongHieuRes.data);
                setSuppliers(nhaCungCapRes.data);
                setCategories(danhMucRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-4 text-[10px]">
            <div className="bg-white p-4 rounded-lg shadow-md relative ">
                <Box sx={{ flexGrow: 1, maxWidth: 870, bgcolor: 'background.paper' }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                    >
                        {tabs.map((tab, index) => (
                            <Tab
                                key={index}
                                label={
                                    <Badge
                                        onMouseEnter={() => setHoverBadge(true)}
                                        onMouseLeave={() => setHoverBadge(false)}
                                        sx={{
                                            "& .MuiBadge-badge": {
                                                color: "black",
                                                fontSize: "10px",
                                                borderRadius: "50%",
                                                top: "-5px",
                                                right: "-5px",
                                                backgroundColor: "white",
                                                border: "black solid 1px"
                                            },
                                        }}
                                        badgeContent={hoverBadge ? (
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTabId(tab.id)
                                                    handleOpenAlert();
                                                }}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: 'red',
                                                    width: "6px",
                                                }}
                                            >
                                                x
                                            </div>
                                        ) : index + 1}
                                        color="secondary"
                                    >
                                        {tab.label}
                                    </Badge>
                                }
                            />
                        ))}
                    </Tabs>
                </Box>
                <div>
                    {tabs.length > 0 && tabs.map((tab, index) => (
                        <TabPanel value={activeTab} index={index} key={tab.id}>
                            <div className='flex justify-content-center gap-2'>
                                <div className="border rounded-md h-[600px] w-[66%]">
                                    <div className="p-2">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-left">{tab.content}</h2>
                                            <div className="flex gap-2">
                                                <button className="p-2 bg-green-600 text-white rounded-md">
                                                    Quét mã QR
                                                </button>
                                                <button
                                                    className="p-2 bg-blue-600 text-white rounded-md"
                                                    onClick={handleOpenDialog}
                                                >
                                                    Thêm sản phẩm
                                                </button>
                                            </div>
                                        </div>
                                        {/* Bảng hóa đơn */}
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
                                                                                {item.trangThai && (
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
                                                                                {item.trangThai ? (
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
                                                                                {item.trangThai && (
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
                                                                        <button
                                                                            onClick={() =>
                                                                                handleRemoveOrderItem(item.idHoaDonChiTiet, item.idChiTietSanPham)
                                                                            }
                                                                        >
                                                                            <Trash size={16} sx={{ width: "10px" }} className="text-red-600" />
                                                                        </button>
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
                                </div>
                                <div className='w-[33%]'>
                                    <DetailsPayment
                                        total={total}
                                        invoiceId={invoiceId}
                                        reloadTab={reloadTab}
                                        totalItem={orderItemsByTab}
                                    />
                                    {/* <DetailPaymentsV2
                                        invoiceId={invoiceId}
                                        reloadTab={reloadTab}
                                    /> */}
                                </div>
                            </div>
                        </TabPanel>
                    ))}
                </div>
                {hasPermission("ADMIN") || hasPermission("STAFF") ? (

                    <div className="top-7 right-10 absolute z-3">
                        <button
                            onClick={handleAdd}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            Tạo hóa đơn chờ
                        </button>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="xl"
                fullWidth
                PaperProps={{
                    sx: {
                        maxHeight: '90vh',
                        height: '90vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
            >
                <DialogTitle sx={{
                    p: 2,
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 className='text-xl font-semibold'>Danh sách sản phẩm</h2>
                    <IconButton
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'gray',
                            '&:hover': {
                                color: 'black',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, flex: 1, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Thêm thanh tìm kiếm */}
                        <div className="p-2 border-b">
                            <div className="grid grid-cols-4 gap-2 mb-2">
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search size={16} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchText && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setSearchText('')}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Cổ giày</InputLabel>
                                    <Select
                                        value={selectedShoeCollar || ''}
                                        onChange={(e) => setSelectedShoeCollar(e.target.value)}
                                        label="Cổ giày"
                                    >
                                        <MenuItem value={null}>Tất cả</MenuItem>
                                        {shoeCollars.map((item) => (
                                            <MenuItem key={item.idCoGiay} value={item}>
                                                {item.ten}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Đế giày</InputLabel>
                                    <Select
                                        value={selectedShoeSole || ''}
                                        onChange={(e) => setSelectedShoeSole(e.target.value)}
                                        label="Đế giày"
                                    >
                                        <MenuItem value={null}>Tất cả</MenuItem>
                                        {shoeSoles.map((item) => (
                                            <MenuItem key={item.idDeGiay} value={item}>
                                                {item.ten}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Mũi giày</InputLabel>
                                    <Select
                                        value={selectedShoeToe || ''}
                                        onChange={(e) => setSelectedShoeToe(e.target.value)}
                                        label="Mũi giày"
                                    >
                                        <MenuItem value={null}>Tất cả</MenuItem>
                                        {shoeToes.map((item) => (
                                            <MenuItem key={item.idMuiGiay} value={item}>
                                                {item.ten}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Chất liệu</InputLabel>
                                    <Select
                                        value={selectedMaterial || ''}
                                        onChange={(e) => setSelectedMaterial(e.target.value)}
                                        label="Chất liệu"
                                    >
                                        <MenuItem value={null}>Tất cả</MenuItem>
                                        {materials.map((item) => (
                                            <MenuItem key={item.idChatLieu} value={item}>
                                                {item.ten}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Thương hiệu</InputLabel>
                                    <Select
                                        value={selectedBrand || ''}
                                        onChange={(e) => setSelectedBrand(e.target.value)}
                                        label="Thương hiệu"
                                    >
                                        <MenuItem value={null}>Tất cả</MenuItem>
                                        {brands.map((item) => (
                                            <MenuItem key={item.idThuongHieu} value={item}>
                                                {item.ten}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Nhà cung cấp</InputLabel>
                                    <Select
                                        value={selectedSupplier || ''}
                                        onChange={(e) => setSelectedSupplier(e.target.value)}
                                        label="Nhà cung cấp"
                                    >
                                        <MenuItem value={null}>Tất cả</MenuItem>
                                        {suppliers.map((item) => (
                                            <MenuItem key={item.idNhaCungCap} value={item}>
                                                {item.ten}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl size="small" fullWidth>
                                    <InputLabel>Danh mục</InputLabel>
                                    <Select
                                        value={selectedCategory || ''}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        label="Danh mục"
                                    >
                                        <MenuItem value={null}>Tất cả</MenuItem>
                                        {categories.map((item) => (
                                            <MenuItem key={item.idDanhMuc} value={item}>
                                                {item.ten}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <DataGrid
                            getRowId={(row) => row.idChiTietSanPham}
                            rows={getFilteredRows()}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10, 25, 50]}
                            checkboxSelection={false}
                            disableSelectionOnClick
                            disableColumnSelector
                            disableColumnMenu
                            hideFooterSelectedRowCount
                            sx={{
                                '& .MuiDataGrid-cell:focus': {
                                    outline: 'none',
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#f5f5f5',
                                    fontWeight: 'bold',
                                },
                                '& .MuiDataGrid-virtualScroller': {
                                    overflow: 'auto',
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    borderTop: '1px solid #e0e0e0',
                                },
                                '& .MuiDataGrid-cell': {
                                    whiteSpace: 'normal',
                                    lineHeight: 'normal',
                                    padding: '8px',
                                },
                                '& .MuiDataGrid-columnHeader': {
                                    whiteSpace: 'normal',
                                    lineHeight: 'normal',
                                    padding: '8px',
                                },
                                '& .MuiDataGrid-main': {
                                    overflow: 'hidden',
                                },
                                '& .MuiDataGrid-virtualScrollerContent': {
                                    height: '100% !important',
                                    overflow: 'auto !important'
                                }
                            }}
                            localeText={vietnameseLocaleText}
                            style={{ height: 'calc(100vh - 250px)' }}
                        />
                    </div>
                </DialogContent>
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
            <Alert
                open={openAlert}
                message={alertMessage}
                onClose={handleAlertClose} />
        </div>
    );
}
