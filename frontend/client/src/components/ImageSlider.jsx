import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = () => {
  const images = [
    { id: 1, src: 'https://i.pinimg.com/736x/1d/5f/ef/1d5fef5dc23f62b6e1f46a98d361d4d2.jpg', alt: "Find Parking" },
    { id: 2, src: 'https://i.pinimg.com/736x/73/79/4f/73794ff8826e7f5e6aaee6b1b6405362.jpg', alt: "Reserve Spot" },
    { id: 3, src: 'https://i.pinimg.com/736x/31/e2/1f/31e21fbac9cc20398893011d9e012c27.jpg', alt: "Navigate to Spot" },
    { id: 4, src: 'https://i.pinimg.com/736x/5a/28/16/5a2816b35e400d3362b88b0be3138d3e.jpg', alt: "Automatic Payment" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: false,
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <Slider {...settings}>
        {images.map((img) => (
          <div key={img.id} className="px-2">
            <img 
              src={img.src} 
              alt={img.alt} 
              className="rounded-lg shadow-lg w-[30em] max-h-[30em]"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
