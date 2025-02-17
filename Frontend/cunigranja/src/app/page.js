'use client';

import React from 'react';
import PublicNav from "@/components/Nav/PublicNav";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "@/components/Nav/footer";


const ImageCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: true,
  };

  const cardData = [
    {
      title: "Gestión eficiente",
      description: "Organiza la información de tus conejos de manera rápida y sencilla.",
    },
    {
      title: "Ahorro de tiempo",
      description: "Automatiza tareas repetitivas para centrarte en lo importante.",
    },
    {
      title: "Datos seguros",
      description: "Tu información está protegida con estándares modernos de seguridad.",
    },
  ];

  return (
    <>
      <PublicNav />

      {/* Sección principal */}
      <div className="carrusel-container bg-white py-8">
        <div className="text-section text-center px-6">
          <h1 className="text-3xl font-extrabold mb-4 text-gray-800">Bienvenido a Cunigranja</h1>
          <p className="text-lg text-gray-700">
            Facilita la gestión de información en cunicultura con herramientas modernas y eficientes.
          </p>
        </div>

        {/* Carrusel */}
        <div className="carrusel mt-8">
          <Slider {...settings}>
            <div>
              <img
                src="./assets/img/unidad.JPEG"
                alt="Unidad de manejo"
                className="w-full h-96 object-cover"
              />
            </div>
            <div>
              <img
                src="./assets/img/jaulas.JPEG"
                alt="Jaulas"
                className="w-full h-96 object-cover"
              />
            </div>
            <div>
              <img
                src="./assets/img/con1.JPEG"
                alt="Conejo 1"
                className="w-full h-96 object-cover"
              />
            </div>
            <div>
              <img
                src="./assets/img/con2.JPEG"
                alt="Conejo 2"
                className="w-full h-96 object-cover"
              />
            </div>
            <div>
              <img
                src="./assets/img/con3.JPEG"
                alt="Conejo 3"
                className="w-full h-96 object-cover"
              />
            </div>
          </Slider>
        </div>
      </div>

      {/* Beneficios */}
      <div className="beneficios py-12 bg-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">¿Por qué elegir Cunigranja?</h2>
          <p className="text-gray-600">Descubre las razones para unirte a nosotros.</p>
        </div>
        <div className="flex flex-col items-center gap-6 px-6 lg:px-12">
          {/* Fila 1: Dos tarjetas */}
          <div className="flex flex-wrap justify-center gap-6">
            {cardData.slice(0, 2).map((card, index) => (
              <div
                key={index}
                className="p-4 rounded-lg shadow-md max-w-md w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 relative bg-gradient-to-r from-blue-100 to-purple-100"
              >
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{card.title}</h3>
                  <p className="text-gray-700">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Fila 2: Una tarjeta centrada */}
          <div
            className="p-4 rounded-lg shadow-md max-w-md w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 relative bg-gradient-to-r from-blue-100 to-purple-100"
          >
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2 text-gray-800">{cardData[2].title}</h3>
              <p className="text-gray-700">{cardData[2].description}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ImageCarousel;

