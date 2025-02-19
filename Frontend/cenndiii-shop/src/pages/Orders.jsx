import { useNavigate } from "react-router-dom";

export default function Orders() {
  const navigate = useNavigate();

  return (
    <div className="p-2 space-y-4 text-sm">
      {/* Breadcrumb */}
      <nav className="text-gray-500 mb-4">
        <span className="cursor-pointer hover:underline" onClick={() => navigate("/dashboard")}>
          Trang chủ
        </span>{" "}
        &gt;{" "}
        <span className="font-semibold text-black">Bán hàng</span>
      </nav>

      {/* Orders */}
      <div className="flex flex-row gap-2">
        <div className="basic-2/3 bg-white p-4 rounded-lg shadow-md w-2/3 h-screen">
          <div>
            adfadfaadfadfa
          </div>
          <div className="text-gray-500 flex justify-center items-center h-full">
            <h2>Chưa có hóa đơn nào</h2>
          </div>

        </div>
        <div className="basic-1/3 bg-white p-4 rounded-lg shadow-md w-1/3 h-screen">

        </div>
      </div>
    </div>
  );
}