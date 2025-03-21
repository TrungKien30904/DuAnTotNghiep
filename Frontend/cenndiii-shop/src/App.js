import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoute from "./Admin/AdminRoute";
import UserRoute from "./User/UserRoute";
import { AuthProvider } from "./untils/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="/*" element={<UserRoute />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;