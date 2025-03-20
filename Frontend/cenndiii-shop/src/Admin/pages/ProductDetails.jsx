import { React, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { SketchPicker } from "react-color";
import { Dialog } from "@headlessui/react";
import { Trash } from "lucide-react";
import { ToastContainer } from "react-toastify";
import Notification from '../../components/Notification';
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../components/Loading";
import Alert from "../../components/Alert";
import api from "../../security/Axios";

const removeDiacritics = (str) => {
  return str
    .normalize("NFD")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[\u0300-\u036f]/g, "");
};

// Hàm kiểm tra xem có nên hiển thị option "Thêm mới" hay không (dùng .trim())
const isValidNewOption = (inputValue, selectValue, selectOptions) => {
  const safeInput = (inputValue || "").toString();
  const trimmedInput = safeInput.trim();
  if (!trimmedInput) return false;
  const normalizedInput = removeDiacritics(trimmedInput.toLowerCase());
  return !selectOptions.some((option) => {
    const safeLabel = typeof option.label === "string" ? option.label : "";
    return removeDiacritics(safeLabel.trim().toLowerCase()).includes(normalizedInput);
  });
};

// Hàm custom filterOption dùng cho CreatableSelect
const customFilterOption = (option, rawInput) => {
  const safeInput = (rawInput || "").toString();
  const normalizedInput = removeDiacritics(safeInput.trim().toLowerCase());
  const safeLabel = typeof option.label === "string" ? option.label : "";
  const normalizedLabel = removeDiacritics(safeLabel.trim().toLowerCase());
  return normalizedLabel.includes(normalizedInput);
};

export default function ProductDetails() {
  const navigate = useNavigate();
  // Dữ liệu tải về từ backend
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

  // State cho multi-select (màu sắc & kích cỡ)
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // State quản lý modal thêm màu & kích cỡ
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [newColor, setNewColor] = useState("#000000");
  const [isAddingSize, setIsAddingSize] = useState(false);
  const [newSize, setNewSize] = useState("");
  // State cho các trường CreatableSelect (sản phẩm & các thuộc tính khác)
  const [productSelected, setProductSelected] = useState(null);
  const [shoeCollarSelected, setShoeCollarSelected] = useState(null);
  const [shoeSoleSelected, setShoeSoleSelected] = useState(null);
  const [shoeToeSelected, setShoeToeSelected] = useState(null);
  const [materialSelected, setMaterialSelected] = useState(null);
  const [brandSelected, setBrandSelected] = useState(null);
  const [supplierSelected, setSupplierSelected] = useState(null);
  const [categorySelected, setCategorySelected] = useState(null);

  const [variants, setVariants] = useState([]);
  const [deletedVariants, setDeletedVariants] = useState([]);
  const [selectedVariantIds, setSelectedVariantIds] = useState([]);
  const [commonAll, setCommonAll] = useState({ quantity: "", price: "" });

  // const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [description, setDescription] = useState("");

  const [selectedImages, setSelectedImages] = useState([]);

  const [loading, setLoading] = useState(false); // Trạng thái loading

  const [alertOpen, setAlertOpen] = useState(false); // mở alert
  const [alertMessage, setAlertMessage] = useState(''); // thông báo alert

  const handleAlertClose = (confirm) => {
    setAlertOpen(false);
    if (confirm) {
      handleSubmit();
    }
  };

  const showAlert = () => {
    setAlertMessage("Bạn có chắc chắn muốn thêm chi tiết sản phẩm này không?");
    setAlertOpen(true);
  };
  const handleImageChange = (event, colorName) => {
    const files = Array.from(event.target.files);

    setSelectedImages((prevImages) => ({
      ...prevImages,
      [colorName]: [...(prevImages[colorName] || []), ...files] // Lưu file gốc
    }));
  };

  const handleRemoveImage = (colorName, index) => {
    setSelectedImages((prevImages) => ({
      ...prevImages,
      [colorName]: prevImages[colorName].filter((_, i) => i !== index), // Xóa ảnh của đúng màu
    }));
  };

  const handleUploadImages = async (idSanPham) => {
    if (!selectedImages || Object.keys(selectedImages).length === 0) {
      console.warn("Không có ảnh nào để upload!");
      return;
    }

    const formData = new FormData();

    Object.entries(selectedImages).forEach(([colorName, files]) => {
      files.forEach((file) => {
        formData.append("file", file);
        formData.append("tenMau", colorName); // Gửi mã màu tương ứng
      });
    });

    try {
      await axios.post(
        `http://localhost:8080/admin/chi-tiet-san-pham/them-anh/${idSanPham}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Notification("Thêm ảnh thành công", "success");
    } catch (error) {
      Notification("Lỗi khi thêm ảnh", "error");
    }
  };



  const [errors, setErrors] = useState({
    product: "",
    shoeCollar: "",
    shoeSole: "",
    shoeToe: "",
    material: "",
    brand: "",
    supplier: "",
    category: "",
    description: ""
  });
  useEffect(() => {
  },[]);
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


  useEffect(() => {
    setDeletedVariants([]);
  }, [selectedColors, selectedSizes]);

  useEffect(() => {
    setSelectedVariantIds([]);
    setCommonAll({});
  }, [selectedColors, selectedSizes]);

  // Hàm lấy dữ liệu từ API
  const fetchData = async (endpoint, setter) => {
    try {
      const response = await api.get(endpoint);
      setter(response.data);
    } catch (error) {
      console.error(`Lỗi khi lấy dữ liệu từ ${endpoint}:`, error);
    }
  };



  useEffect(() => {
    // Automatically select the first option for these fields on initial load
    if (shoeCollars.length > 0) {
      setShoeCollarSelected({ value: shoeCollars[0].idCoGiay, label: shoeCollars[0].ten });
    }
    if (shoeSoles.length > 0) {
      setShoeSoleSelected({ value: shoeSoles[0].idDeGiay, label: shoeSoles[0].ten });
    }
    if (shoeToes.length > 0) {
      setShoeToeSelected({ value: shoeToes[0].idMuiGiay, label: shoeToes[0].ten });
    }
    if (materials.length > 0) {
      setMaterialSelected({ value: materials[0].idChatLieu, label: materials[0].ten });
    }
    if (brands.length > 0) {
      setBrandSelected({ value: brands[0].idThuongHieu, label: brands[0].ten });
    }
    if (suppliers.length > 0) {
      setSupplierSelected({ value: suppliers[0].idNhaCungCap, label: suppliers[0].ten });
    }
    if (categories.length > 0) {
      setCategorySelected({ value: categories[0].idDanhMuc, label: categories[0].ten });
    }
  }, [shoeCollars, shoeSoles, shoeToes, materials, brands, suppliers, categories]);

  const handleAddColor = async () => {
    if (!newColor.trim()) return;
    try {
      const response = await api.post("/admin/mau-sac/them", {
        ten: newColor,
      });
      const newOption = { value: response.data.idKichCo, label: response.data.ten };
      setSelectedSizes((prevSelected) => [...prevSelected, newOption]);
      setIsAddingSize(false);
      setNewColor("");
      Notification("Thêm kích cỡ thành công", "success");
      await fetchData("/admin/mau-sac/hien-thi/true", setSizes);
    } catch (error) {
      Notification("Lỗi khi thêm mau-sac!", "error");
    }
  };

  const handleAddSize = async () => {
    if (!newSize.trim()) return;
    try {
      const response = await api.post("/admin/kich-co/them", {
        ten: newSize,
      });
      const newOption = { value: response.data.idKichCo, label: response.data.ten };
      setSelectedSizes((prevSelected) => [...prevSelected, newOption]);
      setIsAddingSize(false);
      setNewSize("");
      Notification("Thêm kích cỡ thành công", "success");
      await fetchData("/admin/kich-co/hien-thi/true", setSizes);
    } catch (error) {
      Notification("Lỗi khi thêm kích cỡ!", "error");
    }
  };
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
      Notification(`Lỗi khi thêm ${type.replace("-", " ")}!`, "error");
    }
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

  useEffect(() => {
    if (selectedColors.length > 0 && selectedSizes.length > 0) {
      setVariants((prevVariants) => {
        const newVariants = [];
        selectedColors.forEach((color) => {
          selectedSizes.forEach((size) => {
            // Nếu biến thể đã bị xóa, bỏ qua
            if (
              deletedVariants.some((d) => d.colorId === color.value && d.sizeId === size.value)
            ) {
              return;
            }
            // Nếu biến thể đã tồn tại, giữ lại quantity và price
            const oldVariant = prevVariants.find(
              (v) => v.colorId === color.value && v.sizeId === size.value
            );
            newVariants.push({
              colorId: color.value,
              colorName: color.label,
              sizeId: size.value,
              sizeName: size.label,
              quantity: oldVariant ? oldVariant.quantity : "",
              price: oldVariant ? oldVariant.price : "",
            });
          });
        });
        return newVariants;
      });
    } else {
      setVariants([]);
    }
  }, [selectedColors, selectedSizes, deletedVariants]);

  const groupedVariants = useMemo(() => {
    const groups = {};
    variants.forEach((variant) => {
      if (!groups[variant.colorId]) {
        groups[variant.colorId] = {
          colorName: variant.colorName,
          variants: [],
        };
      }
      groups[variant.colorId].variants.push(variant);
    });
    return groups;
  }, [variants]);

  const updateVariantField = (colorId, sizeId, field, value) => {
    // Ensure the value is greater than or equal to 1
    const newValue = field === 'quantity' || field === 'price' ? Math.max(1, value) : value;

    setVariants((prevVariants) =>
      prevVariants.map((v) =>
        v.colorId === colorId && v.sizeId === sizeId
          ? { ...v, [field]: newValue }
          : v
      )
    );
  };

  const handleDeleteVariant = (colorId, sizeId) => {
    // Lưu lại các biến thể bị xóa
    setDeletedVariants((prev) => {
      const newDeletedVariants = [...prev, { colorId, sizeId }];
      // Xóa biến thể khỏi danh sách
      setVariants((prevVariants) =>
        prevVariants.filter(
          (v) => !(v.colorId === colorId && v.sizeId === sizeId)
        )
      );
      return newDeletedVariants;
    });

  };

  useEffect(() => {
    // Sắp xếp lại các biến thể sau khi thêm hoặc xóa
    setVariants((prevVariants) => {
      let index = 0;
      return prevVariants.map((variant) => {
        // Thêm index cục bộ vào từng biến thể
        return { ...variant, index: index++ };
      });
    });
  }, [deletedVariants]);

  const handleGroupSelectAllChange = (groupVariants, checked) => {
    if (checked) {
      const newIds = groupVariants.map((v) => `${v.colorId}-${v.sizeId}`);
      setSelectedVariantIds((prev) => [
        ...prev,
        ...newIds.filter((id) => !prev.includes(id)),
      ]);
    } else {
      setSelectedVariantIds((prev) =>
        prev.filter(
          (id) =>
            !groupVariants.some((v) => `${v.colorId}-${v.sizeId}` === id)
        )
      );
    }
  };

  const handleCommonAllQuantityChange = (e) => {
    let newQuantity = Number(e.target.value);
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    setCommonAll((prev) => ({ ...prev, quantity: newQuantity }));
    // Cập nhật các biến thể được chọn
    setVariants((prevVariants) =>
      prevVariants.map((v) =>
        selectedVariantIds.includes(`${v.colorId}-${v.sizeId}`)
          ? { ...v, quantity: newQuantity }
          : v
      )
    );
  };

  const handleCommonAllPriceChange = (e) => {
    let newPrice = Number(e.target.value);
    if (newPrice < 1) {
      newPrice = 1;
    }
    setCommonAll((prev) => ({ ...prev, price: newPrice }));
    // Cập nhật các biến thể được chọn
    setVariants((prevVariants) =>
      prevVariants.map((v) =>
        selectedVariantIds.includes(`${v.colorId}-${v.sizeId}`)
          ? { ...v, price: newPrice }
          : v
      )
    );
  };


  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra các ô bắt buộc
    if (!productSelected) newErrors.product = "Sản phẩm là bắt buộc";
    if (!shoeCollarSelected) newErrors.shoeCollar = "Cổ giày là bắt buộc";
    if (!shoeSoleSelected) newErrors.shoeSole = "Đế giày là bắt buộc";
    if (!shoeToeSelected) newErrors.shoeToe = "Mũi giày là bắt buộc";
    if (!materialSelected) newErrors.material = "Chất liệu là bắt buộc";
    if (!brandSelected) newErrors.brand = "Thương hiệu là bắt buộc";
    if (!supplierSelected) newErrors.supplier = "Nhà cung cấp là bắt buộc";
    if (!categorySelected) newErrors.category = "Danh mục là bắt buộc";

    // Kiểm tra các ô giá và số lượng biến thể
    variants.forEach((variant, idx) => {
      if (!variant.price) {
        newErrors[`price_${variant.index}`] = `Giá cho biến thể ${variant.sizeName} là bắt buộc`;
      }
      if (!variant.quantity) {
        newErrors[`quantity_${variant.index}`] = `Số lượng cho biến thể ${variant.sizeName} là bắt buộc`;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Nếu không có lỗi
  };


  const handleSubmit = async () => {
    if (validateForm()) {
      const safeSelectValueFor = (type, selected) => {
        if (!selected || !selected.value) return null;
        const { value, label } = selected;
        switch (type) {
          case "san-pham":
            return { idSanPham: value, ten: label, trangThai: true };
          case "co-giay":
            return { idCoGiay: value, ten: label, trangThai: true };
          case "de-giay":
            return { idDeGiay: value, ten: label, trangThai: true };
          case "mui-giay":
            return { idMuiGiay: value, ten: label, trangThai: true };
          case "chat-lieu":
            return { idChatLieu: value, ten: label, trangThai: true };
          case "thuong-hieu":
            return { idThuongHieu: value, ten: label, trangThai: true };
          case "nha-cung-cap":
            return { idNhaCungCap: value, ten: label, trangThai: true };
          case "danh-muc":
            return { idDanhMuc: value, ten: label, trangThai: true };
          default:
            return null;
        }
      };

      const payload = {
        sanPham: safeSelectValueFor("san-pham", productSelected),
        coGiay: safeSelectValueFor("co-giay", shoeCollarSelected),
        deGiay: safeSelectValueFor("de-giay", shoeSoleSelected),
        muiGiay: safeSelectValueFor("mui-giay", shoeToeSelected),
        chatLieu: safeSelectValueFor("chat-lieu", materialSelected),
        thuongHieu: safeSelectValueFor("thuong-hieu", brandSelected),
        nhaCungCap: safeSelectValueFor("nha-cung-cap", supplierSelected),
        danhMuc: safeSelectValueFor("danh-muc", categorySelected),
        moTa: description,
        bienThe: variants.map((variant) => ({
          mauSac: {
            idMauSac: variant.colorId,
            ten: variant.colorName,
            trangThai: true,
          },
          kichCo: {
            idKichCo: variant.sizeId,
            ten: variant.sizeName,
            trangThai: true,
          },
          soLuong: variant.quantity ?? 0,
          gia: variant.price ?? 0,
        })),
      };

      setLoading(true);
      try {
        const productResponse = await api.post(
          "/admin/chi-tiet-san-pham/them",
          payload
        );
        await handleUploadImages(productResponse.data);
        Notification("Thêm chi tiết sản phẩm thành công", "success");
        navigate(`/admin/product-details-manager/phan-trang/${productSelected.value}`);
      } catch (error) {
        Notification("Lỗi khi thêm chi tiết sản phẩm", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-2 space-y-4 text-sm">
      {/* Breadcrumb */}
      <nav className="text-gray-500 mb-4">
        <span className="cursor-pointer hover:underline" onClick={() => navigate("/admin/dashboard")}>
          Trang chủ
        </span>{" "}
        &gt;{" "}
        <span className="cursor-pointer hover:underline" onClick={() => navigate("/admin/products")}>
          Sản phẩm
        </span>{" "}
        &gt; <span className="font-semibold text-black">Thêm chi tiết sản phẩm</span>
      </nav>
      {/* <h1 className="text-lg font-semibold mb-4">Chi Tiết Sản Phẩm</h1> */}

      {/* Layout 2 cột: Cột bên trái (Card 1 & Card 2), Cột bên phải (Card 3) */}
      <div className="">
        {/* Cột bên trái */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Card 1 - Thông Tin Sản Phẩm */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg mb-4">Thông Tin Sản Phẩm</h2>
            <div className="space-y-4">
              {/* Sản Phẩm */}
              <div>
                <div className="font-semibold mb-1">Sản Phẩm</div>
                <CreatableSelect
                  isClearable
                  options={productOptions}
                  value={productSelected}
                  onChange={(selected) => {
                    setProductSelected(selected);
                    if (!selected) {
                      // Nếu không có sản phẩm được chọn, làm sạch các state phụ thuộc
                      setSelectedColors([]);
                      setSelectedSizes([]);
                      setVariants([]);
                      setDeletedVariants([]);
                      setSelectedVariantIds([]);
                      setCommonAll({});
                    }
                  }}
                  onCreateOption={(inputValue) => handleCreateOption("san-pham", inputValue)}
                  placeholder="Chọn hoặc nhập tên sản phẩm..."
                  formatCreateLabel={(input) => `Thêm mới "${(input || "").trim()}"`}
                  isValidNewOption={isValidNewOption}
                  filterOption={customFilterOption}
                />
                {errors.product && <div className="text-red-600 text-xs">* {errors.product}</div>}
              </div>

              {/* Các thuộc tính khác */}
              <div className="grid grid-cols-3 gap-6">
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

              {/* Mô Tả */}
              <div>
                <div className="font-semibold mb-1">Mô Tả</div>
                <textarea
                  className="border p-2 rounded-md w-full"
                  rows="4"
                  placeholder="Nhập mô tả sản phẩm..."
                  value={description || ""}
                  onChange={(e) => setDescription(e.target.value ?? null)}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Card 2 - Màu Sắc & Kích Cỡ */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg mb-4">Biến thể</h2>
            <div className="grid grid-cols gap-6">
              <div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold mb-1">Màu Sắc</div>
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => {
                      if (!productSelected) {
                        Notification("Bạn chưa chọn sản phẩm!", "error");
                        return;
                      }
                      setIsAddingColor(true);
                    }}
                  >
                    Thêm màu sắc
                  </button>
                </div>
                <Select
                  isMulti
                  options={colorOptions}
                  formatOptionLabel={(option) => (
                    <span className="flex items-center space-x-2">
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: option.label }}
                      ></span>
                      <span>{option.label}</span>
                    </span>
                  )}
                  value={selectedColors}
                  onChange={setSelectedColors}
                  isDisabled={!productSelected}
                  placeholder="Chọn màu sắc ..."
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold mb-1">Kích Cỡ</div>
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => {
                      if (!productSelected) {
                        Notification("Bạn chưa chọn sản phẩm!", "error");
                        return;
                      }
                      setIsAddingSize(true);
                    }}
                  >
                    Thêm kích cỡ
                  </button>
                </div>
                <Select
                  isMulti
                  options={sizeOptions}
                  value={selectedSizes}
                  onFocus={() => {
                    if (!productSelected) {
                      Notification("Bạn chưa chọn sản phẩm!", "error");
                      return;
                    }
                  }}
                  isDisabled={!productSelected}
                  placeholder="Chọn kích cỡ ..."
                  onChange={setSelectedSizes}
                  className="border p-2 rounded-md w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cột bên phải */}
        <div className="bg-white p-6 rounded-lg shadow-md relative">
          {/* <h2 className="font-semibold mb-4">Biến Thể</h2> */}
          {Object.keys(groupedVariants).length > 0 ? (
            <div className="overflow-x-auto">
              {/* Bảng hiển thị biến thể */}
              <div className="overflow-x-auto">
                <div className="flex space-x-4 mb-2">
                  <div>
                    <label className="block text-xs text-gray-600">Số lượng chung</label>
                    <input
                      type="number"
                      value={commonAll.quantity}
                      onChange={handleCommonAllQuantityChange}
                      className="border rounded p-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Giá chung</label>
                    <input
                      type="number"
                      value={commonAll.price}
                      onChange={handleCommonAllPriceChange}
                      className="border rounded p-1 text-sm"
                    />
                  </div>
                </div>
                <table className="w-full border-collapse text-sm table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-center">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedVariantIds(variants.map(v => `${v.colorId}-${v.sizeId}`));
                            } else {
                              setSelectedVariantIds([]);
                            }
                          }}
                          checked={variants.length > 0 && selectedVariantIds.length === variants.length}
                        />
                      </th>
                      <th className="p-2">STT</th>
                      <th className="p-2">Tên Sản Phẩm</th>
                      <th className="p-2">Số Lượng</th>
                      <th className="p-2">Giá</th>
                      <th className="p-2">Hành Động</th>
                      <th className="p-2">Ảnh</th>
                    </tr>


                  </thead>
                  <tbody>
                    {Object.values(groupedVariants).map((group,index) => {
                      const colorName = group.colorName;
                      const variantsGroup = group.variants;
                      return (
                        // <>
                          variantsGroup.map((variant, idx) => {
                            const variantId = `${variant.colorId}-${variant.sizeId}`;
                            return (
                              <tr key={variantId} className="border-t">
                                <td className="p-2 text-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedVariantIds.includes(variantId)}
                                    onChange={() => {
                                      let newSelected;
                                      if (selectedVariantIds.includes(variantId)) {
                                        newSelected = selectedVariantIds.filter(
                                          (id) => id !== variantId
                                        );
                                      } else {
                                        newSelected = [...selectedVariantIds, variantId];
                                      }
                                      setSelectedVariantIds(newSelected);
                                    }}
                                  />
                                </td>
                                {idx === 0 && (<td className="p-2 text-center " rowSpan={variantsGroup.length} >{index + 1}</td>)}
                                <td className="p-2">
                                  {productSelected && productSelected.label
                                    ? `${productSelected.label} [${variant.colorName} - ${variant.sizeName}]`
                                    : `[${variant.colorName} - ${variant.sizeName}]`}
                                </td>
                                <td className="p-2 text-center">
                                  <input
                                    min={1}
                                    type="number"
                                    value={variant.quantity ?? 0}
                                    onChange={(e) => {
                                      const newValue = Math.max(1, e.target.value);
                                      updateVariantField(
                                        variant.colorId,
                                        variant.sizeId,
                                        "quantity",
                                        newValue
                                      );
                                    }}
                                    className="w-20 border rounded p-1 text-center"
                                  />
                                  {errors[`quantity_${variant.index}`] && (
                                    <div className="text-red-600 text-xs">
                                      {errors[`quantity_${variant.index}`]}
                                    </div>
                                  )}
                                </td>
                                <td className="p-2 text-center">
                                  <input
                                    min={1}
                                    type="number"
                                    value={variant.price ?? 0}
                                    onChange={(e) => {
                                      const newValue = Math.max(1, e.target.value);
                                      updateVariantField(
                                        variant.colorId,
                                        variant.sizeId,
                                        "price",
                                        newValue
                                      );
                                    }}
                                    className="w-20 border rounded p-1 text-center"
                                  />
                                  {errors[`price_${variant.index}`] && (
                                    <div className="text-red-600 text-xs">
                                      {errors[`price_${variant.index}`]}
                                    </div>
                                  )}
                                </td>
                                <td className="p-2 text-center">
                                  <button
                                    onClick={() =>
                                      handleDeleteVariant(variant.colorId, variant.sizeId)
                                    }
                                  >
                                    <Trash size={16} className="text-red-600" />
                                  </button>
                                </td>
                                {/* Ở dòng đầu tiên của nhóm, hiển thị ô ảnh với rowSpan bằng số biến thể */}
                                {idx === 0 && (
                                  <td className="p-2" rowSpan={variantsGroup.length}>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      multiple
                                      onChange={(event) => handleImageChange(event, colorName)}
                                      className="block w-full mb-2"
                                    />
                                    <div className="flex gap-2 flex-wrap">
                                      {selectedImages[colorName]?.map((file, index) => (
                                        <div key={index} className="relative w-24 h-24">
                                          <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="w-full h-full object-cover rounded-md border"
                                          />
                                          <button
                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                            onClick={() => handleRemoveImage(colorName, index)}
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                        // }
                        
                      );
                    })}
                  </tbody>

                </table>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 flex justify-center items-center h-full">Chưa có biến thể nào</div>
          )}
          {variants.length > 0 && (
            <div className="flex justify-end mt-4">
              <button
                className="p-2 bg-green-600 text-white rounded-md"
                onClick={showAlert}
              >
                Thêm chi tiết sản phẩm
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal thêm màu sắc */}
      <Dialog
        open={isAddingColor}
        onClose={() => setIsAddingColor(false)}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 text-center">Chọn Màu Sắc</h2>
          <SketchPicker
            color={newColor}
            onChange={(color) => {
              setNewColor(color.hex)
            }}
            className="mx-auto"
          />
          <div className="flex justify-center space-x-2 mt-4 w-full">
            <button
              className="p-2 border border-gray-400 text-gray-600 rounded-md w-1/2"
              onClick={() => setIsAddingColor(false)}
            >
              Hủy
            </button>
            <button
              className="p-2 bg-black text-white rounded-md w-1/2"
              onClick={handleAddColor}
            >
              Lưu
            </button>
          </div>
        </div>
      </Dialog>

      {/* Modal thêm kích cỡ */}
      <Dialog
        open={isAddingSize}
        onClose={() => setIsAddingSize(false)}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4 text-center">Thêm Kích Cỡ</h2>
          <input
            type="text"
            className="border p-2 rounded-md w-full"
            placeholder="Nhập kích cỡ mới..."
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            onBlur={() => {
              // Kiểm tra định dạng kích cỡ (số nguyên hoặc số thập phân, ví dụ "39", "39.5")
              const regex = /^[0-9]+(\.[0-9]+)?$/;
              if (!regex.test(newSize)) {
                Notification("Kích cỡ không hợp lệ! Vui lòng nhập số hoặc số thập phân.", "error");
                setNewSize(""); // Clear giá trị khi không hợp lệ
              }
            }}
          />
          <div className="flex justify-center space-x-2 mt-4 w-full">
            <button
              className="p-2 border border-gray-400 text-gray-600 rounded-md w-1/2"
              onClick={() => setIsAddingSize(false)}
            >
              Hủy
            </button>
            <button
              className="p-2 bg-black text-white rounded-md w-1/2"
              onClick={handleAddSize}
            >
              Lưu
            </button>
          </div>
        </div>
      </Dialog>
      {loading && (<Loading />)}
      <Alert
        message={alertMessage}
        open={alertOpen}
        onClose={handleAlertClose}
      />
      <ToastContainer />
    </div>
  );
}