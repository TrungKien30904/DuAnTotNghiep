

import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Typography } from "@mui/material";

const AddAddress = ({ onConfirm, existingData }) => {
    const [formData, setFormData] = useState(existingData || {
        hoTen: '',
        soDienThoai: '',
        email: '',
        diaChi:'',
        ghiChu: ''
    });

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

    const handleConfirm = async () => {
        const fullAddress = `${selectedWard?.WardName || ''}, ${selectedDistrict?.DistrictName || ''}, ${selectedProvince?.ProvinceName || ''}`;
    
        let shippingFee = 0;
        if (selectedWard && selectedDistrict) {
            try {
                const requestData = {
                    "service_type_id": 2,
                    "from_district_id": 1542,
                    "from_ward_code": "1A0607",
                    "to_district_id": Number(selectedDistrict.DistrictID),
                    "to_ward_code": selectedWard.WardCode,
                    "length": 40,
                    "width": 20,
                    "height": 20,
                    "weight": 2000,
                    "insurance_value": 0,
                    "coupon": null
                };
                const response = await axios.post(
                    "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                    requestData,
                    { headers }
                );
                if (response.status === 200) {
                    shippingFee = response.data.data.total;
                } else {
                    shippingFee = 30000; // Giá mặc định nếu lỗi xảy ra
                }
            } catch (error) {
                console.error("Lỗi khi tính phí vận chuyển:", error);
                shippingFee = 33000;
            }
        }
    
        onConfirm({ ...formData, diaChi: fullAddress, phiVanChuyen: shippingFee });
    };
    


    return (
        <div>
           
            <TextField fullWidth size="small" margin="dense" label="Họ tên" value={formData.hoTen} onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })} />
            <TextField fullWidth size="small" margin="dense" label="Số điện thoại" value={formData.soDienThoai} onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })} />
            <TextField fullWidth size="small" margin="dense" label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

            <FormControl fullWidth size="small" margin="dense">
                <InputLabel>Tỉnh/Thành phố</InputLabel>
                <Select value={selectedProvince?.ProvinceID || ""} onChange={handleProvinceChange}>
                    {provinces.map((p) => (<MenuItem key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</MenuItem>))}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" margin="dense" disabled={!selectedProvince}>
                <InputLabel>Quận/Huyện</InputLabel>
                <Select value={selectedDistrict?.DistrictID || ""} onChange={handleDistrictChange}>
                    {districts.map((d) => (<MenuItem key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</MenuItem>))}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" margin="dense" disabled={!selectedDistrict}>
                <InputLabel>Xã/Phường</InputLabel>
                <Select value={selectedWard?.WardCode || ""} onChange={handleWardChange}>
                    {wards.map((w) => (<MenuItem key={w.WardCode} value={w.WardCode}>{w.WardName}</MenuItem>))}
                </Select>
            </FormControl>

            <TextField fullWidth size="small" margin="dense" label="Ghi chú" multiline rows={3} value={formData.ghiChu} onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })} />

            <Button variant="contained" color="primary" fullWidth size="large" className="mt-4" onClick={handleConfirm}>
                Xác nhận thông tin
            </Button>
        </div>
    );
};
export default AddAddress;