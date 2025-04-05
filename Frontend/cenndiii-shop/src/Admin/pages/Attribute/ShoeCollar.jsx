import { useState } from "react";
import axios from "axios";

export default function ShoeCollar() {
  const [images, setImages] = useState([]); // Lưu nhiều ảnh
  const [uploadUrls, setUploadUrls] = useState([]); // Lưu các link ảnh đã upload

  // Khi người dùng chọn nhiều ảnh
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files)); // Lưu nhiều file vào mảng
  };

  // Upload từng ảnh lên Cloudinary
  const handleUpload = async () => {
    if (images.length === 0) {
      alert("Vui lòng chọn ảnh!");
      return;
    }

    const urls = []; // Mảng để lưu link ảnh upload

    try {
      for (const image of images) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "upload_images"); // Thay bằng upload_preset của bạn

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dabnimezp/image/upload`, // Thay YOUR_CLOUD_NAME
          formData
        );

        urls.push(response.data.secure_url);
      }

      setUploadUrls(urls);
      alert("Tải ảnh lên thành công!");
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      alert("Tải ảnh lên thất bại!");
    }
  };

  return (
    <div className="p-4">
      <input type="file" accept="image/*" multiple onChange={handleImageChange} className="border p-2 rounded" />
      <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded ml-2">
        Upload
      </button>

      {uploadUrls.length > 0 && (
        <div className="mt-4">
          <p>Ảnh đã upload:</p>
          <div className="grid grid-cols-3 gap-4">
            {uploadUrls.map((url, index) => (
              <img key={index} src={url} alt="Uploaded" className="w-32 h-32 object-cover" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
