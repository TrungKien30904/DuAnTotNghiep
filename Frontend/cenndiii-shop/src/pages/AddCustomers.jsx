import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/images-upload.png';
// import { useToast } from '../utils/ToastContext';
function AddCustomers() {
    const [formData, setFormData] = useState({
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
        provinceName: "", 
        districtName: "", 
        wardName: ""
    });
    const [successMessage, setSuccessMessage] = useState(null); // For confirmation message
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const [provinces, setProvince] = useState([]);
    const [districts, setDistrict] = useState([]);
    const [wards, setWards] = useState([]);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const filePreviewUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(filePreviewUrl);
            setFile(selectedFile);
        }
    };

    // const { showToast } = useToast();
    const fetchProvinces = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/admin/custom-address/get-province"
            );
            setProvince(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            // showToast(error, "error");
        }
    };

    const fetchDistrict = useCallback(async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/admin/custom-address/get-district",
                {
                    params: {
                        provinceId: formData.provinceId
                    },
                }
            );
            setDistrict(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (error) {
            // showToast(error, "error");
        }
    }, [formData]);

    const fetchWards = useCallback(async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/admin/custom-address/get-ward",
                {
                    params: {
                        districtId: formData.districtId
                    },
                }
            );
            setWards(
                Array.isArray(response.data) ? response.data : []
            );
        } catch (error) {
            // showToast(error, "error");
        }
    }, [formData]);

//   const { setLoadingState, loading } = useLoading();
    const handleSelectedProvince = (event) => {
        var provicneName = provinces.find((e) => e.id == event.target.value).name ?? "";
        setFormData({ ...formData, provinceId: event.target.value, districtId: 0, wardId: 0, provinceName: provicneName, districtName: "", wardName: "" });
    };

    useEffect(() => { fetchDistrict(); }, [formData, fetchDistrict]);

    const handleSelectedDistrict = (event) => {
        var name = districts.find((e) => e.id == event.target.value).name ?? "";
        setFormData({ ...formData, districtId: event.target.value, wardId: 0, districtName: name, wardName: "" });
    };

    useEffect(() => { fetchWards(); }, [formData, fetchWards]);
    const handleSelectedWard = (event) => {
        var name = wards.find((e) => e.id == event.target.value).name ?? "";
        setFormData({ ...formData, wardId: event.target.value, wardName: name});
    }

    useEffect(() => {
        fetchProvinces();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeGender = (event) => {
        setFormData({ ...formData, gioiTinh: event.target.value === 'male' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
    
        const newErrors = {};
        if (!formData.maKhachHang) newErrors.maKhachHang = "Mã khách hàng không được để trống";
        if (!formData.hoTen) newErrors.hoTen = "Họ tên không được để trống";
        if (!formData.soDienThoai.match(/^0[0-9]{9}$/)) newErrors.soDienThoai = "Số điện thoại không hợp lệ";
        if (!formData.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) newErrors.email = "Email không hợp lệ";
        if (!formData.provinceId || formData.provinceId === 0) newErrors.provinceId = "Vui lòng chọn tỉnh/thành phố";
        if (!formData.districtId || formData.districtId === 0) newErrors.districtId = "Vui lòng chọn quận/huyện";
        if (!formData.wardId || formData.wardId === 0) newErrors.wardId = "Vui lòng chọn xã/phường";
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        try {
            const userJson = JSON.stringify(formData);
            const forms = new FormData();
            if (file === null) {
                alert("Require avatar image");
                return;
            }
            forms.append('user', userJson);
            forms.append('fileImage', file);
    
            const response = await fetch('http://localhost:8080/admin/khach-hang/them', {
                method: "POST",
                body: forms
            });
            console.log(forms);
            
            const data = await response.json();
            if (data) {
                if (data.code > 0) {
                    alert("Insert customer successfully");
                    navigate('/customers');
                } else {
                    console.log(data.message);
                }
            } else {
                console.log("Insert customer fail");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-6 space-y-4">
            {/* {loading && <Spinner />} Show the spinner while loading */}
            <div className="flex items-center font-semibold mb-4">
                <h1>Thêm mới khách hàng</h1>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    
                <h2 className="ml-1 font-bold">Thông tin cá nhân</h2>
                        <hr className="border-t-2 border-gray-300 my-4" />
                    <div className='grid grid-cols-12 gap-4'>
                        <div className='col-span-4'>
                            <div className="flex justify-center mb-2">
                                <label htmlFor="avatar" className="relative">

                                    {
                                        !previewUrl && (<img
                                            src={formData.avatar || avatar}
                                            alt="Avatar"
                                            className="w-32 h-32 rounded-full object-cover border-gray-300"

                                        />)
                                    }

                                    {
                                        previewUrl && (<img
                                            src={previewUrl}
                                            alt="Avatar"
                                            className="w-32 h-32 rounded-full object-cover border-gray-300"

                                        />)
                                    }

                                    <input
                                        type="file"
                                        id="avatar"
                                        name="avatar"
                                        onChange={handleFileChange}
                                        className="absolute bottom-0 right-0 w-8 h-8 opacity-0 cursor-pointer"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className='col-span-8'>
                            <div className='mb-10'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className="mb-4">
                                        <label className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Mã Khách hàng</label>
                                        <input
                                            type="text"
                                            name="maKhachHang"
                                            value={formData.maKhachHang}
                                            onChange={handleChange}
                                            className={`w-full p-2 border text-sm font-normal rounded-md ${errors.maKhachHang ? 'border-red-500' : ''}`}
                                            required
                                        />
                                        {errors.maKhachHang && <p className="text-red-500 text-xs mt-1">{errors.maKhachHang}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Họ và tên</label>
                                        <input
                                            type="text"
                                            name="hoTen"
                                            value={formData.hoTen}
                                            onChange={handleChange}
                                            className={`w-full p-2 border text-sm font-normal rounded-md ${errors.hoTen ? 'border-red-500' : ''}`}
                                            required
                                        />
                                        {errors.hoTen && <p className="text-red-500 text-xs mt-1">{errors.hoTen}</p>}
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <div className="mb-4">
                                        <label className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Số Điện Thoại</label>
                                        <input
                                            type="text"
                                            name="soDienThoai"
                                            value={formData.soDienThoai}
                                            onChange={handleChange}
                                            className={`w-full p-2 border text-sm font-normal rounded-md ${errors.soDienThoai ? 'border-red-500' : ''}`}
                                            required
                                            pattern="0[0-9]{9}"
                                            title="Số điện thoại không hợp lệ"
                                        />
                                        {errors.soDienThoai && <p className="text-red-500 text-xs mt-1">{errors.soDienThoai}</p>}
                                    </div>

                                    <div className="flex space-x-4 mb-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Giới Tính</label>
                                            <div>
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="gioiTinh"
                                                        value="male"
                                                        checked={formData.gioiTinh === true}
                                                        onChange={handleChangeGender}
                                                        className="form-radio"
                                                    />
                                                    <span className="ml-2 text-sm font-normal">Nam</span>
                                                </label>
                                                <label className="inline-flex items-center ml-4">
                                                    <input
                                                        type="radio"
                                                        name="gioiTinh"
                                                        value="female"
                                                        checked={formData.gioiTinh === false}
                                                        onChange={handleChangeGender}
                                                        className="form-radio"
                                                    />
                                                    <span className="ml-2 text-sm font-normal">Nữ</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-4'>
                        <div className="mb-4">
                            <label className="block text-sm font-normal mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full p-2 border text-sm font-normal rounded-md ${errors.email ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                    </div>

                    <div className='grid grid-cols-3 gap-4'>
                        <div className="mb-4">
                            <label className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Tỉnh/Thành phố</label>
                            <select
                                value={formData.provinceId}
                                onChange={handleSelectedProvince}
                                className="border p-2 text-sm font-normal rounded-md w-full"
                            >
                                <option value="0" className='text-sm font-normal'>Chọn Tỉnh/Thành phố</option>
                                {provinces.map((item) => (
                                    <option key={item.id} value={item.id} className='text-sm font-normal'>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            {errors.provinceId && <p className="text-red-500 text-xs mt-1">{errors.provinceId}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Quận/Huyện</label>
                            <select
                                value={formData.districtId}
                                onChange={handleSelectedDistrict}
                                className="border p-2 text-sm font-normal rounded-md w-full"
                                disabled={formData.provinceId === 0}
                            >
                                <option value="0" className='text-sm font-normal'>Chọn Quận/Huyện</option>
                                {districts.map((item) => (
                                    <option key={item.id} value={item.id} className='text-sm font-normal'>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            {errors.districtId && <p className="text-red-500 text-xs mt-1">{errors.districtId}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Xã/Phường</label>
                            <select
                                value={formData.wardId}
                                onChange={handleSelectedWard}
                                className="border text-sm font-normal p-2 rounded-md w-full"
                                disabled={formData.districtId === 0}
                            >
                                <option value="0" className='text-sm font-normal'>Chọn Xã/Phường</option>
                                {wards.map((item) => (
                                    <option key={item.id} value={item.id} className='text-sm font-normal'>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            {errors.wardId && <p className="text-red-500 text-xs mt-1">{errors.wardId}</p>}
                        </div>

                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Địa chỉ chi tiết</label>
                        <input
                            type="text"
                            name="addressDetails"
                            value={formData.addressDetails}
                            onChange={handleChange}
                            className={`w-full p-2 border text-sm font-normal rounded-md ${errors.addressDetails ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.addressDetails && <p className="text-red-500 text-xs mt-1">{errors.addressDetails}</p>}
                    </div>

                    <button type="submit" className="p-2 border-2 text-yellow-500 text-sm font-bold border-yellow-500 rounded-lg">Thêm Khách Hàng</button>
                </form>
            </div>
        </div>
    );
}

export default AddCustomers;
