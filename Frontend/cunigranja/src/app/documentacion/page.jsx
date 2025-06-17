"use client"

import { useState, useEffect } from "react"
import Footer from "@/components/Nav/footer"
import PublicNav from "@/components/Nav/PublicNav"
import { motion } from "framer-motion"
import { Download, ZoomIn, ZoomOut, Maximize2, ExternalLink, Settings, Users, Menu } from "lucide-react"

const Documento = () => {
  const [activeDocument, setActiveDocument] = useState("technical")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [showMobileControls, setShowMobileControls] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Configuración de documentos
  const documents = {
    technical: {
      id: "technical",
      title: "Manual Técnico",
      subtitle: "Especificaciones y desarrollo técnico",
      description: "Documentación completa para desarrolladores y personal técnico",
      icon: Settings,
      color: "blue",
      gradient: "from-blue-600 to-purple-700",
      file: "./assets/img/DOCUMENTO ESPECIFICACION REQUISITOS.pdf",
      filename: "Manual_Tecnico_Cunigranja.pdf",
      version: "MYGR",
      features: [
        "Especificaciones técnicas",
        "Arquitectura del sistema",
        "Diagramas de desarrollo",
        "Guías de implementación",
      ],
    },
    user: {
      id: "user",
      title: "Manual de Usuario",
      subtitle: "Guía completa para usuarios finales",
      description: "Instrucciones paso a paso para el uso del sistema",
      icon: Users,
      color: "green",
      gradient: "from-green-600 to-teal-700",
      file: "./assets/img/MANUAL_USUARIO_CUNIGRANJA.pdf",
      filename: "Manual_Usuario_Cunigranja.pdf",
      version: "v1.0",
      features: [
        "Guía de inicio rápido",
        "Funcionalidades principales",
        "Casos de uso comunes",
        "Solución de problemas",
      ],
    },
  }

  const currentDoc = documents[activeDocument]

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25)
  }

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25)
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = currentDoc.file
    link.download = currentDoc.filename
    link.click()
  }

  const handleOpenInNewTab = () => {
    window.open(currentDoc.file, "_blank")
  }

  const switchDocument = (docId) => {
    setActiveDocument(docId)
    setZoom(isMobile ? 120 : 100) // Zoom inicial mayor en móvil
    setShowMobileControls(false)
  }

  // Ajustar zoom inicial para móvil
  useEffect(() => {
    if (isMobile && zoom === 100) {
      setZoom(120)
    }
  }, [isMobile])

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Barra de navegación */}
        <PublicNav />

        {/* Hero Section - MÁS COMPACTO EN MÓVIL */}
        <div className={`bg-gradient-to-r ${currentDoc.gradient} text-white py-6 sm:py-12 transition-all duration-500`}>
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              key={activeDocument}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="flex justify-center mb-2 sm:mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3">
                  <currentDoc.icon className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-3 px-4">{currentDoc.title}</h1>
              <p className="text-sm sm:text-lg text-white/90 max-w-2xl mx-auto px-4">{currentDoc.subtitle}</p>
            </motion.div>
          </div>
        </div>

        {/* Selector de documentos - OPTIMIZADO MÓVIL */}
        <div className="bg-white shadow-lg">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex justify-center">
              <div className="flex bg-gray-100 rounded-lg p-1 -mt-3 sm:-mt-6 relative z-10 shadow-lg w-full max-w-sm sm:max-w-md">
                {Object.values(documents).map((doc) => {
                  const IconComponent = doc.icon
                  return (
                    <button
                      key={doc.id}
                      onClick={() => switchDocument(doc.id)}
                      className={`flex items-center justify-center gap-1 sm:gap-3 px-2 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-all duration-300 flex-1 text-xs sm:text-base ${
                        activeDocument === doc.id
                          ? `bg-${doc.color}-600 text-white shadow-md`
                          : "text-gray-600 hover:text-gray-800 hover:bg-white"
                      }`}
                    >
                      <IconComponent className="w-3 h-3 sm:w-5 sm:h-5" />
                      <span className="truncate">{isMobile ? doc.title.split(" ")[0] : doc.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 py-3 sm:py-8 px-2 sm:px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Controles móviles flotantes */}
            {isMobile && (
              <div className="fixed bottom-4 left-4 right-4 z-40 bg-white rounded-xl shadow-2xl border p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-800">Controles</h3>
                  <button
                    onClick={() => setShowMobileControls(!showMobileControls)}
                    className="p-1 bg-gray-100 rounded"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                </div>

                {showMobileControls && (
                  <div className="space-y-2">
                    {/* Zoom móvil */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Zoom:</span>
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={handleZoomOut}
                          disabled={zoom <= 50}
                          className="p-1 rounded hover:bg-white transition-colors disabled:opacity-50"
                        >
                          <ZoomOut className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-1 text-xs font-medium text-gray-700 min-w-[40px] text-center">
                          {zoom}%
                        </span>
                        <button
                          onClick={handleZoomIn}
                          disabled={zoom >= 200}
                          className="p-1 rounded hover:bg-white transition-colors disabled:opacity-50"
                        >
                          <ZoomIn className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Botones móviles */}
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={handleOpenInNewTab}
                        className="flex flex-col items-center gap-1 p-2 bg-purple-600 text-white rounded text-xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Abrir</span>
                      </button>

                      <button
                        onClick={handleFullscreen}
                        className={`flex flex-col items-center gap-1 p-2 bg-${currentDoc.color}-600 text-white rounded text-xs`}
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Completa</span>
                      </button>

                      <button
                        onClick={handleDownload}
                        className="flex flex-col items-center gap-1 p-2 bg-green-600 text-white rounded text-xs"
                      >
                        <Download className="w-3 h-3" />
                        <span>Descargar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Información del documento - COMPACTA EN MÓVIL */}
            {!isMobile && (
              <motion.div
                key={`info-${activeDocument}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`bg-${currentDoc.color}-100 rounded-lg p-2`}>
                        <currentDoc.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${currentDoc.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{currentDoc.title}</h2>
                        <span
                          className={`inline-block px-2 sm:px-3 py-1 bg-${currentDoc.color}-100 text-${currentDoc.color}-800 text-xs sm:text-sm rounded-full font-medium mt-1`}
                        >
                          {currentDoc.version}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">{currentDoc.description}</p>

                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-800 text-sm sm:text-base">📋 Contenido incluido:</h3>
                      <ul className="space-y-1">
                        {currentDoc.features.map((feature, index) => (
                          <li key={index} className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                            <div className={`w-2 h-2 bg-${currentDoc.color}-500 rounded-full flex-shrink-0`}></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">🔧 Controles</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Zoom:</span>
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={handleZoomOut}
                            disabled={zoom <= 50}
                            className="p-2 rounded-md hover:bg-white transition-colors disabled:opacity-50"
                          >
                            <ZoomOut className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium text-gray-700 min-w-[60px] text-center">
                            {zoom}%
                          </span>
                          <button
                            onClick={handleZoomIn}
                            disabled={zoom >= 200}
                            className="p-2 rounded-md hover:bg-white transition-colors disabled:opacity-50"
                          >
                            <ZoomIn className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                        <button
                          onClick={handleOpenInNewTab}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Nueva pestaña</span>
                        </button>

                        <button
                          onClick={handleFullscreen}
                          className={`flex items-center justify-center gap-2 px-3 py-2 bg-${currentDoc.color}-600 text-white rounded-lg hover:bg-${currentDoc.color}-700 transition-colors text-sm`}
                        >
                          <Maximize2 className="w-4 h-4" />
                          <span>Pantalla completa</span>
                        </button>

                        <button
                          onClick={handleDownload}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:col-span-2 lg:col-span-1 xl:col-span-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Descargar {currentDoc.title}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Visor de PDF - OPTIMIZADO PARA MÓVIL */}
            <motion.div
              key={`viewer-${activeDocument}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`bg-white rounded-xl shadow-2xl overflow-hidden ${
                isFullscreen ? "fixed inset-0 z-50" : ""
              } ${isMobile ? "mb-20" : ""}`}
            >
              {/* Header del visor - MÁS COMPACTO EN MÓVIL */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-2 sm:px-6 py-1 sm:py-3 flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-4 min-w-0">
                  <div className="flex items-center gap-1">
                    <div className="bg-red-500 w-2 h-2 sm:w-3 sm:h-3 rounded-full"></div>
                    <div className="bg-yellow-500 w-2 h-2 sm:w-3 sm:h-3 rounded-full"></div>
                    <div className="bg-green-500 w-2 h-2 sm:w-3 sm:h-3 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                    <currentDoc.icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium truncate">
                      {isMobile ? currentDoc.title : currentDoc.filename}
                    </span>
                  </div>
                </div>

                {isFullscreen && (
                  <button
                    onClick={handleFullscreen}
                    className="text-gray-300 hover:text-white transition-colors p-1 rounded flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Contenedor del PDF - OPTIMIZADO MÓVIL */}
              <div className="relative bg-white">
                {" "}
                {/* Cambié de bg-gray-200 a bg-white */}
                {/* Loading overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                  <div className="text-center p-4">
                    <div
                      className={`animate-spin rounded-full h-6 w-6 sm:h-12 sm:w-12 border-b-2 border-${currentDoc.color}-600 mx-auto mb-2 sm:mb-4`}
                    ></div>
                    <p className="text-xs sm:text-base text-gray-600">Cargando documento...</p>
                  </div>
                </div>
                {/* PDF Iframe - COMPLETAMENTE OPTIMIZADO PARA MÓVIL */}
                <iframe
                  key={activeDocument}
                  src={currentDoc.file}
                  title={currentDoc.title}
                  className={`w-full border-none relative z-20 ${
                    isFullscreen
                      ? "h-[calc(100vh-32px)] sm:h-[calc(100vh-60px)]"
                      : isMobile
                        ? "h-[70vh]"
                        : "h-[800px] lg:h-[1000px] xl:h-[1200px]"
                  }`}
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top center",
                    backgroundColor: "white",
                    minHeight: isFullscreen ? "calc(100vh - 32px)" : isMobile ? "70vh" : "800px",
                  }}
                  onLoad={(e) => {
                    const loadingDiv = e.target.parentElement.querySelector(".absolute")
                    if (loadingDiv) loadingDiv.style.display = "none"
                  }}
                />
              </div>
            </motion.div>

            {/* Cards de documentos - OCULTAS EN MÓVIL */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-4 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
              >
                {Object.values(documents).map((doc) => {
                  const IconComponent = doc.icon
                  return (
                    <div
                      key={doc.id}
                      className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 border-2 transition-all duration-300 ${
                        activeDocument === doc.id
                          ? `border-${doc.color}-200 bg-${doc.color}-50/30`
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`bg-${doc.color}-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4`}
                        >
                          <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 text-${doc.color}-600`} />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{doc.title}</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">{doc.description}</p>

                        {activeDocument !== doc.id && (
                          <button
                            onClick={() => switchDocument(doc.id)}
                            className={`px-3 sm:px-4 py-2 bg-${doc.color}-600 text-white rounded-lg hover:bg-${doc.color}-700 transition-colors text-sm font-medium w-full sm:w-auto`}
                          >
                            Ver {doc.title}
                          </button>
                        )}

                        {activeDocument === doc.id && (
                          <span
                            className={`inline-block px-3 sm:px-4 py-2 bg-${doc.color}-100 text-${doc.color}-800 rounded-lg text-sm font-medium`}
                          >
                            📖 Documento actual
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Documento
