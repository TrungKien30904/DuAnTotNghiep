import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoute from "./Admin/AdminRoute";
import UserRoute from "./User/UserRoute";
import { LoadingProvider } from "./Admin/components/ui/spinner/LoadingContext"; // Đảm bảo import đúng

function App() {
  return (
    <LoadingProvider>
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="/*" element={<UserRoute />} />
        </Routes>
      </Router>
    </LoadingProvider>
  );
}

export default App;
