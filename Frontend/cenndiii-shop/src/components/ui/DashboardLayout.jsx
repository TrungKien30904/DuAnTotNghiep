import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="h-16 fixed top-0 left-64 right-0 bg-white shadow-md z-50">
          <Navbar />
        </div>
        <div className="pt-16 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
