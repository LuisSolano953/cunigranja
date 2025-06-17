"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/authContext"
import { Users, Settings, Database } from 'lucide-react'
import { NavPrivada } from "../../components/Nav/NavPrivada"
import { Loader2 } from 'lucide-react'

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    // Si no está cargando, verificar autenticación y rol
    if (!loading) {
      if (!user) {
        router.replace("/user/login")
      } else if (!isAdmin()) {
        router.replace("/unauthorized")
      } else {
        setIsVerifying(false)
      }
    }
  }, [user, loading, isAdmin, router])

  // Mientras se verifica, mostrar un loader
  if (loading || isVerifying) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  // Si no hay usuario o no es admin, no mostrar nada (se redirigirá)
  if (!user || !isAdmin()) {
    return null
  }

  const navigateTo = (path) => {
    router.push(path)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col flex-1">
        <NavPrivada>
          <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600 mt-2">Gestiona usuarios, configuraciones y más desde aquí.</p>
            </header>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Tarjeta de Gestión de Usuarios */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Gestión de Usuarios</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">Administrar usuarios</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <button
                      onClick={() => navigateTo("/admin/Responsible")}
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Ver todos los usuarios
                    </button>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Configuración del Sistema */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Configuración</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">Ajustes del usuario</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <button
                      onClick={() => navigateTo("/Dashboar/settings-user")}
                      className="font-medium text-purple-600 hover:text-purple-500"
                    >
                      Modificar configuración
                    </button>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </NavPrivada>
      </div>
    </div>
  )
}