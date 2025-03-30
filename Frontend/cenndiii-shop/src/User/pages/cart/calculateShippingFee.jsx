import axios from "axios";

const GHN_HEADERS = {
    token: "a9cd42d9-f28a-11ef-a268-9e63d516feb9",
    "Content-Type": "application/json",
};

const validateAddressCodes = async (provinceId, districtId, wardCode) => {
    try {
        const [provinceRes, districtRes, wardRes] = await Promise.all([
            axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", { headers: GHN_HEADERS }),
            axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", { headers: GHN_HEADERS, params: { province_id: provinceId } }),
            axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward", { headers: GHN_HEADERS, params: { district_id: districtId } })
        ]);

        const province = provinceRes.data.data.find(p => p.ProvinceID == provinceId);
        const district = districtRes.data.data.find(d => d.DistrictID == districtId);
        const ward = wardRes.data.data.find(w => w.WardCode == wardCode);

        if (!province || !district || !ward) {
            throw new Error("Invalid address codes");
        }

        return { province, district, ward };
    } catch (error) {
        console.error("Lỗi khi xác minh mã địa chỉ:", error.message);
        throw error;
    }
};

export const calculateShippingFee = async (addressCode, cartItems) => {
    const [provinceId, districtId, wardCode] = addressCode.split(", ").map(code => code.trim());
    const serviceId = 53321; // ID dịch vụ của GHN (thay đổi nếu cần)
    const shopId = 1542; // ID cửa hàng của bạn trên GHN (thay đổi nếu cần)

    // Tính tổng khối lượng và giá trị đơn hàng
    const totalWeight = cartItems.reduce((total, item) => total + (item.weight || 0) * item.soLuong, 0);
    const totalValue = cartItems.reduce((total, item) => total + item.gia * item.soLuong, 0);

    // Kiểm tra nếu totalWeight bằng 0 và đặt giá trị mặc định nếu cần thiết
    const validTotalWeight = totalWeight > 0 ? totalWeight : 500; // Đặt giá trị mặc định là 500g nếu totalWeight bằng 0

    console.log("Address code:", addressCode);
    console.log("Calculated weight:", validTotalWeight);
    console.log("Calculated value:", totalValue);

    try {
        await validateAddressCodes(provinceId, districtId, wardCode); // Xác minh mã địa chỉ

        const requestData = {
            from_district_id: shopId,
            service_id: serviceId,
            to_district_id: parseInt(districtId, 10), // Chuyển đổi districtId sang kiểu số nguyên
            to_ward_code: wardCode,
            weight: validTotalWeight,
            insurance_value: totalValue,
            coupon: null
        };

        console.log("Request data:", requestData);

        const response = await axios.post(
            "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
            requestData,
            { headers: GHN_HEADERS }
        );

        console.log("API response:", response.data);
        return response.data.data.total;
    } catch (error) {
        if (error.response) {
            console.error("Lỗi khi tính phí vận chuyển:", error.response.data);
        } else {
            console.error("Lỗi khi tính phí vận chuyển:", error.message);
        }
        return 34000; // Thiết lập phí vận chuyển mặc định là 34,000 VND khi xảy ra lỗi
    }
};
export default calculateShippingFee;