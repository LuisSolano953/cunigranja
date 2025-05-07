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
  const videoRef = useRef(null)

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
  }

  // Datos mejorados para la sección "¿Por qué elegir Cunigranja?"
  const benefitsData = [
    {
      title: "Gestión eficiente",
      description: "Organiza la información de tus conejos de manera rápida y sencilla con nuestro sistema integrado.",
      icon: <BarChart className="w-10 h-10 text-purple-500" />,
    },
    {
      title: "Ahorro de tiempo",
      description: "Automatiza tareas repetitivas para centrarte en lo importante y optimizar tu producción.",
      icon: <Clock className="w-10 h-10 text-purple-500" />,
    },
    {
      title: "Datos seguros",
      description: "Tu información está protegida con estándares modernos de seguridad y respaldos automáticos.",
      icon: <Shield className="w-10 h-10 text-purple-500" />,
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
      src: "./assets/img/5.JPEG", // Reemplazar con imagen de conejo gigante
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

      <div className="bg-gradient-to-b from-white-50 to-white py-12 mt-10">
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="text-center md:text-left max-w-xl mx-auto md:mx-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800 leading-tight">
          Bienvenido a <span className="text-blue-600">Cunigranja</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">
          La plataforma integral que facilita la gestión de información en cunicultura con herramientas modernas y eficientes.
        </p>
      </div>
      <div className="w-full md:w-1/2 relative">
        {/* Carrusel */}
        <div className="carrusel">
          <Slider {...settings}>
            <div>
              <img src="./assets/img/f1.JPEG" alt="grupo" className="w-full h-96 object-cover rounded-xl" />
            </div>
            <div>
              <img src="./assets/img/f2.JPEG" alt="grupo" className="w-full h-96 object-cover rounded-xl" />
            </div>
            <div>
              <img src="./assets/img/f3.JPEG" alt="unidad" className="w-full h-96 object-cover rounded-xl" />
            </div>
            <div>
              <img src="./assets/img/f4.JPEG" alt="grupo" className="w-full h-96 object-cover rounded-xl" />
            </div>
            <div>
              <img src="./assets/img/f5.JPEG" alt="grupo" className="w-full h-96 object-cover rounded-xl" />
            </div>
          </Slider>
        </div>
      </div>
    </div>
  </div>
</div>
    

      {/* Sección de Razas de Conejos e Instalaciones */}
      <div className="bg-gradient-to-b from-white-50 to-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Explora Nuestra Granja</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-2 text-lg">
              Conoce nuestras razas de conejos e instalaciones. Haz clic en cada imagen para ver más detalles.
            </p>
          </div>

          {/* 5 Tarjetas con círculos más grandes: 4 Razas + Instalaciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-16">
            {stories.map((story, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] flex flex-col items-center p-6"
                style={{ height: "280px" }} // Altura fija para todas las tarjetas
              >
                <button
                  onClick={() => openStoryMode(index)}
                  className={`w-36 h-36 rounded-full p-2 cursor-pointer transition-transform duration-300 hover:scale-105 focus:outline-none shadow-lg mb-4 ${
                    story.type === "instalación"
                      ? "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
                      : "bg-gradient-to-br from-blue-400 via-pink-400 to-pink-500"
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden border-3 border-white">
                    <img src={story.src || "/placeholder.svg"} alt={story.alt} className="w-full h-full object-cover" />
                  </div>
                </button>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">{story.alt}</h3>
              </div>
            ))}
          </div>

          {/* Sección de Video (con márgenes ajustados) */}
          <div
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 mx-auto"
            style={{ maxWidth: "calc(100% - 4cm)" }} // 2cm de margen a cada lado
          >
            {/* Encabezado centrado */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-pink-50 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Conoce Nuestra Granja</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explora nuestras instalaciones y descubre cómo cuidamos a nuestros conejos para obtener los mejores
                resultados en producción y bienestar animal.
              </p>
            </div>

            {/* Video con espacio adicional alrededor */}
            <div className="p-12 bg-white">
              <div className="rounded-lg overflow-hidden shadow-md border border-gray-100">
                <div className="aspect-video w-full bg-black max-h-[400px] relative">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    poster="./assets/img/unidad.JPEG"
                  >
                    {/* Ruta del video en la carpeta img */}
                    <source src="./assets/img/video.mp4" type="video/mp4" />
                    <source src="./assets/img/video.webm" type="video/webm" />
                    <p>Tu navegador no soporta videos HTML5.</p>
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Beneficios Mejorada */}
      <div className="py-16 bg-gradient-to-b from-white to-white-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">¿Por qué elegir Cunigranja?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestra plataforma ofrece soluciones integrales para optimizar la gestión de tu granja cunícola.
            </p>
          </div>

          {/* Tarjetas de beneficios con diseño mejorado */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefitsData.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
              >
                <div className="p-2 bg-gradient-to-r from-blue-500 to-pink-500"></div>
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-50 rounded-full">{benefit.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-800 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 text-center mb-5">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modo Historia a pantalla completa */}
      {storyMode && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Barra de progreso */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-800 z-20">
            <div
              className={`h-full transition-all duration-50 ease-linear ${
                stories[currentStoryIndex]?.type === "instalación"
                  ? "bg-gradient-to-r from-blue-400 to-blue-600"
                  : "bg-gradient-to-r from-blue-400 to-pink-500"
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Controles de navegación */}
          <div className="absolute top-4 right-4 z-20 flex items-center space-x-4">
            <button
              onClick={togglePause}
              className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
            <button
              onClick={closeStoryMode}
              className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            >
              <X size={20} />
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
            {/* Para la historia de instalaciones, mostrar galería */}
            {stories[currentStoryIndex]?.type === "instalación" && stories[currentStoryIndex]?.gallery ? (
              <img
                src={stories[currentStoryIndex]?.gallery[galleryIndex]?.src || "/placeholder.svg"}
                alt={stories[currentStoryIndex]?.gallery[galleryIndex]?.caption}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <img
                src={stories[currentStoryIndex]?.src || "/placeholder.svg"}
                alt={stories[currentStoryIndex]?.alt}
                className="max-h-full max-w-full object-contain"
              />
            )}

            {/* Información de la historia */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-white text-2xl font-semibold mb-2">{stories[currentStoryIndex]?.alt}</h3>

                {/* Mostrar caption para galería de instalaciones */}
                {stories[currentStoryIndex]?.type === "instalación" && stories[currentStoryIndex]?.gallery ? (
                  <p className="text-white/90 text-lg mb-2">
                    {stories[currentStoryIndex]?.gallery[galleryIndex]?.caption}
                  </p>
                ) : null}

                <p className="text-white/90 text-base mb-4">{stories[currentStoryIndex]?.description}</p>
              </div>
            </div>
          </div>

          {/* Botones de navegación */}
          <button
            className="absolute left-4 z-20 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            onClick={handlePreviousStory}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            className="absolute right-4 z-20 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            onClick={handleNextStory}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      <Footer />
    </>
  )
}

export default StoriesGallery
