import { useState, useEffect } from "react";
import { Search, Eye, Edit, Plus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import api from "../../../security/Axios";
import { hasPermission } from "../../../security/DecodeJWT";
export default function EmployeeManagement() {
  const [filters, setFilters] = useState({ search: "", trangThai: "all", dob: "" });
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1);   // Tổng số trang

  useEffect(() => {
    fetchEmployees(); // Gọi lại khi trang thay đổi
  }, [currentPage]); // Chỉ gọi lại khi currentPage thay đổi
  useEffect(() => {
    if (!hasPermission("ADMIN") && !hasPermission("STAFF")) {
        navigate("/admin/login");
    }
}, [navigate]);

  const fetchEmployees = async (filtersToUse = filters, pageToUse = currentPage) => {
    try {
      const { search, trangThai, dob } = filtersToUse;
      let params = {
        page: pageToUse,
        size: 5, // Số lượng phần tử mỗi trang
        trangThai: trangThai === "1" ? true : trangThai === "0" ? false : undefined,
        ngaySinh: dob || undefined,
      };
      // Kiểm tra search là số hay chữ
      if (!isNaN(search) && search.trim() !== "") {
        params.soDienThoai = search;
      } else if (search.trim() !== "") {
        params.ten = search;
      }
      const response = await api.get("/admin/nhan-vien/search", { params });
      setEmployees(response.data.content); // Lấy danh sách nhân viên từ response
      setTotalPages(response.data.totalPages); // Lưu tổng số trang
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
    }
  }

  // lấy ds không phân trang
  const fetchAllEmployees = async () => {
    try {
      const response = await api.get("/admin/nhan-vien/hien-thi");
      console.log(response.data); // Kiểm tra phản hồi từ API
      return response.data; // Trả về chỉ phần content
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      return []; // Trả về mảng rỗng nếu có lỗi
    }
  };
  // import excel
  const exportToExcel = async () => {
    const allEmployees = await fetchAllEmployees(); // Lấy danh sách nhân viên
    if (!Array.isArray(allEmployees) || allEmployees.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    // Chọn các trường bạn muốn xuất
    const formattedData = allEmployees.map(employee => ({
      "Họ Tên": employee.ten,
      "Số Điện Thoại": employee.soDienThoai,
      "Địa Chỉ": employee.diachi || "Chưa có", // Nếu địa chỉ là null, hiển thị "Chưa có"
      "Ngày Sinh": employee.ngaySinh ? new Date(employee.ngaySinh).toLocaleDateString("vi-VN") : "Chưa có", // Kiểm tra nếu có ngày sinh
      "Giới Tính": employee.gioiTinh == "Nam" ? "Nam" : "Nữ", // Chuyển đổi giá trị chuỗi thành giới tính
      "Trạng Thái": employee.trangThai ? "Hoạt động" : "Ngừng hoạt động"
    }));

    // Chuyển dữ liệu sang worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "employees.xlsx");
  };


  const searchEmployees = async () => {
    setCurrentPage(0); // Đặt lại trang về 0 khi tìm kiếm
    await fetchEmployees(); // Gọi lại danh sách nhân viên
  };

  const resetFilters = () => {
    setFilters({ search: "", trangThai: "all", dob: "" });
    setCurrentPage(0); // Đặt lại trang về 0
    fetchEmployees({ search: "", trangThai: "all", dob: "" }, 0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-lg font-semibold mb-4">Quản lý tài khoản nhân viên</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold mb-4">Bộ Lọc</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="relative text-sm">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Tìm theo tên hoặc số điện thoại..."
              className="w-full pl-10 p-2 border rounded-md"
            />
          </div>

          <div className="relative text-sm">
            <select
              name="trangThai"
              value={filters.trangThai}
              onChange={(e) => setFilters({ ...filters, trangThai: e.target.value })}
              className="border p-2 rounded-md w-full"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="1">Hoạt động</option>
              <option value="0">Ngừng hoạt động</option>
            </select>
          </div>

          <div className="relative text-sm">
            <input
              type="date"
              name="dob"
              value={filters.dob}
              onChange={(e) => setFilters({ ...filters, dob: e.target.value })}
              className="border p-2 rounded-md w-full"
              placeholder="Tìm theo ngày sinh"
            />
          </div>
        </div>
        <button
          onClick={searchEmployees}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Tìm Kiếm
        </button>

        <button
          onClick={resetFilters}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Làm Mới
        </button>
      </div>

      <button
        onClick={exportToExcel}  // Gọi hàm exportToExcel
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
      >
        Xuất Excel
      </button>``
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Danh Sách Nhân Viên</h2>
          <button
            className="flex items-center justify-center border border-black rounded-full w-8 h-8"
            onClick={() => navigate("/admin/employees/add")}
          >
            <Plus size={20} stroke="black" />
          </button>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">STT</th>
              <th className="p-2">Ảnh</th>
              <th className="p-2">Tên Nhân Viên</th>
              <th className="p-2">CCCD</th>
              <th className="p-2">Số Điện Thoại</th>
              <th className="p-2">Ngày Sinh</th>
              <th className="p-2">Giới Tính</th>
              <th className="p-2">Trạng Thái</th>
              <th className="p-2">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={employee.idNhanVien} className="border-t">
                  <td className="p-2">{index + 1 + currentPage * 5}</td>
                  <td className="p-2"><img src={`${employee.hinh_anh}`} alt="Avatar" className="w-10 h-10 rounded-full" /></td>
                  <td className="p-2">{employee.ten}</td>
                  <td className="p-2">{employee.cccd}</td>
                  <td className="p-2">{employee.soDienThoai}</td>
                  <td className="p-2">{new Date(employee.ngaySinh).toLocaleDateString("vi-VN")}</td>
                  <td className="p-2">{employee.gioiTinh == "Nam" ? "Nam" : "Nữ"}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-white w-28 inline-block text-center ${employee.trangThai == 1 ? "bg-green-500" : "bg-red-500"}`}>
                      {employee.trangThai == 1 ? "Hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button className="text-black p-1 rounded" onClick={() => navigate(`/admin/employees/detail/${employee.idNhanVien}`)}>
                      <Eye size={18} stroke="black" />
                    </button>
                    <button className="text-black p-1 rounded" onClick={() => navigate(`/admin/employees/edit/${employee.idNhanVien}`)}>
                      <Edit size={18} stroke="black" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )
            }
          </tbody>
        </table>
        {employees.length > 0 && (
          <div className="flex justify-center items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Trước
            </button>
            <span className="mx-4">Trang {currentPage + 1} / {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 === totalPages}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}