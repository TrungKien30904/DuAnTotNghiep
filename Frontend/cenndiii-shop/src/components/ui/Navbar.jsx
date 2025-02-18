import { Globe, Sun, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-gray-200 flex items-center justify-between px-4 shadow">
      <div></div>
      <div className="flex items-center space-x-4">
        <Globe size={20} />
        <Sun size={20} />
        <Bell size={20} />
        <div className="w-8 h-8 rounded-full bg-gray-400"></div>
      </div>
    </header>
  );
}
