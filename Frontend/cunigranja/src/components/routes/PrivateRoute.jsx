"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/authContext"

// Componente para proteger rutas que requieren autenticación - SIN LOADING PROPIO
export function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Solo redirigir si terminó de cargar y no hay usuario
    if (!loading && !user) {
      router.push("/user/login")
    }
  }, [user, loading, router])

  // NO mostrar loading aquí - el layout se encarga de eso
  // Si está cargando, mostrar children (el layout maneja el loading)
  if (loading) {
    return children
  }

  // Si no hay usuario y no está cargando, no mostrar nada (se redirigirá)
  if (!user && !loading) {
    return null
  }

  // Si hay usuario, mostrar el contenido protegido
  return children
}

// Componente para proteger rutas que requieren un rol específico - SIN LOADING PROPIO
export function RoleRoute({ children, roles = [] }) {
  const { user, loading, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Solo verificar si terminó de cargar
    if (!loading) {
      if (!user) {
        router.push("/user/login")
        return
      }

      if (!roles.some((role) => hasRole(role))) {
        router.push("/unauthorized")
        return
      }
    }
  }, [user, loading, hasRole, roles, router])

  // NO mostrar loading aquí - el layout se encarga de eso
  if (loading) {
    return children
  }

  // Si no cumple los requisitos, no mostrar nada
  if (!user || !roles.some((role) => hasRole(role))) {
    return null
  }

  // Si cumple los requisitos, mostrar el contenido
  return children
}

// Componente para mostrar elementos condicionalmente según el rol
export function RoleElement({ children, roles = [] }) {
  const { user, hasRole } = useAuth()

  // Si no hay usuario o no tiene el rol requerido, no mostrar nada
  if (!user || !roles.some((role) => hasRole(role))) {
    return null
  }

  // Si hay usuario y tiene el rol requerido, mostrar el contenido
  return children
}
