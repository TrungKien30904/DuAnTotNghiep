import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoute from "./Admin/AdminRoute";
import UserRoute from "./User/UserRoute";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="/*" element={<UserRoute />} />
        </Routes>
      </Router>
  );
}

export default App;