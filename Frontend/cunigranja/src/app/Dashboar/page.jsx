"use client"

import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import {
  Loader2,
  Rabbit,
  Users,
  AlertCircle,
  Heart,
  Skull,
  RefreshCw,
  Calendar,
  Activity,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import axiosInstance from "@/lib/axiosInstance"

// Componente de tabla de datos resumida
const DataTable = ({ columns, data, title, maxRows = 5 }) => {
  const [showAll, setShowAll] = useState(false)
  const displayData = showAll ? data : data.slice(0, maxRows)

  return (
    <div className="w-full">
      {title && <h3 className="text-base font-medium mb-3">{title}</h3>}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {columns.map((column, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {displayData.length > 0 ? (
                displayData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                      >
                        {column.cell ? column.cell(row) : row[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {data.length > maxRows && (
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-right">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-600 gap-1"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? (
                <>
                  Mostrar menos <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Ver todos ({data.length}) <ChevronDown className="h-3 w-3" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente de tarjeta de estadísticas
const StatCard = ({ icon: Icon, title, value, description, color = "blue", onClick = null }) => {
  const colorSchemes = {
    blue: {
      light: "bg-blue-50 text-blue-700 border-blue-100",
      icon: "bg-blue-100 text-blue-600",
      trend: "text-blue-600",
      border: "border-blue-100 hover:border-blue-200",
      shadow: "shadow-blue-100/50",
    },
    green: {
      light: "bg-green-50 text-green-700 border-green-100",
      icon: "bg-green-100 text-green-600",
      trend: "text-green-600",
      border: "border-green-100 hover:border-green-200",
      shadow: "shadow-green-100/50",
    },
    purple: {
      light: "bg-purple-50 text-purple-700 border-purple-100",
      icon: "bg-purple-100 text-purple-600",
      trend: "text-purple-600",
      border: "border-purple-100 hover:border-purple-200",
      shadow: "shadow-purple-100/50",
    },
    amber: {
      light: "bg-amber-50 text-amber-700 border-amber-100",
      icon: "bg-amber-100 text-amber-600",
      trend: "text-amber-600",
      border: "border-amber-100 hover:border-amber-200",
      shadow: "shadow-amber-100/50",
    },
    red: {
      light: "bg-red-50 text-red-700 border-red-100",
      icon: "bg-red-100 text-red-600",
      trend: "text-red-600",
      border: "border-red-100 hover:border-red-200",
      shadow: "shadow-red-100/50",
    },
    cyan: {
      light: "bg-cyan-50 text-cyan-700 border-cyan-100",
      icon: "bg-cyan-100 text-cyan-600",
      trend: "text-cyan-600",
      border: "border-cyan-100 hover:border-cyan-200",
      shadow: "shadow-cyan-100/50",
    },
    teal: {
      light: "bg-teal-50 text-teal-700 border-teal-100",
      icon: "bg-teal-100 text-teal-600",
      trend: "text-teal-600",
      border: "border-teal-100 hover:border-teal-200",
      shadow: "shadow-teal-100/50",
    },
  }

  const scheme = colorSchemes[color]

  return (
    <Card
      className={`border ${scheme.border} shadow-sm hover:shadow-md transition-all duration-300 ${scheme.shadow} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className={`p-2.5 rounded-lg ${scheme.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="text-sm">{title}</CardDescription>
      </CardContent>
      {description && <CardFooter className="pt-0 text-xs text-gray-500 dark:text-gray-400">{description}</CardFooter>}
    </Card>
  )
}

// Componente de alerta
const AlertCard = ({ title, messages, icon: Icon = AlertCircle, color = "amber" }) => {
  const colorSchemes = {
    amber: "border-l-amber-500 bg-amber-50/50",
    red: "border-l-red-500 bg-red-50/50",
    blue: "border-l-blue-500 bg-blue-50/50",
    green: "border-l-green-500 bg-green-50/50",
    purple: "border-l-purple-500 bg-purple-50/50",
  }

  const iconColors = {
    amber: "text-amber-500",
    red: "text-red-500",
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
  }

  return (
    <Card className={`border-l-4 ${colorSchemes[color]} shadow-sm`}>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${iconColors[color]}`} />
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="py-1">
        <ul className="space-y-1.5">
          {messages.map((message, index) => (
            <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
              <span className="mr-2 text-gray-400">•</span>
              {message}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// Componente de actividad reciente
const ActivityItem = ({ action, details, time, icon: Icon = Activity, color = "blue" }) => {
  const colorSchemes = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    amber: "bg-amber-100 text-amber-600",
    purple: "bg-purple-100 text-purple-600",
  }

  return (
    <div className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-full ${colorSchemes[color]} mt-0.5`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{action}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{details}</p>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">{time}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente de panel de información
const InfoPanel = ({ title, value, description, icon: Icon, color = "blue" }) => {
  const colorSchemes = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    amber: "text-amber-600",
    purple: "text-purple-600",
  }

  return (
    <div className="flex items-center gap-3 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      {Icon && (
        <div className={`${colorSchemes[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
        <div className="text-xl font-bold text-gray-800 dark:text-gray-200">{value}</div>
        {description && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</div>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  // Estados para almacenar datos
  const [rabbits, setRabbits] = useState([])
  const [races, setRaces] = useState([])
  const [reproductions, setReproductions] = useState([])
  const [mortality, setMortality] = useState([])
  const [health, setHealth] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [stats, setStats] = useState({
    totalRabbits: 0,
    totalReproductions: 0,
    totalRaces: 0,
    mortalityRate: "0.0",
    totalBorn: 0,
    avgPerReproduction: "0.0",
    survivalRate: "0.0",
    totalHealthRecords: 0,
    healthRecordsPerRabbit: "0.0",
  })

  // Estados para controlar la carga y errores
  const [dataLoading, setDataLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isVerifying, setIsVerifying] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Función para formatear fecha
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Fecha desconocida"
    }
  }

  // Función para formatear fecha corta
  const formatShortDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }).format(date)
    } catch (error) {
      return "N/A"
    }
  }

  // Función para formatear fecha relativa
  const formatRelativeTime = (dateString) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffSecs = Math.floor(diffMs / 1000)
      const diffMins = Math.floor(diffSecs / 60)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffSecs < 60) return "Hace unos segundos"
      if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`
      if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`
      if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`

      return formatDate(dateString)
    } catch (error) {
      return "Fecha desconocida"
    }
  }

  // Función para cargar todos los datos
  const loadAllData = async () => {
    setDataLoading(true)
    const newErrors = {}

    try {
      // Cargar datos de conejos
      try {
        const response = await axiosInstance.get("/Api/Rabbit/GetRabbit")
        console.log("Rabbit data:", response.data)
        setRabbits(response.data || [])
      } catch (error) {
        console.error("Error fetching rabbits:", error)
        newErrors.rabbits = `Error al cargar conejos: ${error.message || "Error desconocido"}`
      }

      // Cargar datos de razas
      try {
        const response = await axiosInstance.get("/Api/Race/GetRace")
        console.log("Race data:", response.data)
        setRaces(response.data || [])
      } catch (error) {
        console.error("Error fetching races:", error)
        newErrors.races = `Error al cargar razas: ${error.message || "Error desconocido"}`
      }

      // Cargar datos de reproducciones
      try {
        const response = await axiosInstance.get("/Api/Reproduction/GetReproduction")
        console.log("Reproduction data:", response.data)
        setReproductions(response.data || [])
      } catch (error) {
        console.error("Error fetching reproductions:", error)
        newErrors.reproductions = `Error al cargar reproducciones: ${error.message || "Error desconocido"}`
      }

      // Cargar datos de mortalidad
      try {
        const response = await axiosInstance.get("/Api/Mortality/AllMortality")
        console.log("Mortality data:", response.data)
        setMortality(response.data || [])
      } catch (error) {
        console.error("Error fetching mortality:", error)
        newErrors.mortality = `Error al cargar mortalidad: ${error.message || "Error desconocido"}`
      }

      // Cargar datos de salud
      try {
        const response = await axiosInstance.get("/Api/Health/AllHealth")
        console.log("Health data:", response.data)
        setHealth(response.data || [])
      } catch (error) {
        console.error("Error fetching health:", error)
        newErrors.health = `Error al cargar salud: ${error.message || "Error desconocido"}`
      }

      setErrors(newErrors)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error general al cargar datos:", error)
      newErrors.general = `Error general: ${error.message || "Error desconocido"}`
    } finally {
      setDataLoading(false)
    }
  }

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadAllData()

    // Configurar intervalo para actualizar datos cada 60 segundos
    const intervalId = setInterval(() => {
      loadAllData()
    }, 60000)

    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId)
  }, [])

  // Efecto para procesar los datos cuando se cargan
  useEffect(() => {
    if (reproductions.length || health.length || mortality.length) {
      prepareRecentActivity()
    }

    calculateStats()
  }, [rabbits, races, reproductions, mortality, health])

  // Preparar datos de actividad reciente
  const prepareRecentActivity = () => {
    if (!reproductions.length && !health.length && !mortality.length) return

    try {
      const allActivities = []

      // Añadir reproducciones recientes
      reproductions.slice(0, 5).forEach((reproduction) => {
        allActivities.push({
          action: "Reproducción registrada",
          details: `Total: ${reproduction.total_conejos || 0} conejos (${reproduction.nacidos_vivos || 0} vivos, ${reproduction.nacidos_muertos || 0} muertos)`,
          time: reproduction.fecha_nacimiento ? formatRelativeTime(reproduction.fecha_nacimiento) : "Fecha desconocida",
          date: new Date(reproduction.fecha_nacimiento || Date.now()),
          icon: Heart,
          color: "green",
        })
      })

      // Añadir registros de salud recientes
      health.slice(0, 5).forEach((healthRecord) => {
        allActivities.push({
          action: "Control de salud",
          details: `${healthRecord.name_health || "Control"} - ${healthRecord.descripcion_health || "Sin descripción"}`,
          time: healthRecord.fecha_health ? formatRelativeTime(healthRecord.fecha_health) : "Fecha desconocida",
          date: new Date(healthRecord.fecha_health || Date.now()),
          icon: Activity,
          color: "blue",
        })
      })

      // Añadir registros de mortalidad recientes
      mortality.slice(0, 5).forEach((mortalityRecord) => {
        allActivities.push({
          action: "Registro de mortalidad",
          details: `${mortalityRecord.name_rabbit || "Conejo"} - ${mortalityRecord.causa_mortality || "Causa desconocida"}`,
          time: mortalityRecord.fecha_mortality
            ? formatRelativeTime(mortalityRecord.fecha_mortality)
            : "Fecha desconocida",
          date: new Date(mortalityRecord.fecha_mortality || Date.now()),
          icon: Skull,
          color: "red",
        })
      })

      // Ordenar por fecha más reciente y tomar los 8 primeros
      setRecentActivity(allActivities.sort((a, b) => b.date - a.date).slice(0, 8))
    } catch (err) {
      console.error("Error preparing recent activity:", err)
      setRecentActivity([])
    }
  }

  // Calcular estadísticas
  const calculateStats = () => {
    try {
      // Total de conejos
      const totalRabbits = rabbits.length

      // Total de reproducciones
      const totalReproductions = reproductions.length

      // Total de razas
      const totalRaces = races.length

      // Tasa de mortalidad (total)
      const mortalityRate =
        totalRabbits > 0 ? ((mortality.length / (totalRabbits + mortality.length)) * 100).toFixed(1) : "0.0"

      // Calcular total de conejos nacidos
      const totalBorn = reproductions.reduce((sum, reproduction) => sum + (reproduction.total_conejos || 0), 0)

      // Calcular promedio de conejos por reproducción
      const avgPerReproduction = totalReproductions > 0 ? (totalBorn / totalReproductions).toFixed(1) : "0.0"

      // Calcular tasa de supervivencia
      const totalBornAlive = reproductions.reduce((sum, reproduction) => sum + (reproduction.nacidos_vivos || 0), 0)
      const survivalRate = totalBorn > 0 ? ((totalBornAlive / totalBorn) * 100).toFixed(1) : "0.0"

      // Calcular estadísticas de salud
      const totalHealthRecords = health.length
      const healthRecordsPerRabbit = totalRabbits > 0 ? (totalHealthRecords / totalRabbits).toFixed(1) : "0.0"

      setStats({
        totalRabbits,
        totalReproductions,
        totalRaces,
        mortalityRate,
        totalBorn,
        avgPerReproduction,
        survivalRate,
        totalHealthRecords,
        healthRecordsPerRabbit,
      })
    } catch (err) {
      console.error("Error calculating stats:", err)
    }
  }

  // Mientras se verifica o cargan datos iniciales, mostrar un loader
  if (isVerifying) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-gray-600 animate-pulse">Cargando CUNIGRANJA...</p>
        </div>
      </div>
    )
  }

  const hasErrors = Object.keys(errors).length > 0

  // Columnas para tablas de datos
  const rabbitColumns = [
    { header: "ID", accessor: "Id_rabbit" },
    { header: "Nombre", accessor: "name_rabbit" },
    { header: "Sexo", accessor: "sexo_rabbit" },
    { header: "Peso", cell: (row) => `${row.peso_actual || "N/A"} kg` },
    { header: "Estado", accessor: "estado" },
    { header: "Raza", accessor: "nombre_race" },
  ]

  const reproductionColumns = [
    { header: "Fecha", cell: (row) => formatShortDate(row.fecha_nacimiento) },
    { header: "Conejo", accessor: "name_rabbit" },
    { header: "Total", accessor: "total_conejos" },
    { header: "Vivos", accessor: "nacidos_vivos" },
    { header: "Muertos", accessor: "nacidos_muertos" },
  ]

  // Función para navegar a otras páginas
  const navigateToPage = (page) => {
    window.location.href = page
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col flex-1">
        <NavPrivada>
          <div className="py-6 px-4 md:px-6 animate-fadeIn">
            <div className="max-w-7xl mx-auto">
              {/* Encabezado del dashboard */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Resumen de la actividad de tu granja cunícola
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div
                      className={`${
                        hasErrors ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                      } text-xs font-medium px-3 py-1.5 rounded-full flex items-center`}
                    >
                      <span
                        className={`w-2 h-2 ${
                          hasErrors ? "bg-amber-500" : "bg-blue-500"
                        } rounded-full mr-1.5 animate-pulse`}
                      ></span>
                      {hasErrors ? "Datos parciales" : "Datos en tiempo real"}
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs gap-1.5"
                            onClick={loadAllData}
                            disabled={dataLoading}
                          >
                            {dataLoading ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3.5 w-3.5" />
                            )}
                            Actualizar
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Última actualización: {lastUpdated.toLocaleTimeString()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {dataLoading && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        Actualizando...
                      </div>
                    )}
                  </div>
                </div>

                {/* Mostrar errores si existen */}
                {hasErrors && (
                  <Card className="border-l-4 border-l-amber-500 shadow-sm mb-6 bg-amber-50/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <CardTitle className="text-sm font-medium">Problemas de conexión</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="py-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Algunos datos no pudieron cargarse correctamente. Se están mostrando datos parciales.
                      </p>
                      <details className="text-xs text-gray-600 dark:text-gray-400">
                        <summary className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                          Ver detalles técnicos
                        </summary>
                        <ul className="mt-2 space-y-1 pl-4">
                          {Object.values(errors).map((err, index) => (
                            <li key={index} className="text-red-600 dark:text-red-400">
                              {err}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Pestañas del dashboard */}
              <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="overview" className="text-sm">
                    Resumen
                  </TabsTrigger>
                </TabsList>

                {/* Contenido de la pestaña Resumen */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Tarjetas de estadísticas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                      icon={Rabbit}
                      title="Conejos"
                      value={stats.totalRabbits.toString()}
                      description="Total de conejos registrados"
                      color="blue"
                    />
                    <StatCard
                      icon={Heart}
                      title="Reproducciones"
                      value={stats.totalReproductions.toString()}
                      description="Total de reproducciones registradas"
                      color="green"
                    />
                    <StatCard
                      icon={Users}
                      title="Razas"
                      value={stats.totalRaces.toString()}
                      description="Tipos de razas registradas"
                      color="purple"
                    />
                    <StatCard
                      icon={Skull}
                      title="Tasa de Mortalidad"
                      value={`${stats.mortalityRate}%`}
                      description="Porcentaje total"
                      color="red"
                    />
                  </div>

                  {/* Contenido principal y actividades recientes */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tablas de datos */}
                    <div className="lg:col-span-2 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Últimos Conejos Registrados</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <DataTable columns={rabbitColumns} data={rabbits} maxRows={5} />
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-blue-600 gap-1"
                            onClick={() => navigateToPage("/Dashboar/Rabbit")}
                          >
                            Ver todos los conejos
                          </Button>
                        </CardFooter>
                      </Card>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InfoPanel
                          title="Conejos Nacidos"
                          value={stats.totalBorn}
                          description="Total de conejos nacidos"
                          icon={Heart}
                          color="green"
                        />
                        <InfoPanel
                          title="Promedio por Camada"
                          value={stats.avgPerReproduction}
                          description="Conejos por reproducción"
                          icon={Users}
                          color="purple"
                        />
                        <InfoPanel
                          title="Tasa de Supervivencia"
                          value={`${stats.survivalRate}%`}
                          description="Nacidos vivos / Total nacidos"
                          icon={Activity}
                          color="blue"
                        />
                      </div>
                    </div>

                    {/* Alertas y actividades recientes */}
                    <div className="space-y-6">
                      <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
                            <Badge variant="outline" className="text-xs font-normal">
                              {recentActivity.length} actividades
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          {recentActivity.length > 0 ? (
                            <div className="divide-y">
                              {recentActivity.map((item, index) => (
                                <ActivityItem
                                  key={index}
                                  action={item.action}
                                  details={item.details}
                                  time={item.time}
                                  icon={item.icon}
                                  color={item.color}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                              <Calendar className="h-10 w-10 text-gray-300 mb-2" />
                              <p>No hay actividades recientes</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <AlertCard
                        title="Resumen de Datos"
                        icon={Info}
                        color="blue"
                        messages={[
                          `${rabbits.length} conejos en total`,
                          `${reproductions.length} reproducciones registradas`,
                          `${mortality.length} registros de mortalidad`,
                          `${health.length} controles de salud`,
                          `Tasa de supervivencia: ${stats.survivalRate}%`,
                        ]}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </NavPrivada>
      </div>

      {/* Estilos personalizados para animaciones */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
