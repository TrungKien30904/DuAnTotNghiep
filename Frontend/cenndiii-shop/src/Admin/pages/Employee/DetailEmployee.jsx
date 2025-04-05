import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../../../security/Axios";
import { hasPermission } from "../../../security/DecodeJWT";
export default function DetailEmployee() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  useEffect(() => {
    if (!hasPermission("ADMIN") && !hasPermission("STAFF")) {
      navigate("/admin/login");
    }
  }, [navigate]);
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(`/admin/nhan-vien/detail/${id}`);
        const data = response.data;
        data.ngaySinh = data.ngaySinh ? data.ngaySinh.split("T")[0] : "";
        setEmployee(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhân viên:", error);
      }
    };
    fetchEmployee();
  }, [id]);

  if (!employee) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">CHI TIẾT NHÂN VIÊN</h2>
      <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-3 gap-4">
        {/* Cột ảnh đại diện (1/3) */}
        <div className="flex justify-center items-center">
          <img src={employee.hinh_anh} alt="Avatar" className="w-40 h-40 rounded-full object-cover shadow-md" />
        </div>

        {/* Cột thông tin (2/3) */}
        <div className="col-span-2 space-y-2">
          <div><strong>Tên:</strong> {employee.ten}</div>
          <div><strong>Giới tính:</strong> {employee.gioiTinh}</div>
          <div><strong>Ngày sinh:</strong> {employee.ngaySinh ? employee.ngaySinh.split("T")[0] : ""}</div>
          <div><strong>Số điện thoại:</strong> {employee.soDienThoai}</div>
          <div><strong>Email:</strong> {employee.email}</div>
          <div><strong>Vai trò:</strong> {employee.vaiTro ? "Quản lý" : "Nhân viên"}</div>
          <div><strong>Trạng thái:</strong> {employee.trangThai ? "Kích hoạt" : "Tạm ngưng"}</div>
          <div><strong>Căn cước công dân:</strong> {employee.cccd}</div>
          <div><strong>Địa chỉ:</strong> {employee.diachi}</div>

          {/* Nút quay lại */}
          <div className="mt-4">
            <button onClick={() => navigate("/admin/employees")} className="bg-gray-500 text-white p-2 rounded-md">Quay lại</button>
          </div>
        </div>
      </div>
    </div>

  );
}
