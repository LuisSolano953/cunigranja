"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Home,
  Utensils,
  Carrot,
  Skull,
  Box,
  Stethoscope,
  Dna,
  Baby,
  Weight,
  Rabbit,
  PackageOpen,
  Menu,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function Sidebar({ onNavigate }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const sidebarItems = [
    { name: "Inicio", icon: <Home />, href: "/Dashboar" },
    { name: "Jaula", icon: <Box />, href: "/Dashboar/Cage" },
    { name: "Raza", icon: <Dna />, href: "/Dashboar/race" },
    { name: "Conejo", icon: <Rabbit />, href: "/Dashboar/Rabbit" },
    { name: "Pesaje", icon: <Weight />, href: "/Dashboar/pesaje" },
    { name: "Alimento", icon: <Utensils />, href: "/Dashboar/food" },
    { name: "Insumos", icon: <PackageOpen />, href: "/Dashboar/insumos" },
    { name: "Alimentación", icon: <Carrot />, href: "/Dashboar/feeding" },
    { name: "Sanidad", icon: <Stethoscope />, href: "/Dashboar/health" },
    { name: "Reproducción", icon: <Baby />, href: "/Dashboar/reproduction" },
    { name: "Mortalidad", icon: <Skull />, href: "/Dashboar/mortality" },
  ]

  const handleItemClick = (href) => {
    setIsExpanded(false)
    setIsMobileMenuOpen(false)

    // Activar la pantalla de carga antes de navegar
    if (typeof onNavigate === "function") {
      onNavigate()
    }

    router.push(href)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Botón de menú móvil */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-black text-white hover:bg-gray-800"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay para móvil */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-40 bg-black text-white shadow-lg transition-all duration-300
          ${
            isMobile
              ? `${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} w-64`
              : `${isExpanded ? "w-64" : "w-20"}`
          }
        `}
        onMouseEnter={() => !isMobile && setIsExpanded(true)}
        onMouseLeave={() => !isMobile && setIsExpanded(false)}
      >
        {/* Header with Logo */}
        <div className="flex items-center justify-center h-16 sm:h-20 px-2 sm:px-4 bg-black">
          <div
            className={`
            transition-all duration-300 overflow-hidden flex justify-center items-center
            ${isExpanded || isMobileMenuOpen ? "w-32 sm:w-40 h-12 sm:h-16" : "w-10 sm:w-12 h-10 sm:h-12"}
          `}
          >
            <Image
              src="/assets/img/CUNIGRANJA-1.png"
              alt="CUNIGRANJA Logo"
              width={isExpanded || isMobileMenuOpen ? 110 : 40}
              height={isExpanded || isMobileMenuOpen ? 64 : 40}
              className="transition-all duration-300 object-contain"
              priority
            />
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] px-2 sm:px-3">
          <nav className="py-4 sm:py-6">
            <ul className="flex flex-col space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.name} className="w-full">
                  <Button
                    variant="ghost"
                    className={`
                      w-full min-h-[3rem] sm:min-h-[4rem] flex items-center gap-3 sm:gap-6
                      text-base sm:text-lg font-bold rounded-lg
                      transition-colors duration-200
                      text-white group
                      hover:bg-white/10
                      ${isExpanded || isMobileMenuOpen ? "justify-start px-2 sm:px-4" : "justify-center px-1 sm:px-2"}
                    `}
                    onClick={() => handleItemClick(item.href)}
                  >
                    <div className="flex-shrink-0">
                      {React.cloneElement(item.icon, {
                        className:
                          "h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white transition-colors duration-200 group-hover:text-blue-400",
                      })}
                    </div>
                    {(isExpanded || isMobileMenuOpen) && (
                      <span className="flex-1 text-left truncate text-white transition-colors duration-200 group-hover:text-blue-400 text-sm sm:text-base">
                        {item.name}
                      </span>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
      </div>

      {/* Main content wrapper */}
      <div
        className={`
        transition-all duration-300
        ${isMobile ? "ml-0" : `${isExpanded ? "ml-64" : "ml-20"}`}
      `}
      >
        {/* Content goes here */}
      </div>
    </>
  )
}

export default Sidebar
