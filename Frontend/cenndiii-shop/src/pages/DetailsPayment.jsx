import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../components/Notification";
import { ToastContainer } from "react-toastify";
const DeliveryForm = ({ total, orderItems, reloadTab }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [formData, setFormData] = useState({
        id: 0,
        maKhachHang: '',
        hoTen: '',
        gioiTinh: true,
        soDienThoai: '',
        email: '',
        matKhau: '',
        trangThai: true,
        provinceId: 0,
        districtId: 0,
        wardId: 0,
        addressDetails: "",
        addressMappers: [],
        image: "",
        imageBase64: ""
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [amount, setAmount] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [customers, setCustomers] = useState([]);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [lastTotal, setLastTotal] = useState(total);
    const [deliveryMethod, setDeliveryMethod] = useState("taiquay");
    const [paymentMethod, setPaymentMethod] = useState("tienmat");
    const [cashAmount, setCashAmount] = useState(0);
    const [transferAmount, setTransferAmount] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");

    const headers = {
        token: "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
        "Content-Type": "application/json",
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(
                    "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
                    { headers }
                );
                if (Array.isArray(response.data.data)) {
                    setProvinces(response.data.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tỉnh:", error);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        if (deliveryMethod === "taiquay") {
            setLastTotal(total);
        } else {
            setLastTotal(total + Number(amount));
        }
    }, [total, amount, deliveryMethod]);

    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        setDistricts([]);
        setSelectedDistrict("");
        setWards([]);
        setSelectedWard("");
        setAmount("");
        try {
            const response = await axios.get(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
                {
                    headers,
                    params: { province_id: provinceId },
                }
            );

            if (Array.isArray(response.data.data)) {
                setDistricts(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách district:", error);
        }
    };

    const handleDistrictChange = async (e) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        setWards([]);
        setSelectedWard("");
        setAmount("");
        try {
            const response = await axios.get(
                "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
                {
                    headers,
                    params: { district_id: districtId },
                }
            );

            if (Array.isArray(response.data.data)) {
                setWards(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ward:", error);
        }
    };

    const handleWardChange = (e) => {
        setSelectedWard(e.target.value);
    };

    useEffect(() => {
        if (selectedWard && selectedDistrict) {
            const requestData = {
                "service_id": 53321,
                "insurance_value": 500000,
                "coupon": null,
                "from_district_id": 1542,
                "to_district_id": Number(selectedDistrict),
                "to_ward_code": selectedWard,
                "height": 15,
                "length": 15,
                "weight": 1000,
                "width": 15
            };

            axios.post(
                "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
                requestData,
                {
                    headers: {
                        token: "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
                        "shop_id": "5652920",
                        "Content-Type": "application/json"
                    }
                }
            )
                .then(response => {
                    if (response.data.data) {
                        setAmount(response.data.data.total);
                    } else {
                        setAmount(31000);
                    }
                })
                .catch(error => {
                    setAmount(31000);
                });
        }
    }, [selectedWard, selectedDistrict]);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/khach-hang');
            setCustomers(response.data);
            setShowCustomerModal(true);
        } catch (error) {
            console.error("Error fetching customers: ", error);
        }
    };

    const handleCustomerSelect = (customer) => {
        setFormData({
            ...formData,
            maKhachHang: customer.maKhachHang,
            hoTen: customer.hoTen,
            soDienThoai: customer.soDienThoai,
            email: customer.email,
        });
        setShowCustomerModal(false);
    };

    const onSubmit = async (data) => {
        if (!orderItems || orderItems.length === 0) {
            Notification("Không có sản phẩm nào trong đơn hàng.","errorerror")
            return;
        }

        if (deliveryMethod === "giaohang") {
            // Validate required fields for "Giao hàng"
            if (!data.hoten || !data.sodienthoai || !data.email || !data.diachi) {
                alert("Vui lòng nhập đầy đủ thông tin giao hàng.");
                return;
            }
        }

        if (paymentMethod === "cahai" && (Number(cashAmount) + Number(transferAmount) !== lastTotal)) {
            setErrorMessage("Tổng tiền mặt và chuyển khoản phải bằng tổng thanh toán.");
            return;
        }

        const requestData = {
            idHoaDon: orderItems.idHoaDon,
            maHoaDon: orderItems.maHoaDon,
            phieuGiamGia: null,
            khachHang: null,
            nhanVien: null,
            tongTien: lastTotal,
            tenNguoiNhan: deliveryMethod === "giaohang" ? data.hoten : null,
            soDienThoai: deliveryMethod === "giaohang" ? data.sodienthoai : null,
            email: deliveryMethod === "giaohang" ? data.email : null,
            ngayGiaoHang: null,
            phiVanChuyen: deliveryMethod === "giaohang" ? amount : null,
            trangThai: "Đã thanh toán",
            ngaySua: new Date().toISOString(),
            nguoiSua: null,
            loaiDon: deliveryMethod,
            hinhThucThanhToan: paymentMethod,
            tienMat: paymentMethod === "cahai" ? cashAmount : null,
            chuyenKhoan: paymentMethod === "cahai" ? transferAmount : null,
        };

        console.log(requestData);
        
        try {
            // const response = await axios.post(
            //     'http://localhost:8080/admin/hoa-don/thanh-toan',
            //     requestData,
            //     {
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //     }
            // );

            // if (response.status === 200) {
            //     alert("Thanh toán thành công!");
            //     reloadTab(); // Gọi hàm reload tab sau khi thanh toán thành công
            // }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("Đã có lỗi xảy ra khi thanh toán, vui lòng thử lại!");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
                maxWidth: "100%",
                margin: "auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
            }}
        >
            <div className="flex items-center gap-4 mb-4">
                <label>
                    <input
                        type="radio"
                        value="taiquay"
                        checked={deliveryMethod === "taiquay"}
                        onChange={() => setDeliveryMethod("taiquay")}
                    />
                    Tại quầy
                </label>
                <label>
                    <input
                        type="radio"
                        value="giaohang"
                        checked={deliveryMethod === "giaohang"}
                        onChange={() => setDeliveryMethod("giaohang")}
                    />
                    Giao hàng
                </label>
            </div>
            <div className="flex items-center justify-between w-full mt-4">
                <div>Hình thức thanh toán:</div>
                <div className="flex items-center gap-4">
                    <label>
                        <input
                            type="radio"
                            value="tienmat"
                            checked={paymentMethod === "tienmat"}
                            onChange={() => setPaymentMethod("tienmat")}
                        />
                        Tiền mặt
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="chuyenkhoan"
                            checked={paymentMethod === "chuyenkhoan"}
                            onChange={() => setPaymentMethod("chuyenkhoan")}
                        />
                        Chuyển khoản
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="cahai"
                            checked={paymentMethod === "cahai"}
                            onChange={() => setPaymentMethod("cahai")}
                        />
                        Cả hai
                    </label>
                </div>
            </div>
            {paymentMethod === "cahai" && (
                <div className="flex items-center gap-4 mt-4">
                    <div>
                        <label>Tiền mặt:</label>
                        <input
                            type="number"
                            value={cashAmount}
                            onChange={(e) => setCashAmount(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                        />
                    </div>
                    <div>
                        <label>Chuyển khoản:</label>
                        <input
                            type="number"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                        />
                    </div>
                </div>
            )}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {deliveryMethod === "giaohang" && (
                <>
                    {["hoten", "sodienthoai", "email", "diachi"].map((name) => (
                        <div key={name}>
                            <label>{name.charAt(0).toUpperCase() + name.slice(1)}:</label>
                            <input
                                {...register(name, { required: `Vui lòng nhập ${name}` })}
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                            />
                            {errors[name] && <p style={{ color: "red" }}>{errors[name].message}</p>}
                        </div>
                    ))}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {[{ label: "Tỉnh/Thành Phố", value: selectedProvince, onChange: handleProvinceChange, options: provinces, key: "ProvinceID", name: "ProvinceName" }, { label: "Quận/Huyện", value: selectedDistrict, onChange: handleDistrictChange, options: districts, key: "DistrictID", name: "DistrictName", disabled: !selectedProvince }, { label: "Xã/Phường", value: selectedWard, onChange: handleWardChange, options: wards, key: "WardCode", name: "WardName", disabled: !selectedDistrict }].map(({ label, value, onChange, options, key, name, disabled }) => (
                            <div key={label}>
                                <label>{label}:</label>
                                <select value={value} onChange={onChange} disabled={disabled} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}>
                                    <option value="">Chọn {label.toLowerCase()}</option>
                                    {options.map((option) => (
                                        <option key={option[key]} value={option[key]}>{option[name]}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                    <div>
                        <label>Ghi Chú:</label>
                        <textarea {...register('note')} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
                    </div>

                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <label>Phí vận chuyển:</label>
                            <img
                                src="https://product.hstatic.net/1000405368/product/giao_hang_nhanh_toan_quoc_color.b7d18fe5_39425b03ee544ab2966d465756a00f89_small.png"
                                alt="Giao Hàng Nhanh"
                                className="w-24 h-12"
                            />
                        </div>

                        <div className="text-red-500">
                            <span className=""> + </span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="p-2 h-4 w-20 text-right border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                </>
            )}
            <div className="flex items-center justify-between w-full">
                <div>Tổng thanh toán: </div>
                <div className="text-green-500">{lastTotal} vnd </div>
            </div>
            
            <button
                type="submit"
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    width: "100%",
                }}
            >
                Thanh Toán
            </button>
        <ToastContainer/>
        </form>
    );
};

export default DeliveryForm;