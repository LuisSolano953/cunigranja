"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/authContext"
import { NavPrivada } from "@/components/Nav/NavPrivada"
import {
  Loader2,
  UserIcon,
  Mail,
  CheckCircle,
  AlertCircle,
  Shield,
  Sparkles,
  Lock,
  Save,
  Eye,
  EyeOff,
  Fingerprint,
  Zap,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axiosInstance from "@/lib/axiosInstance"

// Componente de partículas de fondo
const ParticleBackground = () => {
  return (
    <div className="particle-container absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle absolute rounded-full bg-blue-400/20"
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 10}s`,
          }}
        ></div>
      ))}
    </div>
  )
}

// Componente de efecto de onda
const WaveEffect = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden z-0 opacity-70">
      <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          className="wave1 fill-blue-400/10"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
        <path
          className="wave2 fill-blue-500/10"
          d="M0,256L48,261.3C96,267,192,277,288,261.3C384,245,480,203,576,197.3C672,192,768,224,864,213.3C960,203,1056,149,1152,149.3C1248,149,1344,203,1392,229.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  )
}

// Componente de efecto de luz
const LightEffect = ({ className = "" }) => {
  return <div className={`absolute rounded-full blur-3xl opacity-30 ${className}`}></div>
}

// Componente de tarjeta con efecto de vidrio
const GlassCard = ({ children, className = "", hoverEffect = true }) => {
  return (
    <div className={`relative group ${hoverEffect ? "transform transition-all duration-500 hover:scale-[1.01]" : ""}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"></div>
      <div
        className={`relative bg-white/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-white/20 ${className}`}
      >
        {children}
      </div>
    </div>
  )
}

// Componente de botón con efecto de neón
const NeonButton = ({ children, onClick, disabled = false, variant = "primary", className = "" }) => {
  const baseClasses = "relative overflow-hidden rounded-lg px-6 py-3 font-medium transition-all duration-300"
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-70",
    secondary: "bg-white text-blue-600 border border-blue-200 hover:border-blue-400 hover:bg-blue-50",
    danger:
      "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-70",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} group/btn`}
    >
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-full w-full bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100"></div>
      </div>

      {/* Efecto de partículas */}
      <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
        <div className="absolute top-1/2 left-1/4 h-1 w-1 rounded-full bg-white/60 animate-ping"></div>
        <div className="absolute top-1/3 right-1/4 h-1 w-1 rounded-full bg-white/60 animate-ping delay-300"></div>
      </div>

      <span className="relative z-10 flex items-center">{children}</span>
    </button>
  )
}

// Componente de campo de formulario con efecto 3D
const FormField3D = ({ id, label, icon: Icon, value, onChange, type = "text", placeholder, required = false }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const actualType = type === "password" && showPassword ? "text" : type

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all duration-300 ${isFocused ? "shadow-lg shadow-blue-200/50" : "shadow-md"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fondo con efecto de profundidad */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${isFocused ? "from-blue-100/80 to-blue-50/90" : isHovered ? "from-blue-50/80 to-white/90" : "from-gray-50/80 to-white/90"} transition-all duration-300`}
      ></div>

      {/* Borde con efecto de brillo */}
      <div
        className={`absolute inset-0 border ${isFocused ? "border-blue-400/50" : isHovered ? "border-blue-300/50" : "border-gray-200/70"} rounded-xl transition-all duration-300`}
      ></div>

      {/* Efecto de luz en esquina */}
      <div
        className={`absolute -top-10 -right-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl opacity-0 ${isFocused ? "opacity-100" : ""} transition-opacity duration-300`}
      ></div>

      <div className="relative p-5 z-10">
        <Label
          htmlFor={id}
          className={`mb-2 block font-medium transition-colors duration-300 ${isFocused ? "text-blue-700" : isHovered ? "text-blue-600" : "text-gray-700"}`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`rounded-full p-1.5 transition-colors duration-300 ${isFocused ? "bg-blue-100 text-blue-600" : isHovered ? "bg-blue-50 text-blue-500" : "bg-gray-100 text-gray-500"}`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span>{label}</span>
          </div>
        </Label>

        <div className="relative">
          <Input
            id={id}
            type={actualType}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`pr-10 border-0 bg-white/70 shadow-inner transition-all duration-300 focus:ring-2 ${isFocused ? "ring-blue-400/50 bg-white" : ""} placeholder:text-gray-400`}
            placeholder={placeholder}
            required={required}
          />

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente de avatar interactivo
const InteractiveAvatar = ({ user, userInitial }) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-75 blur-sm group-hover:opacity-100 transition duration-300 animate-tilt"></div>
      <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 overflow-hidden border-2 border-white shadow-xl">
        {user?.photoURL ? (
          <Avatar className="w-full h-full">
            <AvatarImage src={user.photoURL || "/placeholder.svg"} alt={user.email} />
            <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">{userInitial}</AvatarFallback>
          </Avatar>
        ) : (
          <span className="text-white text-3xl font-bold">{userInitial}</span>
        )}
      </div>

      {/* Indicador de estado */}
      <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-sm flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
      </div>
    </div>
  )
}

// Componente de tarjeta de estadísticas
const StatCard = ({ icon: Icon, title, value, trend = null, color = "blue" }) => {
  const colors = {
    blue: "from-blue-500 to-blue-700",
    purple: "from-purple-500 to-purple-700",
    indigo: "from-indigo-500 to-indigo-700",
    cyan: "from-cyan-500 to-cyan-700",
  }

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg group hover:shadow-xl transition-all duration-300">
      {/* Fondo con gradiente */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>

      {/* Efecto de luz */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>

      {/* Icono grande de fondo */}
      <div className="absolute right-4 bottom-4 opacity-20">
        <Icon className="w-16 h-16 text-white" />
      </div>

      <div className="relative p-5 text-white z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-medium text-white/90">{title}</h3>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  )
}

// Componente de alerta con animación
const AnimatedAlert = ({ type, title, message, details = null, onClose = null, isAnimating = false }) => {
  const alertTypes = {
    success: {
      bg: "from-green-50 to-green-100",
      icon: CheckCircle,
      iconColor: "text-green-600",
      titleColor: "text-green-800",
      textColor: "text-green-700",
      detailsBg: "bg-green-100/80",
      borderColor: "border-green-200",
    },
    error: {
      bg: "from-red-50 to-red-100",
      icon: AlertCircle,
      iconColor: "text-red-600",
      titleColor: "text-red-800",
      textColor: "text-red-700",
      detailsBg: "bg-red-100/80",
      borderColor: "border-red-200",
    },
    warning: {
      bg: "from-amber-50 to-amber-100",
      icon: AlertCircle,
      iconColor: "text-amber-600",
      titleColor: "text-amber-800",
      textColor: "text-amber-700",
      detailsBg: "bg-amber-100/80",
      borderColor: "border-amber-200",
    },
    info: {
      bg: "from-blue-50 to-blue-100",
      icon: Fingerprint,
      iconColor: "text-blue-600",
      titleColor: "text-blue-800",
      textColor: "text-blue-700",
      detailsBg: "bg-blue-100/80",
      borderColor: "border-blue-200",
    },
  }

  const currentType = alertTypes[type] || alertTypes.info
  const Icon = currentType.icon

  return (
    <Alert
      className={`mb-6 border-0 bg-gradient-to-r ${currentType.bg} shadow-md overflow-hidden ${isAnimating ? "animate-alert-pulse" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"></div>

      {isAnimating && (
        <>
          <div className="absolute top-0 left-1/4 h-2 w-2 bg-white animate-confetti-1"></div>
          <div className="absolute top-0 left-1/2 h-3 w-1 bg-white animate-confetti-2"></div>
          <div className="absolute top-0 right-1/4 h-2 w-2 bg-white animate-confetti-3"></div>
        </>
      )}

      <div className="flex items-center gap-2 relative z-10">
        <div className={`rounded-full p-1.5 ${currentType.bg} shadow-inner`}>
          <Icon className={`h-5 w-5 ${currentType.iconColor}`} />
        </div>
        <AlertTitle className={`${currentType.titleColor} font-semibold`}>{title}</AlertTitle>

        {onClose && (
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <AlertDescription className={`mt-2 pl-9 ${currentType.textColor}`}>
        {message}
        {details && (
          <div className={`mt-2 rounded ${currentType.detailsBg} p-3 text-sm border ${currentType.borderColor}`}>
            <pre className="whitespace-pre-wrap">{details}</pre>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Componente principal - SIN LOADING PROPIO
export default function Settings() {
  const { user, loading, isAdmin, updateUserEmail, logout } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [errorDetails, setErrorDetails] = useState("")
  const [animateSuccess, setAnimateSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    security: true,
  })

  // Referencia para el efecto de desplazamiento
  const scrollRef = useRef(null)

  useEffect(() => {
    // Solo verificar si terminó de cargar y hay usuario
    if (!loading && user) {
      fetchUserData()
    }
  }, [user, loading])

  const fetchUserData = async () => {
    try {
      // Buscar el usuario por email
      const response = await axiosInstance.get(`/Api/User/AllUser`)
      if (response.status === 200) {
        const users = response.data
        const currentUser = users.find((u) => u.email_user === user.email)

        if (currentUser) {
          setUserData(currentUser)
          setName(currentUser.name_user || "")
          setEmail(currentUser.email_user || "")
        } else {
          setErrorMessage("No se encontró el usuario en el servidor")
        }
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error)
      setErrorMessage("No se pudieron cargar los datos del usuario")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage("")
    setErrorMessage("")
    setErrorDetails("")

    try {
      if (!userData) {
        throw new Error("No se encontraron datos del usuario")
      }

      const updateData = { ...userData }
      updateData.name_user = name
      updateData.email_user = email

      if (!updateData.password_user) {
        updateData.password_user = userData.password_user || ""
      }

      if (!updateData.estado) {
        updateData.estado = userData.estado || "activo"
      }

      if (updateData.id_user && !updateData.Id_user) {
        updateData.Id_user = updateData.id_user
      } else if (updateData.Id_user && !updateData.id_user) {
        updateData.id_user = updateData.Id_user
      }

      const response = await axiosInstance.post(`/Api/User/UpdateUser`, updateData)

      if (response.status === 200) {
        const emailChanged = user && email !== user.email

        setSuccessMessage(
          emailChanged
            ? "Información actualizada correctamente. Para aplicar los cambios es necesario iniciar sesión nuevamente."
            : "Información actualizada correctamente",
        )
        setAnimateSuccess(true)

        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }

        if (emailChanged) {
          try {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
            storedUser.email = email
            localStorage.setItem("user", JSON.stringify(storedUser))

            if (typeof updateUserEmail === "function") {
              updateUserEmail(email)
            }
          } catch (error) {
            console.error("Error al actualizar el email en localStorage:", error)
          }

          setTimeout(() => {
            if (typeof logout === "function") {
              logout()
            } else {
              localStorage.removeItem("user")
            }
            router.push("/user/login")
          }, 3000)
        }
      }
    } catch (error) {
      console.error("Error al actualizar la información:", error)

      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          const errorDetails = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
            .join("\n")

          setErrorDetails(errorDetails)
        }
      }

      setErrorMessage(
        error.response?.data?.title ||
          error.response?.data?.message ||
          error.message ||
          "Error al actualizar la información",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage("")
    setErrorMessage("")
    setErrorDetails("")

    try {
      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      const passwordData = {
        Email: user.email,
        Password: password,
      }

      const response = await axiosInstance.post("/Api/User/ChangePassword", passwordData)

      if (response.status === 200) {
        setSuccessMessage(
          "Contraseña actualizada correctamente. Por favor, inicia sesión nuevamente con tu nueva contraseña.",
        )
        setAnimateSuccess(true)

        setPassword("")
        setConfirmPassword("")
        setCurrentPassword("")

        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }

        setTimeout(() => {
          if (typeof logout === "function") {
            logout()
          } else {
            localStorage.removeItem("user")
          }
          router.push("/user/login")
        }, 3000)
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error)

      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          const errorDetails = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`)
            .join("\n")

          setErrorDetails(errorDetails)
        }
      }

      setErrorMessage(
        error.response?.data?.title ||
          error.response?.data?.message ||
          error.message ||
          "Error al cambiar la contraseña",
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Obtener la inicial del usuario para el avatar
  const userInitial = user?.email?.charAt(0).toUpperCase() || "U"

  // NO HAY LOADING AQUÍ - el layout se encarga de todo
  // Siempre mostrar el contenido, el layout maneja la autenticación

  return (
    <NavPrivada>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-6 pb-12 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <ParticleBackground />
        <LightEffect className="top-1/4 right-1/4 w-64 h-64 bg-blue-300/10 animate-pulse" />
        <LightEffect className="bottom-1/4 left-1/4 w-96 h-96 bg-indigo-300/10 animate-pulse animation-delay-700" />
        <WaveEffect />

        <div ref={scrollRef} className="container mx-auto max-w-6xl px-4 relative z-10">
          {/* Encabezado con efecto de vidrio */}
          <GlassCard className="mb-10 p-8 bg-gradient-to-r from-blue-600/90 via-blue-700/90 to-indigo-800/90 backdrop-blur-md">
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar del usuario */}
              <InteractiveAvatar user={user} userInitial={userInitial} />

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start">
                      Configuración de Cuenta
                      <Sparkles className="ml-2 h-5 w-5 text-yellow-300 animate-pulse" />
                    </h1>
                    <div className="mt-2 flex items-center justify-center md:justify-start flex-wrap gap-2">
                      <p className="text-blue-100">Actualiza tu información personal</p>
                      <div className="flex items-center rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm border border-white/30 shadow-inner">
                        {isAdmin() && <Shield className="w-3 h-3 mr-1 text-white" />}
                        <span className="text-xs font-medium text-white">
                          {isAdmin() ? "Administrador" : "Usuario"}
                        </span>
                      </div>
                      <div className="flex items-center rounded-full bg-green-500/20 px-3 py-1 backdrop-blur-sm border border-green-500/30 shadow-inner">
                        <div className="mr-1 h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-xs font-medium text-green-100">En línea</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estadísticas del usuario */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <StatCard icon={Zap} title="Estado" value="Activo" color="cyan" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Alertas */}
          {successMessage && (
            <AnimatedAlert
              type="success"
              title="¡Éxito!"
              message={successMessage}
              isAnimating={animateSuccess}
              onClose={() => setSuccessMessage("")}
            />
          )}

          {errorMessage && (
            <AnimatedAlert
              type="error"
              title="Error"
              message={errorMessage}
              details={errorDetails}
              onClose={() => {
                setErrorMessage("")
                setErrorDetails("")
              }}
            />
          )}

          {/* Contenido principal con pestañas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlassCard>
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="px-6 pt-6">
                    <TabsList className="w-full grid grid-cols-2 bg-blue-50/50">
                      <TabsTrigger
                        value="profile"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white"
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        Perfil
                      </TabsTrigger>
                      <TabsTrigger
                        value="security"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white"
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Seguridad
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="profile" className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <UserIcon className="mr-2 h-5 w-5 text-blue-600" />
                        Información Personal
                      </h2>
                      <p className="text-gray-600">Actualiza tu información personal y de contacto.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <FormField3D
                        id="name"
                        label="Nombre Completo"
                        icon={UserIcon}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                      />

                      <FormField3D
                        id="email"
                        label="Correo Electrónico"
                        icon={Mail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="tu@email.com"
                        required
                      />

                      <div className="flex justify-end">
                        <NeonButton onClick={handleSubmit} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span>Actualizando...</span>
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              <span>Guardar Cambios</span>
                            </>
                          )}
                        </NeonButton>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="security" className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Lock className="mr-2 h-5 w-5 text-blue-600" />
                        Seguridad de la Cuenta
                      </h2>
                      <p className="text-gray-600">Actualiza tu contraseña y configura opciones de seguridad.</p>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <FormField3D
                        id="password"
                        label="Nueva Contraseña"
                        icon={Lock}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Nueva contraseña"
                        required
                      />

                      <FormField3D
                        id="confirmPassword"
                        label="Confirmar Contraseña"
                        icon={Lock}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        placeholder="Confirma tu nueva contraseña"
                        required
                      />

                      <div className="flex justify-end">
                        <NeonButton
                          onClick={handlePasswordChange}
                          disabled={isLoading || password !== confirmPassword || !password}
                          variant={password !== confirmPassword && password ? "danger" : "primary"}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span>Actualizando...</span>
                            </>
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              <span>Cambiar Contraseña</span>
                            </>
                          )}
                        </NeonButton>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </GlassCard>
            </div>

            {/* Panel lateral */}
            <div className="space-y-6">
              {/* Tarjeta de información del usuario */}
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <Fingerprint className="mr-2 h-5 w-5 text-blue-600" />
                  Información de Cuenta
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center p-3 rounded-lg bg-blue-50/80 border border-blue-100">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-800 font-medium">Email</div>
                      <div className="text-blue-600">{user?.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 rounded-lg bg-purple-50/80 border border-purple-100">
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm text-purple-800 font-medium">Tipo de Cuenta</div>
                      <div className="text-purple-600">{isAdmin() ? "Administrador" : "Usuario"}</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos personalizados */}
      <style jsx global>{`
        @keyframes confetti-1 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        
        @keyframes confetti-2 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-80px) rotate(-180deg); opacity: 0; }
        }
        
        @keyframes confetti-3 {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-120px) rotate(180deg); opacity: 0; }
        }
        
        .animate-confetti-1 {
          animation: confetti-1 1.5s ease-out forwards;
        }
        
        .animate-confetti-2 {
          animation: confetti-2 1.3s ease-out forwards;
        }
        
        .animate-confetti-3 {
          animation: confetti-3 1.7s ease-out forwards;
        }
        
        .animate-alert-pulse {
          animation: alert-pulse 2s ease;
        }
        
        @keyframes alert-pulse {
          0%, 100% { box-shadow: 0 0 0 rgba(34, 197, 94, 0); }
          50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
        
        @keyframes tilt {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
        }
        
        .particle {
          animation: float 15s infinite ease-in-out;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-30px) translateX(15px); }
          50% { transform: translateY(-15px) translateX(-15px); }
          75% { transform: translateY(-25px) translateX(5px); }
        }
        
        .wave1 {
          animation: wave1 15s linear infinite;
        }
        
        .wave2 {
          animation: wave2 10s linear infinite;
        }
        
        @keyframes wave1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes wave2 {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
      `}</style>
    </NavPrivada>
  )
}
