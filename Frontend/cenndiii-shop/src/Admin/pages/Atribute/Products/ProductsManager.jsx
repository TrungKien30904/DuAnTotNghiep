import { useNavigate } from "react-router-dom";
import { Search, Edit } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { Dialog, Switch } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import Notification from '../../../../components/Notification';
import "react-toastify/dist/ReactToastify.css";
import Alert from "../../../../components/Alert";
import { ImageList, ImageListItem } from "@mui/material";
import api from "../../../../security/Axios";
import { hasPermission } from "../../../../security/DecodeJWT";

export default function ProductDetails() {
  const { id } = useParams(); // Id lấy từ trang khác
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [totalItems, setTotalItems] = useState(0);
  const [chiTietSanPham, setChiTietSanPham] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const navigate = useNavigate();
  const [filters, setFilters] = useState("");

  // Dữ liệu từ BE
  const [products, setProducts] = useState([]);
  const [shoeCollars, setShoeCollars] = useState([]);
  const [shoeSoles, setShoeSoles] = useState([]);
  const [shoeToes, setShoeToes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [selectedImages, setSelectedImages] = useState([]);


  const [openAlert, setOpenAlert] = useState(false); // trạng thái cho alert
  const [alertMessage, setAlertMessage] = useState(""); // thông báo cho alert


  useEffect(() => {
    if (!hasPermission("ADMIN") && !hasPermission("STAFF")) {
      navigate("/admin/login");
    }
  }, [navigate]);
  const handleAlertClose = (confirm) => {
    setOpenAlert(false);
    if (confirm) {
      handleSave();
    }
  }

  const showAlert = () => {
    setAlertMessage("Bạn có chắc chắn muốn lưu thay đổi không?");
    setOpenAlert(true);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };


  useEffect(() => {
    fetchData("/admin/san-pham/hien-thi/true", setProducts);
    fetchData("/admin/co-giay/hien-thi/true", setShoeCollars);
    fetchData("/admin/de-giay/hien-thi/true", setShoeSoles);
    fetchData("/admin/mui-giay/hien-thi/true", setShoeToes);
    fetchData("/admin/chat-lieu/hien-thi/true", setMaterials);
    fetchData("/admin/thuong-hieu/hien-thi/true", setBrands);
    fetchData("/admin/nha-cung-cap/hien-thi/true", setSuppliers);
    fetchData("/admin/danh-muc/hien-thi/true", setCategories);
    fetchData("/admin/mau-sac/hien-thi/true", setColors);
    fetchData("/admin/kich-co/hien-thi/true", setSizes);
  }, []);

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await api.get(endpoint);
      setter(response.data);
    } catch (error) {
      console.error(`Lỗi khi lấy dữ liệu từ ${endpoint}:`, error);
    }
  };

  // Các state cho dropdowns (các combobox)
  const [productSelected, setProductSelected] = useState(null);
  const [shoeCollarSelected, setShoeCollarSelected] = useState(null);
  const [shoeSoleSelected, setShoeSoleSelected] = useState(null);
  const [shoeToeSelected, setShoeToeSelected] = useState(null);
  const [materialSelected, setMaterialSelected] = useState(null);
  const [brandSelected, setBrandSelected] = useState(null);
  const [supplierSelected, setSupplierSelected] = useState(null);
  const [categorySelected, setCategorySelected] = useState(null);
  const [colorSelected, setColorSelected] = useState(null);
  const [sizeSelected, setSizeSelected] = useState(null);

  const [description, setDescription] = useState("");

  // Mới: state cho số lượng và giá bán
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [imageById, setImageById] = useState(null);
  // Validate
  const [errors, setErrors] = useState({
    product: "",
    shoeCollar: "",
    shoeSole: "",
    shoeToe: "",
    material: "",
    brand: "",
    supplier: "",
    category: "",
    size: "",
    color: "",
    quantity: "",
    price: ""
  });

  const fetchChiTietSanPham = useCallback(async () => {
    try {
      const response = await api.post(
        `/admin/chi-tiet-san-pham/phan-trang/${id}`,
        null,
        {
          params: {
            page: currentPage,
            pageSize: pageSize,
          },
        }
      );
      const response1 = await api.get(
        `/admin/chi-tiet-san-pham/total-pages/${id}`
      );
      setChiTietSanPham(response.data);
      setTotalItems(response1.data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  }, [id, currentPage, pageSize]);

  useEffect(() => {
    fetchChiTietSanPham();
  }, [fetchChiTietSanPham]);

  const toggleTrangThai = async (productId, productDetailId, currentTrangThai) => {
    try {
      const response = await api.post(
        `/admin/chi-tiet-san-pham/doi-trang-thai/${productDetailId}/${productId}/${currentTrangThai}`
      );
      setChiTietSanPham((prevChiTietSanPham) =>
        prevChiTietSanPham.map((item) =>
          item.idChiTietSanPham === productDetailId
            ? { ...item, trangThai: currentTrangThai === 1 ? 0 : 1 }
            : item
        )
      );
      Notification("Thay đổi trạng thái thành công", "success");
      return response;
    } catch (error) {
      Notification("Thay đổi trạng thái thất bại", "error");
    }
  };


  const openModal = (productDetail) => {
    setSelectedProductDetail(productDetail);
    setIsModalOpen(true);
    fetchProductDetail(productDetail.idChiTietSanPham);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductDetail(null);
  };

  const productOptions = products.map((p) => ({
    value: p.idSanPham,
    label: p.ten,
  }));
  const shoeCollarOptions = shoeCollars.map((item) => ({
    value: item.idCoGiay,
    label: item.ten,
  }));
  const shoeSoleOptions = shoeSoles.map((item) => ({
    value: item.idDeGiay,
    label: item.ten,
  }));
  const shoeToeOptions = shoeToes.map((item) => ({
    value: item.idMuiGiay,
    label: item.ten,
  }));
  const materialOptions = materials.map((item) => ({
    value: item.idChatLieu,
    label: item.ten,
  }));
  const brandOptions = brands.map((item) => ({
    value: item.idThuongHieu,
    label: item.ten,
  }));
  const supplierOptions = suppliers.map((item) => ({
    value: item.idNhaCungCap,
    label: item.ten,
  }));
  const categoryOptions = categories.map((cat) => ({
    value: cat.idDanhMuc,
    label: cat.ten,
  }));
  const colorOptions = colors.map((color) => ({
    value: color.idMauSac,
    label: color.ten,
  }));
  const sizeOptions = sizes.map((size) => ({
    value: size.idKichCo,
    label: size.ten,
  }));

  const handleCreateOption = async (type, inputValue) => {
    try {
      const response = await api.post(`/admin/${type}/them`, {
        ten: inputValue,
      });
      if (type === "san-pham") {
        setProducts((prev) => [
          ...prev,
          { idSanPham: response.data.idSanPham, ten: inputValue },
        ]);
        setProductSelected({ value: response.data.idSanPham, label: inputValue });
        Notification("Thêm sản phẩm thành công", "success");
      } else if (type === "co-giay") {
        setShoeCollars((prev) => [
          ...prev,
          { idCoGiay: response.data.idCoGiay, ten: inputValue },
        ]);
        setShoeCollarSelected({ value: response.data.idCoGiay, label: inputValue });
        Notification("Thêm cổ giày thành công", "success");
      } else if (type === "de-giay") {
        setShoeSoles((prev) => [
          ...prev,
          { idDeGiay: response.data.idDeGiay, ten: inputValue },
        ]);
        setShoeSoleSelected({ value: response.data.idDeGiay, label: inputValue });
        Notification("Thêm đế giày thành công", "success");
      } else if (type === "mui-giay") {
        setShoeToes((prev) => [
          ...prev,
          { idMuiGiay: response.data.idMuiGiay, ten: inputValue },
        ]);
        setShoeToeSelected({ value: response.data.idMuiGiay, label: inputValue });
        Notification("Thêm mũi giày thành công", "success");
      } else if (type === "chat-lieu") {
        setMaterials((prev) => [
          ...prev,
          { idChatLieu: response.data.idChatLieu, ten: inputValue },
        ]);
        setMaterialSelected({ value: response.data.idChatLieu, label: inputValue });
        Notification("Thêm chất liệu thành công", "success");
      } else if (type === "thuong-hieu") {
        setBrands((prev) => [
          ...prev,
          { idThuongHieu: response.data.idThuongHieu, ten: inputValue },
        ]);
        setBrandSelected({ value: response.data.idThuongHieu, label: inputValue });
        Notification("Thêm thương hiệu thành công", "success");
      } else if (type === "nha-cung-cap") {
        setSuppliers((prev) => [
          ...prev,
          { idNhaCungCap: response.data.idNhaCungCap, ten: inputValue },
        ]);
        setSupplierSelected({ value: response.data.idNhaCungCap, label: inputValue });
        Notification("Thêm nhà cung cấp thành công", "success");
      } else if (type === "danh-muc") {
        setCategories((prev) => [
          ...prev,
          { idDanhMuc: response.data.idDanhMuc, ten: inputValue },
        ]);
        setCategorySelected({ value: response.data.idDanhMuc, label: inputValue });
        Notification("Thêm danh mục thành công", "success");
      }
    } catch (error) {
      Notification(`Lỗi khi thêm mới thuộc tính`, "error");
    }
  };

  const isValidNewOption = (inputValue, selectOptions) => {
    const safeInput = (inputValue || "").toString();
    const trimmedInput = safeInput.trim();
    if (!trimmedInput) return false;
    const normalizedInput = removeDiacritics(trimmedInput.toLowerCase());
    return !selectOptions.some((option) => {
      const safeLabel = typeof option.label === "string" ? option.label : "";
      return removeDiacritics(safeLabel.trim().toLowerCase()).includes(normalizedInput);
    });
  };

  const removeDiacritics = (str) => {
    return str
      .normalize("NFD")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const customFilterOption = (option, rawInput) => {
    const safeInput = (rawInput || "").toString();
    const normalizedInput = removeDiacritics(safeInput.trim().toLowerCase());
    const safeLabel = typeof option.label === "string" ? option.label : "";
    const normalizedLabel = removeDiacritics(safeLabel.trim().toLowerCase());
    return normalizedLabel.includes(normalizedInput);
  };

  const fetchProductDetail = async (idChiTietSanPham) => {
    try {
      const response = await api.get(`/admin/chi-tiet-san-pham/chi-tiet/${idChiTietSanPham}`);
      const data = response.data;
      setImageById(idChiTietSanPham);
      // Set giá trị cho các dropdowns sau khi lấy dữ liệu từ API
      setProductSelected({ value: data.sanPham.idSanPham, label: data.sanPham.ten });
      setShoeCollarSelected({ value: data.coGiay.idCoGiay, label: data.coGiay.ten });
      setShoeSoleSelected({ value: data.deGiay.idDeGiay, label: data.deGiay.ten });
      setShoeToeSelected({ value: data.muiGiay.idMuiGiay, label: data.muiGiay.ten });
      setMaterialSelected({ value: data.chatLieu.idChatLieu, label: data.chatLieu.ten });
      setBrandSelected({ value: data.thuongHieu.idThuongHieu, label: data.thuongHieu.ten });
      setSupplierSelected({ value: data.nhaCungCap.idNhaCungCap, label: data.nhaCungCap.ten });
      setCategorySelected({ value: data.danhMucSanPham.idDanhMuc, label: data.danhMucSanPham.ten });
      setColorSelected({ value: data.mauSac.idMauSac, label: data.mauSac.ten });
      setSizeSelected({ value: data.kichCo.idKichCo, label: data.kichCo.ten });
      setDescription(data.moTa);
      // Mới: set số lượng và giá bán từ dữ liệu
      setQuantity(data.soLuong);
      setPrice(data.gia);
    } catch (error) {
      console.error('Error fetching product detail:', error);
    }
  };

  const handleUploadImages = async (idSanPham) => {
    const token = localStorage.getItem("token")
    const formData = new FormData();

    selectedImages.forEach((image) => {
      formData.append("file", image);
      formData.append("tenMau", colorSelected.label);
    });
    try {
      if (selectedImages.length > 0) {
        const response = await axios.post(
          `http://localhost:8080/admin/chi-tiet-san-pham/them-anh/${idSanPham}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" ,Authorization:`Bearer ${token}`} }
        );
        if (response.status === 200) {
          Notification("Tải ảnh thành công", "success");
        } else {
          Notification("Tải ảnh thất bại", "error");
        }
      }
    } catch (error) {
      Notification("Tải ảnh thất bại", "error");
    } finally {

    }
  };

  const handleSave = async () => {
    // Tạo payload gồm các dữ liệu từ các combobox và các trường số lượng, giá bán
    const payload = {
      sanPham: { idSanPham: productSelected.value },
      coGiay: { idCoGiay: shoeCollarSelected.value },
      deGiay: { idDeGiay: shoeSoleSelected.value },
      muiGiay: { idMuiGiay: shoeToeSelected.value },
      chatLieu: materialSelected ? { idChatLieu: materialSelected.value } : null,
      thuongHieu: brandSelected ? { idThuongHieu: brandSelected.value } : null,
      nhaCungCap: supplierSelected ? { idNhaCungCap: supplierSelected.value } : null,
      danhMucSanPham: categorySelected ? { idDanhMuc: categorySelected.value } : null,
      mauSac: colorSelected ? { idMauSac: colorSelected.value } : null,
      kichCo: sizeSelected ? { idKichCo: sizeSelected.value } : null,
      moTa: description,
      soLuong: quantity,
      gia: price,
    };


    try {
      await api.post(
        `/admin/chi-tiet-san-pham/sua/${selectedProductDetail.idChiTietSanPham}`,
        payload
      );
      await handleUploadImages(productSelected.value);
      Notification("Cập nhật thành công", "success");
      closeModal();
      fetchChiTietSanPham();
      setSelectedImages([]);
    } catch (error) {
      Notification("Cập nhật thất bại", "error");
    }
  };

  return (
    <div className="p-6 space-y-4 text-sm">
      <nav className="text-gray-500 mb-4">
        <span className="cursor-pointer hover:underline" onClick={() => navigate("/admin/dashboard")}>
          Trang chủ
        </span>{" "}
        &gt;{" "}
        <span className="cursor-pointer hover:underline" onClick={() => navigate("/admin/products")}>
          Sản phẩm
        </span>{" "}
        &gt; <span className="font-semibold text-black">Chi tiết sản phẩm</span>
      </nav>

      {/* Card 1 - Bộ Lọc */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold mb-4">Bộ Lọc</h2>
        <div className="relative text-sm my-3">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            name="search"
            // value={filters.search}
            // onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Tìm theo tên..."
            className="w-full pl-10 p-2 border rounded-md"
          />
        </div>
        <div className="grid grid-cols-5 gap-4">
          {[
            { id:0,field: "product", options: products, label: "Sản phẩm" },
            { id:1,field: "shoeCollar", options: shoeCollars, label: "Cổ giày" },
            { id:2,field: "shoeToe", options: shoeToes, label: "Mũi giày" },
            { id:3,field: "shoeSole", options: shoeSoles, label: "Đế giày" },
            { id:4,field: "material", options: materials, label: "Chất liệu" },
            { id:5,field: "brand", options: brands, label: "Thương hiệu" },
            { id:6,field: "supplier", options: suppliers, label: "Nhà cung cấp" },
            { id:7,field: "category", options: categories, label: "Danh mục" },
            { id:8,field: "color", options: colors, label: "Màu sắc" },
            { id:9,field: "size", options: sizes, label: "Kích cỡ" },
          ].map(({ field, options, label, index }) => (
            <div key={index} className="relative text-sm">
              <select
                name={field}
                value={filters[field] || ""}
                onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
                className="border p-2 rounded-md w-full"
              >
                <option value="">Tất cả {label}</option>
                {options && options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.ten}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

      </div>

      {/* Card 2 - Danh Sách Chi Tiết Sản Phẩm */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Danh Sách Chi Tiết Sản Phẩm</h2>
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">STT</th>
              <th className="p-2">Ảnh</th>
              <th className="p-2">Tên sản phẩm</th>
              <th className="p-2">Cổ giày</th>
              <th className="p-2">Đế giày</th>
              <th className="p-2">Mũi giày</th>
              <th className="p-2">Thương hiệu</th>
              <th className="p-2">Chất liệu</th>
              <th className="p-2">Nhà cung cấp</th>
              <th className="p-2">Danh mục</th>
              <th className="p-2">Số Lượng</th>
              <th className="p-2">Giá bán</th>
              {/* <th className="p-2">Trạng Thái</th> */}
              <th className="p-2">Hành Động</th>
            </tr>
          </thead>
          <tbody className="">
            {chiTietSanPham.map((c, index) => (
              <tr key={c.idChiTietSanPham} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2 max-w-md relative">
                  {c.listAnh.map((anh, index) => (
                    <div
                    >
                      <img
                        key={index}
                        src={anh} alt={c.sanPham.ten}
                        style={{ top: index * 5 + "px", left: index * 5 + "px" }}
                        className={`w-8 h-8 object-cover inset-0 absolute rounded-md inline-block z-${index}`}
                      />
                    </div>
                  ))}
                </td>

                {/* <td className="p-2">{c.sanPham.ten} &#91;{c.mauSac.ten} - {c.kichCo.ten}&#93;</td> */}
                <td className="p-2">
                  <span className="flex items-center space-x-2">
                    <span>{c.sanPham.ten} &#91;</span>
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: c.mauSac.ten }}
                    ></span>
                    <span>{c.kichCo.ten} &#93;</span>
                  </span>
                </td>

                <td className="p-2">{c.coGiay.ten}</td>
                <td className="p-2">{c.muiGiay.ten}</td>
                <td className="p-2">{c.deGiay.ten}</td>
                <td className="p-2">{c.thuongHieu.ten}</td>
                <td className="p-2">{c.chatLieu.ten}</td>
                <td className="p-2">{c.nhaCungCap.ten}</td>
                <td className="p-2">{c.danhMucSanPham.ten}</td>
                <td className="p-2">{c.soLuong ?? 0}</td>
                <td className="p-2">{c.gia}</td>
                {/* <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white w-28 inline-block text-center ${Number(c.trangThai) === 1 ? "bg-green-500" : "bg-red-500"}`}>
                    {Number(c.trangThai) === 1 ? "Đang Bán" : "Ngừng Bán"}
                  </span>
                </td> */}
                <td className="p-2 flex space-x-2 items-center">
                  <button className="text-black p-1 rounded" onClick={() => openModal(c)}>
                    <Edit size={18} stroke="black" />
                  </button>
                  <Switch
                    checked={Number(c.trangThai) === 1}
                    onChange={async () => {
                      await toggleTrangThai(c.sanPham.idSanPham, c.idChiTietSanPham, Number(c.trangThai));
                    }}
                    className={`${Number(c.trangThai) === 1 ? "bg-green-600" : "bg-gray-300"} relative inline-flex items-center h-6 rounded-full w-11`}
                  >
                    <span className="sr-only">Toggle</span>
                    <span className={`${Number(c.trangThai) === 1 ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                  </Switch>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for Edit */}
        <Dialog
          open={isModalOpen}
          onClose={closeModal}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 "
        >
          <div className="bg-white p-6 rounded-lg shadow-lg overflow-auto">
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-1 text-left">Cập nhật thông tin chi tiết sản phẩm</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="mt-4">
                <div className="space-y-4">
                  {/* Row 1: Product attribute */}
                  <div>
                    <div className="font-semibold mb-1">Sản Phẩm</div>
                    <CreatableSelect
                      isClearable
                      options={productOptions}
                      value={productSelected}
                      onChange={setProductSelected}
                      onCreateOption={(inputValue) => handleCreateOption("san-pham", inputValue)}
                      placeholder="Chọn hoặc nhập tên sản phẩm..."
                      formatCreateLabel={(input) => `Thêm mới "${(input || "").trim()}"`}
                      isValidNewOption={isValidNewOption}
                      filterOption={customFilterOption}
                      isDisabled={true}
                    />
                    {errors.product && <div className="text-red-600 text-xs">* {errors.product}</div>}
                  </div>

                  {/* Middle Rows: Other attributes, 3 per row */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Cổ Giày */}
                    <div>
                      <div className="font-semibold mb-1">Cổ Giày</div>
                      <CreatableSelect
                        isClearable
                        options={shoeCollarOptions}
                        value={shoeCollarSelected}
                        onChange={setShoeCollarSelected}
                        onCreateOption={(inputValue) => handleCreateOption("co-giay", inputValue)}
                        placeholder="Chọn hoặc nhập cổ giày..."
                        formatCreateLabel={(input) => `Thêm mới "${(input || "").trim()}"`}
                        isValidNewOption={isValidNewOption}
                        filterOption={customFilterOption}
                      />
                      {errors.shoeCollar && <div className="text-red-600 text-xs">* {errors.shoeCollar}</div>}
                    </div>

                    {/* Đế Giày */}
                    <div>
                      <div className="font-semibold mb-1">Đế Giày</div>
                      <CreatableSelect
                        isClearable
                        options={shoeSoleOptions}
                        value={shoeSoleSelected}
                        onChange={setShoeSoleSelected}
                        onCreateOption={(inputValue) => handleCreateOption("de-giay", inputValue)}
                        placeholder="Chọn hoặc nhập đế giày..."
                        formatCreateLabel={(input) => `Thêm mới "${(input || "").trim()}"`}
                        isValidNewOption={isValidNewOption}
                        filterOption={customFilterOption}
                      />
                      {errors.shoeSole && <div className="text-red-600 text-xs">* {errors.shoeSole}</div>}
                    </div>

                    {/* Mũi Giày */}
                    <div>
                      <div className="font-semibold mb-1">Mũi Giày</div>
                      <CreatableSelect
                        isClearable
                        options={shoeToeOptions}
                        value={shoeToeSelected}
                        onChange={setShoeToeSelected}
                        onCreateOption={(inputValue) => handleCreateOption("mui-giay", inputValue)}
                        placeholder="Chọn hoặc nhập mũi giày..."
                        formatCreateLabel={(input) => `Thêm mới "${(input || "").trim()}"`}
                        isValidNewOption={isValidNewOption}
                        filterOption={customFilterOption}
                      />
                      {errors.shoeToe && <div className="text-red-600 text-xs">* {errors.shoeToe}</div>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Chất Liệu */}
                    <div>
                      <div className="font-semibold mb-1">Chất Liệu</div>
                      <CreatableSelect
                        isClearable
                        options={materialOptions}
                        value={materialSelected}
                        onChange={setMaterialSelected}
                        onCreateOption={(inputValue) => handleCreateOption("chat-lieu", inputValue)}
                        placeholder="Chọn hoặc nhập chất liệu..."
                        formatCreateLabel={(input) => `Thêm mới "${(input || "").trim()}"`}
                        isValidNewOption={isValidNewOption}
                        filterOption={customFilterOption}
                      />
                      {errors.material && <div className="text-red-600 text-xs">* {errors.material}</div>}
                    </div>

                    {/* Thương Hiệu */}
                    <div>
                      <div className="font-semibold mb-1">Thương Hiệu</div>
                      <CreatableSelect
                        isClearable
                        options={brandOptions}
                        value={brandSelected}
                        onChange={setBrandSelected}
                        onCreateOption={(inputValue) => handleCreateOption("thuong-hieu", inputValue)}
                        placeholder="Chọn hoặc nhập thương hiệu..."
                        formatCreateLabel={(input) => `Thêm mới "${(input || "").trim()}"`}
                        isValidNewOption={isValidNewOption}
                        filterOption={customFilterOption}
                      />
                      {errors.brand && <div className="text-red-600 text-xs">* {errors.brand}</div>}
                    </div>

                    {/* Nhà Cung Cấp */}
                    <div>
                      <div className="font-semibold mb-1">Nhà Cung Cấp</div>
                      <CreatableSelect
                        isClearable
                        options={supplierOptions}
                        value={supplierSelected}
                        onChange={setSupplierSelected}
                        onCreateOption={(inputValue) => handleCreateOption("nha-cung-cap", inputValue)}
                        placeholder="Chọn hoặc nhập nhà cung cấp..."
                        formatCreateLabel={(input) => `Thêm mới "${(input || "").trim()}"`}
                        isValidNewOption={isValidNewOption}
                        filterOption={customFilterOption}
                      />
                      {errors.supplier && <div className="text-red-600 text-xs">* {errors.supplier}</div>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Danh Mục */}
                    <div>
                      <div className="font-semibold mb-1">Danh Mục</div>
                      <CreatableSelect
                        isClearable
                        options={categoryOptions}
                        value={categorySelected}
                        onChange={setCategorySelected}
                        onCreateOption={(inputValue) => handleCreateOption("danh-muc", inputValue)}
                        placeholder="Chọn hoặc nhập danh mục..."
                        formatCreateLabel={(input) => `Thêm mới "${(input || "").trim()}"`}
                        isValidNewOption={isValidNewOption}
                        filterOption={customFilterOption}
                      />
                      {errors.category && <div className="text-red-600 text-xs">* {errors.category}</div>}
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Màu Sắc</div>
                      <Select
                        isClearable
                        options={colorOptions}
                        value={colorSelected}
                        onChange={setColorSelected}
                        formatOptionLabel={(option) => (
                          <span className="flex items-center space-x-2">
                            <span
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: option.label }}
                            ></span>
                            <span>{option.label}</span>
                          </span>
                        )}
                        isDisabled={true}
                      />
                      {errors.color && <div className="text-red-600 text-xs">* {errors.color}</div>}
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Kích Cỡ</div>
                      <Select
                        isClearable
                        options={sizeOptions}
                        value={sizeSelected}
                        onChange={setSizeSelected}
                        isDisabled={true}
                      />
                      {errors.size && <div className="text-red-600 text-xs">* {errors.size}</div>}
                    </div>
                  </div>

                  {/* New Row: Số Lượng & Giá bán */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-semibold mb-1">Số Lượng</div>
                      <input
                        type="number"
                        className="border p-2 rounded-md w-full"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                      {errors.quantity && <div className="text-red-600 text-xs">* {errors.quantity}</div>}
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Giá bán</div>
                      <input
                        type="number"
                        className="border p-2 rounded-md w-full"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      {errors.price && <div className="text-red-600 text-xs">* {errors.price}</div>}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="font-semibold mb-1">Mô Tả</div>
                    <textarea
                      className="border p-2 rounded-md w-full"
                      rows="4"
                      placeholder="Nhập mô tả sản phẩm..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value ?? null)}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="max-w-1/2">
                <div className="mb-4">
                  <h2>Ảnh Sản phẩm</h2>
                  <div className="">
                    <ImageList sx={{ width: 415, height: 199 }} cols={4} >
                      {chiTietSanPham.map((c) => (
                        c.idChiTietSanPham === imageById && (
                          c.listAnh.map((anh, index) => (
                            <ImageListItem key={index}>
                              <div key={index} className="w-24 h-24">
                                <img
                                  src={anh}
                                  alt="err"
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </div>
                            </ImageListItem>
                          ))
                        )
                      ))}
                    </ImageList>
                  </div>
                </div>
                <div className="">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="block w-full mb-2"
                    onChange={handleImageChange}
                  />
                  <div className="">
                    <ImageList sx={{ width: 415, height: 199 }} cols={4} >
                      {selectedImages.map((file, index) => (
                        <ImageListItem key={index}>
                          <div key={index} className="relative w-24 h-24">
                            <img
                              srcSet={`${URL.createObjectURL(file)}`}
                              src={`${URL.createObjectURL(file)}?`}
                              alt={"err"}
                              loading="lazy"
                              className="w-full h-full object-cover rounded-md border"
                            />
                            <button
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                              onClick={() => handleRemoveImage(index)}
                            >
                              ✕
                            </button>
                          </div>
                        </ImageListItem>
                      ))}
                    </ImageList>
                    {/* {selectedImages.map((file, index) => (
                      <div key={index} className="relative w-32 h-32 p-2">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover rounded-md border"
                        />
                        <button
                          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))} */}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={closeModal} className="px-3 py-1 border border-gray-400 text-gray-600 rounded-md mr-2">
                Đóng
              </button>
              <button className="px-3 py-1 bg-black text-white rounded-md" onClick={showAlert}>
                Lưu
              </button>
            </div>
          </div>
        </Dialog>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <span className="text-sm">Số bản ghi mỗi trang: </span>
            <select
              className="ml-2 border rounded-md p-2 text-sm"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value), setCurrentPage(0))}
            >
              {[3, 5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm">
            {`Trang ${currentPage + 1} / ${Math.ceil(totalItems / pageSize)}`}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="p-2 border rounded-md"
            >
              &lt;
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalItems / pageSize) - 1))}
              disabled={totalItems === 0}
              className="p-2 border rounded-md"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
      <Alert
        message={alertMessage}
        open={openAlert}
        onClose={handleAlertClose}
      />
      <ToastContainer />
    </div>
  );
}
