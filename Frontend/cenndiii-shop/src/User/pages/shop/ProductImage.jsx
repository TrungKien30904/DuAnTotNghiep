import React, { useState } from "react";

export default function ImageGallery({ images }) {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="flex">
            {/* Danh sách ảnh nhỏ */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] pr-2">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img.lienKet}
                        alt={`Thumbnail ${index}`}
                        className={`w-16 h-16 object-cover cursor-pointer rounded-lg border-2 transition-all duration-300 ${selectedImage === img ? "border-black" : "border-gray-300"
                            }`}
                        onClick={() => setSelectedImage(img)}
                    />
                ))}
            </div>

            {/* Ảnh lớn */}
            <div className="flex-1">
                <img
                    src={selectedImage?.lienKet}
                    alt="Selected"
                    className="w-full h-[500px] object-cover rounded-lg"
                />
            </div>
        </div>
    );
};