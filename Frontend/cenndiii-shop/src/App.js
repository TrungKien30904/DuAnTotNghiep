import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import DashboardLayout from "./components/ui/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Employees from "./pages/Employees";
import Invoices from "./pages/Invoices";
import Products from "./pages/Products";
import ShoeCollar from "./pages/ShoeCollar";
import ShoeSoles from "./pages/ShoeSoles";
import Toe from "./pages/Toe";
import Brand from "./pages/Brand";
import Material from "./pages/Material";
import Suppliers from "./pages/Suppliers";
import Color from "./pages/Color";
import Size from "./pages/Size";
import Discounts from "./pages/Discounts";
import Coupons from "./pages/Coupons";
import Categories from "./pages/Categories";
import ProductsDetails from "./pages/ProductDetails";
import ProductsManager from "./pages/ProductsManager";
import AddDiscounts from "./pages/Discounts/AddDiscounts";
import EditDiscounts from "./pages/Discounts/EditDiscounts";
import AddCoupon from "./pages/AddCoupon";
import CouponDetails from "./pages/CouponDetails";
import AddEmployee from "./pages/AddEmployee";
import UpdateEmployee from "./pages/UpdateEmployee";
import DetailEmployee from "./pages/DetailEmployee";
import AddCustomers from "./pages/AddCustomers";
import EditCustomer from "./pages/EditCustomer";
// import DynamicForm from "./pages/ModelSample";
// import { ToastProvider } from './utils/ToastContext'
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { LoadingProvider, useLoading } from './components/ui/spinner/LoadingContext';



function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard Layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="" element={<Navigate to="/dashboard"/>} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/add" element={<AddEmployee />} />
          <Route path="/employees/edit/:id" element={<UpdateEmployee />} />
          <Route path="/employees/detail/:id" element={<DetailEmployee />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="products" element={<Products />} />
          <Route path="shoe-collar" element={<ShoeCollar />} />
          <Route path="shoe-soles" element={<ShoeSoles />} />
          <Route path="toe" element={<Toe />} />
          <Route path="brand" element={<Brand />} />
          <Route path="material" element={<Material />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="categories" element={<Categories />} />
          <Route path="color" element={<Color />} />
          <Route path="size" element={<Size />} />
          <Route path="discounts" element={<Discounts />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="product-details" element={<ProductsDetails />} />
          <Route path="product-details-manager/phan-trang/:id" element={<ProductsManager />} />
          <Route path="discounts/add" element={<AddDiscounts />} />
          <Route path="discounts/edit/:idDGG" element={<EditDiscounts />} />
          <Route path="add-coupon" element={<AddCoupon />} />
          <Route path="coupons/:id" element={<CouponDetails />} />
          <Route path="/add-customer" element={<AddCustomers />} />
          <Route path="/edit-customer/:id" element={<EditCustomer />} />
          {/* <Route path="/test" element={<DynamicForm />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
