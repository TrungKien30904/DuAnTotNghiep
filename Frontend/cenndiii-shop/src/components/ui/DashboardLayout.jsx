import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout() {
  return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 fixed inset-y-0 left-0 bg-white shadow-lg flex flex-col z-50">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 ml-64">
          <div className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md z-60">
            <Navbar />
          </div>
          <div className="flex-1 mt-16 overflow-auto p-6">
            <Outlet />
          </div>
        </div>
      </div>
  );
}
