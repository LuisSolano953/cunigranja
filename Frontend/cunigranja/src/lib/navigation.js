"use client"

import { useRouter } from "next/navigation"

// Función simplificada para navegar - eliminamos la lógica problemática de sessionStorage
export function useSecureNavigation() {
  const router = useRouter()

  // Función para navegar a una ruta
  const navigateTo = (path) => {
    router.push(path)
  }

  return { navigateTo }
}

// Eliminamos la función checkNavigation ya que causaba problemas
