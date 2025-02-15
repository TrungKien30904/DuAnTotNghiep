import { useState, useEffect } from "react";
import { Search, Eye, Edit, Plus, X } from "lucide-react";
import axios from "axios";

export default function ProductManagement() {
  const [filters, setFilters] = useState({ search: "", trangThai: "all", soLuong: "all" });
  const [sanPhams, setSanPhams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // const [tenSanPham, setTenSanPham] = useState("");

  useEffect(() => {
    fetchSanPhams();
  }, []);

  const fetchSanPhams = async () => {
    try {
      const response = await axios.get("http://localhost:8080/admin/san-pham/hien-thi");
      setSanPhams(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  // const handleAddProduct = () => {
  //   console.log("Tên sản phẩm mới:", tenSanPham);
  //   setShowModal(false);
  //   setTenSanPham("");
  // };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-lg font-semibold mb-4">Sản phẩm</h1>
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
              placeholder="Tìm theo tên..."
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
              <option value="1">Đang Bán</option>
              <option value="0">Ngừng Bán</option>
            </select>
          </div>

          <div className="relative text-sm">
            <select
              name="soLuong"
              value={filters.soLuong}
              onChange={(e) => setFilters({ ...filters, soLuong: e.target.value })}
              className="border p-2 rounded-md w-full"
            >
              <option value="all">Tất cả số lượng</option>
              <option value="<50">&lt; 50</option>
              <option value="50-100">50 - 100</option>
              <option value=">100">&gt; 100</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Danh Sách Sản Phẩm</h2>
          <button 
            className="flex items-center justify-center border border-black rounded-full w-8 h-8"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} stroke="black" />
          </button>
        </div>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">STT</th>
              <th className="p-2">Sản Phẩm</th>
              <th className="p-2">Số Lượng</th>
              <th className="p-2">Trạng Thái</th>
              <th className="p-2">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {sanPhams.map((sanPham, index) => (
              <tr key={sanPham.idSanPham} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{sanPham.tenSanPham}</td>
                <td className="p-2">{sanPham.soLuong}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white w-28 inline-block text-center ${sanPham.trangThai == 1 ? "bg-green-500" : "bg-red-500"}`}>
                    {sanPham.trangThai == 1 ? "Đang Bán" : "Ngừng Bán"}
                  </span>
                </td>
                <td className="p-2 flex space-x-2">
                  <button className="text-black p-1 rounded">
                    <Eye size={18} stroke="black" />
                  </button>
                  <button className="text-black p-1 rounded">
                    <Edit size={18} stroke="black" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 "style={{ marginTop: "0px" }}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button 
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              <X size={20} stroke="black" />
            </button>
            <h2 className="text-lg font-semibold text-center mb-4">Thêm Sản Phẩm</h2>
            <input
              type="text"
              placeholder="Tên sản phẩm"
              value={tenSanPham}
              onChange={(e) => setTenSanPham(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />
            <button 
              className="w-full border border-black text-black p-2 rounded-md hover:bg-black hover:text-white transition"
              onClick={handleAddProduct}
            >
              Thêm Sản Phẩm
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}
