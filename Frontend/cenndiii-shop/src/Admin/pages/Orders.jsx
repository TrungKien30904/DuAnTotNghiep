import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from "../components/Alert";
import Notification from "../components/Notification";
import { ToastContainer } from 'react-toastify';
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
} from "@mui/material";
import { Trash, Ticket } from "lucide-react";
import { Add, Remove } from '@mui/icons-material';
import DetailsPayment from "./DetailsPayment";
import { hasPermission } from '../../security/DecodeJWT';
import api from '../../security/Axios';

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
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
    useEffect(() => {
        if (!hasPermission("ADMIN") && !hasPermission("STAFF")) {
            navigate("/login");
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
    const [orderItems, setOrderItems] = useState([]);
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const [isFirstLoad, setIsFirstLoad] = useState(true); // Thêm state này

    //  Tong tien
    const [total, setTotal] = useState(0);


    useEffect(() => {
        if (!token) {
            console.error("Token không tồn tại.");
            window.location.href = "/login"; // Điều hướng về trang đăng nhập
            return;
        }
    
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
            setOrderItems(orders[0]);
            setIsFirstLoad(false); // Đánh dấu lần đầu tiên đã hoàn thành
        }
    }, [orders, isFirstLoad]);

    const getProductFromDetailsInvoice = async (idHoaDon) => {
        if (!token) {
            console.error("Token không tồn tại.");
            window.location.href = "/login"; // Điều hướng về trang đăng nhập
            return;
        }
    
        try {
            const response = await api.get(`/admin/hdct/get-cart/${idHoaDon}`); // filepath: f:\feat(orders)\DuAnTotNghiep\Frontend\cenndiii-shop\src\Admin\pages\Orders.jsx
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
            const response = await api.post("/admin/hoa-don/create", {}, { headers }); // filepath: f:\feat(orders)\DuAnTotNghiep\Frontend\cenndiii-shop\src\Admin\pages\Orders.jsx
            const createdOrder = response.data;
            const newTabId = createdOrder.idHoaDon;
            setTabs([...tabs, { id: newTabId, label: `${createdOrder.maHoaDon}`, maHoaDon: createdOrder.maHoaDon, content: `Hóa đơn ${createdOrder.maHoaDon}` }]);
            setActiveTab(tabs.length);
            setOrders([...orders, createdOrder]);
            setOrderId(newTabId);
            setOrderItems(createdOrder);
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
            await axios.get(`http://localhost:8080/admin/hoa-don/delete/${tabId}`,{headers});

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
            setOrderItems(updatedOrders[0])
            setActiveTab(0);
            setOrderId(updatedOrders[0].idHoaDon);
            getProductFromDetailsInvoice(updatedOrders[0].idHoaDon);

            Notification(`Bạn đã xóa thành công Hóa đơn chờ có mã ${tabToRemove.maHoaDon}`, "success");
        } catch (error) {
            Notification("Xóa hóa đơn thất bại! Vui lòng thử lại.", "error");
        }
    };


    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
        setOrderId(orders[newValue].idHoaDon)
        getProductFromDetailsInvoice(orders[newValue].idHoaDon)
        setOrderItems(orders[newValue])
    };

    const handleOpenDialog = () => {
        if (!token) {
            console.error("Token không tồn tại.");
            window.location.href = "/login"; // Điều hướng về trang đăng nhập
            return;
        }
        axios
            .get("http://localhost:8080/admin/chi-tiet-san-pham/dot-giam/hien-thi/-1",{headers})
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

            const response = await axios.post(
                `http://localhost:8080/admin/chi-tiet-san-pham/them-sp`,
                requestData,{headers}
            );

            if (response.status === 200) {
                getProductFromDetailsInvoice(orderId)
                Notification(`Sản phẩm ${productDetailSelected.sanPham} đã được thêm thành công!`, "success");
                axios
                    .get("http://localhost:8080/admin/chi-tiet-san-pham/dot-giam/hien-thi/-1",{headers})
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

            await axios.post(
                `http://localhost:8080/admin/chi-tiet-san-pham/xoa-sp`,
                requestData,
                {headers}
            );

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
                // console.log(newQuantity);
                await axios.post(
                    `http://localhost:8080/admin/chi-tiet-san-pham/cap-nhat-sl`,
                    requestData,
                    {headers}
                );
                getProductFromDetailsInvoice(orderId);

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
                // console.log(newQuantity);
                await axios.post(
                    `http://localhost:8080/admin/chi-tiet-san-pham/sua-sp`,
                    requestData,
                    {headers}
                );
                getProductFromDetailsInvoice(orderId);

            } catch (error) {
                console.error("Error updating product quantity:", error);
                Notification("Đã có lỗi xảy ra khi cập nhật số lượng sản phẩm, vui lòng thử lại!", "error");
            }
        }

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
            getProductFromDetailsInvoice(ordersData[0].idHoaDon);
            setActiveTab(0);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <div className="p-4 text-xs">
            <nav className="text-gray-500 mb-4">
                <span className="cursor-pointer hover:underline" onClick={() => navigate("/admin/dashboard")}>Thống kê</span>{" "} &gt;{" "}
                <span className="font-semibold text-black">Bán hàng</span>
            </nav>

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
                                <div className="border rounded-md h-[700px] w-3/5">
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
                                            <TableContainer component={Paper}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            {/* <TableCell align="center">Ảnh</TableCell> */}
                                                            <TableCell align="center">Sản phẩm</TableCell>
                                                            <TableCell align="center">Số lượng</TableCell>
                                                            <TableCell align="center">Kho</TableCell>
                                                            <TableCell align="center">Giá hiện tại</TableCell>
                                                            <TableCell align="center">Giá được tính</TableCell>
                                                            <TableCell align="center">Tổng</TableCell>
                                                            <TableCell align="center">Hành động</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {orderItemsByTab && orderItemsByTab.length > 0 ? (
                                                            orderItemsByTab.map((item, index) => (
                                                                <TableRow key={item.idHoaDonChiTiet} className='relative'>
                                                                    <TableCell align="center">
                                                                        <div className='flex justify-content-center '>
                                                                            <div>
                                                                                <img
                                                                                    src={item.lienKet}
                                                                                    alt={item.tenSanPham}
                                                                                    className={`w-12 h-12 object-cover inset-0 rounded-md inline-block`}
                                                                                />
                                                                            </div>
                                                                            <div className='ms-1'>
                                                                                {item.tenSanPham}
                                                                            </div>

                                                                        </div>

                                                                    </TableCell>
                                                                    {/* <TableCell align="center">{item.tenSanPham}</TableCell> */}
                                                                    <TableCell align="center">
                                                                        {item.trangThai && (
                                                                            <button onClick={() => {
                                                                                if (Number(item.soLuongMua) > 1) {
                                                                                    handleQuantityChange(item.idHoaDonChiTiet, item.idChiTietSanPham, "tru", item.giaDuocTinh)
                                                                                } else {
                                                                                    Notification("Đã là số lượng nhỏ nhất !", "warning")
                                                                                    return;
                                                                                }
                                                                            }
                                                                            }>
                                                                                <Remove sx={{ fontSize: 15 }} />
                                                                            </button>
                                                                        )}

                                                                        {item.trangThai ? (
                                                                            <input
                                                                                type="number"
                                                                                value={item.soLuongMua}
                                                                                onChange={(e) => {
                                                                                    if (e.target.value > 0 && e.target.value <= (item.soLuongMua + item.kho)) {
                                                                                        if ((e.target.value - item.soLuongMua) <= item.kho) {
                                                                                            handleQuantityChange(item.idHoaDonChiTiet, item.idChiTietSanPham, e.target.value, item.giaDuocTinh)
                                                                                        }
                                                                                    } else {
                                                                                        Notification("Chọn số lượng hợp lệ", "error")
                                                                                        return;
                                                                                    }
                                                                                }}
                                                                                className='text-center w-8'
                                                                            />
                                                                        ) : (
                                                                            <span>{item.soLuongMua}</span>
                                                                        )}
                                                                        {item.trangThai && (
                                                                            <button onClick={() => {
                                                                                if (item.kho > 0) {
                                                                                    if (!item.giaDuocTinh) {
                                                                                        handleQuantityChange(item.idHoaDonChiTiet, item.idChiTietSanPham, "cong", item.giaDuocTinh)
                                                                                    } else {
                                                                                        Notification("Sản phẩm đã thay đổi giá chỉ có thể mua hoặc trả lại!", "warning")
                                                                                    }
                                                                                } else {
                                                                                    Notification("Đã hết hàng trong kho!", "warning")
                                                                                    return;
                                                                                }
                                                                            }}>
                                                                                <Add sx={{ fontSize: 15 }} />
                                                                            </button>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell align="center">{item.kho}</TableCell>
                                                                    <TableCell align="center">{item.donGia.toLocaleString()} đ</TableCell>
                                                                    <TableCell align="center">{(item.giaDuocTinh ?? item.donGia).toLocaleString()} đ</TableCell>
                                                                    <TableCell align="center">{item.thanhTien.toLocaleString()} đ</TableCell>
                                                                    <TableCell align="center">
                                                                        <Button
                                                                            onClick={() => handleRemoveOrderItem(item.idHoaDonChiTiet, item.idChiTietSanPham)}
                                                                        >
                                                                            <Trash size={16} className="text-red-600" />
                                                                        </Button>
                                                                    </TableCell>
                                                                    {!item.trangThai ? (
                                                                        <p className='text-red-500 absolute bottom-0 left-10 w-[500px]'>*Sản phẩm đã ngừng hoạt động! Chỉ có thể trả lại hoặc thanh toán !</p>
                                                                    ) : (
                                                                        item.giaDuocTinh && (
                                                                            <p className='text-red-500 absolute bottom-0 left-10 w-[500px]'>*Sản phẩm có sự thay đổi về giá !</p>
                                                                        )
                                                                    )}
                                                                </TableRow>
                                                            ))) : (
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
                                <div className='w-2/5'>
                                    <DetailsPayment
                                        total={total}
                                        orderItems={orderItems}
                                        reloadTab={reloadTab}
                                    />
                                </div>
                            </div>
                        </TabPanel>
                    ))}
                </div>
                <div className="top-0 right-0 absolute z-3">
                    <button
                        onClick={handleAdd}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                        Tạo hóa đơn chờ
                    </button>
                </div>
            </div>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="xl"
                fullWidth
            >
                <DialogTitle>Danh sách sản phẩm</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ảnh</TableCell>
                                    <TableCell>Sản phẩm</TableCell>
                                    <TableCell>Mã</TableCell>
                                    <TableCell>Cổ giày</TableCell>
                                    <TableCell>Mũi giày</TableCell>
                                    <TableCell>Thương hiệu</TableCell>
                                    <TableCell>Chất liệu</TableCell>
                                    <TableCell>Nhà cung cấp</TableCell>
                                    <TableCell>Danh mục sản phẩm</TableCell>
                                    <TableCell>Giá</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productDetails && productDetails.length > 0 ? (
                                    productDetails.map((item) => (
                                        item.trangThai && (
                                            !item.giaDuocTinh && (
                                                Number(item.soLuong) > 0 && (
                                                    <TableRow key={item.idChiTietSanPham}>
                                                        <TableCell className="relative">
                                                            {/* {item.listAnh.map((anh, index) => (
                                                    <div key={index}>
                                                        <img
                                                            src={anh}
                                                            alt={item.sanPham.ten}
                                                            style={{ left: index * 5 + "px" }}
                                                            className={`w-8 h-8 object-cover inset-0 absolute rounded-md inline-block z-${index}`}
                                                        />
                                                    </div>
                                                ))} */}
                                                            <img
                                                                src={item.lienKet}
                                                                alt={item.sanPham.ten}
                                                                className={`w-12 h-12 object-cover inset-0 rounded-md inline-block`}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="flex items-center space-x-2">
                                                                <span>{item.sanPham} &#91;</span>
                                                                <span
                                                                    className="w-4 h-4 rounded-full"
                                                                    style={{ backgroundColor: item.mauSac }}
                                                                ></span>
                                                                <span>{item.kichCo} &#93;</span>
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>{item.coGiay}</TableCell>
                                                        <TableCell>{item.muiGiay}</TableCell>
                                                        <TableCell>{item.deGiay}</TableCell>
                                                        <TableCell>{item.thuongHieu}</TableCell>
                                                        <TableCell>{item.chatLieu}</TableCell>
                                                        <TableCell>{item.nhaCungCap}</TableCell>
                                                        <TableCell>{item.danhMucSanPham}</TableCell>
                                                        <TableCell>{item.giaSauGiam.toLocaleString()} đ</TableCell>
                                                        <TableCell>{item.soLuong}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="contained"
                                                                onClick={() => {
                                                                    // if (item.soLuong <= 0) {
                                                                    // Notification(
                                                                    // "Hàng đã hết! Xin vui lòng chọn sản phẩm khác !",
                                                                    // "warning"
                                                                    // );
                                                                    // } else {
                                                                    handleOpenSelectQuantity(item);
                                                                    // }
                                                                }}
                                                            >
                                                                Chọn
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )
                                        )
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={12} align="center">
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Đóng</Button>
                </DialogActions>
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
            <ToastContainer />
        </div>
    );
}
