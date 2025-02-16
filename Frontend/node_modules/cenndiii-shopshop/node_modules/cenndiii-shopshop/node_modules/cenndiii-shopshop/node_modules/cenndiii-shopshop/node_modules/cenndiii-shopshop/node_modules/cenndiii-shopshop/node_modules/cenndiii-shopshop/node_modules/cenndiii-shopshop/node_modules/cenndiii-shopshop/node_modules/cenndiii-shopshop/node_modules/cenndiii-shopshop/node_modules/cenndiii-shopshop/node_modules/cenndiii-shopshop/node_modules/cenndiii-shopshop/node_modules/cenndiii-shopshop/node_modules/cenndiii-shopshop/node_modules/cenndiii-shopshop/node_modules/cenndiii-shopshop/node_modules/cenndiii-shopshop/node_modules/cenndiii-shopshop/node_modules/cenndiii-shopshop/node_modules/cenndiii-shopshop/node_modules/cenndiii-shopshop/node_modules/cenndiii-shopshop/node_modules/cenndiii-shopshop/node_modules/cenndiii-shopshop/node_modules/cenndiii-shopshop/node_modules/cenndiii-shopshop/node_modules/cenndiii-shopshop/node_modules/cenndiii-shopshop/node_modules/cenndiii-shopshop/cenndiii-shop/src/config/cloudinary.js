import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dh5qgrnv6", // Thay YOUR_CLOUD_NAME bằng cloud của bạn
  },
});

export { cld };