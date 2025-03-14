import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import AdminRoute from "./Admin/AdminRoute";
import UserRoute from "./User/UserRoute";
function App() {
  return (
    <Router>
        <Routes>
            <Route path="/admin/*" element={<AdminRoute/>}/>
        </Routes>
        <Routes>
            <Route path="/*" element={<UserRoute/>}/>
        </Routes>
    </Router>
  );
}

export default App;
