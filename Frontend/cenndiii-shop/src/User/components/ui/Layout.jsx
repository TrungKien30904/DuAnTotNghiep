import { Outlet } from "react-router-dom";
import { Container } from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer"; // Import Footer

const Layout = () => (
  <div className="flex flex-col min-h-screen font-montserrat font-medium">
    <Navbar />
    <Container maxWidth={false} className="!p-0 flex-grow">
      <Outlet className="w-full"/>
    </Container>
    <Footer/>
  </div>
);

export default Layout;
