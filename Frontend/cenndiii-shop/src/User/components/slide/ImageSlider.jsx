import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Parallax } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/parallax";

const ImageSlider = () => {
  const images = [
    "images/giay2.jpg",
    // "images/giay3.jpg",
    // "images/giay6.jpg",
  ];

  return (
    <>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        speed={600}
        parallax={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Parallax, Pagination, Navigation]}
        className="mySwiper"
      >
        <div
          slot="container-start"
          className="parallax-bg"
          style={{
            backgroundImage: "url(/images/giay6.jpg)",
            height: "100vh", // Hoặc chỉnh thành 500px, 700px tùy ý
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          data-swiper-parallax="-23%"
        ></div>
        <SwiperSlide className="mt-24">
          <div className="title" data-swiper-parallax="-300">
            Cửa hàng của chúng tôi
          </div>
          <div className="subtitle" data-swiper-parallax="-200">
            {/* Subtitle */}
          </div>
          <div className="text" data-swiper-parallax="-100">
            <p>
              Chào mừng bạn đến với cửa hàng của chúng tôi! Với hàng loạt sản phẩm chất lượng, phong cách đa dạng và dịch vụ tận tâm, chúng tôi tự hào mang đến cho bạn trải nghiệm mua sắm tuyệt vời nhất. Hãy ghé thăm và khám phá ngay hôm nay!
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide className="mt-24">
          <div className="title" data-swiper-parallax="-300">
            Chất lượng hàng đầu
          </div>
          <div className="subtitle" data-swiper-parallax="-200">
            {/* Subtitle */}
          </div>
          <div className="text" data-swiper-parallax="-100">
            <p>
              Chúng tôi cam kết mang đến những sản phẩm chất lượng cao, được chọn lọc kỹ lưỡng từ những thương hiệu uy tín. Mỗi sản phẩm đều trải qua quy trình kiểm tra nghiêm ngặt để đảm bảo sự hài lòng tuyệt đối cho khách hàng.
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide className="mt-24 text-right">
          <div className="title" data-swiper-parallax="-300">
            Ưu đãi hấp dẫn
          </div>
          <div className="subtitle" data-swiper-parallax="-200">
            {/* Subtitle */}
          </div>
          <div className="text float-right" data-swiper-parallax="-100">
            <p className="">
              Đừng bỏ lỡ những chương trình khuyến mãi siêu hấp dẫn từ chúng tôi! Giảm giá sốc, quà tặng độc quyền và nhiều ưu đãi đặc biệt đang chờ đón bạn. Mua sắm ngay để không bỏ lỡ cơ hội này!
            </p>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default ImageSlider;
