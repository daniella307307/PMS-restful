import React from 'react';

function Services() {
  const images = [
    {
      id: 1,
      src: 'https://i.pinimg.com/736x/1d/5f/ef/1d5fef5dc23f62b6e1f46a98d361d4d2.jpg',
      alt: 'Find Parking',
    },
    {
      id: 2,
      src: 'https://i.pinimg.com/736x/73/79/4f/73794ff8826e7f5e6aaee6b1b6405362.jpg',
      alt: 'Reserve Spot',
    },
    {
      id: 3,
      src: 'https://i.pinimg.com/736x/31/e2/1f/31e21fbac9cc20398893011d9e012c27.jpg',
      alt: 'Navigate to Spot',
    },
    {
      id: 4,
      src: 'https://i.pinimg.com/736x/5a/28/16/5a2816b35e400d3362b88b0be3138d3e.jpg',
      alt: 'Automatic Payment',
    },
  ];

  return (
    <div className="p-6 bg-[#fff] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {images.map((image) => (
        <div key={image.id} className="flex flex-col items-center">
          <img src={image.src} alt={image.alt} className="rounded-lg shadow-md w-48 h-48 object-cover" />
          <h2 className="mt-4 text-lg font-semibold">Step {image.id}</h2>
          <p className="text-sm text-center">{image.alt}</p>
        </div>
      ))}
    </div>
  );
}

export default Services;
