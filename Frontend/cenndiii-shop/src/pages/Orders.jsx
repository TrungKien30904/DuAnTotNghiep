import { useNavigate } from "react-router-dom";

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
    <div className="p-2 space-y-4 text-sm">
      {/* Breadcrumb */}
      <nav className="text-gray-500 mb-4">
        <span className="cursor-pointer hover:underline" onClick={() => navigate("/dashboard")}>
          Trang chủ
        </span>{" "}
        &gt;{" "}
        <span className="font-semibold text-black">Bán hàng</span>
      </nav>

      {/* Orders */}
      <div className="flex flex-row gap-2">
        <div className="basic-2/3 bg-white p-4 rounded-lg shadow-md w-2/3 h-screen">
          <div>
            adfadfaadfadfa
          </div>
          <div className="text-gray-500 flex justify-center items-center h-full">
            <h2>Chưa có hóa đơn nào</h2>
          </div>

        </div>
        <div className="basic-1/3 bg-white p-4 rounded-lg shadow-md w-1/3 h-screen">

        </div>
      </div>
    </div>
  );
}
