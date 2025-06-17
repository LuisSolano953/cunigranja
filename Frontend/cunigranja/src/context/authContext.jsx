"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import axiosInstance from "@/lib/axiosInstance"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const isTokenValid = (token) => {
    if (!token) return false
    try {
      const decoded = jwtDecode(token)
      return decoded.exp * 1000 > Date.now()
    } catch (error) {
      return false
    }
  }

  const syncTokenToCookies = (token) => {
    if (token) {
      const decoded = jwtDecode(token)
      const expirationDate = new Date(decoded.exp * 1000)
      document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`
    } else {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
  }

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post("Api/User/Login", credentials)

      if (response.status === 200) {
        const token = response.data.token
        localStorage.setItem("token", token)
        syncTokenToCookies(token)

        const decoded = jwtDecode(token)
        const userData = {
          email: decoded.User,
          tipo_user: decoded.tipo_user || "usuario",
        }

        setUser(userData)
        window.dispatchEvent(new Event("userLoggedIn"))
        return true
      }
      return false
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error desconocido"
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    syncTokenToCookies(null)
    setUser(null)
  }

  // Verificación de autenticación OPTIMIZADA - sin loading extra
  useEffect(() => {
    const checkAuth = () => {
      try {
        let token = localStorage.getItem("token")

        if (!token) {
          const cookies = document.cookie.split(";")
          const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("token="))
          if (tokenCookie) {
            token = tokenCookie.split("=")[1]
            localStorage.setItem("token", token)
          }
        }

        if (token && isTokenValid(token)) {
          syncTokenToCookies(token)
          const decoded = jwtDecode(token)
          setUser({
            email: decoded.User,
            tipo_user: decoded.tipo_user || "usuario",
          })
        } else if (token) {
          localStorage.removeItem("token")
          syncTokenToCookies(null)
        }
      } catch (error) {
        console.error("Error en checkAuth:", error)
      } finally {
        setLoading(false) // Siempre terminar el loading
      }
    }

    // Ejecutar inmediatamente sin delay
    checkAuth()
  }, [])

  const hasRole = (role) => user && user.tipo_user === role
  const isAdmin = () => hasRole("administrador")
  const updateUserEmail = (newEmail) => {
    if (user) {
      setUser({ ...user, email: newEmail })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAdmin,
        hasRole,
        updateUserEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
