"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Utensils, Carrot, Skull, Box, Stethoscope, Dna, Baby, Weight, Milk, Rabbit, HeartHandshake, PackageOpen } from 'lucide-react'
import { useRouter } from "next/navigation"
import Image from "next/image"

export function Sidebar({ onNavigate }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const sidebarItems = [
    { name: "Inicio", icon: <Home />, href: "/Dashboar" },
    { name: "Jaula", icon: <Box />, href: "/Dashboar/Cage" },
    { name: "Raza", icon: <Dna />, href: "/Dashboar/race" },
    { name: "Conejo", icon: <Rabbit />, href: "/Dashboar/Rabbit" },
    { name: "Pesaje", icon: <Weight />, href: "/Dashboar/pesaje" },
    { name: "Alimento", icon: <Utensils />, href: "/Dashboar/food" },
    { name: "Insumos", icon: <PackageOpen />, href: "/Dashboar/insumos" },
    { name: "Alimentación", icon: <Carrot/>, href: "/Dashboar/feeding" },
    { name: "Sanidad", icon: <Stethoscope />, href: "/Dashboar/health" },
    { name: "Reproducción", icon: <Baby />, href: "/Dashboar/reproduction" },
    { name: "Mortalidad", icon: <Skull />, href: "/Dashboar/mortality" },
    // { name: "Destete", icon: <Milk />, href: "/Dashboar/destete" },
    // { name: "Montas", icon: <HeartHandshake />, href: "/Dashboar/mounts" },
  ]

  const handleItemClick = (href) => {
    setIsExpanded(false)
    
    // Activar la pantalla de carga antes de navegar
    if (typeof onNavigate === 'function') {
      onNavigate()
    }
    
    router.push(href)
  }

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen z-40 bg-black text-white shadow-lg transition-all duration-300 
          ${isExpanded ? "w-64" : "w-20"}
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Header with Logo */}
        <div className="flex items-center justify-center h-20 px-4 bg-black">
          <div
            className={`
            transition-all duration-300 overflow-hidden flex justify-center items-center
            ${isExpanded ? "w-40 h-16" : "w-12 h-12"}
          `}
          >
            <Image
              src="/assets/img/CUNIGRANJA-1.png"
              alt="CUNIGRANJA Logo"
              width={isExpanded ? 110 : 48}
              height={isExpanded ? 64 : 48}
              className="transition-all duration-300 object-contain"
              priority
            />
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-5rem)] px-3">
          <nav className="py-6">
            <ul className="flex flex-col space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.name} className="w-full">
                  <Button
                    variant="ghost"
                    className={`
                      w-full min-h-[4rem] flex items-center gap-6
                      text-lg font-bold rounded-lg
                      transition-colors duration-200
                      text-white group
                      hover:bg-white/10
                      ${isExpanded ? "justify-start px-4" : "justify-center px-2"}
                    `}
                    onClick={() => handleItemClick(item.href)}
                  >
                    <div className="flex-shrink-0">
                      {React.cloneElement(item.icon, {
                        className: "h-10 w-10 text-white transition-colors duration-200 group-hover:text-blue-400",
                      })}
                    </div>
                    {isExpanded && (
                      <span className="flex-1 text-left truncate text-white transition-colors duration-200 group-hover:text-blue-400">
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
      <div className={`ml-0 transition-all duration-300 ${isExpanded ? "md:ml-64" : "md:ml-20"}`}>
        {/* Content goes here */}
      </div>
    </>
  )
}

export default Sidebar