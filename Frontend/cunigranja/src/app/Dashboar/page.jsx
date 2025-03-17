"use client"
import { NavPrivada } from "../../components/Nav/NavPrivada"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Utensils, Apple, Skull, Box, Stethoscope, Dna, Baby, Weight, BabyIcon as BabyBottle } from "lucide-react"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleNavigation = (path) => {
    setIsLoading(true) // Activa la animación

    setTimeout(() => {
      router.push(path) // Cambia de página después de un tiempo
    }, 600)
  }

  const modules = [
    { name: "Alimento", icon: Utensils, href: "/Dashboar/food" },
    { name: "Alimentación", icon: Apple, href: "/Dashboar/feeding" },
    { name: "Mortalidad", icon: Skull, href: "/Dashboar/mortality" },
    { name: "Jaula", icon: Box, href: "/Dashboar/Cage" },
    { name: "Sanidad", icon: Stethoscope, href: "/Dashboar/health" },
    { name: "Raza", icon: Dna, href: "/Dashboar/race" },
    { name: "Reproducción", icon: Baby, href: "/Dashboar/reproduction" },
    { name: "Destete", icon: BabyBottle, href: "/Dashboar/weaning" },
    { name: "Pesaje", icon: Weight, href: "/Dashboar/pesaje" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col flex-1">
        <NavPrivada>
          <div className="py-10 px-4">
            <div className="flex flex-col items-center space-y-6 pb-10">
              {/* Imagen con animación de giro */}
              <div className="w-[250px] h-[180px] flex justify-center items-center">
                <Image
                  src="/assets/img/CUNIGRANJA-1.png"
                  alt="Bienvenida a CUNIGRANJA"
                  width={250}
                  height={180}
                  objectFit="contain"
                  className={`rounded-lg transition-transform duration-700 
                    ${isLoading ? "animate-spin" : ""}
                  `}
                />
              </div>

              {/* Mensaje de bienvenida */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">¡Bienvenido al Dashboard!</h1>
                <p className="text-gray-600">Explora todas las funciones disponibles.</p>
              </div>

              {/* Módulos en cuadrícula */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 w-full max-w-6xl">
                {modules.map((mod) => (
                  <button
                    key={mod.name}
                    onClick={() => handleNavigation(mod.href)}
                    className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md 
                    transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <mod.icon className="h-10 w-10 text-blue-500 transition-colors duration-300 hover:text-blue-700" />
                    <span className="mt-2 text-gray-800 font-semibold">{mod.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </NavPrivada>
      </div>
    </div>
  )
}

