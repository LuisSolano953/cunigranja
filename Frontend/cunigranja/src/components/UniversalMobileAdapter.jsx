"use client"

import { useEffect, useState } from "react"

export default function UniversalMobileAdapter({ children }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  useEffect(() => {
    if (isMobile) {
      // Crear e inyectar estilos CSS súper agresivos
      const styleId = "universal-mobile-adapter-aggressive"
      const existingStyle = document.getElementById(styleId)

      if (existingStyle) {
        existingStyle.remove()
      }

      const style = document.createElement("style")
      style.id = styleId
      style.textContent = `
        /* ============================================
           ADAPTADOR MÓVIL ULTRA AGRESIVO
           ============================================ */
        
        @media (max-width: 767px) {
          
          /* ===== RESET TOTAL ===== */
          * {
            box-sizing: border-box !important;
            max-width: 100vw !important;
          }
          
          html, body {
            overflow-x: hidden !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* ===== OCULTAR SIDEBAR COMPLETAMENTE ===== */
          .sidebar,
          [class*="sidebar"],
          .aside,
          [class*="aside"],
          .w-64,
          [class*="w-64"],
          .flex.flex-col.h-full.bg-black,
          [class*="bg-black"].flex.flex-col,
          div[class*="w-64"],
          div[class*="sidebar"] {
            display: none !important;
            width: 0 !important;
            min-width: 0 !important;
            max-width: 0 !important;
            overflow: hidden !important;
            visibility: hidden !important;
            position: absolute !important;
            left: -9999px !important;
          }

          /* ===== LAYOUT PRINCIPAL FORZADO ===== */
          .flex.h-screen,
          [class*="flex"][class*="h-screen"],
          .h-screen {
            display: block !important;
            height: 100vh !important;
            width: 100vw !important;
            max-width: 100vw !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* ===== CONTENIDO PRINCIPAL 100% ANCHO ===== */
          .flex-1,
          [class*="flex-1"],
          .flex-1.flex.flex-col,
          main,
          main.flex-1,
          .overflow-auto {
            width: 100vw !important;
            max-width: 100vw !important;
            min-width: 100vw !important;
            flex: none !important;
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            left: 0 !important;
            right: 0 !important;
            position: relative !important;
          }

          /* ===== HEADER OPTIMIZADO ===== */
          header,
          header.bg-black,
          [class*="bg-black"] {
            width: 100vw !important;
            max-width: 100vw !important;
            margin: 0 !important;
            padding: 0.75rem 1rem !important;
            position: relative !important;
            z-index: 1000 !important;
          }

          /* ===== ÁREA DE TRABAJO COMPLETA ===== */
          main.flex-1.bg-white,
          main[class*="bg-white"],
          main[class*="overflow-auto"],
          .bg-white.overflow-auto {
            width: 100vw !important;
            max-width: 100vw !important;
            min-width: 100vw !important;
            height: calc(100vh - 80px) !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            padding: 0.5rem !important;
            margin: 0 !important;
            background: white !important;
            position: relative !important;
          }

          /* ===== CONTENEDORES INTERNOS ===== */
          .container,
          .container.mx-auto,
          [class*="container"],
          .max-w-6xl,
          .max-w-4xl,
          .max-w-2xl,
          [class*="max-w-"] {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 100% !important;
            padding: 0.5rem !important;
            margin: 0 !important;
          }

          /* ===== ELIMINAR TODOS LOS GAPS Y ESPACIOS ===== */
          .gap-6,
          .gap-4,
          .gap-2,
          [class*="gap-"],
          .space-x-6,
          .space-x-4,
          .space-y-6,
          .space-y-4,
          [class*="space-"] {
            gap: 0.25rem !important;
          }

          .space-y-6 > * + *,
          .space-y-4 > * + *,
          [class*="space-y-"] > * + * {
            margin-top: 0.25rem !important;
          }

          /* ===== PADDING MÍNIMO ===== */
          .p-6,
          .p-4,
          .px-6,
          .px-4,
          .py-6,
          .py-4,
          [class*="p-6"],
          [class*="p-4"],
          [class*="px-"],
          [class*="py-"] {
            padding: 0.5rem !important;
          }

          /* ===== MÁRGENES ELIMINADOS ===== */
          .mx-4,
          .mx-6,
          .my-4,
          .my-6,
          [class*="mx-"],
          [class*="my-"],
          .m-4,
          .m-6,
          [class*="m-"] {
            margin: 0 !important;
          }

          /* ===== TABLAS ANCHO COMPLETO ===== */
          table,
          .table,
          [class*="table"],
          .data-table {
            width: calc(100vw - 1rem) !important;
            max-width: calc(100vw - 1rem) !important;
            min-width: calc(100vw - 1rem) !important;
            display: block !important;
            overflow-x: auto !important;
            overflow-y: visible !important;
            white-space: nowrap !important;
            -webkit-overflow-scrolling: touch !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 8px !important;
            background: white !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            margin: 0.25rem 0 !important;
          }

          /* ===== CARDS Y PANELES ANCHO COMPLETO ===== */
          .card,
          [class*="card"],
          .panel,
          [class*="panel"],
          .bg-white.rounded-lg,
          .bg-white.shadow,
          [class*="bg-white"][class*="rounded"],
          [class*="bg-white"][class*="shadow"] {
            width: calc(100vw - 1rem) !important;
            max-width: calc(100vw - 1rem) !important;
            min-width: calc(100vw - 1rem) !important;
            margin: 0.25rem 0 !important;
            padding: 0.75rem !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            background: white !important;
            border: 1px solid #e5e7eb !important;
          }

          /* ===== GRIDS A COLUMNA ÚNICA ===== */
          .grid,
          [class*="grid-"],
          [class*="grid "],
          .grid-cols-1,
          .grid-cols-2,
          .grid-cols-3,
          .grid-cols-4,
          [class*="grid-cols-"] {
            display: block !important;
            width: 100% !important;
            gap: 0.25rem !important;
          }

          .grid > *,
          [class*="grid-"] > *,
          [class*="grid-cols-"] > * {
            width: 100% !important;
            margin: 0.25rem 0 !important;
          }

          /* ===== FLEX A COLUMNA ===== */
          .flex,
          [class*="flex-row"],
          .flex.items-center,
          .flex.justify-between {
            display: block !important;
            width: 100% !important;
          }

          .flex > *,
          [class*="flex-row"] > * {
            width: 100% !important;
            margin: 0.25rem 0 !important;
          }

          /* ===== FORMULARIOS OPTIMIZADOS ===== */
          form,
          .form,
          [class*="form"] {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0.5rem !important;
            margin: 0 !important;
          }

          input,
          textarea,
          select,
          .input {
            width: 100% !important;
            max-width: 100% !important;
            font-size: 16px !important;
            padding: 12px 16px !important;
            border-radius: 8px !important;
            border: 2px solid #e5e7eb !important;
            margin-bottom: 0.5rem !important;
            box-sizing: border-box !important;
            background: white !important;
            transition: all 0.2s !important;
          }

          /* ===== BOTONES OPTIMIZADOS ===== */
          button,
          .btn,
          [class*="btn"],
          [role="button"] {
            width: 100% !important;
            padding: 12px 20px !important;
            font-size: 16px !important;
            min-height: 48px !important;
            touch-action: manipulation !important;
            -webkit-tap-highlight-color: transparent !important;
            border-radius: 8px !important;
            margin: 0.25rem 0 !important;
            cursor: pointer !important;
            border: none !important;
            font-weight: 600 !important;
            transition: all 0.2s !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 0.5rem !important;
          }

          /* ===== NAVEGACIÓN MÓVIL ===== */
          .nav-responsive,
          nav,
          [class*="nav"] {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0.75rem 1rem !important;
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%) !important;
            color: white !important;
            overflow: visible !important;
          }

          /* ===== TEXTO RESPONSIVO ===== */
          h1, .h1 { 
            font-size: 1.5rem !important; 
            line-height: 2rem !important; 
            margin-bottom: 0.5rem !important;
            font-weight: 700 !important;
          }
          
          h2, .h2 { 
            font-size: 1.25rem !important; 
            line-height: 1.75rem !important; 
            margin-bottom: 0.5rem !important;
            font-weight: 600 !important;
          }
          
          h3, .h3 { 
            font-size: 1.125rem !important; 
            line-height: 1.5rem !important; 
            margin-bottom: 0.25rem !important;
            font-weight: 600 !important;
          }

          /* ===== PÁGINAS ESPECÍFICAS ===== */
          .min-h-screen,
          [class*="min-h-screen"] {
            min-height: calc(100vh - 80px) !important;
            height: auto !important;
            width: 100% !important;
            padding: 0.5rem !important;
            margin: 0 !important;
          }

          /* ===== SCROLLBARS OPTIMIZADOS ===== */
          *::-webkit-scrollbar {
            width: 4px !important;
            height: 4px !important;
          }
          
          *::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.05) !important;
            border-radius: 2px !important;
          }
          
          *::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.2) !important;
            border-radius: 2px !important;
          }

          /* ===== FORZAR ANCHO MÁXIMO GLOBAL ===== */
          * {
            max-width: 100vw !important;
          }

          /* ===== ELIMINAR TRANSFORMS Y POSITIONS PROBLEMÁTICOS ===== */
          .transform,
          [class*="transform"],
          .translate-x-2,
          .translate-y-2,
          [class*="translate-"] {
            transform: none !important;
          }

          /* ===== UTILIDADES RESPONSIVE ===== */
          .mobile-only {
            display: block !important;
          }
          
          .desktop-only {
            display: none !important;
          }

          /* ===== COMPONENTES ESPECÍFICOS DE LA APP ===== */
          .relative.overflow-hidden,
          [class*="relative"][class*="overflow-hidden"] {
            width: 100% !important;
            overflow-x: auto !important;
            overflow-y: visible !important;
            position: relative !important;
          }

          /* ===== FORZAR LAYOUT ESPECÍFICO ===== */
          body > div,
          #__next,
          [data-nextjs-scroll-focus-boundary] {
            width: 100vw !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
          }

          /* ===== ARREGLOS ESPECÍFICOS PARA CUNIGRANJA ===== */
          .carrusel {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          .carrusel-container {
            flex-direction: column !important;
            padding: 0.5rem !important;
            gap: 0.5rem !important;
          }
          
          .text-section {
            max-width: 100% !important;
            width: 100% !important;
          }

          /* ===== TOUCH OPTIMIZATIONS ===== */
          button, a, [role="button"] {
            -webkit-tap-highlight-color: rgba(0,0,0,0.1) !important;
            tap-highlight-color: rgba(0,0,0,0.1) !important;
          }
          
        }
      `

      document.head.appendChild(style)

      // Forzar cambios inmediatos en el DOM
      setTimeout(() => {
        // Ocultar sidebars agresivamente
        const sidebars = document.querySelectorAll(
          '.sidebar, [class*="sidebar"], .w-64, [class*="w-64"], .bg-black.flex.flex-col',
        )
        sidebars.forEach((sidebar) => {
          sidebar.style.display = "none"
          sidebar.style.width = "0"
          sidebar.style.minWidth = "0"
          sidebar.style.maxWidth = "0"
          sidebar.style.visibility = "hidden"
          sidebar.style.position = "absolute"
          sidebar.style.left = "-9999px"
        })

        // Forzar ancho completo en contenido principal
        const mainContents = document.querySelectorAll('main, .flex-1, [class*="flex-1"]')
        mainContents.forEach((main) => {
          main.style.width = "100vw"
          main.style.maxWidth = "100vw"
          main.style.minWidth = "100vw"
          main.style.margin = "0"
          main.style.padding = "0.5rem"
        })

        // Optimizar tablas
        const tables = document.querySelectorAll("table, .table, [class*='table']")
        tables.forEach((table) => {
          table.style.width = "calc(100vw - 1rem)"
          table.style.maxWidth = "calc(100vw - 1rem)"
          table.style.display = "block"
          table.style.overflowX = "auto"
        })

        // Eliminar gaps y espacios
        const containers = document.querySelectorAll('[class*="gap-"], [class*="space-"], [class*="p-"], [class*="m-"]')
        containers.forEach((container) => {
          container.style.gap = "0.25rem"
          container.style.margin = "0"
          container.style.padding = "0.5rem"
        })
      }, 50)
    } else {
      // Remover estilos cuando no es móvil
      const existingStyle = document.getElementById("universal-mobile-adapter-aggressive")
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [isMobile])

  return (
    <div className={`universal-mobile-wrapper ${isMobile ? "is-mobile-active" : ""} ${isTablet ? "is-tablet" : ""}`}>
      {children}
    </div>
  )
}
