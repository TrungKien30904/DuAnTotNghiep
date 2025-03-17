export const formatCurrency = (amount) => {
  // Kiểm tra nếu amount không tồn tại hoặc không phải là số
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "0"; // Hoặc trả về một chuỗi thay thế khác
  }

  // Sử dụng phương thức toLocaleString để định dạng tiền tệ Việt Nam
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
