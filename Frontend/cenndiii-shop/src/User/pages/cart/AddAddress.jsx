import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Typography } from "@mui/material";
import calculateShippingFee from "./calculateShippingFee";

const AddAddress = ({ onConfirm, existingData }) => {
    const [formData, setFormData] = useState(existingData || {
        hoTen: '',
        soDienThoai: '',
        email: '',
        diaChi: '',
        ghiChu: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (existingData) {
            setFormData(existingData);
        }
    }, [existingData]);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const headers = {
        token: "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
        "Content-Type": "application/json",
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", { headers });
                setProvinces(response.data.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tỉnh:", error);
            }
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (e) => {
        const province = provinces.find(p => p.ProvinceID == e.target.value);
        setSelectedProvince(province);
        setDistricts([]);
        setWards([]);
        setSelectedDistrict(null);
        setSelectedWard(null);

        try {
            const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", {
                headers, params: { province_id: province.ProvinceID }
            });
            setDistricts(response.data.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách district:", error);
        }
    };

    const handleDistrictChange = async (e) => {
        const district = districts.find(d => d.DistrictID == e.target.value);
        setSelectedDistrict(district);
        setWards([]);
        setSelectedWard(null);

        try {
            const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", {
                headers, params: { district_id: district.DistrictID }
            });
            setWards(response.data.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ward:", error);
        }
    };

    const handleWardChange = (e) => {
        const ward = wards.find(w => w.WardCode == e.target.value);
        setSelectedWard(ward);
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" }); // Xóa lỗi khi người dùng nhập vào
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.hoTen = formData.hoTen ? "" : "Họ tên không được để trống.";
        tempErrors.soDienThoai = formData.soDienThoai ? "" : "Số điện thoại không được để trống.";
        tempErrors.email = formData.email ? "" : "Email không được để trống.";
        tempErrors.email = formData.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email) ? "" : "Email không hợp lệ.";
        tempErrors.selectedProvince = selectedProvince ? "" : "Vui lòng chọn Tỉnh/Thành phố.";
        tempErrors.selectedDistrict = selectedDistrict ? "" : "Vui lòng chọn Quận/Huyện.";
        tempErrors.selectedWard = selectedWard ? "" : "Vui lòng chọn Xã/Phường.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleConfirm = async () => {
        if (validate()) {
            const fullAddress = `${selectedWard?.WardName || ''}, ${selectedDistrict?.DistrictName || ''}, ${selectedProvince?.ProvinceName || ''}`;

            let shippingFee = 0;
            if (selectedWard && selectedDistrict) {
                try {
                    const fee = await calculateShippingFee(`${selectedProvince.ProvinceID}, ${selectedDistrict.DistrictID}, ${selectedWard.WardCode}`, []);
                    shippingFee = fee;
                } catch (error) {
                    console.error("Lỗi khi tính phí vận chuyển:", error);
                    shippingFee = 33000; // Giá mặc định nếu lỗi xảy ra
                }
            }

            onConfirm({ 
                ...formData, 
                diaChi: `${selectedProvince.ProvinceID}, ${selectedDistrict.DistrictID}, ${selectedWard.WardCode}`, // Send address ID
                phiVanChuyen: shippingFee,
                diaChiHienThi: fullAddress // Send address name for display
            });
        }
    };

    return (
        <div>
            <TextField
                fullWidth
                size="small"
                margin="dense"
                label="Họ tên"
                value={formData.hoTen}
                onChange={(e) => handleInputChange('hoTen', e.target.value)}
                error={!!errors.hoTen}
                helperText={errors.hoTen}
            />
            <TextField
                fullWidth
                size="small"
                margin="dense"
                label="Số điện thoại"
                value={formData.soDienThoai}
                onChange={(e) => handleInputChange('soDienThoai', e.target.value)}
                error={!!errors.soDienThoai}
                helperText={errors.soDienThoai}
            />
            <TextField
                fullWidth
                size="small"
                margin="dense"
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
            />

            <FormControl fullWidth size="small" margin="dense" error={!!errors.selectedProvince}>
                <InputLabel>Tỉnh/Thành phố</InputLabel>
                <Select value={selectedProvince?.ProvinceID || ""} onChange={handleProvinceChange}>
                    {provinces.map((p) => (<MenuItem key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</MenuItem>))}
                </Select>
                {errors.selectedProvince && <Typography color="error">{errors.selectedProvince}</Typography>}
            </FormControl>

            <FormControl fullWidth size="small" margin="dense" disabled={!selectedProvince} error={!!errors.selectedDistrict}>
                <InputLabel>Quận/Huyện</InputLabel>
                <Select value={selectedDistrict?.DistrictID || ""} onChange={handleDistrictChange}>
                    {districts.map((d) => (<MenuItem key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</MenuItem>))}
                </Select>
                {errors.selectedDistrict && <Typography color="error">{errors.selectedDistrict}</Typography>}
            </FormControl>

            <FormControl fullWidth size="small" margin="dense" disabled={!selectedDistrict} error={!!errors.selectedWard}>
                <InputLabel>Xã/Phường</InputLabel>
                <Select value={selectedWard?.WardCode || ""} onChange={handleWardChange}>
                    {wards.map((w) => (<MenuItem key={w.WardCode} value={w.WardCode}>{w.WardName}</MenuItem>))}
                </Select>
                {errors.selectedWard && <Typography color="error">{errors.selectedWard}</Typography>}
            </FormControl>

            <TextField
                fullWidth
                size="small"
                margin="dense"
                label="Ghi chú"
                multiline
                rows={3}
                value={formData.ghiChu}
                onChange={(e) => handleInputChange('ghiChu', e.target.value)}
            />

            <Button variant="contained" color="primary" fullWidth size="large" className="mt-4" onClick={handleConfirm}>
                Xác nhận thông tin
            </Button>
        </div>
    );
};

export default AddAddress;