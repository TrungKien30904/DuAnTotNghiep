import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { MapPinHouse } from "lucide-react";
import { getUserId } from "../../../security/DecodeJWT";
import Notification from "../../../components/Notification"; 
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Typography } from "@mui/material";

const SelectAddress = ({ onSelect, onClose, currentAddress }) => {
    const [addressNames, setAddressNames] = useState({});
    const [selectedAddress, setSelectedAddress] = useState(currentAddress); // Sử dụng currentAddress để đặt giá trị mặc định
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false); // Trạng thái hiển thị form nhập địa chỉ mới
    const [newAddress, setNewAddress] = useState({
        nameReceive: '',
        phoneNumber: '',
        provinceId: '',
        districtId: '',
        wardId: '',
        addressDetail: '',
        note: '',
        status: false,
        stage: 1
    });
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [customerAddresses, setCustomerAddresses] = useState([]);
    
    const GHN_HEADERS = {
        token: "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
        "Content-Type": "application/json",
    };

    useEffect(() => {
        const userId = getUserId();
        if (userId) {
            setSelectedCustomerId(userId);
        }
    }, []);

    useEffect(() => {
        if (selectedCustomerId) {
            fetchAddressesFromBackend(); // Lấy danh sách địa chỉ từ backend
        }
    }, [selectedCustomerId]);

    useEffect(() => {
        // Cập nhật selectedAddress khi currentAddress thay đổi
        setSelectedAddress(currentAddress);
    }, [currentAddress]);

    const convertAddress = async (provinceId, districtId, wardId) => {
        try {
            const [provinceRes, districtRes, wardRes] = await Promise.all([
                axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", { headers: GHN_HEADERS }),
                axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", { headers: GHN_HEADERS, params: { province_id: provinceId } }),
                axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", { headers: GHN_HEADERS, params: { district_id: districtId } })
            ]);

            const province = provinceRes.data.data.find(p => p.ProvinceID == provinceId);
            const district = districtRes.data.data.find(d => d.DistrictID == districtId);
            const ward = wardRes.data.data.find(w => w.WardCode == wardId);

            return `${ward?.WardName || ""}, ${district?.DistrictName || ""}, ${province?.ProvinceName || ""}`;
        } catch (error) {
            console.error("Lỗi khi chuyển đổi địa chỉ:", error);
            return "Địa chỉ không xác định";
        }
    };

    const fetchAddressesFromBackend = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/admin/khach-hang/detail-client/${selectedCustomerId}`, {
                withCredentials: true
            });
            setCustomerAddresses(response.data.addressMappers);
        } catch (err) {
            console.error("Lỗi khi lấy thông tin khách hàng:", err);
        }
    };

    useEffect(() => {
        const fetchAddresses = async () => {
            const newAddressNames = {};
            await Promise.all(
                customerAddresses.map(async (address) => {
                    const fullAddress = await convertAddress(address.provinceId, address.districtId, address.wardId);
                    newAddressNames[address.id] = fullAddress;
                })
            );
            setAddressNames(newAddressNames);
        };

        fetchAddresses();
    }, [customerAddresses]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", { headers: GHN_HEADERS });
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
                headers: GHN_HEADERS, params: { province_id: province.ProvinceID }
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
                headers: GHN_HEADERS, params: { district_id: district.DistrictID }
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
        setNewAddress({ ...newAddress, [field]: value });
        setErrors({ ...errors, [field]: "" }); // Xóa lỗi khi người dùng nhập vào
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.nameReceive = newAddress.nameReceive ? "" : "Họ tên không được để trống.";
        tempErrors.phoneNumber = newAddress.phoneNumber ? "" : "Số điện thoại không được để trống.";
        tempErrors.provinceId = selectedProvince ? "" : "Vui lòng chọn Tỉnh/Thành phố.";
        tempErrors.districtId = selectedDistrict ? "" : "Vui lòng chọn Quận/Huyện.";
        tempErrors.wardId = selectedWard ? "" : "Vui lòng chọn Xã/Phường.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleAddNewAddress = async () => {
        if (validate()) {
            const fullAddress = `${selectedWard?.WardName || ''}, ${selectedDistrict?.DistrictName || ''}, ${selectedProvince?.ProvinceName || ''}`;

            const newDiaChi = {
                customerId: selectedCustomerId, // Bạn có thể thay đổi ID khách hàng tương ứng
                nameReceive: newAddress.nameReceive,
                phoneNumber: newAddress.phoneNumber,
                provinceId: selectedProvince.ProvinceID,
                districtId: selectedDistrict.DistrictID,
                wardId: selectedWard.WardCode,
                addressDetail: newAddress.addressDetail,
                note: newAddress.note,
                status: newAddress.status,
                stage: newAddress.stage
            };

            try {
                const response = await axios.post("http://localhost:8080/admin/khach-hang/them-dia-chi", newDiaChi);
                const savedAddress = response.data;
                await fetchAddressesFromBackend(); // Gọi API để lấy lại danh sách địa chỉ
                setSelectedAddress(savedAddress);
                setIsAddingNewAddress(false);
                 Notification("Thêm địa chỉ thành công!", "success");
            } catch (error) {
                console.error("Lỗi khi thêm địa chỉ mới:", error);
                Notification("Thêm địa chỉ thất bại!", "error");
            }
        }
    };

    return (
        <Dialog open={true} onClose={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-[600px] rounded-lg shadow-lg max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Chọn Địa Chỉ Giao Hàng</h2>
                        <p className="text-sm text-gray-600">Chọn một địa chỉ để giao hàng</p>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setIsAddingNewAddress(true)}>
                        Thêm Địa Chỉ
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
                    {isAddingNewAddress ? (
                        <div className="space-y-4">
                            <TextField
                                fullWidth
                                size="small"
                                margin="dense"
                                label="Họ tên"
                                value={newAddress.nameReceive}
                                onChange={(e) => handleInputChange('nameReceive', e.target.value)}
                                error={!!errors.nameReceive}
                                helperText={errors.nameReceive}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                margin="dense"
                                label="Số điện thoại"
                                value={newAddress.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber}
                            />
                            <FormControl fullWidth size="small" margin="dense" error={!!errors.provinceId}>
                                <InputLabel>Tỉnh/Thành phố</InputLabel>
                                <Select value={selectedProvince?.ProvinceID || ""} onChange={handleProvinceChange}>
                                    {provinces.map((p) => (<MenuItem key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</MenuItem>))}
                                </Select>
                                {errors.provinceId && <Typography color="error">{errors.provinceId}</Typography>}
                            </FormControl>

                            <FormControl fullWidth size="small" margin="dense" disabled={!selectedProvince} error={!!errors.districtId}>
                                <InputLabel>Quận/Huyện</InputLabel>
                                <Select value={selectedDistrict?.DistrictID || ""} onChange={handleDistrictChange}>
                                    {districts.map((d) => (<MenuItem key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</MenuItem>))}
                                </Select>
                                {errors.districtId && <Typography color="error">{errors.districtId}</Typography>}
                            </FormControl>

                            <FormControl fullWidth size="small" margin="dense" disabled={!selectedDistrict} error={!!errors.wardId}>
                                <InputLabel>Xã/Phường</InputLabel>
                                <Select value={selectedWard?.WardCode || ""} onChange={handleWardChange}>
                                    {wards.map((w) => (<MenuItem key={w.WardCode} value={w.WardCode}>{w.WardName}</MenuItem>))}
                                </Select>
                                {errors.wardId && <Typography color="error">{errors.wardId}</Typography>}
                            </FormControl>

                            <TextField
                                fullWidth
                                size="small"
                                margin="dense"
                                label="Địa chỉ chi tiết"
                                value={newAddress.addressDetail}
                                onChange={(e) => handleInputChange('addressDetail', e.target.value)}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                margin="dense"
                                label="Ghi chú"
                                multiline
                                rows={3}
                                value={newAddress.note}
                                onChange={(e) => handleInputChange('note', e.target.value)}
                            />

                            <div className="flex justify-end gap-4">
                                <button className="px-5 py-2 border rounded hover:bg-gray-100" onClick={() => setIsAddingNewAddress(false)}>
                                    Hủy
                                </button>
                                <button className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleAddNewAddress}>
                                    Thêm Địa Chỉ
                                </button>
                            </div>
                        </div>
                    ) : (
                        customerAddresses.length > 0 ? (
                            customerAddresses.map((address, index) => (
                                <div
                                    key={index}
                                    className={`border rounded-lg p-4 cursor-pointer flex items-center transition-all 
                                            ${selectedAddress?.id === address.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                                            hover:border-blue-500`}
                                    onClick={() => setSelectedAddress(address)} // Chỉ cập nhật selectedAddress khi click
                                >
                                    {/* Icon bên trái */}
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-blue-600">
                                        <MapPinHouse size={24} className="w-17 h-17 object-contain transition-transform duration-300 hover:scale-110" />
                                    </div>

                                    {/* Nội dung bên phải */}
                                    <div className="flex-1 ml-4">
                                        <p className="text-lg font-medium">{address.nameReceive} | {address.phoneNumber}</p>
                                        <p className="text-sm text-gray-700">{address.addressDetail} {addressNames[address.id] || "Đang tải..."}</p>
                                    </div>

                                    {/* Radio button */}
                                    <input
                                        type="radio"
                                        name="address"
                                        value={address.id}
                                        checked={selectedAddress?.id === address.id}
                                        readOnly
                                        className="ml-2"
                                    />
                                </div>

                            ))
                        ) : (
                            <p className="text-center text-gray-500">Không có địa chỉ nào</p>
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t flex justify-end gap-4">
                    <button className="px-5 py-2 border rounded hover:bg-gray-100" onClick={onClose}>
                        Hủy
                    </button>
                    <button
                        className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => onSelect(selectedAddress)} // Truyền địa chỉ đã chọn khi xác nhận
                        disabled={!selectedAddress}
                    >
                        Xác Nhận
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default SelectAddress;