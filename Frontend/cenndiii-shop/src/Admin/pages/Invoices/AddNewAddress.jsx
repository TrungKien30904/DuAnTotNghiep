import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import api from '../../../security/Axios';
import { useNavigate } from 'react-router-dom';
export default function AddressDialog({ hoaDon, reload, open, onClose }) {
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [tenNguoiNhan, setTenNguoiNhan] = useState('');
    const [diaChiChiTiet, setDiaChiChiTiet] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [ghiChu, setGhiChu] = useState('');

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const validateForm = () => {
        const newErrors = {};

        if (!tenNguoiNhan.trim()) {
            newErrors.tenNguoiNhan = "Tên người nhận không được để trống.";
        }

        if (!diaChiChiTiet.trim()) {
            newErrors.diaChiChiTiet = "Địa chỉ chi tiết không được để trống.";
        }
        if (!soDienThoai.trim()) {
            newErrors.soDienThoai = "Số điện thoại không được để trống.";
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(soDienThoai)) {
            newErrors.soDienThoai = "Số điện thoại phải gồm đúng 10 chữ số.";
        }

        if (!selectedProvince) {
            newErrors.province = "Vui lòng chọn Tỉnh/Thành phố.";
        }

        if (!selectedDistrict) {
            newErrors.district = "Vui lòng chọn Quận/Huyện.";
        }

        if (!selectedWard) {
            newErrors.ward = "Vui lòng chọn Xã/Phường.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await api.get(
                    "/admin/dia-chi/get-province",
                );
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
            const response = await api.get(
                "/admin/dia-chi/get-districts",
                { params: { provinceID: province.ProvinceID } }
            );
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
            const response = await api.get(
                "/admin/dia-chi/get-wards",
                { params: { districtID: district.DistrictID } }
            );
            setWards(response.data.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ward:", error);
        }
    };

    const handleWardChange = (e) => {
        const ward = wards.find(w => w.WardCode == e.target.value);
        setSelectedWard(ward);
    };

    const handleSave = () => {
        if (!validateForm()) return;

        const data = {
            khachHang: hoaDon.khachHang,
            tenNguoiNhan,
            soDienThoai,
            ghiChu,
            diaChiChiTiet,
            thanhPho: selectedProvince?.ProvinceID,
            quanHuyen: selectedDistrict?.DistrictID,
            xaPhuong: selectedWard?.WardCode,
        };
        api.post(`/admin/dia-chi/add/${hoaDon.idHoaDon}`, data)
            .then(response => {
                if (response.status === 200) {
                    onClose(true);
                    reload();
                }
            })
            .catch(error => {
                console.error('Lỗi khi gửi dữ liệu:', error);
            });
        
        // Close dialog after successful submission
    };


    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <DialogTitle>Thêm Địa Chỉ</DialogTitle>
            <DialogContent>
                <FormControl fullWidth error={Boolean(errors.province)}>
                    <InputLabel id="thanh-pho">Tỉnh/Thành phố</InputLabel>
                    <Select
                        value={selectedProvince?.ProvinceID || ""}
                        labelId="thanh-pho"
                        label="Tỉnh/Thành phố"
                        onChange={(e) => {
                            handleProvinceChange(e)
                            setErrors(prev => ({ ...prev, province: '' }));
                        }}
                    >
                        {provinces.map((p) => (
                            <MenuItem key={p.ProvinceID} value={p.ProvinceID}>
                                {p.ProvinceName}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.province && <p style={{ color: 'red', margin: 0, fontSize: 12 }}>{errors.province}</p>}
                </FormControl>


                <FormControl
                    fullWidth
                    disabled={!selectedProvince}
                    error={Boolean(errors.district)}
                >
                    <InputLabel id="huyen">Quận/Huyện</InputLabel>
                    <Select
                        labelId="huyen"
                        label="Quận/Huyện"
                        value={selectedDistrict?.DistrictID || ""}
                        onChange={(e) => {
                            handleDistrictChange(e)
                            setErrors(prev => ({ ...prev, district: '' }));
                        }}
                    >
                        {districts.map((d) => (
                            <MenuItem key={d.DistrictID} value={d.DistrictID}>
                                {d.DistrictName}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.district && (
                        <p style={{ color: 'red', margin: 0, fontSize: 12 }}>
                            {errors.district}
                        </p>
                    )}
                </FormControl>


                <FormControl
                    fullWidth
                    disabled={!selectedDistrict}
                    error={Boolean(errors.ward)}
                >
                    <InputLabel id="xa">Xã/Phường</InputLabel>
                    <Select
                        value={selectedWard?.WardCode || ""}
                        onChange={(e) => {
                            handleWardChange(e)
                            setErrors(prev => ({ ...prev, ward: '' }));
                        }}
                        labelId="xa"
                        label="Xã/Phường"
                    >
                        {wards.map((w) => (
                            <MenuItem key={w.WardCode} value={w.WardCode}>
                                {w.WardName}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.ward && (
                        <p style={{ color: 'red', margin: 0, fontSize: 12 }}>
                            {errors.ward}
                        </p>
                    )}
                </FormControl>

                <TextField
                    label="Địa chỉ chi tiết"
                    fullWidth
                    value={diaChiChiTiet}
                    onChange={(e) => {
                        setDiaChiChiTiet(e.target.value);
                        setErrors(prev => ({ ...prev, diaChiChiTiet: '' }));
                    }}
                    margin="normal"
                    error={Boolean(errors.diaChiChiTiet)}
                    helperText={errors.diaChiChiTiet}
                />

                <TextField
                    label="Tên người nhận"
                    fullWidth
                    value={tenNguoiNhan}
                    margin="normal"
                    error={Boolean(errors.tenNguoiNhan)}
                    helperText={errors.tenNguoiNhan}
                    onChange={(e) => {
                        setTenNguoiNhan(e.target.value);
                        setErrors(prev => ({ ...prev, tenNguoiNhan: '' }));
                    }}

                />


                <TextField
                    label="Số điện thoại"
                    fullWidth
                    value={soDienThoai}
                    onChange={(e) => {
                        setSoDienThoai(e.target.value);
                        setErrors(prev => ({ ...prev, soDienThoai: '' }));
                    }}
                    margin="normal"
                    error={Boolean(errors.soDienThoai)}
                    helperText={errors.soDienThoai}
                />

                <TextField
                    label="Ghi chú"
                    fullWidth
                    value={ghiChu}
                    onChange={(e) => setGhiChu(e.target.value)}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose(false)} color="primary">Hủy</Button>
                <Button onClick={handleSave} color="primary">Lưu</Button>
            </DialogActions>
        </Dialog>
    )
}
