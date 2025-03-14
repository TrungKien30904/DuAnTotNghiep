import {  Outlet } from "react-router-dom";
import {  Container } from "@mui/material";
import Navbar from "./Navbar";

const Layout = () => (
    <div className="flex flex-col min-h-screen font-montserrat font-medium">
      <Navbar />
      <Container maxWidth={false} className="!p-0 h-[2000px]">
        <Outlet className="w-full"/>
      </Container>
    </div>
  );
  
  export default Layout;