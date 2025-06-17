"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, AlertCircle, RefreshCw, TrendingUp, Scale, Calendar, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function GraficoConejo({ rabbitId, isOpen, onClose, refreshTrigger = 0 }) {
  const [weighingData, setWeighingData] = useState([])
  const [rabbitInfo, setRabbitInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chartData, setChartData] = useState({ points: [], minWeight: 0, maxWeight: 0, labels: [] })
  const [currentDate, setCurrentDate] = useState(new Date())
  const [retryCount, setRetryCount] = useState(0)
  const [rawData, setRawData] = useState(null) // Para depuración

  // Paleta de colores mejorada
  const colors = {
    primary: "#4f46e5", // Indigo-600
    primaryLight: "#818cf8", // Indigo-400
    primaryDark: "#3730a3", // Indigo-800
    secondary: "#10b981", // Emerald-500
    secondaryLight: "#6ee7b7", // Emerald-300
    accent: "#f97316", // Orange-500
    bacground: "#f9fafb", // Gray-50
    bacgroundAlt: "#f3f4f6", // Gray-100
    text: "#1f2937", // Gray-800
    textLight: "#6b7280", // Gray-500
    border: "#e5e7eb", // Gray-200
    success: "#22c55e", // Green-500
    error: "#ef4444", // Red-500
  }

  useEffect(() => {
    if (rabbitId && isOpen) {
      // Actualizar la fecha actual cada vez que se abre el gráfico
      setCurrentDate(new Date())
      fetchData()
    }
  }, [rabbitId, isOpen, refreshTrigger, retryCount])

  // Función para reintentar la carga de datos
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  // Función para usar datos de ejemplo si los reales fallan
  const useDemoData = () => {
    console.log("Usando datos de demostración para el gráfico")

    // Crear datos de ejemplo basados en el resumen que vimos en la captura de pantalla
    const demoRabbitInfo = {
      name_rabbit: "Marlon",
      peso_inicial: 5,
      peso_actual: 20,
      fecha_registro: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días atrás
    }

    // Crear registros de pesaje de ejemplo
    const demoWeighingData = [
      {
        fecha_weighing: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 días atrás
        peso_actual: 10,
      },
      {
        fecha_weighing: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 días atrás
        peso_actual: 15,
      },
    ]

    setRabbitInfo(demoRabbitInfo)
    setWeighingData(demoWeighingData)
    prepareChartData(demoRabbitInfo, demoWeighingData)
  }

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Obteniendo datos para el conejo ID:", rabbitId)

      // Configuración de timeout para evitar esperas infinitas
      const axiosConfig = { timeout: 10000 } // 10 segundos de timeout

      // Fetch rabbit information
      let rabbitData = null
      try {
        const rabbitResponse = await axiosInstance.get(`/Api/Rabbit/ConsultRabbit?id=${rabbitId}`, axiosConfig)
        console.log("Datos del conejo obtenidos (raw):", rabbitResponse)
        console.log("Datos del conejo obtenidos (data):", rabbitResponse.data)

        // Guardar datos crudos para depuración
        setRawData(rabbitResponse.data)

        rabbitData = rabbitResponse.data

        // Verificar si los datos tienen la estructura esperada
        if (!rabbitData) {
          console.error("Los datos del conejo están vacíos")
        } else {
          console.log("Propiedades del conejo:", Object.keys(rabbitData))
          console.log("Peso inicial:", rabbitData.peso_inicial)
          console.log("Peso actual:", rabbitData.peso_actual)
          console.log("Fecha registro:", rabbitData.fecha_registro)
        }

        setRabbitInfo(rabbitData)
      } catch (rabbitError) {
        console.error("Error al obtener información del conejo:", rabbitError)

        // Mensaje de error específico según el tipo de error
        if (rabbitError.code === "ECONNABORTED") {
          throw new Error("La solicitud ha excedido el tiempo de espera. Por favor, inténtelo de nuevo.")
        } else if (rabbitError.message === "Network Error") {
          throw new Error("Error de conexión. Verifique su conexión a internet e inténtelo de nuevo.")
        } else {
          throw new Error(`No se pudo obtener información del conejo: ${rabbitError.message}`)
        }
      }

      // Intentar obtener los registros de pesaje
      let weighingRecords = []
      try {
        // Fetch weighing records for this rabbit
        const weighingResponse = await axiosInstance.get(
          `/Api/Weighing/GetWeighingByRabbit?id_rabbit=${rabbitId}`,
          axiosConfig,
        )
        console.log("Registros de pesaje obtenidos:", weighingResponse.data)
        weighingRecords = weighingResponse.data || []
      } catch (weighingError) {
        // Si hay un error 404, significa que no hay registros de pesaje
        // Esto es normal, así que no lo tratamos como un error fatal
        if (weighingError.response && weighingError.response.status === 404) {
          console.log("No se encontraron registros de pesaje para este conejo")
          weighingRecords = [] // Asegurarnos de que sea un array vacío
        } else {
          console.warn("Error al obtener registros de pesaje:", weighingError)
          // No lanzamos error aquí, continuamos con weighingRecords vacío
        }
      }

      setWeighingData(weighingRecords)

      // Prepare chart data
      if (rabbitData) {
        prepareChartData(rabbitData, weighingRecords)
      } else {
        console.error("No se pudieron preparar los datos del gráfico porque rabbitData es null")
      }
    } catch (error) {
      console.error("Error al obtener datos para el gráfico:", error)
      setError(error.message || "No se pudieron cargar los datos para el gráfico")
    } finally {
      setIsLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
    } catch (e) {
      return dateString
    }
  }

  const prepareChartData = (rabbitData, weighingData) => {
    if (!rabbitData) {
      console.error("No hay datos del conejo para preparar el gráfico")
      setChartData({ points: [], minWeight: 0, maxWeight: 0, labels: [] })
      return
    }

    console.log("Preparando datos del gráfico con:", { rabbitData, weighingData })

    // Create arrays for data points and labels
    const points = []
    const labels = []
    const weights = []

    // Extraer propiedades del conejo con verificación
    // Buscar las propiedades en diferentes formatos posibles
    const getPesoInicial = () => {
      const posiblesPropiedades = ["peso_inicial", "pesoInicial", "peso inicial", "initial_weight"]
      for (const prop of posiblesPropiedades) {
        if (rabbitData[prop] !== undefined && rabbitData[prop] !== null) {
          return Number.parseFloat(rabbitData[prop])
        }
      }
      console.warn("No se encontró la propiedad peso_inicial en los datos del conejo")
      return 0
    }

    const getPesoActual = () => {
      const posiblesPropiedades = ["peso_actual", "pesoActual", "peso actual", "current_weight"]
      for (const prop of posiblesPropiedades) {
        if (rabbitData[prop] !== undefined && rabbitData[prop] !== null) {
          return Number.parseFloat(rabbitData[prop])
        }
      }
      console.warn("No se encontró la propiedad peso_actual en los datos del conejo")
      return 0
    }

    const getFechaRegistro = () => {
      const posiblesPropiedades = ["fecha_registro", "fechaRegistro", "fecha registro", "registration_date"]
      for (const prop of posiblesPropiedades) {
        if (rabbitData[prop] !== undefined && rabbitData[prop] !== null) {
          return rabbitData[prop]
        }
      }
      console.warn("No se encontró la propiedad fecha_registro en los datos del conejo")
      return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días atrás como fallback
    }

    const initialWeight = getPesoInicial()
    const currentWeight = getPesoActual()
    const registrationDate = getFechaRegistro()

    console.log("Valores extraídos:", { initialWeight, currentWeight, registrationDate })

    // Verificar si hay registros de pesaje
    if (weighingData && weighingData.length > 0) {
      // CASO 1: El conejo tiene registros de pesaje
      console.log("Usando registros de pesaje para el gráfico")

      // Add initial weight as first data point
      points.push({
        date: new Date(registrationDate),
        weight: initialWeight,
        label: formatDate(registrationDate),
      })
      labels.push(formatDate(registrationDate))
      weights.push(initialWeight)

      // Sort weighing data by date
      const sortedData = [...weighingData].sort(
        (a, b) => new Date(a.fecha_weighing || a.created_at) - new Date(b.fecha_weighing || b.created_at),
      )

      // Add each weighing record
      sortedData.forEach((record) => {
        const recordWeight = Number.parseFloat(record.peso_actual || record.peso || 0)
        const recordDate = record.fecha_weighing || record.created_at

        points.push({
          date: new Date(recordDate),
          weight: recordWeight,
          label: formatDate(recordDate),
        })
        labels.push(formatDate(recordDate))
        weights.push(recordWeight)
      })
    } else {
      // CASO 2: El conejo NO tiene registros de pesaje
      console.log("No hay registros de pesaje, usando datos básicos del conejo")

      // Añadir el peso inicial con la fecha de registro
      points.push({
        date: new Date(registrationDate),
        weight: initialWeight,
        label: formatDate(registrationDate),
      })
      labels.push(formatDate(registrationDate))
      weights.push(initialWeight)

      // Añadir el peso actual con la fecha actual real (hoy)
      points.push({
        date: currentDate,
        weight: currentWeight,
        label: formatDate(currentDate.toISOString()),
      })
      labels.push(formatDate(currentDate.toISOString()))
      weights.push(currentWeight)
    }

    console.log("Puntos generados para el gráfico:", points)
    console.log("Pesos para el gráfico:", weights)

    // Verificar que tenemos pesos válidos
    if (weights.length === 0 || weights.every((w) => w === 0 || isNaN(w))) {
      console.error("Datos de peso inválidos:", weights)
      setChartData({ points: [], minWeight: 0, maxWeight: 0, labels: [] })
      setError("Datos de peso inválidos")
      return
    }

    // Calculate min and max weight for scaling
    const validWeights = weights.filter((w) => !isNaN(w) && w > 0)
    if (validWeights.length === 0) {
      console.error("No hay pesos válidos para el gráfico")
      setChartData({ points: [], minWeight: 0, maxWeight: 0, labels: [] })
      setError("No hay pesos válidos para el gráfico")
      return
    }

    const minActual = Math.min(...validWeights)
    const maxActual = Math.max(...validWeights)

    console.log("Rango de pesos:", { minActual, maxActual })

    // Crear un rango que comience desde 0 o un valor menor al mínimo
    // y termine en un valor mayor al máximo para evitar que los puntos
    // toquen los bordes del gráfico
    const minWeight = Math.max(0, Math.floor(minActual) - 1)
    const maxWeight = Math.ceil(maxActual) + 1

    // Asegurarnos de que minWeight y maxWeight sean diferentes para evitar divisiones por cero
    const finalMaxWeight = minWeight === maxWeight ? minWeight + 2 : maxWeight

    console.log("Rango final para el gráfico:", { minWeight, maxWeight: finalMaxWeight })

    setChartData({
      points,
      minWeight,
      maxWeight: finalMaxWeight,
      labels,
    })
  }

  // Generate SVG path for the line chart
  const generatePath = () => {
    if (!chartData.points.length) {
      console.warn("No hay puntos para generar el path del gráfico")
      return ""
    }

    const { points, minWeight, maxWeight } = chartData
    const width = 1000
    const height = 600
    const padding = { top: 60, right: 100, bottom: 120, left: 100 }

    // Verificar que tenemos un rango válido para evitar divisiones por cero
    if (maxWeight === minWeight) {
      console.error("Rango de peso inválido (min === max):", { minWeight, maxWeight })
      return ""
    }

    // Calculate x and y positions
    const pathPoints = points.map((point, index) => {
      const x = padding.left + (index / Math.max(1, points.length - 1)) * (width - padding.left - padding.right)

      // Correct y-axis calculation (smaller values at bottom, larger at top)
      const y =
        height -
        padding.bottom -
        ((point.weight - minWeight) / (maxWeight - minWeight)) * (height - padding.top - padding.bottom)

      return { x, y, weight: point.weight, label: point.label }
    })

    console.log("Puntos calculados para el path:", pathPoints)

    // Generate SVG path
    return pathPoints
      .map((point, index) => {
        return index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`
      })
      .join(" ")
  }

  // Generar path para el área bajo la curva
  const generateAreaPath = () => {
    if (!chartData.points.length) return ""

    const { points, minWeight, maxWeight } = chartData
    const width = 1000
    const height = 600
    const padding = { top: 60, right: 100, bottom: 120, left: 100 }
    const baseline = height - padding.bottom // Línea base para el área

    // Verificar que tenemos un rango válido para evitar divisiones por cero
    if (maxWeight === minWeight) return ""

    // Calculate x and y positions
    const pathPoints = points.map((point, index) => {
      const x = padding.left + (index / Math.max(1, points.length - 1)) * (width - padding.left - padding.right)
      const y =
        height -
        padding.bottom -
        ((point.weight - minWeight) / (maxWeight - minWeight)) * (height - padding.top - padding.bottom)
      return { x, y }
    })

    // Generate area path (line + bottom border + back to start)
    let path = pathPoints
      .map((point, index) => (index === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`))
      .join(" ")

    // Add bottom line and close path
    path += ` L ${pathPoints[pathPoints.length - 1].x},${baseline} L ${pathPoints[0].x},${baseline} Z`

    return path
  }

  const generateYAxisLabels = () => {
    const { minWeight, maxWeight } = chartData

    // Asegurarnos de que minWeight y maxWeight sean enteros
    const minInt = Math.floor(minWeight)
    const maxInt = Math.ceil(maxWeight)

    // Calcular el rango de valores enteros
    const range = maxInt - minInt

    // Determinar cuántas divisiones necesitamos (entre 5-7 es un buen número)
    let divisions = Math.min(range + 1, 6)

    // Si el rango es muy pequeño, asegurar al menos 2 divisiones
    divisions = Math.max(divisions, 2)

    // Calcular el paso entre valores
    const step = Math.ceil(range / (divisions - 1))

    // Generar valores enteros desde el mínimo hasta el máximo
    const values = []
    for (let i = 0; i < divisions; i++) {
      const value = minInt + i * step
      if (value <= maxInt) {
        values.push(value)
      }
    }

    // Asegurarnos de incluir el valor máximo si no está ya incluido
    if (values[values.length - 1] < maxInt) {
      values.push(maxInt)
    }

    // Invertir el orden para que los valores más pequeños estén abajo
    return values.reverse()
  }

  // Función segura para calcular la posición Y de los puntos
  const calculateYPosition = (weight) => {
    const { minWeight, maxWeight } = chartData

    // Verificar que tenemos valores válidos
    if (isNaN(weight) || isNaN(minWeight) || isNaN(maxWeight) || maxWeight === minWeight) {
      console.error("Valores inválidos para calcular posición Y:", { weight, minWeight, maxWeight })
      return 0 // Valor predeterminado seguro
    }

    return 600 - 120 - ((weight - minWeight) / (maxWeight - minWeight)) * (600 - 180)
  }

  // Calcular el porcentaje de ganancia de peso
  const calculateGrowthPercentage = () => {
    if (!rabbitInfo || !rabbitInfo.peso_inicial || !rabbitInfo.peso_actual) return 0

    const initialWeight = Number.parseFloat(rabbitInfo.peso_inicial)
    const currentWeight = Number.parseFloat(rabbitInfo.peso_actual)

    if (initialWeight === 0) return 0

    return ((currentWeight - initialWeight) / initialWeight) * 100
  }

  // Calcular la tasa de crecimiento diario promedio
  const calculateDailyGrowthRate = () => {
    if (!rabbitInfo || !rabbitInfo.peso_inicial || !rabbitInfo.peso_actual || !rabbitInfo.fecha_registro) return 0

    const initialWeight = Number.parseFloat(rabbitInfo.peso_inicial)
    const currentWeight = Number.parseFloat(rabbitInfo.peso_actual)
    const registrationDate = new Date(rabbitInfo.fecha_registro)
    const today = new Date()

    // Calcular días transcurridos
    const daysDiff = Math.max(1, Math.floor((today - registrationDate) / (1000 * 60 * 60 * 24)))

    // Calcular ganancia diaria promedio
    return (currentWeight - initialWeight) / daysDiff
  }

  // Renderizar el gráfico SVG mejorado
  const renderEnhancedChart = () => {
    if (!chartData.points.length) {
      return (
        <div className="flex flex-col justify-center items-center h-64 bg-gray-100 rounded-lg shadow-inner">
          <p className="text-gray-500 mb-4 font-medium">No hay datos suficientes para mostrar el gráfico</p>
          <Button onClick={useDemoData} variant="outline" size="sm" className="bg-white hover:bg-gray-50">
            Usar datos de demostración
          </Button>
        </div>
      )
    }

    return (
      <div className="h-[600px] w-full relative bg-white overflow-x-auto rounded-lg shadow-sm border border-gray-100">
        <svg width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
          {/* Fondo del gráfico */}
          <rect x="100" y="60" width="800" height="420" fill="#f9fafb" rx="4" />

          {/* Horizontal grid lines */}
          {generateYAxisLabels().map((weight, i) => {
            // Calcular la posición Y correcta (valores más pequeños abajo)
            const y = 60 + (i * (600 - 180)) / Math.max(1, generateYAxisLabels().length - 1)
            return (
              <g key={`grid-h-${i}`}>
                <line
                  x1="100"
                  y1={y}
                  x2="900"
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray={i > 0 && i < generateYAxisLabels().length - 1 ? "4 4" : ""}
                />
                <text x="90" y={y + 5} textAnchor="end" fontSize="14" fontWeight="500" fill={colors.textLight}>
                  {weight}
                </text>
              </g>
            )
          })}

          {/* Vertical grid lines and X-axis labels */}
          {chartData.labels.map((label, i) => {
            const x = 100 + (i * (1000 - 200)) / Math.max(1, chartData.labels.length - 1)
            return (
              <g key={`grid-v-${i}`}>
                <line
                  x1={x}
                  y1="60"
                  x2={x}
                  y2="480"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray={i > 0 && i < chartData.labels.length - 1 ? "4 4" : ""}
                />
                <text x={x} y="520" textAnchor="middle" fontSize="14" fontWeight="500" fill={colors.textLight}>
                  {label}
                </text>
              </g>
            )
          })}

          {/* Área bajo la curva */}
          <path d={generateAreaPath()} fill={`url(#areaGradient)`} opacity="0.2" />

          {/* Definir gradientes */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
              <stop offset="100%" stopColor={colors.primary} stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.primaryLight} />
              <stop offset="100%" stopColor={colors.primary} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Line chart */}
          <path
            d={generatePath()}
            fill="none"
            stroke={`url(#lineGradient)`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Data points with values */}
          {chartData.points.map((point, index) => {
            const x = 100 + (index * (1000 - 200)) / Math.max(1, chartData.points.length - 1)

            // Usar la función segura para calcular la posición Y
            const y = calculateYPosition(point.weight)

            // Solo renderizar si tenemos valores válidos
            if (isNaN(x) || isNaN(y)) {
              console.error("Coordenadas inválidas para punto:", { x, y, point })
              return null
            }

            return (
              <g key={`point-${index}`}>
                {/* Círculo exterior (halo) */}
                <circle cx={x} cy={y} r="10" fill="white" opacity="0.6" />

                {/* Círculo principal */}
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill={
                    index === 0
                      ? colors.secondary
                      : index === chartData.points.length - 1
                        ? colors.accent
                        : colors.primary
                  }
                  stroke="white"
                  strokeWidth="2"
                />

                {/* Etiqueta de peso */}
                <text
                  x={x}
                  y={y - 15}
                  textAnchor="middle"
                  fontSize="15"
                  fill={
                    index === 0
                      ? colors.secondary
                      : index === chartData.points.length - 1
                        ? colors.accent
                        : colors.primary
                  }
                  fontWeight="bold"
                  stroke="#ffffff"
                  strokeWidth="3"
                  paintOrder="stroke"
                >
                  {point.weight} g
                </text>
                <title>{`${point.label}: ${point.weight} g`}</title>
              </g>
            )
          })}

          {/* Axis labels */}
          <text x="500" y="560" textAnchor="middle" fontSize="18" fontWeight="bold" fill={colors.text}>
            Fecha
          </text>
          <text
            x="30"
            y="300"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            fill={colors.text}
            transform="rotate(-90, 30, 300)"
          >
            Peso (g)
          </text>

          {/* Legend */}
          <rect x="820" y="30" width="20" height="4" rx="2" fill={`url(#lineGradient)`} />
          <text x="850" y="35" fontSize="14" fill={colors.text} fontWeight="500">
            Evolución de peso
          </text>
        </svg>
      </div>
    )
  }

  // Componente para mostrar los datos crudos (para depuración)
  const renderRawData = () => {
    if (!rawData) return null

    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto max-h-[200px]">
        <h4 className="font-bold mb-2">Datos crudos (depuración):</h4>
        <pre className="text-xs">{JSON.stringify(rawData, null, 2)}</pre>
      </div>
    )
  }

  // Renderizar tarjetas de estadísticas mejoradas
  const renderEnhancedStats = () => {
    if (!rabbitInfo) return null

    const initialWeight = rabbitInfo.peso_inicial ? Number.parseFloat(rabbitInfo.peso_inicial) : 0
    const currentWeight = rabbitInfo.peso_actual ? Number.parseFloat(rabbitInfo.peso_actual) : 0
    const weightGain = currentWeight - initialWeight
    const growthPercentage = calculateGrowthPercentage()
    const dailyGrowthRate = calculateDailyGrowthRate()

    return (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-indigo-900 mb-1">Peso Inicial</h3>
                <p className="text-3xl font-bold text-indigo-700">{initialWeight.toFixed(2)} g</p>
                <p className="text-sm text-indigo-500 mt-1">Registrado el {formatDate(rabbitInfo.fecha_registro)}</p>
              </div>
              <div className="bg-indigo-100 p-2 rounded-full">
                <Scale className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-orange-900 mb-1">Peso Actual</h3>
                <p className="text-3xl font-bold text-orange-700">{currentWeight.toFixed(2)} g</p>
                <p className="text-sm text-orange-500 mt-1">Último registro de peso</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                <Scale className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-1">Ganancia Total</h3>
                <p className="text-3xl font-bold text-emerald-700">{weightGain.toFixed(2)} g</p>
                <p className="text-sm text-emerald-500 mt-1">{growthPercentage.toFixed(1)}% de incremento</p>
              </div>
              <div className="bg-emerald-100 p-2 rounded-full">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">Crecimiento Diario</h3>
                <p className="text-3xl font-bold text-blue-700">{dailyGrowthRate.toFixed(3)} g</p>
                <p className="text-sm text-blue-500 mt-1">Promedio por día</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mensaje informativo cuando no hay registros de pesaje */}
        {weighingData.length === 0 && (
          <div className="col-span-1 md:col-span-2 mt-2 p-4 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 text-sm">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>Este conejo no tiene registros de pesaje adicionales. El gráfico muestra el peso inicial y actual.</p>
            </div>
          </div>
        )}

        {/* Insignia de rendimiento */}
        {weightGain > 0 && (
          <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full flex items-center shadow-md">
              <Award className="h-6 w-6 mr-2" />
              <span>
                {growthPercentage > 100
                  ? "¡Crecimiento excepcional!"
                  : growthPercentage > 50
                    ? "¡Buen crecimiento!"
                    : "Crecimiento normal"}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-auto bg-white">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-center text-indigo-900">
            {rabbitInfo ? (
              <span className="flex items-center justify-center">
                <span>{rabbitInfo.name_rabbit}</span>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full ml-2">
                  Ciclo de Crecimiento
                </span>
              </span>
            ) : (
              "Ciclo de Crecimiento"
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
              <span className="text-gray-600 font-medium">Cargando datos del conejo...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center bg-red-50 rounded-lg p-6">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <div className="text-red-600 mb-6 font-medium">{error}</div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleRetry}
                  className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reintentar
                </Button>
                <Button onClick={useDemoData} variant="default" className="bg-indigo-600 hover:bg-indigo-700">
                  Usar datos de demostración
                </Button>
              </div>
            </div>
          ) : !rabbitInfo ? (
            <div className="text-center text-red-600 p-6 bg-red-50 rounded-lg">
              <p className="mb-4 font-medium">No se pudo cargar la información del conejo</p>
              <Button onClick={useDemoData} variant="default" className="bg-indigo-600 hover:bg-indigo-700">
                Usar datos de demostración
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Evolución de Peso</h2>
                <p className="text-gray-500 text-sm">Seguimiento del crecimiento a lo largo del tiempo</p>
              </div>

              {/* Gráfico mejorado */}
              {renderEnhancedChart()}

              {/* Estadísticas mejoradas */}
              {renderEnhancedStats()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
