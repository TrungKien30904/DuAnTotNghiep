import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "@mui/material";
import { Edit, Trash } from "lucide-react";
import Notification from "../components/Notification";
import { ToastContainer } from "react-toastify";

export default function Orders() {
  const navigate = useNavigate();
  
  // State cho tabs hóa đơn
  const [orderTabs, setOrderTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  // Các state hiện có
  const [openDialog, setOpenDialog] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [openSelectQuantity, setOpenSelectQuantity] = useState(false);
  const [productDetailSelected, setProductDetailSelected] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Lấy danh sách sản phẩm khi mở dialog (danh sách sản phẩm để thêm vào hóa đơn)
  useEffect(() => {
    if (openDialog) {
      axios
        .get("http://localhost:8080/admin/chi-tiet-san-pham/hien-thi")
        .then((response) => {
          setProductDetails(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
        });
    }
  }, [openDialog]);

  // Xử lý chuyển tab
  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Tạo hóa đơn mới bằng API
  const handleCreateOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/admin/hoa-don/them",
        {}
      );
      // Giả sử API trả về đối tượng có thuộc tính maHoaDon
      const newOrder = response.data;
      setOrderTabs([...orderTabs, newOrder]);
      setSelectedTab(orderTabs.length); // Chọn tab mới
    } catch (error) {
      console.error("Error creating order:", error);
      Notification("Có lỗi khi tạo hóa đơn", "error");
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenSelectQuantity = (item) => {
    setProductDetailSelected(item);
    setSelectedQuantity(1); // reset số lượng mặc định
    setOpenSelectQuantity(true);
  };

  const handleCloseSelectQuantity = () => {
    setOpenSelectQuantity(false);
  };

  const handleAddProduct = () => {
    const qty = Number(selectedQuantity);
    // Validate số lượng: phải từ 1 đến số lượng tồn kho
    if (qty < 1 || qty > productDetailSelected.soLuong) {
      alert(`Số lượng đặt phải từ 1 đến ${productDetailSelected.soLuong}`);
      return;
    }

    // Kiểm tra xem sản phẩm đã có trong danh sách hóa đơn chưa
    const existingIndex = orderItems.findIndex(
      (item) =>
        item.idChiTietSanPham === productDetailSelected.idChiTietSanPham
    );

    if (existingIndex !== -1) {
      // Nếu đã tồn tại, cộng dồn số lượng
      const existingItem = orderItems[existingIndex];
      const newQuantity = existingItem.orderQuantity + qty;
      // Kiểm tra tổng số lượng không vượt quá số lượng tồn kho ban đầu của sản phẩm
      if (newQuantity > productDetailSelected.soLuong) {
        alert(
          `Số lượng đặt tổng không được vượt quá ${productDetailSelected.soLuong}`
        );
        return;
      }
      const updatedItem = { ...existingItem, orderQuantity: newQuantity };
      const updatedOrders = [...orderItems];
      updatedOrders[existingIndex] = updatedItem;
      setOrderItems(updatedOrders);
    } else {
      // Nếu chưa có, thêm sản phẩm mới vào danh sách
      const newOrderItem = { ...productDetailSelected, orderQuantity: qty };
      setOrderItems([...orderItems, newOrderItem]);
    }

    // Cập nhật lại số lượng tồn kho của sản phẩm trong productDetails (trừ đi số lượng vừa đặt)
    setProductDetails((prevProducts) =>
      prevProducts.map((prod) =>
        prod.idChiTietSanPham === productDetailSelected.idChiTietSanPham
          ? { ...prod, soLuong: prod.soLuong - qty }
          : prod
      )
    );

    setOpenSelectQuantity(false);
  };

  const handleRemoveOrderItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.idChiTietSanPham !== id));
  };

  return (
    <div className="p-2 space-y-4 text-xs">
      {/* Breadcrumb */}
      <nav className="text-gray-500 mb-4">
        <span
          className="cursor-pointer hover:underline"
          onClick={() => navigate("/dashboard")}
        >
          Trang chủ
        </span>{" "}
        &gt;{" "}
        <span className="font-semibold text-black">Bán hàng</span>
      </nav>

      {/* Orders */}
      <div className="flex flex-row gap-2 h-dvh">
        {/* Cột bên trái hiển thị hóa đơn */}
        <div className="basic-2/3 bg-white p-4 rounded-lg shadow-md w-2/3 h-full">
          {/* Tabs Hóa đơn */}
          <div className="flex items-center justify-between">
            <Tabs
              value={selectedTab}
              onChange={handleChangeTab}
              variant="scrollable"
              scrollButtons="auto"
            >
              {orderTabs.map((order, index) => (
                <Tab
                  key={order.maHoaDon}
                  label={`Hóa đơn ${order.maHoaDon}`}
                />
              ))}
            </Tabs>
            <Button variant="contained" onClick={handleCreateOrder}>
              Tạo hóa đơn
            </Button>
          </div>

          <hr />
          <div className="border rounded-md my-2 h-[700px]">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-left">Danh sách sản phẩm - Hóa đơn</h2>
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
                      {orderItems && orderItems.length > 0 ? (
                        orderItems.map((item) => (
                          <TableRow key={item.idChiTietSanPham}>
                            <TableCell align="center">
                              {item.sanPham.ten}
                            </TableCell>
                            <TableCell align="center">
                              {item.orderQuantity}
                            </TableCell>
                            <TableCell align="center">
                              {item.soLuong}
                            </TableCell>
                            <TableCell align="center">
                              {item.gia} VND
                            </TableCell>
                            <TableCell align="center">
                              {item.gia} VND
                            </TableCell>
                            <TableCell align="center">
                              {item.gia * item.orderQuantity} VND
                            </TableCell>
                            <TableCell align="center">
                              <div className="grid grid-cols-2">
                                <Button>
                                  <Edit size={18} stroke="black" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleRemoveOrderItem(
                                      item.idChiTietSanPham
                                    )
                                  }
                                >
                                  <Trash size={16} className="text-red-600" />
                                </Button>
                              </div>
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
        </div>
        {/* Cột bên phải */}
        <div className="basic-1/3 bg-white p-4 rounded-lg shadow-md w-1/3 h-full">
          {/* Nội dung cột bên phải */}
        </div>
      </div>

      {/* Dialog hiển thị danh sách sản phẩm */}
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
                    <TableRow key={item.idChiTietSanPham}>
                      <TableCell className="relative">
                        {item.listAnh.map((anh, index) => (
                          <div key={index}>
                            <img
                              src={anh}
                              alt={item.sanPham.ten}
                              style={{ left: index * 5 + "px" }}
                              className={`w-8 h-8 object-cover inset-0 absolute rounded-md inline-block z-${index}`}
                            />
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center space-x-2">
                          <span>{item.sanPham.ten} &#91;</span>
                          <span
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.mauSac.ten }}
                          ></span>
                          <span>{item.kichCo.ten} &#93;</span>
                        </span>
                      </TableCell>
                      <TableCell>{item.coGiay.ten}</TableCell>
                      <TableCell>{item.muiGiay.ten}</TableCell>
                      <TableCell>{item.deGiay.ten}</TableCell>
                      <TableCell>{item.thuongHieu.ten}</TableCell>
                      <TableCell>{item.chatLieu.ten}</TableCell>
                      <TableCell>{item.nhaCungCap.ten}</TableCell>
                      <TableCell>{item.danhMucSanPham.ten}</TableCell>
                      <TableCell>{item.gia}</TableCell>
                      <TableCell>{item.soLuong}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => {
                            if (item.soLuong <= 0) {
                              Notification(
                                "Hàng đã hết! Xin vui lòng chọn sản phẩm khác !",
                                "warning"
                              );
                            } else {
                              handleOpenSelectQuantity(item);
                            }
                          }}
                        >
                          Chọn
                        </Button>
                      </TableCell>
                    </TableRow>
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
                        productDetailSelected.listAnh &&
                        productDetailSelected.listAnh[0]
                      }
                      alt={productDetailSelected.sanPham.ten}
                      className="size-60 object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold">
                      Tên sản phẩm: {productDetailSelected.sanPham.ten}
                    </h2>
                    <p>Cổ giày: {productDetailSelected.coGiay.ten}</p>
                    <p>Mũi giày: {productDetailSelected.muiGiay.ten}</p>
                    <p>Đế giày: {productDetailSelected.deGiay.ten}</p>
                    <p>Thương hiệu: {productDetailSelected.thuongHieu.ten}</p>
                    <p>Chất liệu: {productDetailSelected.chatLieu.ten}</p>
                    <p>Nhà cung cấp: {productDetailSelected.nhaCungCap.ten}</p>
                    <p>Danh mục: {productDetailSelected.danhMucSanPham.ten}</p>
                  </div>
                </div>
                <div className="w-1/3">
                  <p>Giá: {productDetailSelected.gia}đ</p>
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
      <ToastContainer />
    </div>
  );
}
