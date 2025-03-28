import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../static/AddEmployee/style.css";
import cryptoRandomString from 'crypto-random-string';
import api from "../../security/Axios";
import { hasPermission } from "../../security/DecodeJWT";

export default function EditEmployee() {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ten: "",
        gioiTinh: "Nam",
        ngaySinh: "",
        soDienThoai: "",
        email: "",
        vaiTro: false,
        trangThai: true,
        hinh_anh: null,
        cccd: "",
        diachi: ""
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if(localStorage.getItem("token")){
            if (!hasPermission("ADMIN") && !hasPermission("STAFF")) {
                navigate("/admin/login");
            }
        }
    }, [navigate]);
    const [loading, setLoading] = useState(false); // Trạng thái loading

    const handleSuccess = () => {
        toast.success("Sửa nhân viên thành công!", {
            position: "top-right",
            autoClose: 3000,
        })
    };

    const handleError = () => {
        toast.error("Lỗi khi sửa nhân viên!", {
            position: "top-right",
            autoClose: 3000,
        });
    };
    // 🟢 Lấy dữ liệu nhân viên
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await api.get(`/admin/nhan-vien/detail/${id}`);
                const data = response.data;
                data.ngaySinh = data.ngaySinh ? data.ngaySinh.split("T")[0] : "";
                setFormData(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu nhân viên:", error);
            }
        };
        fetchEmployee();
    }, [id]);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: name === "vaiTro" || name === "trangThai" ? value === "true" : type === "checkbox" ? checked : value,
        });
    };

    const [soNha, setSoNha] = useState("");
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get("https://provinces.open-api.vn/api/p");
                setProvinces(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
            }
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        setSelectedProvince(provinceId);
        setSelectedDistrict("");
        setSelectedWard("");
        setWards([]);

        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`);
            setDistricts(response.data.districts);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách quận huyện:", error);
        }
    };

    const handleDistrictChange = async (e) => {
        const districtId = e.target.value;
        setSelectedDistrict(districtId);
        setSelectedWard("");

        try {
            const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);
            setWards(response.data.wards);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách xã phường:", error);
        }
    };

    const handleWardChange = (e) => {
        setSelectedWard(e.target.value);
    };

    useEffect(() => {
        if (soNha && selectedProvince && selectedDistrict && selectedWard) {
            const provinceName = provinces.find((p) => p.code === Number(selectedProvince))?.name || "";
            const districtName = districts.find((d) => d.code === Number(selectedDistrict))?.name || "";
            const wardName = wards.find((w) => w.code === Number(selectedWard))?.name || "";
            const fullAddress = `${soNha}, ${wardName}, ${districtName}, ${provinceName}`;
            setFormData((prev) => ({
                ...prev,
                diachi: fullAddress,
            }));
        }
    }, [soNha, selectedProvince, selectedDistrict, selectedWard, provinces, districts, wards]);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await api.get(`/admin/nhan-vien/detail/${id}`);
                const data = response.data;
                data.ngaySinh = data.ngaySinh ? data.ngaySinh.split("T")[0] : "";

                // 🟢 Tách địa chỉ thành số nhà, tỉnh, huyện, xã
                if (data.diachi) {
                    const parts = data.diachi.split(", ").reverse();
                    const provinceName = parts[0];
                    const districtName = parts[1];
                    const wardName = parts[2];
                    const houseNumber = parts.slice(3).reverse().join(", "); // Ghép lại phần còn lại

                    setSoNha(houseNumber);

                    // 🟢 Tìm tỉnh theo tên
                    const province = provinces.find((p) => p.name === provinceName);
                    if (province) {
                        setSelectedProvince(province.code);

                        // 🟢 Gọi API lấy quận/huyện của tỉnh
                        const districtRes = await axios.get(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
                        setDistricts(districtRes.data.districts);

                        // 🟢 Tìm huyện theo tên
                        const district = districtRes.data.districts.find((d) => d.name === districtName);
                        if (district) {
                            setSelectedDistrict(district.code);

                            // 🟢 Gọi API lấy xã/phường của huyện
                            const wardRes = await axios.get(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
                            setWards(wardRes.data.wards);

                            // 🟢 Tìm xã theo tên
                            const ward = wardRes.data.wards.find((w) => w.name === wardName);
                            if (ward) {
                                setSelectedWard(ward.code);
                            }
                        }
                    }
                }

                setFormData(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu nhân viên:", error);
            }
        };

        fetchEmployee();
    }, [id, provinces]);


    // Xử lý upload ảnh lên Cloudinary khi chọn file
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageFormData = new FormData();
        imageFormData.append("file", file);
        imageFormData.append("upload_preset", "upload_images"); // Thay bằng upload_preset từ Cloudinary

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/dabnimezp/image/upload`,
                imageFormData
            );
            setFormData((prev) => ({
                ...prev,
                hinh_anh: response.data.secure_url, // Lưu URL thay vì file
            }));
        } catch (error) {
            console.error("Lỗi khi upload ảnh:", error);
            alert("Tải ảnh lên thất bại!");
        }
    };

    // Validation dữ liệu
    const validate = () => {
        let newErrors = {};
        if (!formData.ten.trim()) newErrors.ten = "Tên không được để trống!";

        if (!formData.ngaySinh) {
            newErrors.ngaySinh = "Vui lòng chọn ngày sinh!";
        } else {
            const birthDate = new Date(formData.ngaySinh);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 18) {
                newErrors.ngaySinh = "Nhân viên phải từ 18 tuổi trở lên!";
            }
        }

        if (!/^\d{12}$/.test(formData.cccd)) newErrors.cccd = "CCCD phải là 12 chữ số!";

        if (!/^0\d{9}$/.test(formData.soDienThoai)) newErrors.soDienThoai = "Số điện thoại phải có 10 số và bắt đầu bằng 0!";

        if (!formData.email.trim()) newErrors.email = "Email không được để trống!";

        if (!formData.diachi.trim()) newErrors.diachi = "Địa chỉ không được để trống!";

        if (!selectedProvince || selectedProvince === "") newErrors.selectedProvince = "Vui lòng chọn Tỉnh/Thành phố!";
        if (!selectedDistrict || selectedDistrict === "") newErrors.selectedDistrict = "Vui lòng chọn Quận/Huyện!";
        if (!selectedWard || selectedWard === "") newErrors.selectedWard = "Vui lòng chọn Xã/Phường!";
        if (!soNha.trim()) {
            newErrors.soNha = "Số nhà không được để trống!";
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            handleError();
        }
        return Object.keys(newErrors).length === 0;
    };

    // 🟢 Cập nhật nhân viên
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Dữ liệu gửi đi:", JSON.stringify(formData));
        if (!validate()) return;

        setErrors({});
        setLoading(true);

        try {
            const response = await api.put(`/admin/nhan-vien/sua/${id}`, formData);
            if (response.status === 200) {
                toast.success("Cập nhật nhân viên thành công!", {
                    position: "top-right",
                    autoClose: 3000,
                })
                navigate("/admin/employees");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrors(error.response.data); // Lưu lỗi vào state
            } else {
                console.error("Lỗi khi cập nhật nhân viên:", error);
                toast.error("Có lỗi xảy ra, vui lòng thử lại!", { position: "top-right", autoClose: 3000, });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">THÊM MỚI NHÂN VIÊN</h2>
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-6">
                    {/* Cột 1 */}
                    <div className="space-y-4">
                        <div>
                            <label className="block">Tên</label>
                            <input type="text" name="ten" value={formData.ten} onChange={handleChange} className="border p-2 w-full" />
                            {errors.ten && <p className="text-red-500 text-sm">{errors.ten}</p>}
                        </div>
                        <div>
                            <label className="block">Ngày sinh</label>
                            <input type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleChange} className="border p-2 w-full" />
                            {errors.ngaySinh && <p className="text-red-500 text-sm">{errors.ngaySinh}</p>}
                        </div>
                        <div>
                            <label className="block">Căn cước công dân</label>
                            <input type="text" name="cccd" value={formData.cccd} onChange={handleChange} className="border p-2 w-full" />
                            {errors.cccd && <p className="text-red-500 text-sm">{errors.cccd}</p>}
                        </div>
                        <div>
                            <label className="block">Giới tính</label>
                            <label className="inline-flex items-center">
                                <input type="radio" name="gioiTinh" value="Nam" checked={formData.gioiTinh === "Nam"} onChange={handleChange} className="form-radio" />
                                <span className="ml-2">Nam</span>
                            </label>
                            <label className="inline-flex items-center ml-4">
                                <input type="radio" name="gioiTinh" value="Nữ" checked={formData.gioiTinh === "Nữ"} onChange={handleChange} className="form-radio" />
                                <span className="ml-2">Nữ</span>
                            </label>
                        </div>
                        <div>
                            <label className="block">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 w-full" />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block">Số điện thoại</label>
                            <input type="text" name="soDienThoai" value={formData.soDienThoai} onChange={handleChange} className="border p-2 w-full" />
                            {errors.soDienThoai && <p className="text-red-500 text-sm">{errors.soDienThoai}</p>}
                        </div>
                        <div>
                            <label className="block">Vai trò</label>
                            <select name="vaiTro" value={formData.vaiTro} onChange={handleChange} className="border p-2 w-full">
                                <option value="false">Nhân viên</option>
                                <option value="true">Quản lý</option>
                            </select>
                        </div>

                        <div>
                            <label className="block">Trạng thái</label>
                            <select name="trangThai" value={formData.trangThai} onChange={handleChange} className="border p-2 w-full">
                                <option value="true">Hoạt động</option>
                                <option value="false">Ngừng hoạt động</option>
                            </select>
                        </div>
                    </div>

                    {/* Cột 2 */}
                    <div className="space-y-4">
                        <div>
                            <label className="block">Ảnh đại diện</label>
                            <input type="file" accept="image/*" name="hinh_anh" onChange={handleFileChange} className="border p-2 w-full" />
                            {formData.hinh_anh && <img src={formData.hinh_anh} alt="Ảnh đã chọn" className="w-32 h-32 object-cover mt-2" />}
                        </div>
                        <div>
                            <h1 className="font-semibold">Chọn Địa Chỉ</h1>

                            <div>
                                <label>Tỉnh/Thành Phố:</label>
                                <select value={selectedProvince} onChange={handleProvinceChange} className="border p-2 w-full">
                                    {selectedProvince === "" && <option value="">Chọn tỉnh/thành phố</option>}
                                    {provinces.map((province) => (
                                        <option key={province.code} value={province.code}>{province.name}</option>
                                    ))}
                                </select>
                                {errors.selectedProvince && <p className="text-red-500 text-sm">{errors.selectedProvince}</p>}
                            </div>

                            <div>
                                <label>Quận/Huyện:</label>
                                <select value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince} className="border p-2 w-full">
                                    {selectedDistrict === "" && <option value="">Chọn quận/huyện</option>}
                                    {districts.map((district) => (
                                        <option key={district.code} value={district.code}>{district.name}</option>
                                    ))}
                                </select>
                                {errors.selectedDistrict && <p className="text-red-500 text-sm">{errors.selectedDistrict}</p>}
                            </div>

                            <div>
                                <label>Xã/Phường:</label>
                                <select value={selectedWard} onChange={handleWardChange} disabled={!selectedDistrict} className="border p-2 w-full">
                                    {selectedWard === "" && <option value="">Chọn xã/phường</option>}
                                    {wards.map((ward) => (
                                        <option key={ward.code} value={ward.code}>{ward.name}</option>
                                    ))}
                                </select>
                                {errors.selectedWard && <p className="text-red-500 text-sm">{errors.selectedWard}</p>}
                            </div>
                        </div>
                        <div>
                            <label>Số nhà:</label>
                            <input type="text" value={soNha} onChange={(e) => setSoNha(e.target.value)} className="border p-2 w-full" placeholder="Nhập số nhà, thôn, xóm" />
                            {errors.soNha && <p className="text-red-500 text-sm">{errors.soNha}</p>}
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4 mt-6">
                    <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded-md">  {loading ? "Đang cập nhật..." : "Cập nhật"}</button>
                    <button type="button" onClick={() => navigate("/admin/employees")} className="bg-gray-500 text-white p-2 rounded-md">Hủy</button>
                </div>
            </form>
            {/* Loading Overlay */}
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
