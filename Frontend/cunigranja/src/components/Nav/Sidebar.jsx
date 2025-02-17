"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Utensils, Apple, Skull, Box, Stethoscope, Dna, Baby, Weight, BabyIcon as BabyBottle } from "lucide-react"
import { useRouter } from "next/navigation"

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const sidebarItems = [
    { name: "Alimento", icon: <Utensils />, href: "/Dashboar/food" },
    { name: "Alimentación", icon: <Apple />, href: "/Dashboar/feeding" },
    { name: "Mortalidad", icon: <Skull />, href: "/Dashboar/mortality" },
    { name: "Jaula", icon: <Box />, href: "/Dashboar/Cage" },
    { name: "Sanidad", icon: <Stethoscope />, href: "/Dashboar/health" },
    { name: "Raza", icon: <Dna />, href: "/Dashboar/race" },
    { name: "Reproducción", icon: <Baby />, href: "/Dashboar/reproduction" },
    { name: "Destete", icon: <BabyBottle />, href: "/Dashboar/weaning" },
    { name: "Pesaje", icon: <Weight />, href: "/Dashboar/pesaje" },
  ]

  const handleItemClick = (href) => {
    setIsExpanded(false)
    router.push(href)
  }

  return (
    <>
      <div
        className={`
          fixed top-0 left-0 h-screen z-50 bg-black text-white shadow-lg transition-all duration-300 
          ${isExpanded ? "w-64" : "w-20"}
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-4 bg-black">
          {isExpanded && <span className="text-3xl font-semibold"></span>}
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
                      hover:bg-gray-900 hover:text-white
                      transition-colors duration-200
                      ${isExpanded ? "justify-start px-4" : "justify-center px-2"}
                    `}
                    onClick={() => handleItemClick(item.href)}
                  >
                    <div className="flex-shrink-0">
                      {React.cloneElement(item.icon, {
                        className: "h-10 w-10",
                        strokeWidth: 1.5,
                      })}
                    </div>
                    {isExpanded && <span className="flex-1 text-left truncate">{item.name}</span>}
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
          ml-0 transition-all duration-300 
          ${isExpanded ? "md:ml-64" : "md:ml-20"}
        `}
      >
        {/* Content goes here */}
      </div>
    </>
  )
}

export default Sidebar

