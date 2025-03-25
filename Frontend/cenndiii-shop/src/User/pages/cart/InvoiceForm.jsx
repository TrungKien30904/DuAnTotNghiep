import React, { useEffect, useState } from "react";
import axios from "axios";
import { Ticket, Trash2 } from "lucide-react";

import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Typography, Stack } from "@mui/material";

const InvoiceForm = ({ total, cartItem, selectedVoucher, discountAmount, bestVoucherId, onOpenVoucherModal, onRemoveVoucher }) => {


    // ...
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
        setAmount(0);

        try {
            const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", { headers, params: { province_id: province.ProvinceID } });
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
            const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", { headers, params: { district_id: district.DistrictID } });
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
                    "items": cartItem.map(item => ({
                        "name": item.name,
                        "quantity": item.soLuong,
                        "length": 200,
                        "width": 200,
                        "height": 200,
                        "weight": 1000
                    }))

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
    }, [selectedWard, selectedDistrict, total]);
    return (
        <div>
            <Typography variant="h5">Thông Tin Đơn Hàng</Typography>
            <TextField fullWidth size="small" margin="dense" label="Họ tên" value={formData.hoTen} onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })} />
            <TextField fullWidth size="small" margin="dense" label="Số điện thoại" value={formData.soDienThoai} onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })} />
            <TextField fullWidth size="small" margin="dense" label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

            <FormControl fullWidth size="small" margin="dense">
                <InputLabel id="thanh-pho">
                    Tỉnh/Thành phố
                </InputLabel>
                <Select
                    value={selectedProvince?.ProvinceID || ""} onChange={handleProvinceChange}
                    labelId="thanh-pho"
                    label="Tỉnh/Thành phố"
                    MenuProps={{ disableScrollLock: true }}
                >
                    {provinces.map((p) => (<MenuItem key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</MenuItem>))}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" margin="dense" disabled={!selectedProvince}>
                <InputLabel id="huyen">Quận/Huyện</InputLabel>
                <Select
                    labelId="huyen"
                    label="Quận/Huyện"
                    value={selectedDistrict?.DistrictID || ""}
                    onChange={handleDistrictChange}
                    MenuProps={{ disableScrollLock: true }}
                >
                    {districts.map((d) => (<MenuItem key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</MenuItem>))}
                </Select>
            </FormControl>

            <FormControl fullWidth size="small" margin="dense" disabled={!selectedDistrict}>
                <InputLabel id="xa">Xã/Phường</InputLabel>
                <Select
                    value={selectedWard?.WardCode || ""}
                    onChange={handleWardChange}
                    labelId="xa"
                    label="Xã/Phường"
                    MenuProps={{ disableScrollLock: true }}
                >
                    {wards.map((w) => (<MenuItem key={w.WardCode} value={w.WardCode}>{w.WardName}</MenuItem>))}
                </Select>
            </FormControl>

            <TextField fullWidth size="small" margin="dense" label="Ghi chú" multiline rows={3} value={formData.ghiChu} onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })} />


            <div className="mb-6 mt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span><Ticket size={18} /></span>
                        <span className="text-lg font-medium">Phiếu giảm giá</span>
                    </div>
                    {onOpenVoucherModal && (
                        <button
                            onClick={onOpenVoucherModal}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            Chọn mã giảm giá
                        </button>
                    )}
                </div>

                {selectedVoucher && (
                    <div className="mt-1 text-xs text-gray-700">
                        <div className="flex items-center justify-between">
                            <p>
                                Đã chọn: <b className="text-green-500">
                                    {selectedVoucher.maKhuyenMai} - Giảm: {selectedVoucher.hinhThuc === "%"
                                        ? `${selectedVoucher.giaTri}% (tối đa ${selectedVoucher.giaTriToiDa?.toLocaleString()} VND)`
                                        : `${selectedVoucher.giaTri?.toLocaleString()} VND`}
                                </b>
                            </p>
                            <button
                                onClick={onRemoveVoucher}
                                className="text-sm text-red-500 hover:underline ml-2"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {selectedVoucher.id === bestVoucherId && (
                            <p className="text-sm text-red-500 font-semibold mt-1">(*Phiếu giảm tốt nhất)</p>
                        )}
                    </div>
                )}


                {/* Đường kẻ ngang sau nội dung */}
                <div className="border-b mt-2"></div>
            </div>


            <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>Tổng tiền:</Typography>
                    <Typography><b>{total.toLocaleString()} đ</b></Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>Giảm giá:</Typography>
                    <Typography><b className="text-red-500">-{discountAmount.toLocaleString()} đ</b></Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>Phí vận chuyển:</Typography>
                    <Typography><b>{amount.toLocaleString()} đ</b></Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>Tổng thanh toán:</Typography>
                    <Typography><b>{(total - discountAmount + amount).toLocaleString()} đ</b></Typography>
                </Stack>

            </Stack>



            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="small"
                className="mt-4"
                disabled={cartItem.length === 0}
            >
                Thanh Toán
            </Button>

        </div>
    );
};

export default InvoiceForm;