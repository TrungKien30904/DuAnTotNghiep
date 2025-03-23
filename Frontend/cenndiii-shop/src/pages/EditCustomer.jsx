import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import avatar from '../assets/images-upload.png';
import { useParams } from "react-router-dom";
import { EyeClosed, Trash2, Star, Eye } from "lucide-react";
import { useToast } from '../utils/ToastContext';
import { useLoading } from "../components/ui/spinner/LoadingContext";
import Spinner from "../components/ui/spinner/Spinner";


function EditCustomer() {
    const { setLoadingState, loading } = useLoading();
    const { id } = useParams();
    const { showToast } = useToast();
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
    const navigate = useNavigate();
    const [previewUrl, setPreviewUrl] = useState(null);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const filePreviewUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(filePreviewUrl);
            setFile(selectedFile);
            convertToBase64(selectedFile);
        }
    };

    const fetchCustomerById = async () => {
        setLoadingState(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/admin/khach-hang/detail/${id}`
            );
            var model = response.data;

            setFormData(model);
            const updatedItems = (model.addressMappers ?? []).map(item => ({
                ...item,  // Keep all other properties intact
                visiable: true
            }));
            setAddress(updatedItems);
            setLoadingState(false);
        } catch (error) {
            setLoadingState(false);
            console.error("Error: ", error);
        }
    };
    const [base64, setBase64] = useState(null);
    const convertToBase64 = (file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            setBase64(reader.result); // Set the Base64 string to state
        };

        reader.onerror = (error) => {
            console.error("Error converting file to Base64", error);
        };

        reader.readAsDataURL(file); // Read file as Base64
    };

    const [address, setAddress] = useState([{ id: 0, customerId: 0, nameReceive: "", phoneNumber: "", provinceId: "", districtId: "", wardId: "", addressDetail: "", note: "", status: false, districts: [], wards: [], stage: 1, visiable: true, provinceName: "", districtName: "", wardName: "" }]);
    const addNewForm = () => {
        setAddress([...address, { id: 0, customerId: 0, nameReceive: "", phoneNumber: "", provinceId: "", districtId: "", wardId: "", addressDetail: "", note: "", status: false, districts: [], wards: [], stage: 1, visiable: true,  provinceName: "", districtName: "", wardName: ""  }]);
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        // Update the form at the specific index
        const updatedForms = [...address];
        const addressModel = updatedForms.filter((e) => e.provinceId === updatedForms[index].provinceId && updatedForms[index].provinceId.length > 0
            && e.districtId === updatedForms[index].districtId && updatedForms[index].districtId.length > 0
            && e.wardId === updatedForms[index].wardId && updatedForms[index].wardId > 0
            && e.addressDetail === value && e.addressDetail.length > 0);
        if (addressModel && addressModel.length === 0) {
            updatedForms[index] = { ...updatedForms[index], [name]: value };
            setAddress(updatedForms);
        } else {
            showToast("Address already exist", "error");
        }
    };
    const handleSelectedChange = (e, index, name) => {
        if (name == "provinceId") {
            fetchDistricts(e.target.value, index);
        } else if (name == "districtId") {
            fetchWards(e.target.value, index);
        } else {

            const updatedForms = [...address];
            var wardName = updatedForms[index].wards.find((item) => item.id === parseInt(e.target.value)).name ?? "";
            updatedForms[index] = { ...updatedForms[index], [name]: e.target.value, wardName: wardName };
            setAddress(updatedForms);
        }
    };

    const [successMessage, setSuccessMessage] = useState(null); // For confirmation message
    const [errors, setErrors] = useState({});
    const [provinces, setProvince] = useState([]);

    const fetchProvinces = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/admin/custom-address/get-province"
            );
            setProvince(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const fetchDistricts = useCallback(async (provinceId, index) => {
        try {
            const response = await axios.get(
                "http://localhost:8080/admin/custom-address/get-district",
                {
                    params: {
                        provinceId: provinceId
                    },
                }
            );

            const updatedForms = [...address];
            var name = provinces.find((e) => e.id === parseInt(provinceId)).name ?? "";
            updatedForms[index] = { ...updatedForms[index], districts: response.data, provinceId: provinceId, districtName: null, wardName: null, provinceName: name };
            setAddress(updatedForms);
        } catch (error) {
            console.error("Error:  ", error);
        }
    });

    const toggleFormVisibility = (e, index) => {
        e.preventDefault();
        const updatedForms = [...address];
        const showModel = updatedForms[index];
        updatedForms[index] = { ...updatedForms[index], visiable: showModel.visiable === true ? false : true };
        setAddress(updatedForms);
    };

    const fetchWards = useCallback(async (districtId, index) => {
        try {
            const response = await axios.get(
                "http://localhost:8080/admin/custom-address/get-ward",
                {
                    params: {
                        districtId: districtId
                    },
                }
            );

            const updatedForms = [...address];
            var name = updatedForms[index].districts.find((e) => e.id === parseInt(districtId)).name ?? "";
            updatedForms[index] = { ...updatedForms[index], wards: response.data, districtId: districtId, wardName: null, districtName: name, wardId: 0 };
            setAddress(updatedForms);

        } catch (error) {
            console.error("Error:  ", error);
        }
    });

    useEffect(() => {
        fetchProvinces();
        fetchCustomerById();
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
        setLoadingState(true);
        setErrors({});
        const newErrors = {};
        if (!formData.maKhachHang) newErrors.maKhachHang = "Mã khách hàng không được để trống";
        if (!formData.hoTen) newErrors.hoTen = "Họ tên không được để trống";
        if (!formData.soDienThoai.match(/^0[0-9]{9}$/)) newErrors.soDienThoai = "Số điện thoại không hợp lệ";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoadingState(false);
            return;
        }
        try {
            formData.image = "";
            formData.addressMappers = address;
            formData.imageBase64 = base64;
            const response = await fetch('http://localhost:8080/admin/khach-hang/sua',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                }
            ).then((response) => response.json())
                .then((data) => {

                    if (data) {
                        if(data.code > 0){
                            showToast("Update customer successfully", "success");
                            navigate('/customers');
                        }else{
                            showToast(data.message, "error");
                        }
                    } else {
                        showToast("Update customer fail", "error");
                    }
                    setLoadingState(false);
                })
                .catch((error) => {
                    showToast(error, "success");
                    setLoadingState(false);
                });
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin khách hàng:', error);
            setLoadingState(false);
        }
    };

    const removeAddress = (index) => {
        const addressChange = [...address];
        setAddress(addressChange.map((model, i) => {
            if (i === index) {
                return { ...model, stage: -1 };
            }
            return model;
        }));
    };

    const addressDefaultChange = (e, index) => {
        e.preventDefault();
        const addressModel = [...address];
        const addressUpdate = addressModel.map(model => model.status === true ? { ...model, status: false } : model);
        setAddress(addressUpdate.map((model, i) => {
            if (i === index) {
                return { ...model, status: true };
            }
            return model;
        }));
    };

    return (
        <div className="p-6 space-y-4">
            {loading && <Spinner />} {/* Show the spinner while loading */}
            <div className="flex items-center font-semibold mb-4">
                <h1>Thông tin khách hàng</h1>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className='grid grid-cols-12 gap-4'>
                        <div className="col-span-5">

                            <h2 className="ml-1 font-bold">Thông tin cá nhân</h2>
                            <hr className="border-t-2 border-gray-300 my-4" />
                            <div className="flex justify-center mb-2">
                                <label htmlFor="avatar" className="relative">

                                    {
                                        !previewUrl && (<img
                                            src={formData.image || avatar}
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

                            <div className="mb-4">
                                <label className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Mã Khách hàng</label>
                                <input
                                    type="text"
                                    name="maKhachHang"
                                    value={formData.maKhachHang}
                                    onChange={handleChange}
                                    className={`w-full p-2 border text-sm font-normal rounded-md ${errors.maKhachHang ? 'border-red-500' : ''}`}
                                    required
                                    disabled={true}
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
                                    className={`w-full p-2 border text-sm font-normal ${errors.hoTen ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.hoTen && <p className="text-red-500 text-xs mt-1">{errors.hoTen}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Số Điện Thoại</label>
                                <input
                                    type="text"
                                    name="soDienThoai"
                                    value={formData.soDienThoai}
                                    onChange={handleChange}
                                    className={`w-full p-2 border text-sm font-normal ${errors.soDienThoai ? 'border-red-500' : ''}`}
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
                                                className="form-radio "
                                            />
                                            <span className="ml-2 text-sm font-normal">Nữ</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-7">
                            <h2 className="ml-1 font-bold">Thông tin địa chỉ chi tiết</h2>
                            <hr className="border-t-2 border-gray-300 my-4" />
                            {Array.isArray(address) ? address.map((form, index) => (
                                address[index].stage === 1 ? <div key={`address-${index}`}>

                                    <div className="mb-4s">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="block text-sm font-bold">Địa chỉ {index + 1}</label>

                                            <button
                                                onClick={(e) => toggleFormVisibility(e, index)}
                                            >
                                                {
                                                    address[index].visiable ? <EyeClosed /> : <Eye />
                                                }
                                            </button>
                                        </div>
                                    </div>

                                    {
                                        address[index].visiable ? <div>


                                            <div className='grid grid-cols-2 gap-4'>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Tên người nhận</label>
                                                    <input
                                                        type="text"
                                                        name="nameReceive"
                                                        value={address[index].nameReceive}
                                                        onChange={(e) => handleInputChange(e, index)}
                                                        className={`w-full p-2 border text-sm font-normal`}
                                                        required
                                                    />
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-sm font-bold mb-2"><span style={{ color: 'red' }}> * </span>Số điện thoại</label>
                                                    <input
                                                        type="text"
                                                        name="phoneNumber"
                                                        value={address[index].phoneNumber}
                                                        onChange={(e) => handleInputChange(e, index)}
                                                        className={`w-full p-2 border text-sm font-normal`}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className='grid grid-cols-3 gap-4'>
                                                <div className="mb-4">
                                                    <label htmlFor={`province-${index}`} className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Tỉnh/Thành phố</label>
                                                    <select
                                                        value={address[index].provinceId}
                                                        onChange={(e) => handleSelectedChange(e, index, "provinceId")}
                                                        className="border p-2 text-sm font-normal rounded-md w-full"
                                                        id={`province-${index}`}
                                                    >
                                                        <option value="0">Chọn Tỉnh/Thành phố</option>
                                                        {Array.isArray(provinces) ? (provinces ?? []).map((item) => (
                                                            <option key={item.id} value={item.id} className='text-sm font-normal'>
                                                                {item.name}
                                                            </option>
                                                        )) : <option value="0" className='text-sm font-normal'>Chọn Tỉnh/Thành phố</option>}
                                                    </select>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor={`district-${index}`} className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Quận/Huyện</label>
                                                    <select
                                                        value={address[index].districtId}
                                                        id={`district-${index}`}
                                                        onChange={(e) => handleSelectedChange(e, index, "districtId")}
                                                        className="border p-2 text-sm font-normal rounded-md w-full"
                                                    >
                                                        {address[index].districtName ? <option value={address[index].districtId}>{address[index].districtName}</option> : <option value="0">Chọn Quận/Huyện</option>}
                                                        {Array.isArray(form.districts) ? (form.districts ?? []).map((item) => (
                                                            <option key={item.id} value={item.id} className='text-sm font-normal'>
                                                                {item.name}
                                                            </option>
                                                        )) : <option value="0" className='text-sm font-normal'>Chọn Quận/Huyện</option>}
                                                    </select>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor={`ward-${index}`} className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Xã/Phường</label>
                                                    <select
                                                        value={address[index].wardId}
                                                        onChange={(e) => handleSelectedChange(e, index, "wardId")}
                                                        className="border p-2 text-sm font-normal rounded-md w-full"
                                                        id={`ward-${index}`}
                                                    >
                                                        {address[index].wardName ? <option value={address[index].wardId}>{address[index].wardName}</option> : <option value="0">Chọn Xã/phường</option>}
                                                        {Array.isArray(form.wards) ? (form.wards ?? []).map((item) => (
                                                            <option key={item.id} value={item.id} className='text-sm font-normal'>
                                                                {item.name}
                                                            </option>
                                                        )) : <option value="0" className='text-sm font-normal'>Chọn Xã/Phường</option>}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-normal mb-2"><span style={{ color: 'red' }}> * </span>Địa chỉ chi tiết</label>
                                                <input
                                                    type="text"
                                                    name="addressDetail"
                                                    value={address[index].addressDetail}
                                                    onChange={(e) => handleInputChange(e, index)}
                                                    className={`w-full p-2 border text-sm font-normal text-sm font-normal `}
                                                    required
                                                />
                                            </div>

                                            <div className="mb-4s">
                                                <div className="flex justify-between items-center mb-4">
                                                    <button
                                                        title="Chọn làm địa chỉ mặc định"
                                                        className="flex items-center justify-center  w-8 h-8"
                                                        onClick={(e) => addressDefaultChange(e, index)}
                                                    >
                                                        <Star size={22} stroke={address[index].status === true ? "yellow" : "black"} />
                                                    </button>

                                                    <button
                                                        title="Xuất Excel"
                                                        className="flex items-center justify-center  w-8 h-8"
                                                        onClick={() => removeAddress(index)}
                                                    >
                                                        <Trash2 size={22} stroke="black" color="black" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div> : <div></div>
                                    }

                                </div> : <div></div>
                            )) : <div></div>}
                            <div className='flex justify-center'>
                                <button type="button" onClick={addNewForm} className="p-2 border-2 text-yellow-500 text-sm font-bold border-yellow-500 rounded-lg">Thêm địa chỉ</button>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className='flex item-center'>
                        <button type="submit" className="p-2 border-2 text-yellow-500 text-sm font-bold border-yellow-500 rounded-lg">Cập nhật thông tin</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditCustomer;
