import { useState, useEffect, useCallback } from "react";
import { Eye, Plus, ChevronLeft, ChevronRight, Search } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
// import { useLoading } from "../components/ui/spinner/LoadingContext";
// import Spinner from "../components/ui/spinner/Spinner";

export default function Coupons() {
  // const { setLoadingState, loading } = useLoading();
  const [filters, setFilters] = useState({
    keyword: "",
    gioiTinh: "all",
    trangThai: "all",
    soDienThoai: "all", 
    currentPage: 0
  });
  const [customers, setKhachHangs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const exportToExcel = async () => {
    try {
      // setLoadingState(true);
      const response = await fetch("http://localhost:8080/admin/khach-hang/export-excel").then((response) => response.json())
        .then((result) => {
          // setLoadingState(false);
          const ws = XLSX.utils.json_to_sheet(result);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Khách Hàng");
          XLSX.writeFile(wb, "danh_sach_khach_hang.xlsx");
        })
        .catch((error) => {
          // setLoadingState(false);
          console.error("Something error when fetch API", error);
        });
    } catch (error) {
      // setLoadingState(false);
      console.error("Lỗi khi lấy khách hàng", error);
    }
  };

  const searchKhachHangs = useCallback(async () => {
    try {
      // setLoadingState(true);
      const response = await axios.get(
        "http://localhost:8080/admin/khach-hang/tim-kiem",
        {
          params: {
            keyword: filters.keyword,
            gioiTinh: filters.gioiTinh === "all" ? null : filters.gioiTinh,
            trangThai: filters.trangThai === "all" ? null : filters.trangThai,
            soDienThoai: filters.soDienThoai === "all" ? null : filters.soDienThoai,
            page: filters.currentPage,
            size: 5,
          },
        }
      );
      if(response.status && response.status == 200){
        // setLoadingState(false);
        setKhachHangs(
          Array.isArray(response.data.data) ? response.data.data : []
        );
        setTotalPages(response.data.totalCount);
      }
    } catch (error) {
      // setLoadingState(false);
      console.error("Lỗi khi tìm kiếm khách hàng", error);
    }
  }, [filters]);

  useEffect(() => {
    searchKhachHangs();
  }, [filters, searchKhachHangs]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setFilters({ ...filters, currentPage: newPage });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "gioiTinh" || name === "trangThai") {
      if (value === "true") {
        newValue = true;
      } else if (value === "false") {
        newValue = false;
      } else {
        // value === 'all'
        newValue = null;
      }
    }
    setFilters({ ...filters, [name]: newValue, currentPage: 0 });
  };

  const navigate = useNavigate();

  const renderPageNumbers = () => {
    let pageNumbers = [];
    const maxPagesToShow = 6;

    if (totalPages <= maxPagesToShow) {
      pageNumbers = Array.from({ length: totalPages }, (_, index) => index);
    } else {
      if (filters.currentPage <= 3) {
        pageNumbers = [0, 1, "...", totalPages - 1];
      } else if (filters.currentPage >= totalPages - 4) {
        pageNumbers = [
          0,
          "...",
          totalPages - 5,
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
        ];
      } else {
        pageNumbers = [
          0,
          "...",
          filters.currentPage - 1,
          filters.currentPage,
          filters.currentPage + 1,
          "...",
          totalPages - 1,
        ];
      }
    }

    return pageNumbers.map((page, index) => {
      if (page === "...") {
        return (
          <span key={index} className="mx-1 p-2">
            ...
          </span>
        );
      } else {
        return (
          <button
            key={page}
            className={`mx-1 p-1 rounded ${page === filters.currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            onClick={() => handlePageChange(page)}
          >
            {page + 1}
          </button>
        );
      }
    });
  };

  return (
    <div className="p-6 space-y-4">
      {/* {loading && <Spinner />} Show the spinner while loading */}
      <h1 className="text-lg font-semibold mb-4">Khách hàng</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-sm font-semibold mb-4">Bộ Lọc</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="relative text-sm">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={(e) =>
                setFilters({ ...filters, keyword: e.target.value, currentPage: 0 })
              }
              placeholder="Tìm theo tên hoặc mã"
              className="w-full pl-10 p-2 border rounded-md"
            />
          </div>

          <div className="relative text-sm">
            <select
              name="gioiTinh"
              value={
                filters.gioiTinh === null ? "all" : filters.gioiTinh.toString()
              } // Important for displaying the correct option
              onChange={handleFilterChange}
              className="border p-2 rounded-md w-full"
            >
              <option value="all">Giới tính</option>
              <option value="true">Nam</option>
              <option value="false">Nữ</option>
            </select>
          </div>

          <div className="relative text-sm">
            <select
              name="trangThai"
              value={filters.trangThai === null ? "all" : filters.trangThai.toString()}
              onChange={handleFilterChange}
              className="border p-2 rounded-md w-full"
            >
              <option value="all">Trạng thái</option>
              <option value="true">Hoạt Động</option>
              <option value="false">Ngừng Hoạt Động</option>
            </select>
          </div>

        </div>
      </div>

      <div
        className="bg-white p-4 rounded-lg shadow-md"
        style={{ height: "400px" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Danh Sách Khách Hàng</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              title="Thêm mới"
              className="flex items-center justify-center border border-black rounded-full w-8 h-8"
              onClick={() => navigate("/admin/add-customer")}
            >
              <Plus size={20} stroke="black" />
            </button>

            <button
              title="Xuất Excel"
              className="flex items-center justify-center border border-black rounded-full w-8 h-8"
              onClick={exportToExcel}
            >
              <span className="text-sm">📤</span>
            </button>
          </div>
        </div>
        <div className="overflow-auto flex-grow" style={{ height: "300px" }}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 text-center">STT</th>
                <th className="p-2 text-center">Mã</th>
                <th className="p-2 text-center">Email</th>
                <th className="p-2 text-center">Tên</th>
                <th className="p-2 text-center">Số Điện Thoại</th>
                <th className="p-2 text-center">Địa chỉ</th>
                <th className="p-2 text-center">Giới Tính</th>
                <th className="p-2 text-center">Trạng Thái</th>
                <th className="p-2 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(customers) ? (
                customers.map((customer, index) => (
                  <tr key={`customer-${customer.id}`} className="border-t">
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2 text-center">{customer.maKhachHang}</td>
                    <td className="p-2 text-center">{customer.email}</td>
                    <td className="p-2 text-center">{customer.hoTen}</td>
                    <td className="p-2 text-center">{customer.soDienThoai}</td>
                    <td className="p-2 text-center">{customer.addressDetails ? customer.addressDetails : ""}</td>
                    <td className="p-2 text-center">
                      {customer.gioiTinh ? "Nam" : "Nữ"}
                    </td>
                    <td className="p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-white w-28 inline-block text-center ${customer.trangThai ? "bg-green-500" : "bg-red-500"
                          }`}
                      >
                        {customer.trangThai ? "Hoạt động" : "Ngừng hoạt động"}
                      </span>
                    </td>
                    <td className="p-2 text-center flex justify-center space-x-2">
                      <button className="text-black p-1 rounded" onClick={() => navigate(`/admin/edit-customer/${customer.id}`)}>
                        <Eye size={18} stroke="black" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Thêm các nút phân trang và số trang */}
        <div
          style={{
            padding: "2px 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            className="mx-1 p-0.5 bg-gray-200 rounded"
            onClick={() => handlePageChange(filters.currentPage - 1)}
            disabled={filters.currentPage === 0}
          >
            <ChevronLeft size={18} stroke="black" />
          </button>
          {renderPageNumbers()}
          <button
            className="mx-1 p-0.5 bg-gray-200 rounded"
            onClick={() => handlePageChange(filters.currentPage + 1)}
            disabled={filters.currentPage >= totalPages - 1}
          >
            <ChevronRight size={18} stroke="black" />
          </button>
        </div>
      </div>
    </div>
  );
}
