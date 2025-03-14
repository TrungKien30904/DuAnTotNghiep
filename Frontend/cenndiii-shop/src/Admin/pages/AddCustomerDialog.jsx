import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";

const CustomerDialog = ({ open, onClose,reload }) => {
  const [formData, setFormData] = useState({
    hoTen: "",
    soDienThoai: "",
    email: "",
    tinhThanh: "",
    quanHuyen: "",
    xaPhuong: "",
    gioiTinh: "Nam",
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const headers = {
    token: "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
    "Content-Type": "application/json",
  };

  useEffect(() => {
    axios
      .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
        headers,
      })
      .then((res) => setProvinces(res.data.data))
      .catch((err) => console.error("Lỗi load tỉnh/thành:", err));
  }, []);

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setFormData({ ...formData, tinhThanh: provinceId, quanHuyen: "", xaPhuong: "" });
    setDistricts([]);
    setWards([]);

    axios
      .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", {
        headers,
        params: { province_id: provinceId },
      })
      .then((res) => {
        setDistricts(res.data.data)
        console.log(res.data.data);
      })
      .catch((err) => console.error("Lỗi load quận/huyện:", err));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setFormData({ ...formData, quanHuyen: districtId, xaPhuong: "" });
    setWards([]);

    axios
      .get("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", {
        headers,
        params: { district_id: districtId },
      })
      .then((res) => setWards(res.data.data))
      .catch((err) => console.error("Lỗi load xã/phường:", err));
  };

  const handleConfirm = async () => {
    const diaChi = [formData.tinhThanh, formData.quanHuyen, formData.xaPhuong].join(", ");
    const requestData = {
        maKhachHang: null,
        hoTen: formData.hoTen,
        gioiTinh: formData.gioiTinh == "Nam" ? 1 : 0,
        soDienThoai: formData.soDienThoai,
        email: formData.email,
        trangThai: true,
        diaChi,
    };
    try {
        const response = await axios.post("http://localhost:8080/admin/khach-hang/them-kh", requestData);
        const newCustomer = response.data;
        onClose();
        reload(newCustomer);
    } catch (err) {
        console.error("Lỗi khi thêm khách hàng:", err);
    }
};

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Thêm Khách Hàng</DialogTitle>
      <DialogContent>
        <TextField label="Họ Tên" fullWidth margin="dense" value={formData.hoTen} onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })} />
        <TextField label="Số Điện Thoại" fullWidth margin="dense" value={formData.soDienThoai} onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })} />
        <TextField label="Email" fullWidth margin="dense" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        
        <FormControl component="fieldset" margin="dense">
          <FormLabel component="legend">Giới Tính</FormLabel>
          <RadioGroup row value={formData.gioiTinh} onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}>
            <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
            <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
          </RadioGroup>
        </FormControl>
        
        <TextField select label="Tỉnh/Thành phố" fullWidth margin="dense" value={formData.tinhThanh} onChange={handleProvinceChange}>
          {provinces.map((item) => (
            <MenuItem key={item.ProvinceID} value={item.ProvinceID}>{item.ProvinceName}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Quận/Huyện" fullWidth margin="dense" value={formData.quanHuyen} onChange={handleDistrictChange} disabled={!formData.tinhThanh}>
          {districts.map((item) => (
            <MenuItem key={item.DistrictID} value={item.DistrictID}>{item.DistrictName}</MenuItem>
          ))}
        </TextField>
        <TextField select label="Xã/Phường" fullWidth margin="dense" value={formData.xaPhuong} onChange={(e) => setFormData({ ...formData, xaPhuong: e.target.value })} disabled={!formData.quanHuyen}>
          {wards.map((item) => (
            <MenuItem key={item.WardCode} value={item.WardCode}>{item.WardName}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">Xác Nhận</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerDialog;