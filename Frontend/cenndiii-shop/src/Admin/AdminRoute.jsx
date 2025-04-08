import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/ui/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Orders from "./pages/Order/Orders";
import Customers from "./pages/Customer/Customers";
import Employees from "./pages/Employee/Employees";
import Invoices from "./pages/Invoices/Invoice";
import Products from "./pages/Attribute/Products/Products";
import ShoeCollar from "./pages/Attribute/ShoeCollar";
import ShoeSoles from "./pages/Attribute/ShoeSoles";
import Toe from "./pages/Attribute/Toe";
import Brand from "./pages/Attribute/Brand";
import Material from "./pages/Attribute/Material";
import Suppliers from "./pages/Attribute/Suppliers";
import Color from "./pages/Attribute/Color";
import Size from "./pages/Attribute/Size";
import Discounts from "./pages/Discounts/Discounts";
import Coupons from "./pages/Coupon/Coupons";
import Categories from "./pages/Attribute/Categories";
import ProductsDetails from "./pages/Attribute/Products/ProductDetails";
import ProductsManager from "./pages/Attribute/Products/ProductsManager";
import AddDiscounts from "./pages/Discounts/AddDiscounts";
import EditDiscounts from "./pages/Discounts/EditDiscounts";
import AddCoupon from "./pages/Coupon/AddCoupon";
import CouponDetails from "./pages/Coupon/CouponDetails";
import AddEmployee from "./pages/Employee/AddEmployee";
import UpdateEmployee from "./pages/Employee/UpdateEmployee";
import DetailEmployee from "./pages/Employee/DetailEmployee";
import AddCustomers from "./pages/Customer/AddCustomers";
import EditCustomer from "./pages/Customer/EditCustomer";
import "react-toastify/dist/ReactToastify.css";
import InvoiceDetail from "./pages/Invoices/InvoiceDetail";
import Test from "./pages/test";
import LoginPage from "./components/ui/Login"
import PaymentStatus from "./pages/Order/PaymentStatus"
export default function AdminRoute() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<DashboardLayout />}>
                <Route path="" element={<Navigate to="/admin/dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="customers" element={<Customers />} />
                <Route path="employees" element={<Employees />} />
                <Route path="employees/add" element={<AddEmployee />} />
                <Route path="employees/edit/:id" element={<UpdateEmployee />} />
                <Route path="employees/detail/:id" element={<DetailEmployee />} />
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
                <Route path="add-customer" element={<AddCustomers />} />
                <Route path="edit-customer/:id" element={<EditCustomer />} />
                <Route path="invoice-detail/:id/:idHd" element={<InvoiceDetail />} />
                <Route path="payment-status" element={<PaymentStatus />} />
                {/* <Route path="/test" element={<DynamicForm />} /> */}
                <Route path="test" element={<Test />} />
            </Route>
        </Routes>
    )
}