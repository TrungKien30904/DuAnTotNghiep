// export default function Discounts() {
//     return (
//       <div className="p-6">
//         <h1 className="text-2xl font-bold">đợt giảm giá</h1>
//       </div>
//     );
// }

import React, { useState, useEffect } from "react";
import { Search} from "lucide-react";
import axios from "axios";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditDiscounts() {
  const { idDGG } = useParams();
  const [filters, setFilters] = useState({ search: ""});
  const [editMaDGG, editDGG] = useState({
    maDotGiamGia: "",
    tenDotGiamGia: "",
    hinhThuc: "%",
    giaTri: null,
    ngayBatDau: "",
    ngayKetThuc: "",
    ngayTao: new Date(),
    ngaySua: new Date()
  });
  const navigate = useNavigate(); // Khởi tạo hook điều hướng
  const [sanPhams, setSanPhams] = useState([]);
  const limit = 4; // Số bản ghi trên mỗi trang
  const [skip, setSkip] = useState(0); // Vị trí bắt đầu
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sanPhamChiTiets, setSanPhamChiTiets] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedIdsChiTiet, setSelectedIdsChiTiet] = useState([]);
  const [errorName, setErrorName] = useState(false);
  const [errorGiaTri, setErrorGiaTri] = useState(false);
  const [errorNBT, setErrorNBT] = useState(false);
  const [errorNKT, setErrorNKT] = useState(false);

  const handleUpdate = async () => {
    // Kiểm tra nếu tên đợt giảm giá trống
    if (!editMaDGG.tenDotGiamGia) {
      setErrorName(true); // Hiển thị lỗi nếu không có tên
      return; // Dừng hàm nếu chưa nhập tên
    } else {
      setErrorName(false); // Nếu đã có tên thì xóa lỗi
    }
    if (!editMaDGG.giaTri) {
      setErrorGiaTri(true);
      return;
    } else {
      setErrorGiaTri(false);
    }
    // Kiểm tra nếu ngày bắt đầu chưa được chọn
    if (!editMaDGG.ngayBatDau) {
      setErrorNBT(true); // Hiển thị lỗi nếu chưa chọn ngày
      return;
    } else {
      setErrorNBT(false); // Nếu đã chọn ngày, xóa lỗi
    }
    if (!editMaDGG.ngayKetThuc) {
      setErrorNKT(true);
      return;
    } else {
      setErrorNKT(false);
    }
    // Nếu có lỗi, dừng việc gọi hàm cập nhật
    if (!editMaDGG.tenDotGiamGia || !editMaDGG.giaTri) {
      return;
    }

    const result = await editDotGiamGias();  // Gọi hàm cập nhật
    if (result && result.status === 1) {
      toast.success("Cập nhật thành công!", {
        position: "top-right",  // Đảm bảo rằng bạn đã sử dụng position đúng
        style: {
          backgroundColor: '#28a745',
          color: 'white',
          borderRadius: '8px',
          pediting: '10px 20px',
        }
      });
      setTimeout(() => {
        navigate("/discounts"); // Chuyển hướng sau 1 giây
      }, 1000);
    } else {
      toast.error("Cập nhật không thành công, vui lòng thử lại!", {
        position: "top-right",
        style: {
          backgroundColor: '#dc3545',
          color: 'white',
          borderRadius: '8px',
          pediting: '10px 20px',
        }
      });
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckAllChange = () => {
    if (selectedIds.length === sanPhams.length) {
      setSelectedIds([]); // Bỏ chọn tất cả
    } else {
      setSelectedIds(sanPhams.map((item) => item.idSanPham)); // Chọn tất cả
    }
  };

  const handleCheckboxChangeChiTiet = (id) => {
    setSelectedIdsChiTiet((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckAllChangeChiTiet = () => {
    if (selectedIds.length === sanPhams.length) {
      setSelectedIdsChiTiet([]); // Bỏ chọn tất cả
    } else {
      setSelectedIdsChiTiet(sanPhams.map((item) => item.idSanPham)); // Chọn tất cả
    }
  };

  useEffect(() => {
    if (!sanPhamChiTiets || (sanPhamChiTiets && sanPhamChiTiets.length <= 0)) return setSelectedIdsChiTiet([]);
    const arrId = sanPhamChiTiets.map(i => i.idChiTietSanPham)
    const a = arrId.filter(id => selectedIdsChiTiet.includes(id));
    setSelectedIdsChiTiet(a)
  }, [sanPhamChiTiets]);

  useEffect(() => {
    fetchdotGiamGia();
    fetchSanPham(skip, limit);
  }, []);

  useEffect(() => {
    if (!filters.search) return;
    const timeoutId = setTimeout(() => {
      fetchSanPham(0, 4);
    }, 500); // Đợi 1 giây trước khi gọi hàm
  
    return () => clearTimeout(timeoutId)
  }, [filters.search]);

  useEffect(() => {
    if (!selectedIds || (selectedIds && selectedIds.length <= 0)) return setSanPhamChiTiets([]);
    fetchChiTietSanPhams(0, 4);
  }, [selectedIds]);

  const fetchdotGiamGia = async () => {
    try {
      const [response, response2] = await Promise.all([
        axios.get(`http://localhost:8080/admin/dot-giam-gia/chi-tiet-dgg/${idDGG}`),
        axios.get(`http://localhost:8080/admin/dot-giam-gia/get-list-id-san-pham-chi-tiet/${idDGG}`),
      ]);
      const body = response2.data;
      const response3 = await axios.post(
        "http://localhost:8080/admin/dot-giam-gia/get-list-id-san-pham",
        body
      );
      editDGG(response.data);
      setSelectedIds(response3.data);
      setSelectedIdsChiTiet(response2.data)
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const handleChange1 = (date) => {
    // setSelectedDate1(date);
    editDGG({ ...editMaDGG, ngayBatDau: date });
  }; 
  const handleChange2 = (date) => {
    // setSelectedDate2(date);
    editDGG({ ...editMaDGG, ngayKetThuc: date });
  }; 

  const editDotGiamGias = async () => {
    try {
      // const sanPhamChiTietTrue = sanPhamChiTiets.filter(i => i.isSelected);
      // const idChiTietSanPham = sanPhamChiTietTrue.map(i => i.idChiTietSanPham);
      const body = {dotGiamGia: {...editMaDGG}, idSanPhamChiTietList: selectedIdsChiTiet}
      const response = await axios.put("http://localhost:8080/admin/dot-giam-gia/cap-nhat-dgg",
        body
      );
      if (response && response.status === 200) {
        return { status: 1 }; // Trả về thành công
      } else {
        return { status: 0 }; // Trường hợp không thành công
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const fetchChiTietSanPhams = async (skip, limit) => {
    // const sanPhamsTrue = sanPhams.filter(item => item.isSelected)
    // const idSanPham = sanPhamsTrue.map(i=> i.idSanPham)
    try {
      const response = await axios.post(`http://localhost:8080/admin/dot-giam-gia/get-san-pham-chi-tiet?skip=${skip}&limit=${limit}`, {
        idSanPham: selectedIds // Truyền mảng vào trong body
        });
        setSanPhamChiTiets(response.data.data)
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const fetchSanPham = async (skip, limit) => {
    let response;
    if (filters.search) {
      response = await axios.get(`http://localhost:8080/admin/dot-giam-gia/get-san-pham?skip=${skip}&limit=${limit}&tenSanPham=${filters.search}`);
    } else {
      response = await axios.get(`http://localhost:8080/admin/dot-giam-gia/get-san-pham?skip=${skip}&limit=${limit}`);
    }
    setSanPhams(response.data.data);
    const total = Number(response.data.total) / Number(limit);
    setTotalPages(Math.trunc(total) + (total % 1 !== 0 ? 1 : 0)); // Tính tổng số trang
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      const skipNew = skip + limit;
      setSkip(skipNew);
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchSanPham(skipNew, limit);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      const skipNew = skip - limit;
      setSkip(skipNew);
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchSanPham(skipNew, limit);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <ToastContainer />
      <h1 className="text-lg font-semibold mb-4">Đợt giảm giá / Chi tiết đợt giảm giá</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        {/* <h2 className="text-sm font-semibold mb-4"></h2> */}
        <div className="grid grid-cols-5 gap-4">
          <div className="relative text-sm col-span-2">
            {/* Mã đợt giảm giá */}
            <label htmlFor="maDotGiamGia" className="block text-sm font-medium mb-1">
              Mã đợt giảm giá: <span className="text-red-500">*</span>
            </label>
            <input
              id="maDotGiamGia"
              type="text"
              name="maDotGiamGia"
              value={editMaDGG.maDotGiamGia}
              readOnly
              onChange={(e) => editDGG({ ...editMaDGG, maDotGiamGia: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            {/* Tên đợt giảm giá */}
            <label htmlFor="tenDotGiamGia" className="block text-sm font-medium mb-1">
              Tên đợt giảm giá: <span className="text-red-500">*</span>
            </label>
            <input
              id="tenDotGiamGia"
              type="text"
              name="tenDotGiamGia"
              value={editMaDGG.tenDotGiamGia}
              onChange={(e) => editDGG({ ...editMaDGG, tenDotGiamGia: e.target.value })}
              className={`w-full p-2 border rounded-md ${errorName ? 'border-red-500' : ''}`}
            />
            {errorName && <span className="text-red-500 text-sm">Tên đợt giảm giá không được để trống.</span>} {/* Thông báo lỗi */}
            {/* Hình thức */}
            <div className="grid grid-cols-3 gap-1">
              <h3 className="block text-sm font-medium mb-1">Hình thức: <span className="text-red-500">*</span></h3>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="hinhThuc"
                  value="%"
                  // checked={selectedOption === "option1"}
                  onChange={(e) => editDGG({ ...editMaDGG, hinhThuc: e.target.value, giaTri: "" }) }
                  checked={editMaDGG.hinhThuc === "%"}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <span>%</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="hinhThuc"
                  value="VND"
                  // checked={selectedOption === "option2"}
                  onChange={(e) => editDGG({ ...editMaDGG, hinhThuc: e.target.value, giaTri: "" }) }
                  checked={editMaDGG.hinhThuc === "VND"}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <span>VND</span>
              </label>
            </div>
            {/* Giá trị */}
            <label htmlFor="giaTri" className="block text-sm font-medium mb-1">
              Giá trị <span className="text-red-500">*</span>
            </label>
            <input
              id="giaTri"
              type="text"
              name="giaTri"
              value={editMaDGG.giaTri ? editMaDGG.giaTri.toLocaleString("en-US") : ""}
              onChange={(e) => { 
                let rawValue = e.target.value.replace(/,/g, ""); // Xóa dấu phẩy
                let numberValue = Number(rawValue); // Chuyển thành số nguyên
                // const value = e.target.value;
                // const regex = /^[0-9]+$/;
                if (!isNaN(numberValue) && numberValue > 0 && Number.isInteger(Number(numberValue))) {
                  if (editMaDGG.hinhThuc === "%" && numberValue > 100) {
                    editDGG({ ...editMaDGG, giaTri: 100 }); // Giới hạn max là 100 nếu chọn %
                  } else {
                    editDGG({ ...editMaDGG, giaTri: numberValue });
                  }
                } else {
                  editDGG({ ...editMaDGG, giaTri: null });
                }
              }}
              onKeyPress={(e) => {
                // Ngăn không cho nhập dấu cộng và dấu trừ
                if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                  e.preventDefault();  // Ngừng hành động nhập
                }
              }}
              className={`w-full p-2 border rounded-md ${errorGiaTri ? 'border-red-500' : ''}`}
              min="1"
            />
            {errorGiaTri && <span className="text-red-500 text-sm">Giá trị không được để trống.</span>} {/* Thông báo lỗi */}
            {/* Thời gian */}
            <div className="grid grid-cols-2">
              <div>
                <label htmlFor="dateTime" className="block text-sm font-medium mb-1">
                  Ngày bắt đầu: <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={editMaDGG.ngayBatDau}
                  onChange={handleChange1}
                  showTimeSelect // Hiển thị phần chọn giờ và phút
                  timeFormat="HH:mm" // Định dạng giờ: phút
                  dateFormat="dd/MM/yyyy HH:mm" // Định dạng ngày và giờ
                  timeIntervals={1} // Khoảng cách giữa các phút có thể chọn (15 phút)
                  className={`w-full p-2 border rounded-md ${errorNBT ? 'border-red-500' : ''}`} // Thêm class cho viền đỏ khi có lỗi
                  placeholderText="Chọn ngày và giờ"
              />
              {errorNBT && <span className="text-red-500 text-sm">Ngày bắt đầu không được để trống.</span>} {/* Hiển thị thông báo lỗi nếu chưa chọn ngày */}
              </div>
              <div>
                <label htmlFor="dateTime" className="block text-sm font-medium mb-1">
                  Ngày kết thúc: <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={editMaDGG.ngayKetThuc}
                  onChange={handleChange2}
                  showTimeSelect // Hiển thị phần chọn giờ và phút
                  timeFormat="HH:mm" // Định dạng giờ: phút
                  dateFormat="dd/MM/yyyy HH:mm" // Định dạng ngày và giờ
                  timeIntervals={1} // Khoảng cách giữa các phút có thể chọn (15 phút)
                  className={`w-full p-2 border rounded-md ${errorNKT ? 'border-red-500' : ''}`} // Thêm class cho viền đỏ khi có lỗi
                  placeholderText="Chọn ngày và giờ"
                />
                {errorNKT && <span className="text-red-500 text-sm">Ngày kết thúc không được để trống.</span>} {/* Hiển thị thông báo lỗi nếu chưa chọn ngày */}
              </div>
            </div>
           
            <div className="mt-3">
              {sanPhamChiTiets.length > 0
                ? null
                : <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                    // onClick={() => {editDotGiamGias()}}
                    onClick={handleUpdate}
                  >
                    Cập nhật
                  </button>
              }
              
            </div>
          </div>
          <div className="relative text-sm col-span-3">
            <div className="absolute text-sm w-1/2 right-3">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Tìm theo tên..."
                className="w-full pl-10 p-2 border rounded-md"
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={16} />
            </div>
            <div className="relative text-sm col-span-3">
              <div className=" text-sm mt-12 w-full max-h-48 overflow-y-auto border">
                <table className="w-full border-collapse text-sm pb-0 mb-0">
                  <thead className="bg-gray-100 text-center sticky top-0 z-10">
                    <tr className="bg-gray-100 text-center">
                      <th className="p-2">
                        <input
                          type="checkbox"
                          // checked={sanPhams.length > 0 && sanPhams.every(item => item.isSelected)}
                          // onChange={(e) => {
                          //   const checked = e.target.checked;
                          //   setSanPhams(sanPhams.map((item) => ({ ...item, isSelected: checked })));
                          // }}
                          checked={selectedIds.length > 0 && selectedIds.length === sanPhams.length}
                          onChange={handleCheckAllChange}
                        />
                      </th>
                      <th className="p-2">mã sản phẩm</th>
                      <th className="p-2">tên sản phẩm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sanPhams.map((sanPham, index) => (
                      <tr key={sanPham.idSanPham} className="border-t text-center">
                        <td className="p-2">
                          <input
                            type="checkbox"
                            // checked={sanPham.isSelected || false}
                            // onChange={() => {
                            //   setSanPhams((prevData) =>
                            //     prevData.map((item) =>
                            //       item.idSanPham === sanPham.idSanPham
                            //         ? { ...item, isSelected: !item.isSelected }
                            //         : item
                            //     )
                            //   );
                            // }}
                            checked={selectedIds.includes(sanPham.idSanPham)}
                        onChange={() => handleCheckboxChange(sanPham.idSanPham)}
                          />
                        </td>
                        <td className="p-2">{sanPham.maSanPham}</td>
                        <td className="p-2">{sanPham.ten}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-center items-center space-x-2 mt-4">
                  {/* Nút Prev */}
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 flex items-center justify-center border rounded-full ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                    }`}
                  >
                    ◀
                  </button>

                  {/* Hiển thị số trang */}
                  <span className="w-10 h-10 flex items-center justify-center border rounded-full font-semibold">
                    {currentPage}
                  </span>

                  {/* Nút Next */}
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 flex items-center justify-center border rounded-full ${
                      currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                    }`}
                  >
                    ▶
                  </button>
            </div>
          </div>
        </div>
      </div>
      {sanPhamChiTiets.length > 0 
        ? <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold">Chi Tiết Sản Phẩm</h2>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
                // onClick={() => {editDotGiamGias()}}
                onClick={handleUpdate}
              >
                Cập nhật
              </button>
            </div>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                <th className="p-2">
                    <input
                      type="checkbox"
                      // checked={sanPhamChiTiets.length > 0 && sanPhamChiTiets.every(item => item.isSelected)}
                      // onChange={(e) => {
                      //   const checked = e.target.checked;
                      //   setSanPhamChiTiets(sanPhamChiTiets.map((item) => ({ ...item, isSelected: checked })));
                      // }}
                      checked={selectedIdsChiTiet.length > 0 && selectedIdsChiTiet.length === sanPhamChiTiets.length}
                      onChange={handleCheckAllChangeChiTiet}
                    />
                  </th>
                  <th className="p-2">STT</th>
                  <th className="p-2">Mã sản phẩm</th>
                  <th className="p-2">Tên sản phẩm</th>
                  <th className="p-2">Danh mục</th>
                  <th className="p-2">Thương hiệu</th>
                  <th className="p-2">Chất liệu</th>
                  <th className="p-2">Kích cỡ</th>
                  <th className="p-2">Màu sắc</th>
                  <th className="p-2">Đế giày</th>
                </tr>
              </thead>
              <tbody>
                {sanPhamChiTiets.map((sanPhamChiTiet, index) => (
                  <tr key={sanPhamChiTiet.idChiTietSanPham} className="border-t">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        // checked={sanPhamChiTiet.isSelected || false}
                        // onChange={() => {
                        //   setSanPhamChiTiets((prevData) =>
                        //     prevData.map((item) =>
                        //       item.idChiTietSanPham === sanPhamChiTiet.idChiTietSanPham
                        //         ? { ...item, isSelected: !item.isSelected }
                        //         : item
                        //     )
                        //   );
                        // }}
                        checked={selectedIdsChiTiet.includes(sanPhamChiTiet.idChiTietSanPham)}
                        onChange={() => handleCheckboxChangeChiTiet(sanPhamChiTiet.idChiTietSanPham)}
                      />
                    </td>
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{sanPhamChiTiet.sanPham.maSanPham}</td>
                    <td className="p-2">{sanPhamChiTiet.sanPham.tenSanPham}</td>
                    <td className="p-2">{sanPhamChiTiet.danhMucSanPham.ten}</td>
                    <td className="p-2">{sanPhamChiTiet.thuongHieu.ten}</td>
                    <td className="p-2">{sanPhamChiTiet.chatLieu.ten}</td>
                    <td className="p-2">{sanPhamChiTiet.kichCo.ten}</td>
                    <td className="p-2">{sanPhamChiTiet.mauSac.ten}</td>
                    <td className="p-2">{sanPhamChiTiet.deGiay.ten}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        : null
      }
    </div>
  );
}

  