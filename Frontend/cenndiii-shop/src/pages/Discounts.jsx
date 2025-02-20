import { useState, useEffect } from "react";
import { Search, Eye, Plus} from "lucide-react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import DatePicker from 'react-datepicker';
import { ToastContainer } from 'react-toastify';

export default function Discounts() {
  const [filters, setFilters] = useState({ tenDotGiamGia: "", hinhThuc: "all", giaTri: 0, ngayBatDau: "", ngayKetThuc: "", trangThai: "all" });
  const [dotGiamGias, setDotGiamGias] = useState([]);
  const limit = 4; // Số bản ghi trên mỗi trang
  const [skip, setSkip] = useState(0); // Vị trí bắt đầu
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
    fetchdotGiamGias(skip, limit);
  }, 1000); // Đợi 1 giây trước khi gọi hàm
  return () => clearTimeout(timeoutId)
  }, [filters]);

  const fetchdotGiamGias = async (skip, limit) => {
    try {
      let apiDS = `http://localhost:8080/admin/dot-giam-gia/hien-thi?skip=${skip}&limit=${limit}`;
      if (filters.tenDotGiamGia) {
        apiDS = `${apiDS}&tenDotGiamGia=${filters.tenDotGiamGia}`
      }
      if (filters.hinhThuc) {
        apiDS = `${apiDS}&hinhThuc=${filters.hinhThuc}`
      }
      if (filters.giaTri) {
        apiDS = `${apiDS}&giaTri=${filters.giaTri}`
      }
      if (filters.ngayBatDau) {
        const oldDate = filters.ngayBatDau;
        filters.ngayBatDau = moment(filters.ngayBatDau).format("YYYY-MM-DDTHH:mm:ss.SSS")
        apiDS = `${apiDS}&ngayBatDau=${filters.ngayBatDau}`;
        filters.ngayBatDau = oldDate;
      }
      if (filters.ngayKetThuc) {
        const oldDate = filters.ngayKetThuc;
        filters.ngayKetThuc = moment(filters.ngayKetThuc).format("YYYY-MM-DDTHH:mm:ss.SSS")
        apiDS = `${apiDS}&ngayKetThuc=${filters.ngayKetThuc}`;
        filters.ngayKetThuc = oldDate;
      }
      if (filters.trangThai) {
        apiDS = `${apiDS}&trangThai=${filters.trangThai}`
      }
      const response = await axios.get(apiDS);
      response.data.data.forEach(i => {
        i.ngayBatDau = formatDate(i.ngayBatDau)
        i.ngayKetThuc = formatDate(i.ngayKetThuc)
      });
      setDotGiamGias(response.data.data);
      const total = Number(response.data.total) / Number(limit);
      setTotalPages(Math.trunc(total) + (total % 1 !== 0 ? 1 : 0)); // Tính tổng số trang
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Chưa có"; // Handle cases where the date is missing
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0'); // Add leading zero for single digit
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = d.getFullYear();
  
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  };

  const handleChange1 = (date) => {
    setFilters({ ...filters, ngayBatDau: date });
  }; 

  const handleChange2 = (date) => {
    setFilters({ ...filters, ngayKetThuc: date });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      const skipNew = skip + limit;
      setSkip(skipNew);
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchdotGiamGias(skipNew, limit);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      const skipNew = skip - limit;
      setSkip(skipNew);
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchdotGiamGias(skipNew, limit);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <ToastContainer />
      <h1 className="text-lg font-semibold mb-4">Đợt giảm giá</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-3 gap-4">
          {/* Tên */}
          <div className="relative text-sm">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              name="tenDotGiamGia"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, tenDotGiamGia: e.target.value })}
              placeholder="Tìm theo tên..."
              className="w-full pl-10 p-2 border rounded-md"
            />
          </div>
          {/* Hình thức */}
          <div className="relative text-sm">
            <select
              name="hinhThuc"
              value={filters.hinhThuc}
              onChange={(e) => setFilters({ ...filters, hinhThuc: e.target.value, giaTri: "" })}
              className="border p-2 rounded-md w-full"
            >
              <option value="all">Tất cả hình thức</option>
              <option value="2">%</option>
              <option value="1">VND</option>
            </select>
          </div>
          {/* Giá Trị */}
          <div className="relative text-sm">
            <input
              id="giaTri"
              type="text"
              name="giaTri"
              placeholder="Giá trị"
              value={filters.giaTri ? filters.giaTri.toLocaleString("en-US") : ""}
              onChange={(e) => { 
                let rawValue = e.target.value.replace(/,/g, ""); // Xóa dấu phẩy
                let numberValue = Number(rawValue); // Chuyển thành số nguyên
                if (!isNaN(numberValue) && numberValue > 0 && Number.isInteger(Number(numberValue))) {
                  if (filters.hinhThuc === "%" && numberValue > 100) {
                    setFilters({ ...filters, giaTri: 100 }); // Giới hạn max là 100 nếu chọn %
                  } else {
                    setFilters({ ...filters, giaTri: numberValue });
                  }
                } else {
                  setFilters({ ...filters, giaTri: null });
                }
              }}
              onKeyPress={(e) => {
                // Ngăn không cho nhập dấu cộng và dấu trừ
                if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                  e.preventDefault();  // Ngừng hành động nhập
                }
              }}
              className="w-full p-2 border rounded-md"
              min="1"
            />
          </div>
          {/* Thòi gian */}
          <div className="relative text-sm ">
            <DatePicker
              selected={filters.ngayBatDau}
              onChange={handleChange1}
              showTimeSelect // Hiển thị phần chọn giờ và phút
              timeFormat="HH:mm" // Định dạng giờ: phút
              dateFormat="dd/MM/yyyy HH:mm" // Định dạng ngày và giờ
              timeIntervals={1} // Khoảng cách giữa các phút có thể chọn (15 phút)
              className="w-full p-2 border rounded-md"
              placeholderText="Ngày bắt đầu: Chọn ngày và giờ"
          />
          </div>
          <div className="relative text-sm w-full">
            <DatePicker
              selected={filters.ngayKetThuc}
              onChange={handleChange2}
              showTimeSelect // Hiển thị phần chọn giờ và phút
              timeFormat="HH:mm" // Định dạng giờ: phút
              dateFormat="dd/MM/yyyy HH:mm" // Định dạng ngày và giờ
              timeIntervals={1} // Khoảng cách giữa các phút có thể chọn (15 phút)
              className="w-full p-2 border rounded-md"
              placeholderText="Ngày kết thúc: Chọn ngày và giờ"
            />
          </div>
          {/* Trạng thái */}
          <div className="relative text-sm">
            <select
              name="trangThai"
              value={filters.trangThai}
              onChange={(e) => setFilters({ ...filters, trangThai: e.target.value })}
              className="border p-2 rounded-md w-full"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="2">Sắp diễn ra</option>
              <option value="1">Đang diễn ra</option>
              <option value="0">Bị vô hiệu hóa</option>
            </select>
          </div>
        </div>
      </div>
      {/* Danh Sách */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Danh sách đợt giảm giá</h2>
          <button className="flex items-center justify-center border border-black rounded-full w-8 h-8">
            <NavLink to="/discounts/add" className={({ isActive }) => `block transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`}>
              <Plus size={20} stroke="black" />
            </NavLink>
          </button>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="p-2">STT</th>
              <th className="p-2">Mã</th>
              <th className="p-2">Tên</th>
              <th className="p-2">Giá trị giảm</th>
              <th className="">Hình thức giảm</th>
              <th className="p-2">Thời gian bắt đầu</th>
              <th className="p-2">Thời gian kết thúc</th>
              <th className="p-2">Trạng Thái</th>
              <th className="p-2">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {dotGiamGias.map((dotGiamGia, index) => {
              // Chuyển đổi chuỗi ngày thành đối tượng Date
              const parseDate = (dateString) => {
                if (!dateString) return null;
                const [time, date] = dateString.split(" ");
                const [hours, minutes, seconds] = time.split(":").map(Number);
                const [day, month, year] = date.split("/").map(Number);
                return new Date(year, month - 1, day, hours, minutes, seconds);
              };

              const now = new Date();
              const startDate = parseDate(dotGiamGia.ngayBatDau);
              const endDate = parseDate(dotGiamGia.ngayKetThuc);
              return (
                <tr key={dotGiamGia.idDotGiamGia} className="border-t text-center">
                  <td className="p-2">{index + skip + 1}</td>
                  <td className="p-2">{dotGiamGia.maDotGiamGia}</td>
                  <td className="p-2 text-left">{dotGiamGia.tenDotGiamGia}</td>
                  <td className="p-2">{dotGiamGia.giaTri.toLocaleString("en-US")}</td>
                  <td className="p-2">{dotGiamGia.hinhThuc}</td>
                  <td className="p-2">{dotGiamGia.ngayBatDau}</td>
                  <td className="p-2">{dotGiamGia.ngayKetThuc}</td>
                  <td className="p-2 ">
                  <span 
                    className={`px-2 py-1 rounded w-29 text-center border
                      ${new Date() < new Date(startDate)
                        ? "bg-yellow-300 text-yellow-800 border-yellow-800"  // Sắp diễn ra
                        : new Date() > new Date(endDate)
                          ? "bg-orange-200 text-orange-800 border-orange-800" // Bị vô hiệu hóa
                          : "bg-green-300 text-green-800 border-green-800"}`} // Đang diễn ra
                  >
                    {new Date() < new Date(startDate) 
                      ? "Sắp diễn ra" 
                      : new Date() > new Date(endDate) 
                        ? "Bị vô hiệu hóa" 
                        : "Đang diễn ra"}
                  </span>
                  </td>
                  <td className="p-2 flex space-x-2 justify-center items-center">
                    <NavLink 
                      to={`/discounts/edit/${dotGiamGia.idDotGiamGia}`}
                      className={({ isActive }) => `text-black p-1 rounded ${isActive ? "bg-gray-300" : "hover:bg-gray-100"}`}
                    >
                      <Eye size={18} stroke="black" />
                    </NavLink>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
  );
}

  