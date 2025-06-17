"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, ShieldAlert } from "lucide-react"
import PublicNav from "@/components/Nav/PublicNav"

export default function Unauthorized() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNav />
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <ShieldAlert className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Acceso denegado</h1>
          <p className="text-gray-600 mb-8">
            No tienes los permisos necesarios para acceder a esta página. Por favor, contacta al administrador si crees
            que esto es un error.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  )
}
