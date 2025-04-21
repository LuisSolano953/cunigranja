"use client"
import { NavPrivada } from "../../components/Nav/NavPrivada"
import Image from "next/image"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col flex-1">
        <NavPrivada>
          <div className="py-10 px-4">
            <div className="flex flex-col items-center space-y-6 pb-10">
              {/* Imagen sin animación */}
              <div className="w-[250px] h-[180px] flex justify-center items-center">
                <Image
                  src="/assets/img/CUNIGRANJA-1.png"
                  alt="Bienvenida a CUNIGRANJA"
                  width={250}
                  height={180}
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>

              {/* Mensaje de bienvenida */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">¡Bienvenido al Dashboard!</h1>
                <p className="text-gray-600">Explora todas las funciones disponibles.</p>
              </div>
            </div>
          </div>
        </NavPrivada>
      </div>
    </div>
  )
}

