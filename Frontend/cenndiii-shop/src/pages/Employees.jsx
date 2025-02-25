// import { useState, useEffect } from "react";
// import { Search, Eye, Edit, Plus } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

// export default function EmployeeManagement() {
//   const [filters, setFilters] = useState({ search: "", trangThai: "all", dob: "" });
//   const [employees, setEmployees] = useState([]);
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
//   const [totalPages, setTotalPages] = useState(1);   // Tổng số trang

//   useEffect(() => {
//     fetchEmployees(); // Gọi lại khi trang thay đổi
//   }, [currentPage]); // Chỉ gọi lại khi currentPage thay đổi

//   // lấy danh sách phân trang
//   // const fetchEmployees = async () => {
//   //   try {
//   //     const { search, trangThai, dob } = filters;
//   //     let params = {
//   //       page: currentPage,
//   //       size: 5, // Số lượng phần tử mỗi trang
//   //       trangThai: trangThai === "1" ? true : trangThai === "0" ? false : undefined,
//   //       ngaySinh: dob || undefined,
//   //     };
//   //     // Kiểm tra search là số hay chữ
//   //     if (!isNaN(search) && search.trim() !== "") {
//   //       params.soDienThoai = search;
//   //     } else if (search.trim() !== "") {
//   //       params.ten = search;
//   //     }
//   //     const response = await axios.get("http://localhost:8080/admin/nhan-vien/search", { params });
//   //     setEmployees(response.data.content); // Lấy danh sách nhân viên từ response
//   //     setTotalPages(response.data.totalPages); // Lưu tổng số trang
//   //   } catch (error) {
//   //     console.error("Lỗi khi lấy danh sách nhân viên:", error);
//   //   }
//   // };

//   const fetchEmployees = async (filtersToUse = filters, pageToUse = currentPage) => {
//     try {
//       const { search, trangThai, dob } = filtersToUse;
//       let params = {
//         page: pageToUse,
//         size: 5, // Số lượng phần tử mỗi trang
//         trangThai: trangThai === "1" ? true : trangThai === "0" ? false : undefined,
//         ngaySinh: dob || undefined,
//       };
//       // Kiểm tra search là số hay chữ
//       if (!isNaN(search) && search.trim() !== "") {
//         params.soDienThoai = search;
//       } else if (search.trim() !== "") {
//         params.ten = search;
//       }
//       const response = await axios.get("http://localhost:8080/admin/nhan-vien/search", { params });
//       setEmployees(response.data.content); // Lấy danh sách nhân viên từ response
//       setTotalPages(response.data.totalPages); // Lưu tổng số trang
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách nhân viên:", error);
//     }
//   }

//   // lấy ds không phân trang
//   const fetchAllEmployees = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/admin/nhan-vien/hien-thi");
//       console.log(response.data); // Kiểm tra phản hồi từ API
//       return response.data; // Trả về chỉ phần content
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách nhân viên:", error);
//       return []; // Trả về mảng rỗng nếu có lỗi
//     }
//   };
//   // import excel
//   const exportToExcel = async () => {
//     const allEmployees = await fetchAllEmployees(); // Lấy danh sách nhân viên
//     if (!Array.isArray(allEmployees) || allEmployees.length === 0) {
//       alert("Không có dữ liệu để xuất!");
//       return;
//     }

//     // Chọn các trường bạn muốn xuất
//     const formattedData = allEmployees.map(employee => ({
//       "Họ Tên": employee.ten,
//       "Số Điện Thoại": employee.soDienThoai,
//       "Địa Chỉ": employee.diachi || "Chưa có", // Nếu địa chỉ là null, hiển thị "Chưa có"
//       "Ngày Sinh": employee.ngaySinh ? new Date(employee.ngaySinh).toLocaleDateString("vi-VN") : "Chưa có", // Kiểm tra nếu có ngày sinh
//       "Giới Tính": employee.gioiTinh == "Nam"? "Nam" : "Nữ", // Chuyển đổi giá trị chuỗi thành giới tính
//       "Trạng Thái": employee.trangThai ? "Hoạt động" : "Ngừng hoạt động"
//     }));

//     // Chuyển dữ liệu sang worksheet
//     const worksheet = XLSX.utils.json_to_sheet(formattedData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     saveAs(blob, "employees.xlsx");
//   };


//   const searchEmployees = async () => {
//     setCurrentPage(0); // Đặt lại trang về 0 khi tìm kiếm
//     await fetchEmployees(); // Gọi lại danh sách nhân viên
//   };

//   const resetFilters = () => {
//     setFilters({ search: "", trangThai: "all", dob: "" });
//     setCurrentPage(0); // Đặt lại trang về 0
//     fetchEmployees({ search: "", trangThai: "all", dob: "" }, 0);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-lg font-semibold mb-4">Quản lý tài khoản nhân viên</h1>
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-sm font-semibold mb-4">Bộ Lọc</h2>
//         <div className="grid grid-cols-3 gap-4">
//           <div className="relative text-sm">
//             <Search className="absolute left-3 top-3 text-gray-400" size={16} />
//             <input
//               type="text"
//               name="search"
//               value={filters.search}
//               onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//               placeholder="Tìm theo tên hoặc số điện thoại..."
//               className="w-full pl-10 p-2 border rounded-md"
//             />
//           </div>

//           <div className="relative text-sm">
//             <select
//               name="trangThai"
//               value={filters.trangThai}
//               onChange={(e) => setFilters({ ...filters, trangThai: e.target.value })}
//               className="border p-2 rounded-md w-full"
//             >
//               <option value="all">Tất cả trạng thái</option>
//               <option value="1">Hoạt động</option>
//               <option value="0">Ngừng hoạt động</option>
//             </select>
//           </div>

//           <div className="relative text-sm">
//             <input
//               type="date"
//               name="dob"
//               value={filters.dob}
//               onChange={(e) => setFilters({ ...filters, dob: e.target.value })}
//               className="border p-2 rounded-md w-full"
//               placeholder="Tìm theo ngày sinh"
//             />
//           </div>
//         </div>
//         <button
//           onClick={searchEmployees}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Tìm Kiếm
//         </button>

//         <button
//           onClick={resetFilters}
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
//         >
//           Làm Mới
//         </button>
//       </div>

//       <button
//         onClick={exportToExcel}  // Gọi hàm exportToExcel
//         className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
//       >
//         Xuất Excel
//       </button>``
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-sm font-semibold">Danh Sách Nhân Viên</h2>
//           <button
//             className="flex items-center justify-center border border-black rounded-full w-8 h-8"
//             onClick={() => navigate("/employees/add")}
//           >
//             <Plus size={20} stroke="black" />
//           </button>
//         </div>
//         <table className="w-full border-collapse text-sm">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-2">STT</th>
//               <th className="p-2">Ảnh</th>
//               <th className="p-2">Tên Nhân Viên</th>
//               <th className="p-2">CCCD</th>
//               <th className="p-2">Số Điện Thoại</th>
//               <th className="p-2">Ngày Sinh</th>
//               <th className="p-2">Giới Tính</th>
//               <th className="p-2">Trạng Thái</th>
//               <th className="p-2">Hành Động</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employees.length > 0 ? (
//               employees.map((employee, index) => (
//                 <tr key={employee.idNhanVien} className="border-t">
//                   <td className="p-2">{index + 1 + currentPage * 5}</td>
//                   <td className="p-2"><img src={`${employee.hinh_anh}`} alt="Avatar" className="w-10 h-10 rounded-full" /></td>
//                   <td className="p-2">{employee.ten}</td>
//                   <td className="p-2">{employee.cccd}</td>
//                   <td className="p-2">{employee.soDienThoai}</td>
//                   <td className="p-2">{new Date(employee.ngaySinh).toLocaleDateString("vi-VN")}</td>
//                   <td className="p-2">{employee.gioiTinh == "Nam"? "Nam" : "Nữ"}</td>
//                   <td className="p-2">
//                     <span className={`px-2 py-1 rounded text-white w-28 inline-block text-center ${employee.trangThai == 1 ? "bg-green-500" : "bg-red-500"}`}>
//                       {employee.trangThai == 1 ? "Hoạt động" : "Ngừng hoạt động"}
//                     </span>
//                   </td>
//                   <td className="p-2 flex space-x-2">
//                     <button className="text-black p-1 rounded" onClick={() => navigate(`/employees/detail/${employee.idNhanVien}`)}>
//                       <Eye size={18} stroke="black" />
//                     </button>
//                     <button className="text-black p-1 rounded" onClick={() => navigate(`/employees/edit/${employee.idNhanVien}`)}>
//                       <Edit size={18} stroke="black" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9" className="text-center py-4 text-gray-500">
//                   Không có dữ liệu
//                 </td>
//               </tr>
//             )
//             }
//           </tbody>
//         </table>
//         <div className="flex justify-center items-center mt-4">
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 0}
//             className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
//           >
//             Trước
//           </button>
//           <span className="mx-4">Trang {currentPage + 1} / {totalPages}</span>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage + 1 === totalPages}
//             className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
//           >
//             Sau
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const DeliveryForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [formData, setFormData] = useState({
    id: 0,
    maKhachHang: '',
    hoTen: '',
    gioiTinh: true,
    soDienThoai: '',
    email: '',
    matKhau: '',
    trangThai: true,
    provinceId: 0,
    districtId: 0,
    wardId: 0,
    addressDetails: "",
    addressMappers: [],
    image: "",
    imageBase64: ""
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [amount, setAmount] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [customers, setCustomers] = useState([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const headers = {
    token: "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
          { headers }
        );
        if (Array.isArray(response.data.data)) {
          setProvinces(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh:", error);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setDistricts([]);
    setSelectedDistrict("");
    setWards([]);
    setSelectedWard("");
    setAmount("");

    try {
      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
        {
          headers,
          params: { province_id: provinceId },
        }
      );

      if (Array.isArray(response.data.data)) {
        setDistricts(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách district:", error);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setWards([]);
    setSelectedWard("");
    setAmount("");

    try {
      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
        {
          headers,
          params: { district_id: districtId },
        }
      );

      if (Array.isArray(response.data.data)) {
        setWards(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ward:", error);
    }
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  // Khi selectedWard thay đổi, tự động gọi API
  useEffect(() => {
    if (selectedWard && selectedDistrict) {
      console.log("🚀 Gọi API với:", selectedDistrict, selectedWard);

      const requestData = {
        "service_id": 53321,
        "insurance_value": 500000,
        "coupon": null,
        "from_district_id": 1542,
        "to_district_id": Number(selectedDistrict),
        "to_ward_code": selectedWard,
        "height": 15,
        "length": 15,
        "weight": 1000,
        "width": 15
      };

      console.log("📤 Request gửi đi:", requestData);

      axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        requestData, // ✅ Dữ liệu gửi đi phải để ở đây, không để trong `params`
        {
          headers: {
            token: "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
            "shop_id": "5652920",
            "Content-Type": "application/json"
          }
        }
      )
        .then(response => {
          console.log("✅ Phản hồi từ API:", response.data);
          if (response.data.data) {
            setAmount(response.data.data.total);
          } else {
            console.error("❌ API không trả về dữ liệu hợp lệ:", response.data);
            setAmount(31000);
          }
        })
        .catch(error => {
          console.error("❌ Lỗi khi tính phí giao hàng:", error.response ? error.response.data : error);
          setAmount(31000);
        });
    }
  }, [selectedWard, selectedDistrict]); // ✅ Chạy khi cả hai thay đổi

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/admin/khach-hang');
      setCustomers(response.data);
      setShowCustomerModal(true);
    } catch (error) {
      console.error("Error fetching customers: ", error);
    }
  };
  const handleCustomerSelect = (customer) => {
    setFormData({
      ...formData,
      maKhachHang: customer.maKhachHang,
      hoTen: customer.hoTen,
      soDienThoai: customer.soDienThoai,
      email: customer.email,
      // Add other fields as necessary
    });
    setShowCustomerModal(false);
  };

  return (
    <form
      onSubmit={handleSubmit(() => { })}
      style={{
        maxWidth: "100%",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >

      {/* <h2>Form Giao Hàng</h2> */}
      {["họ tên", "số điện thoại", "email", "địa chỉ"].map((name) => (
        <div key={name}>
          <label>{name.charAt(0).toUpperCase() + name.slice(1)}:</label>
          <input
            {...register(name, { required: `Vui lòng nhập ${name}` })}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          {errors[name] && <p style={{ color: "red" }}>{errors[name].message}</p>}
        </div>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        {[{ label: "Tỉnh/Thành Phố", value: selectedProvince, onChange: handleProvinceChange, options: provinces, key: "ProvinceID", name: "ProvinceName" }, { label: "Quận/Huyện", value: selectedDistrict, onChange: handleDistrictChange, options: districts, key: "DistrictID", name: "DistrictName", disabled: !selectedProvince }, { label: "Xã/Phường", value: selectedWard, onChange: handleWardChange, options: wards, key: "WardCode", name: "WardName", disabled: !selectedDistrict }].map(({ label, value, onChange, options, key, name, disabled }) => (
          <div key={label}>
            <label>{label}:</label>
            <select value={value} onChange={onChange} disabled={disabled} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}>
              <option value="">Chọn {label.toLowerCase()}</option>
              {options.map((option) => (
                <option key={option[key]} value={option[key]}>{option[name]}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div>
        <label>Ghi Chú:</label>
        <textarea {...register('note')} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
      </div>

      <div>
        <img src="https://product.hstatic.net/1000405368/product/giao_hang_nhanh_toan_quoc_color.b7d18fe5_39425b03ee544ab2966d465756a00f89_small.png" alt="Giao Hàng Nhanh" style={{ width: '100px' }} />
        {/* <div>
          <strong>Ngày Giao Hàng:</strong> 
        </div> */}
      </div>

      <div>
        <label>Số Tiền Giao:</label>
        <input
          type="number"
          value={amount}
          // readOnly
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
      </div>

      <button
        type="submit"
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Gửi
      </button>
    </form>
  );
};

export default DeliveryForm;