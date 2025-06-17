"use client"

import Footer from "@/components/Nav/footer"
import { useState, useEffect } from "react"
import PublicNav from "@/components/Nav/PublicNav"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Code, Sparkles, Users, Target, Lightbulb } from "lucide-react"

const teamMembers = [
  {
    name: "Luis Alvaro Solano Mondragon",
    role: "Analista y Desarrollador de Software",
    email: "luissolanor2022@gmail.com",
    birthDate: "2005-12-13",
    image: "/assets/img/luis.png",
  },
  {
    name: "Nestor Sarmiento Barrios",
    role: "Analista y Desarrollador de Software",
    email: "nestor.sarbarrios@gmail.com",
    birthDate: "2006-03-12",
    image: "/assets/img/nestor.png",
  },
  {
    name: "Leidy Paola Guio Cespedes",
    role: "Analista y Desarrollador de Software",
    email: "paolacespedes@gmail.com",
    birthDate: "2004-08-07",
    image: "/assets/img/paola.png",
  },
  {
    name: "Jose Gabriel Diaz Rodriguez",
    role: "Analista y Desarrollador de Software",
    email: "gabrieldiazrodriguez2006@gmail.com",
    birthDate: "2006-01-23",
    image: "/assets/img/gabriel.png",
  },
]

// Función para calcular edad dinámicamente
function calculateAge(birthDate) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

function TeamMemberCard({ member, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const [age, setAge] = useState(0)

  useEffect(() => {
    setAge(calculateAge(member.birthDate))
  }, [member.birthDate])

  return (
    <div
      className="relative w-full max-w-md mx-auto my-4 h-80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-lg shadow-lg h-full">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${isHovered ? "-100%" : "0%"})` }}
        >
          <div className="flex-none w-full h-full relative bg-gray-100">
            <Image
              src={member.image || "/placeholder.svg?height=300&width=300"}
              alt={member.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{
                objectFit: "contain",
                padding: "0px",
              }}
              className="rounded-lg"
            />
          </div>
          <Card className="flex-none w-full h-full">
            <CardContent className="flex flex-col justify-center items-center h-full p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h3>
              <p className="text-gray-700 font-medium mb-2">{member.role}</p>
              <p className="text-sm text-gray-600 mb-1">{member.email}</p>
              <p className="text-sm text-gray-500">Edad: {age}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function QuienesSomosPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <PublicNav />

        {/* Hero Section */}
        <div className="relative pt-32 pb-16 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-6 shadow-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-purple-600 font-semibold">Conoce a Nuestro Equipo</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Innovadores
                </span>
                <br />
                <span className="text-gray-800">por Naturaleza</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Somos un equipo apasionado de desarrolladores y analistas de software, comprometidos con la creación de
                soluciones tecnológicas innovadoras que transforman ideas en realidades digitales extraordinarias.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} index={index} />
            ))}
          </div>

          
        </div>
      </div>
      <Footer />
    </>
  )
}

export default QuienesSomosPage
