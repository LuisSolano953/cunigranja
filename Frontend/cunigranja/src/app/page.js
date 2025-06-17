"use client"

import { useState, useEffect, useRef } from "react"
import PublicNav from "@/components/Nav/PublicNav"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Footer from "@/components/Nav/footer"
import { X, ChevronLeft, ChevronRight, Play, Pause, Clock, Shield, BarChart } from "lucide-react"

const StoriesGallery = () => {
  const [storyMode, setStoryMode] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const videoRef = useRef(null)

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: true,
          arrows: false,
          fade: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          dots: true,
          arrows: false,
          fade: true,
          autoplay: true,
          autoplaySpeed: 4000,
        },
      },
      {
        breakpoint: 480,
        settings: {
          dots: true,
          arrows: false,
          fade: true,
          autoplay: true,
          autoplaySpeed: 4000,
        },
      },
    ],
  }

  // Datos mejorados para la sección "¿Por qué elegir Cunigranja?"
  const benefitsData = [
    {
      title: "Gestión eficiente",
      description: "Organiza la información de tus conejos de manera rápida y sencilla con nuestro sistema integrado.",
      icon: <BarChart className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />,
    },
    {
      title: "Ahorro de tiempo",
      description: "Automatiza tareas repetitivas para centrarte en lo importante y optimizar tu producción.",
      icon: <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />,
    },
    {
      title: "Datos seguros",
      description: "Tu información está protegida con estándares modernos de seguridad y respaldos automáticos.",
      icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />,
    },
  ]

  // 5 historias: 4 razas de conejos + instalaciones
  const stories = [
    {
      id: "Nueva zelanda",
      src: "./assets/img/6.JPEG",
      alt: "Nueva zelanda",
    },
    {
      id: "Ruzo californiano",
      src: "./assets/img/1.JPEG",
      alt: "Ruzo californiano",
    },
    {
      id: "Chinchilla",
      src: "./assets/img/4.JPEG",
      alt: "Chinchilla",
    },
    {
      id: "Mariposa",
      src: "./assets/img/5.JPEG",
      alt: "Mariposa",
    },
    {
      id: "instalaciones",
      src: "./assets/img/jaulas.JPEG",
      alt: "Nuestras Instalaciones",
    },
  ]

  // Efecto para la barra de progreso en modo historia
  useEffect(() => {
    let interval

    if (storyMode && !isPaused) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Pasar a la siguiente historia
            handleNextStory()
            return 0
          }
          return prev + 1
        })
      }, 50) // 5 segundos por historia (50ms * 100 = 5000ms)
    }

    return () => clearInterval(interval)
  }, [storyMode, isPaused, currentStoryIndex])

  const openStoryMode = (index) => {
    setCurrentStoryIndex(index)
    setStoryMode(true)
    setProgress(0)
    document.body.style.overflow = "hidden"

    // Pausar el video si está reproduciéndose
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const closeStoryMode = () => {
    setStoryMode(false)
    setIsPaused(false)
    document.body.style.overflow = "auto"
  }

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStoryIndex((prev) => prev - 1)
        setProgress(0)
        setIsTransitioning(false)
      }, 300)
    } else {
      closeStoryMode()
    }
  }

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStoryIndex((prev) => prev + 1)
        setProgress(0)
        setIsTransitioning(false)
      }, 300)
    } else {
      closeStoryMode()
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // Para la galería de instalaciones
  const [galleryIndex, setGalleryIndex] = useState(0)

  useEffect(() => {
    let galleryInterval

    // Solo para la historia de instalaciones y cuando está en modo historia
    if (
      storyMode &&
      !isPaused &&
      stories[currentStoryIndex]?.type === "instalación" &&
      stories[currentStoryIndex]?.gallery
    ) {
      galleryInterval = setInterval(() => {
        setGalleryIndex((prev) => (prev + 1) % stories[currentStoryIndex].gallery.length)
      }, 2000) // Cambiar imagen cada 2 segundos
    }

    return () => clearInterval(galleryInterval)
  }, [storyMode, isPaused, currentStoryIndex, stories])

  return (
    <>
      <PublicNav />

      {/* Hero Section - Completamente centrado y responsive */}
      <div className="bg-gradient-to-b from-white-50 to-white py-8 sm:py-12 lg:py-16 mt-8 sm:mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12">
            {/* Texto principal - Centrado */}
            <div className="text-center lg:text-left w-full lg:w-1/2 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 sm:mb-6 text-gray-800 leading-tight">
                Bienvenido a <span className="text-blue-600">Cunigranja</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                La plataforma integral que facilita la gestión de información en cunicultura con herramientas modernas y
                eficientes.
              </p>
            </div>


            {/* Carrusel - Perfectamente centrado */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                {/* Contenedor del carrusel con aspect ratio fijo y centrado */}
                <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-100 mx-auto">
                  <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full">
                    <Slider {...settings}>
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 w-full h-full">
                          
                            <img
                                src="./assets/img/f6.JPEG"
                                alt="grupo"
                                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl shadow-lg"
                              />
                        </div>
                      </div>
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 w-full h-full">
                          <img
                            src="./assets/img/f2.JPEG"
                            alt="grupo"
                            className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl shadow-lg"
                          />
                        </div>
                      </div>
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 w-full h-full">
                          <img
                              src="./assets/img/f3.JPEG"
                              alt="unidad"
                              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl shadow-lg"
                            />
                        </div>
                      </div>
                      <div className="relative w-full h-full">
                        <div>
                          <img
                            src="./assets/img/f7.JPEG"
                            alt="grupo"
                            className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl shadow-lg"
                          />
                        </div>
                      </div>
                      <div className="relative w-full h-full">
                         <div>
                    <img
                      src="./assets/img/f5.JPEG"
                      alt="grupo"
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl shadow-lg"
                    />
                  </div>
                      </div>
                    </Slider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resto del componente igual que antes... */}
      {/* Sección de Razas de Conejos e Instalaciones - Responsive */}
      <div className="bg-gradient-to-b from-white-50 to-gray-100 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título de sección */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              Explora Nuestra Granja
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed px-4">
              Conoce nuestras razas de conejos e instalaciones. Haz clic en cada imagen para ver más detalles.
            </p>
          </div>

          {/* Grid de historias - Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20">
            {stories.map((story, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] flex flex-col items-center p-4 sm:p-6"
              >
                <button
                  onClick={() => openStoryMode(index)}
                  className={`w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full p-1.5 sm:p-2 cursor-pointer transition-transform duration-300 hover:scale-105 focus:outline-none shadow-lg mb-3 sm:mb-4 ${
                    story.type === "instalación"
                      ? "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
                      : "bg-gradient-to-br from-blue-400 via-pink-400 to-pink-500"
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden border-2 sm:border-3 border-white">
                    <img src={story.src || "/placeholder.svg"} alt={story.alt} className="w-full h-full object-cover" />
                  </div>
                </button>
                <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-center text-gray-800 leading-tight px-2">
                  {story.alt}
                </h3>
              </div>
            ))}
          </div>

          {/* Sección de Video - Centrada y responsive */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto">
            {/* Encabezado */}
            <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-pink-50 text-center">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                Conoce Nuestra Granja
              </h3>
              <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
                Explora nuestras instalaciones y descubre cómo cuidamos a nuestros conejos para obtener los mejores
                resultados en producción y bienestar animal.
              </p>
            </div>

            {/* Contenedor del video - Centrado y optimizado */}
            <div className="p-4 sm:p-8 lg:p-12 bg-white">
              <div className="rounded-lg overflow-hidden shadow-md border border-gray-100 max-w-4xl mx-auto">
                <div className="relative w-full bg-black" style={{ paddingBottom: isMobile ? "75%" : "56.25%" }}>
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    controls
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    poster="./assets/img/unidad.JPEG"
                  >
                    <source src="./assets/img/video.mp4" type="video/mp4" />
                    <source src="./assets/img/video.webm" type="video/webm" />
                    <p className="text-white p-4 text-center">Tu navegador no soporta videos HTML5.</p>
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Beneficios - Centrada */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-white-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título de sección */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              ¿Por qué elegir Cunigranja?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed">
              Nuestra plataforma ofrece soluciones integrales para optimizar la gestión de tu granja cunícola.
            </p>
          </div>

          {/* Grid de beneficios - Centrado */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
            {benefitsData.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
              >
                <div className="p-1 sm:p-2 bg-gradient-to-r from-blue-500 to-pink-500"></div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 bg-blue-50 rounded-full">{benefit.icon}</div>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-gray-800 mb-3 sm:mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-center text-sm sm:text-base lg:text-lg leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modo Historia - igual que antes */}
      {storyMode && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Barra de progreso */}
          <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gray-800 z-20">
            <div
              className={`h-full transition-all duration-50 ease-linear ${
                stories[currentStoryIndex]?.type === "instalación"
                  ? "bg-gradient-to-r from-blue-400 to-blue-600"
                  : "bg-gradient-to-r from-blue-400 to-pink-500"
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Controles de navegación - Responsive */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={togglePause}
              className="p-2 sm:p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              {isPaused ? <Play size={isMobile ? 16 : 20} /> : <Pause size={isMobile ? 16 : 20} />}
            </button>
            <button
              onClick={closeStoryMode}
              className="p-2 sm:p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <X size={isMobile ? 16 : 20} />
            </button>
          </div>

          {/* Navegación táctil */}
          <div className="absolute inset-0 z-10 flex">
            <div className="w-1/3 h-full" onClick={handlePreviousStory}></div>
            <div className="w-1/3 h-full" onClick={togglePause}></div>
            <div className="w-1/3 h-full" onClick={handleNextStory}></div>
          </div>

          {/* Contenido de la historia */}
          <div
            className={`relative w-full h-full flex items-center justify-center transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <img
              src={stories[currentStoryIndex]?.src || "/placeholder.svg"}
              alt={stories[currentStoryIndex]?.alt}
              className="max-h-full max-w-full object-contain p-4 sm:p-8"
            />

            {/* Información de la historia */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 bg-gradient-to-t from-black to-transparent">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-white text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold mb-2 sm:mb-3">
                  {stories[currentStoryIndex]?.alt}
                </h3>
                <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed">
                  {stories[currentStoryIndex]?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Botones de navegación */}
          <button
            className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            onClick={handlePreviousStory}
          >
            <ChevronLeft size={isMobile ? 20 : 24} />
          </button>

          <button
            className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            onClick={handleNextStory}
          >
            <ChevronRight size={isMobile ? 20 : 24} />
          </button>
        </div>
      )}

      <Footer />

      {/* Estilos personalizados para el carrusel centrado */}
      <style jsx global>{`
        /* Estilos para el carrusel responsive y centrado */
        .slick-slider {
          position: relative;
          display: block;
          box-sizing: border-box;
          user-select: none;
          touch-action: pan-y;
          -webkit-tap-highlight-color: transparent;
          width: 100%;
        }

        .slick-list {
          position: relative;
          display: block;
          overflow: hidden;
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }

        .slick-track {
          position: relative;
          top: 0;
          left: 0;
          display: block;
          margin-left: auto;
          margin-right: auto;
          height: 100%;
          width: 100%;
        }

        .slick-slide {
          display: none;
          float: left;
          height: 100%;
          min-height: 1px;
          width: 100%;
        }

        .slick-slide.slick-active {
          display: block;
        }

        .slick-slide > div {
          height: 100%;
          width: 100%;
        }

        .slick-slide > div > div {
          height: 100%;
          width: 100%;
        }

        /* Dots responsive y centrados */
        .slick-dots {
          position: absolute;
          bottom: 12px;
          display: block;
          width: 100%;
          padding: 0;
          margin: 0;
          list-style: none;
          text-align: center;
          z-index: 10;
        }

        .slick-dots li {
          position: relative;
          display: inline-block;
          width: 20px;
          height: 20px;
          margin: 0 3px;
          padding: 0;
          cursor: pointer;
        }

        .slick-dots li button {
          font-size: 0;
          line-height: 0;
          display: block;
          width: 12px;
          height: 12px;
          padding: 0;
          cursor: pointer;
          color: transparent;
          border: 0;
          outline: none;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .slick-dots li.slick-active button {
          background: rgba(255, 255, 255, 0.9);
          transform: scale(1.2);
        }

        .slick-dots li button:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        /* Responsive dots */
        @media (max-width: 640px) {
          .slick-dots {
            bottom: 8px;
          }
          
          .slick-dots li {
            width: 16px;
            height: 16px;
            margin: 0 2px;
          }
          
          .slick-dots li button {
            width: 10px;
            height: 10px;
          }
        }

        /* Prevenir overflow y centrar contenido */
        @media (max-width: 768px) {
          .slick-slider,
          .slick-list,
          .slick-track {
            overflow: hidden;
          }
        }

        /* Asegurar que el carrusel esté centrado */
        .slick-slider {
          margin: 0 auto;
        }
      `}</style>
    </>
  )
}

export default StoriesGallery
