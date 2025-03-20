import { hasPermission } from "../../security/DecodeJWT";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
export default function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasPermission("ADMIN") && !hasPermission("STAFF")) {
      navigate("/admin/login");
    }
  }, [navigate]);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Trang Chủ</h1>
      <p>Chào mừng đến với bảng điều khiển!</p>
    </div>
  );
}
