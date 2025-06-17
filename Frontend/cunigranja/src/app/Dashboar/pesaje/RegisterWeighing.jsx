"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useState, useEffect } from "react"
import AlertModal from "@/components/utils/AlertModal"

const RegisterWeighing = ({ refreshData, onCloseForm }) => {
  const [fecha_weighing, setFechaWeighing] = useState("")
  const [ganancia_peso, setGananciaPeso] = useState("")
  const [id_rabbit, setIdRabbit] = useState("")
  const [peso_actual, setPesoActual] = useState("")
  const [id_user, setIdUser] = useState("")
  const [rabbit, setRabbit] = useState([])
  const [selectedRabbitData, setSelectedRabbitData] = useState(null)
  const [users, setUsers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [rabbitRes, userRes] = await Promise.all([
          axiosInstance.get("/Api/Rabbit/GetRabbit"),
          axiosInstance.get("/Api/User/AllUser"),
        ])

        // Filtrar solo conejos ACTIVOS
        const allRabbits = rabbitRes.data || []
        const activeRabbits = allRabbits.filter((rabbit) => rabbit.estado === "Activo" || rabbit.estado === "activo")

        console.log("Conejos totales:", allRabbits.length, "Conejos activos:", activeRabbits.length)
        console.log(
          "Conejos activos filtrados:",
          activeRabbits.map((r) => ({
            id: r.id_rabbit || r.Id_rabbit,
            name: r.name_rabbit,
            estado: r.estado,
          })),
        )

        setRabbit(activeRabbits)

        // Filtrar solo usuarios activos (blockard = 0 o estado != "Inactivo")
        const allUsers = userRes.data || []
        const activeUsers = allUsers.filter(
          (user) =>
            (user.blockard === 0 || user.blockard === undefined || user.blockard === null) &&
            user.estado !== "Inactivo",
        )
        console.log("Usuarios totales:", allUsers.length, "Usuarios activos:", activeUsers.length)
        setUsers(activeUsers)
      } catch (error) {
        console.error("Error al obtener datos:", error)
        setErrorMessage("Error al cargar los datos")
        setShowErrorAlert(true)
      }
    }
    fetchData()
  }, [])

  // When rabbit selection changes, fetch the rabbit data to get peso_inicial
  useEffect(() => {
    async function fetchRabbitData() {
      if (!id_rabbit) {
        setSelectedRabbitData(null)
        setPesoActual("")
        setGananciaPeso("")
        return
      }

      try {
        // Importante: Asegurarse de que el ID sea un número entero
        const rabbitId = Number.parseInt(id_rabbit, 10)

        if (isNaN(rabbitId)) {
          console.error("ID de conejo inválido:", id_rabbit)
          setErrorMessage("ID de conejo inválido")
          setShowErrorAlert(true)
          return
        }

        // Añadir un parámetro de timestamp para evitar caché
        const timestamp = new Date().getTime()

        // Usar el formato correcto para el endpoint: id=123 (sin llaves)
        const response = await axiosInstance.get(`/Api/Rabbit/ConsultRabbit?id=${rabbitId}&_t=${timestamp}`)

        if (response.status === 200) {
          const rabbitData = response.data
          console.log("Datos del conejo seleccionado:", rabbitData)

          // Verificar que el conejo sigue siendo activo
          if (rabbitData.estado !== "Activo" && rabbitData.estado !== "activo") {
            setErrorMessage("No se puede registrar pesaje para un conejo inactivo")
            setShowErrorAlert(true)
            setIdRabbit("") // Limpiar la selección
            setSelectedRabbitData(null)
            return
          }

          setSelectedRabbitData(rabbitData)
          // Clear the current weight input to force user to enter new measurement
          setPesoActual("")
          setGananciaPeso("")
        }
      } catch (error) {
        console.error("Error al obtener datos del conejo:", error)
        // Mostrar información más detallada sobre el error
        if (error.response) {
          console.log("Detalles del error:", error.response.data)

          // Si hay errores específicos de validación, mostrarlos
          if (error.response.data && error.response.data.errors) {
            const errorDetails = JSON.stringify(error.response.data.errors)
            setErrorMessage(`Error de validación: ${errorDetails}`)
            setShowErrorAlert(true)
          } else {
            setErrorMessage(`Error al obtener datos del conejo: ${error.response.status} ${error.response.statusText}`)
            setShowErrorAlert(true)
          }
        } else {
          setErrorMessage(`Error al obtener datos del conejo: ${error.message}`)
          setShowErrorAlert(true)
        }
      }
    }

    fetchRabbitData()
  }, [id_rabbit])

  // Calculate weight gain correctly when peso_actual changes
  useEffect(() => {
    if (selectedRabbitData && peso_actual) {
      const currentWeight = Number.parseFloat(peso_actual)
      const lastWeight = Number.parseFloat(selectedRabbitData.peso_actual)

      // Calculate the weight gain as current measured weight - last recorded weight
      const weightGain = currentWeight - lastWeight

      // Update the ganancia_peso field with the current gain
      setGananciaPeso(weightGain.toFixed(2))
      setIsCalculating(false)

      // Add debug information
      console.log("Cálculo de ganancia:", {
        pesoMedidoActual: currentWeight,
        pesoActualAnterior: lastWeight,
        gananciaCalculada: weightGain,
      })
    }
  }, [selectedRabbitData, peso_actual])

  // Función para verificar si el peso actual del conejo se actualizó correctamente
  async function verifyRabbitUpdate(rabbitId) {
    try {
      const timestamp = new Date().getTime()
      // Asegurarse de que el ID sea un número entero
      const numericId = Number.parseInt(rabbitId, 10)

      if (isNaN(numericId)) {
        console.error("ID de conejo inválido para verificación:", rabbitId)
        return null
      }

      const response = await axiosInstance.get(`/Api/Rabbit/ConsultRabbit?id=${numericId}&_t=${timestamp}`)
      if (response.status === 200) {
        const updatedRabbit = response.data
        console.log("Datos del conejo después de la actualización:", updatedRabbit)
        return updatedRabbit
      }
    } catch (error) {
      console.error("Error al verificar la actualización del conejo:", error)
      return null
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    // Validate form data
    if (!fecha_weighing || !id_rabbit || !id_user || !peso_actual) {
      setErrorMessage("Todos los campos son obligatorios")
      setShowErrorAlert(true)
      return
    }

    // Verificación adicional: asegurar que el conejo seleccionado sigue siendo activo
    if (!selectedRabbitData || (selectedRabbitData.estado !== "Activo" && selectedRabbitData.estado !== "activo")) {
      setErrorMessage("No se puede registrar pesaje para un conejo inactivo")
      setShowErrorAlert(true)
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")
    setDebugInfo("")

    try {
      // Obtener los datos más recientes del conejo antes de actualizar
      const timestamp = new Date().getTime()
      // Asegurarse de que el ID sea un número entero
      const rabbitId = Number.parseInt(id_rabbit, 10)

      if (isNaN(rabbitId)) {
        throw new Error("ID de conejo inválido")
      }

      const rabbitResponse = await axiosInstance.get(`/Api/Rabbit/ConsultRabbit?id=${rabbitId}&_t=${timestamp}`)
      const freshRabbitData = rabbitResponse.data

      // Verificación final: el conejo debe estar activo
      if (freshRabbitData.estado !== "Activo" && freshRabbitData.estado !== "activo") {
        throw new Error("El conejo seleccionado ya no está activo. No se puede registrar el pesaje.")
      }

      console.log("Datos frescos del conejo antes de actualizar:", freshRabbitData)
      let debugText = `Peso actual antes de actualizar: ${freshRabbitData.peso_actual}\n`

      // Calcular la ganancia de peso correctamente
      const currentMeasuredWeight = Number.parseFloat(peso_actual)
      const lastRecordedWeight = Number.parseFloat(freshRabbitData.peso_actual)
      const calculatedGain = currentMeasuredWeight - lastRecordedWeight

      debugText += `Ganancia calculada: ${calculatedGain} (${currentMeasuredWeight} - ${lastRecordedWeight})\n`

      // Determinar si la ganancia es positiva o negativa
      const isPositiveGain = calculatedGain >= 0

      debugText += `Ganancia ${isPositiveGain ? "positiva" : "negativa"} detectada.\n`
      debugText += `Peso medido que se registrará: ${currentMeasuredWeight}\n`
      debugText += `Ganancia que se registrará: ${calculatedGain}\n`

      if (!isPositiveGain) {
        debugText += `⚠️ Como la ganancia es negativa, el peso acumulado del conejo se mantendrá en: ${lastRecordedWeight}\n`
      } else {
        debugText += `✅ Como la ganancia es positiva, el peso acumulado del conejo se actualizará a: ${currentMeasuredWeight}\n`
      }

      // Crear el registro de pesaje con los datos correctos
      const weighingData = {
        Id_weighing: 0,
        fecha_weighing: new Date(fecha_weighing).toISOString(),
        peso_actual: currentMeasuredWeight, // SIEMPRE enviar el peso medido actual
        ganancia_peso: calculatedGain, // La ganancia calculada (puede ser negativa)
        Id_rabbit: rabbitId,
        Id_user: Number.parseInt(id_user, 10) || 0,
        // Agregar un flag para indicar si debe actualizar el peso acumulado del conejo
        actualizar_peso_conejo: isPositiveGain,
      }

      console.log("Enviando datos de pesaje:", weighingData)
      debugText += `Enviando peso medido: ${weighingData.peso_actual}, ganancia: ${weighingData.ganancia_peso}\n`

      // Llamar al endpoint normal de creación de pesaje
      // El servicio actualizado se encargará de calcular correctamente la ganancia
      // y actualizar el peso del conejo
      const response = await axiosInstance.post("/Api/weighing/CreateWeighing", weighingData)

      if (response.status === 200) {
        debugText += `Registro de pesaje creado con éxito.\n`

        // Verificar si la actualización se realizó correctamente
        setTimeout(async () => {
          const verifiedRabbit = await verifyRabbitUpdate(id_rabbit)
          if (verifiedRabbit) {
            debugText += `Verificación: Peso actual después de actualizar: ${verifiedRabbit.peso_actual}\n`
            const expectedWeight = isPositiveGain ? currentMeasuredWeight : lastRecordedWeight
            if (Math.abs(verifiedRabbit.peso_actual - expectedWeight) < 0.01) {
              debugText += `✅ La actualización se realizó correctamente.\n`
            } else {
              debugText += `❌ La actualización NO se realizó correctamente. El peso actual debería ser ${expectedWeight} pero es ${verifiedRabbit.peso_actual}\n`
            }
            setDebugInfo(debugText)
          }
        }, 1000)

        setSuccessMessage("Pesaje registrado con éxito y peso del conejo actualizado")
        setShowSuccessAlert(true)

        // Reset form
        setFechaWeighing("")
        setGananciaPeso("")
        setIdRabbit("")
        setPesoActual("")
        setIdUser("")
        setSelectedRabbitData(null)

        // Refresh the data in the parent component
        if (typeof refreshData === "function") {
          setTimeout(() => {
            refreshData()
          }, 1500)
        }
      }
    } catch (error) {
      console.error("Error completo:", error)
      let errorMsg = error.response?.data?.message || error.message || "Error al registrar pesaje"

      // Añadir detalles adicionales si están disponibles
      if (error.response?.data) {
        console.log("Detalles completos del error:", error.response.data)
        errorMsg += ` (${JSON.stringify(error.response.data)})`
      }

      setErrorMessage(errorMsg)
      setShowErrorAlert(true)
      setDebugInfo(`Error: ${errorMsg}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)

    // Refresh data in parent component if successful
    if (typeof refreshData === "function") {
      refreshData()
    }

    // Close the form
    if (typeof onCloseForm === "function") {
      onCloseForm()
    }
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
  }

  return (
    <>
      {/* Alerta de éxito */}
      <AlertModal type="success" message={successMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />

      {/* Alerta de error */}
      <AlertModal type="error" message={errorMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto border border-gray-400 relative"
      >
        <h2 className="text-xl font-bold text-center mb-6">Registrar Pesaje</h2>

        {debugInfo && (
          <div className="mb-4 p-3 bg-gray-100 rounded text-xs font-mono whitespace-pre-wrap">
            <h3 className="font-bold mb-1">Información de depuración:</h3>
            {debugInfo}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Conejo: <span className="text-red-500">*</span>
            </label>
            <select
              value={id_rabbit}
              onChange={(e) => setIdRabbit(e.target.value)}
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
            >
              <option value="">Seleccione un conejo activo</option>
              {rabbit.length === 0 ? (
                <option value="" disabled>
                  No hay conejos activos disponibles
                </option>
              ) : (
                rabbit.map((r) => (
                  <option key={r.id_rabbit || r.Id_rabbit} value={r.id_rabbit || r.Id_rabbit}>
                    {r.name_rabbit} (Activo)
                  </option>
                ))
              )}
            </select>
            <small className="text-gray-500 text-xs">Solo se muestran conejos con estado activo</small>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Fecha del Pesaje:</label>
            <input
              type="datetime-local"
              value={fecha_weighing}
              onChange={(e) => setFechaWeighing(e.target.value)}
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Peso actual medido (g):</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={peso_actual}
              onChange={(e) => {
                const value = e.target.value
                // Solo permitir números positivos o cero
                if (value === "" || Number.parseFloat(value) >= 0) {
                  setPesoActual(value)
                  setIsCalculating(true)
                }
              }}
              onKeyDown={(e) => {
                // Prevenir el signo menos
                if (e.key === "-" || e.key === "e" || e.key === "E") {
                  e.preventDefault()
                }
              }}
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Ganancia de Peso (g):</label>
            <input
              type="number"
              step="0.01"
              value={ganancia_peso}
              readOnly
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Responsable:</label>
            <select
              value={id_user}
              onChange={(e) => setIdUser(e.target.value)}
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
            >
              <option value="">Seleccione</option>
              {users.map((u) => (
                <option key={u.id_user || u.Id_user} value={u.id_user || u.Id_user}>
                  {u.name_user}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedRabbitData && (
          <div className="mb-4 text-xs text-gray-600 border-t pt-2">
            <p>Información del conejo seleccionado:</p>
            <p>
              Estado: <span className="text-green-600 font-semibold">{selectedRabbitData.estado}</span>
            </p>
            <p>Peso inicial: {selectedRabbitData.peso_inicial} g</p>
            <p>Peso actual acumulado: {selectedRabbitData.peso_actual} g</p>
            {peso_actual && (
              <div>
                <p
                  className={`font-semibold ${Number.parseFloat(ganancia_peso) >= 0 ? "text-blue-600" : "text-orange-600"}`}
                >
                  Ganancia calculada: {ganancia_peso} g (diferencia entre el peso medido y el peso actual acumulado)
                </p>
                {Number.parseFloat(ganancia_peso) < 0 && (
                  <p className="text-orange-600 text-xs mt-1 font-medium">
                    ⚠️ Ganancia negativa detectada. El peso acumulado del conejo no se reducirá para preservar el
                    historial de crecimiento.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className={`font-semibold py-3 px-6 rounded-lg transition-colors w-full ${
              isSubmitting || rabbit.length === 0
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-600"
            }`}
            disabled={isSubmitting || rabbit.length === 0}
          >
            {isSubmitting ? "Registrando..." : rabbit.length === 0 ? "No hay conejos activos" : "Registrar Pesaje"}
          </button>
        </div>
      </form>
    </>
  )
}

export default RegisterWeighing
