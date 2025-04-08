import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Typography, Dialog } from "@mui/material";
import Notification from "../../../components/Notification"; // Import Notification component


const UpdateAddress = ({ onClose, existingData, onUpdate }) => {
    const [formData, setFormData] = useState(existingData || {
        hoTen: '',
        soDienThoai: '',
        email: '',
        districtID: '',
        provinceID: '',
        wardCode: '',
        diaChiChiTiet: '',
        ghiChu: ''
    });

    const [errors, setErrors] = useState({});
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

        setFormData(prev => ({
            ...prev,
            provinceID: province?.ProvinceID || "",
            districtID: "",
            wardCode: ""
        }));

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

        setFormData(prev => ({
            ...prev,
            districtID: district?.DistrictID || "",
            wardCode: ""
        }));

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

        setFormData(prev => ({
            ...prev,
            wardCode: ward?.WardCode || ""
        }));
    };


    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" }); // Xóa lỗi khi người dùng nhập vào
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.hoTen = formData.hoTen ? "" : "Họ tên không được để trống.";
        tempErrors.diaChiChiTiet = formData.diaChiChiTiet ? "" : "Địa chỉ chi tiết không được để trống.";
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
        if (!formData.selectedAddressId) {
            if (!validate()) return; // Chỉ validate khi nhập địa chỉ mới
        }
        const addressId = `${formData.provinceID}, ${formData.districtID}, ${formData.wardCode}`;
        let apiUrl = "http://localhost:8080/admin/khach-hang/";
        let addressToUpdate = {
            nameReceive: formData.hoTen,
            phoneNumber: formData.soDienThoai,
            provinceId: formData.provinceID,
            districtId: formData.districtID,
            wardId: formData.wardCode,
            addressDetail: formData.diaChiChiTiet,
            customerId: formData.id, // ID khách hàng hiện tại
            addressId: addressId, // Gửi địa chỉ đã gộp
        };

        try {
            if (formData.selectedAddressId) {
                // Nếu người dùng đã chọn địa chỉ có sẵn
                addressToUpdate.id = formData.selectedAddressId;
                apiUrl += "update-address-selected";
            } else {
                // Nếu người dùng nhập địa chỉ mới trực tiếp
                apiUrl += "update-address-direct";
            }

            await axios.put(apiUrl, addressToUpdate);
            onClose();
            onUpdate({
                ...existingData,
                hoTen: formData.hoTen,
                soDienThoai: formData.soDienThoai,
                email: formData.email,
                provinceID: formData.provinceID,
                districtID: formData.districtID,
                wardCode: formData.wardCode,
                diaChi: addressId,
                detail: formData.diaChiChiTiet,
                ghiChu: formData.ghiChu
            });
            Notification("Cập nhật địa chỉ thành công!", "success");
        } catch (error) {
            console.error("Lỗi khi cập nhật địa chỉ:", error);
            Notification("Cập nhật địa chỉ thất bại!", "error");

        }
    };



    return (
        <Dialog open={true} onClose={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-[500px] max-w-full rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">THÔNG TIN GIAO HÀNG</h2>

                <div className="space-y-4">
                    {/* Họ tên */}
                    <TextField
                        fullWidth
                        size="small"
                        label="Họ tên"
                        value={formData.hoTen}
                        onChange={(e) => handleInputChange('hoTen', e.target.value)}
                        error={!!errors.hoTen}
                        helperText={errors.hoTen}
                        className="rounded-lg"
                    />

                    {/* Số điện thoại */}
                    <TextField
                        fullWidth
                        size="small"
                        label="Số điện thoại"
                        value={formData.soDienThoai}
                        onChange={(e) => handleInputChange('soDienThoai', e.target.value)}
                        error={!!errors.soDienThoai}
                        helperText={errors.soDienThoai}
                        className="rounded-lg"
                    />

                    {/* Email */}
                    <TextField
                        fullWidth
                        size="small"
                        label="Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        className="rounded-lg"
                    />

                    {/* Tỉnh/Thành phố */}
                    <FormControl fullWidth size="small" error={!!errors.selectedProvince} className="rounded-lg">
                        <InputLabel>Tỉnh/Thành phố</InputLabel>
                        <Select value={selectedProvince?.ProvinceID || ""} onChange={handleProvinceChange}>
                            {provinces.map((p) => (<MenuItem key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</MenuItem>))}
                        </Select>
                        {errors.selectedProvince && <Typography color="error">{errors.selectedProvince}</Typography>}
                    </FormControl>

                    {/* Quận/Huyện */}
                    <FormControl fullWidth size="small" disabled={!selectedProvince} error={!!errors.selectedDistrict} className="rounded-lg">
                        <InputLabel>Quận/Huyện</InputLabel>
                        <Select value={selectedDistrict?.DistrictID || ""} onChange={handleDistrictChange}>
                            {districts.map((d) => (<MenuItem key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</MenuItem>))}
                        </Select>
                        {errors.selectedDistrict && <Typography color="error">{errors.selectedDistrict}</Typography>}
                    </FormControl>

                    {/* Xã/Phường */}
                    <FormControl fullWidth size="small" disabled={!selectedDistrict} error={!!errors.selectedWard} className="rounded-lg">
                        <InputLabel>Xã/Phường</InputLabel>
                        <Select value={selectedWard?.WardCode || ""} onChange={handleWardChange}>
                            {wards.map((w) => (<MenuItem key={w.WardCode} value={w.WardCode}>{w.WardName}</MenuItem>))}
                        </Select>
                        {errors.selectedWard && <Typography color="error">{errors.selectedWard}</Typography>}
                    </FormControl>

                    <TextField
                        fullWidth
                        size="small"
                        label="Địa chỉ chi tiết"
                        value={formData.diaChiChiTiet}
                        onChange={(e) => handleInputChange('diaChiChiTiet', e.target.value)}
                        error={!!errors.diaChiChiTiet}
                        helperText={errors.diaChiChiTiet}
                        className="rounded-lg"
                    />

                    {/* Ghi chú */}
                    <TextField
                        fullWidth
                        size="small"
                        label="Ghi chú"
                        multiline
                        rows={3}
                        value={formData.ghiChu}
                        onChange={(e) => handleInputChange('ghiChu', e.target.value)}
                        className="rounded-lg"
                    />
                </div>

                {/* Nút xác nhận */}
                <div className="mt-6 flex gap-4">
                    <Button
                        variant="outlined"
                      //  color="secondary"
                        fullWidth
                        size="large"
                        className="border border-gray-400 text-gray-700 rounded-lg px-5 py-2 hover:bg-gray-100 transition"
                        onClick={onClose}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        className="bg-blue-500 text-white rounded-lg px-5 py-2 hover:bg-blue-600 transition"
                        onClick={handleConfirm}
                    >
                        Xác nhận
                    </Button>
                </div>
            </div>
        </Dialog>

    );
};

export default UpdateAddress;