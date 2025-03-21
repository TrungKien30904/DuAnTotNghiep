import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";

const Delivery = ({ onShippingFeeUpdate, open, onClose }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [formData, setFormData] = useState({
        hoTen: '',
        soDienThoai: '',
        email: '',
        ghiChu: ''
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [amount, setAmount] = useState(0);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    const headers = {
        token: "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
        "Content-Type": "application/json",
    };

    const handleConfirm = () => {
        if (!formData.soDienThoai) {
            onShippingFeeUpdate(false, null, { message: "Vui lòng nhập số điện thoại!", type: "error" });
            return;
        }
        if (!selectedProvince || !selectedDistrict || !selectedWard) {
            onShippingFeeUpdate(false, null, { message: "Vui lòng chọn đầy đủ địa chỉ!", type: "error" });
            return;
        }

        const diaChi = `${selectedProvince.ProvinceName}, ${selectedDistrict.DistrictName}, ${selectedWard.WardName}`;
        onShippingFeeUpdate(true, { ...formData, amount, diaChi }, null); // Không có lỗi, gửi dữ liệu
        onClose(); // Đóng dialog sau khi gửi dữ liệu hợp lệ
    };

    const handleCancel = () => {
        onShippingFeeUpdate(false, null, null); // Gửi false, không có dữ liệu và lỗi
        onClose();
    };


    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(
                    "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
                    { headers }
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
        setAmount(0);

        try {
            const response = await axios.get(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
                { headers, params: { province_id: province.ProvinceID } }
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
        setAmount(0);

        try {
            const response = await axios.get(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
                { headers, params: { district_id: district.DistrictID } }
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

    useEffect(() => {
        const getAmount = async () => {
            if (selectedWard && selectedDistrict) {
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
                    "coupon": null,
                    "items": [{
                        "name": "TEST1",
                        "quantity": 1,
                        "length": 200,
                        "width": 200,
                        "height": 200,
                        "weight": 1000
                    }]
                }
                try {
                    const response = await axios.post(
                        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                        requestData,
                        { headers: { token: headers.token, "shop_id": 5652920, "Content-Type": "application/json" } }
                    );
                    if (response.status === 200) {
                        setAmount(response.data.data.total);
                    } else {
                        setAmount(30000);
                    }
                } catch (error) {
                    if (error.response) {
                        console.error("Phản hồi lỗi từ API:", error.response.data);
                    }
                    setAmount(33000);
                }
            } else {
                setAmount(0);
            }
        }
        getAmount();
    }, [selectedWard, selectedDistrict]);

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>Thêm thông tin khách lẻ</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Họ tên"
                    {...register("hoTen", { required: "Vui lòng nhập họ tên" })}
                    value={formData.hoTen}
                    onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                    error={!!errors.hoTen}
                    helperText={errors.hoTen?.message}
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Số điện thoại"
                    {...register("soDienThoai", { required: "Vui lòng nhập số điện thoại" })}
                    value={formData.soDienThoai}
                    onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                    error={!!errors.soDienThoai}
                    helperText={errors.soDienThoai?.message}
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Email"
                    {...register("email", { required: "Vui lòng nhập email" })}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />

                <FormControl fullWidth margin="dense">
                    <InputLabel id="thanh-pho">
                        Tỉnh/Thành phố
                    </InputLabel>
                    <Select
                        value={selectedProvince?.ProvinceID || ""} onChange={handleProvinceChange}
                        labelId="thanh-pho"
                        label="Tỉnh/Thành phố"
                    >
                        {provinces.map((p) => (<MenuItem key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</MenuItem>))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="dense" disabled={!selectedProvince}>
                    <InputLabel id="huyen">Quận/Huyện</InputLabel>
                    <Select
                        labelId="huyen"
                        label="Quận/Huyện"
                        value={selectedDistrict?.DistrictID || ""}
                        onChange={handleDistrictChange}
                    >
                        {districts.map((d) => (<MenuItem key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</MenuItem>))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="dense" disabled={!selectedDistrict}>
                    <InputLabel id="xa">Xã/Phường</InputLabel>
                    <Select
                        value={selectedWard?.WardCode || ""}
                        onChange={handleWardChange}
                        labelId="xa"
                        label="Xã/Phường"
                    >
                        {wards.map((w) => (<MenuItem key={w.WardCode} value={w.WardCode}>{w.WardName}</MenuItem>))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    margin="dense"
                    label="Ghi chú"
                    multiline
                    rows={3}
                    value={formData.ghiChu}
                    onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                />
            </DialogContent>

            <DialogActions>
                <Button variant="contained" onClick={handleConfirm}>Thêm</Button>
                <Button onClick={handleCancel}>Hủy</Button>
            </DialogActions>
        </Dialog>
    );
};

export default Delivery;
