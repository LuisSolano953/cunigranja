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

  // Estados para validación de fechas
  const [minAllowedDate, setMinAllowedDate] = useState("")
  const [rabbitWeighingHistory, setRabbitWeighingHistory] = useState([])
  const [isFirstWeighing, setIsFirstWeighing] = useState(true)
  const [lastWeighingDate, setLastWeighingDate] = useState(null)

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

  // FUNCIÓN CORREGIDA: Obtener historial y establecer fecha mínima basada en el ÚLTIMO REGISTRO
  async function fetchRabbitWeighingHistory(rabbitId) {
    try {
      console.log(`🔍 Buscando historial de pesajes para conejo ID: ${rabbitId}`)

      let weighings = []

      // Intentar primero el endpoint específico por conejo
      try {
        const response = await axiosInstance.get(`/Api/weighing/GetWeighingByRabbit?rabbitId=${rabbitId}`)
        if (response.status === 200) {
          weighings = response.data || []
          console.log(`✅ Endpoint específico funcionó - encontrados ${weighings.length} registros`)
        }
      } catch (specificError) {
        console.log("⚠️ Endpoint específico falló, intentando endpoint general...")

        // Si falla, usar el endpoint general y filtrar
        try {
          const response = await axiosInstance.get("/Api/weighing/GetWeighing")
          if (response.status === 200) {
            const allWeighings = response.data || []
            // Filtrar por el ID del conejo (verificar ambos formatos de ID)
            weighings = allWeighings.filter(
              (w) =>
                w.Id_rabbit === rabbitId ||
                w.id_rabbit === rabbitId ||
                w.Id_rabbit === Number.parseInt(rabbitId) ||
                w.id_rabbit === Number.parseInt(rabbitId),
            )
            console.log(`✅ Endpoint general funcionó - total: ${allWeighings.length}, filtrados: ${weighings.length}`)
          }
        } catch (generalError) {
          console.error("❌ Ambos endpoints fallaron:", generalError)
          weighings = []
        }
      }

      console.log(`📊 Registros encontrados para conejo ${rabbitId}:`, weighings)

      setRabbitWeighingHistory(weighings)

      if (weighings.length === 0) {
        // Es el primer pesaje, no hay restricciones de fecha
        setIsFirstWeighing(true)
        setMinAllowedDate("")
        setLastWeighingDate(null)
        console.log("🆕 Es el primer pesaje de este conejo - sin restricciones de fecha")
      } else {
        // Ya hay pesajes, encontrar la fecha MÁS RECIENTE (último registro)
        setIsFirstWeighing(false)

        // Ordenar por fecha para encontrar el ÚLTIMO registro (más reciente)
        const sortedWeighings = weighings.sort((a, b) => {
          const dateA = new Date(a.fecha_weighing)
          const dateB = new Date(b.fecha_weighing)
          return dateB - dateA // Orden descendente (más reciente primero)
        })

        const lastWeighingRecord = sortedWeighings[0] // El más reciente
        const lastWeighingDate = new Date(lastWeighingRecord.fecha_weighing)

        setLastWeighingDate(lastWeighingDate)

        console.log(`📅 ÚLTIMO registro encontrado:`, lastWeighingRecord)
        console.log(`📅 Fecha del ÚLTIMO pesaje:`, lastWeighingDate)

        // Formatear la fecha para el input datetime-local (YYYY-MM-DDTHH:MM)
        const minDate = lastWeighingDate.toISOString().slice(0, 16)
        setMinAllowedDate(minDate)

        console.log(`🚫 Fecha mínima permitida establecida: ${minDate}`)
        console.log(`📈 Total de registros previos: ${weighings.length}`)
        console.log(
          `🔄 El próximo registro (${weighings.length + 1}) debe ser posterior a: ${lastWeighingDate.toLocaleString("es-ES")}`,
        )
      }
    } catch (error) {
      console.error("❌ Error al obtener historial de pesajes:", error)
      // Si hay error, asumir que es el primer pesaje
      setIsFirstWeighing(true)
      setMinAllowedDate("")
      setLastWeighingDate(null)
      setRabbitWeighingHistory([])
    }
  }

  // When rabbit selection changes, fetch the rabbit data to get peso_inicial
  useEffect(() => {
    async function fetchRabbitData() {
      if (!id_rabbit) {
        setSelectedRabbitData(null)
        setPesoActual("")
        setGananciaPeso("")
        // Limpiar datos de validación de fechas
        setMinAllowedDate("")
        setRabbitWeighingHistory([])
        setIsFirstWeighing(true)
        setLastWeighingDate(null)
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

        // Obtener historial de pesajes antes de obtener datos del conejo
        await fetchRabbitWeighingHistory(rabbitId)

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

  // Función para validar fecha seleccionada
  const validateSelectedDate = (selectedDate) => {
    if (!selectedDate) return true // Si no hay fecha, no validar aún

    if (isFirstWeighing) return true // Si es el primer pesaje, cualquier fecha es válida

    if (!minAllowedDate) return true // Si no hay fecha mínima, permitir

    const selected = new Date(selectedDate)
    const minDate = new Date(minAllowedDate)

    return selected >= minDate
  }

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

    // VALIDACIÓN MEJORADA: Verificar que la fecha sea posterior al ÚLTIMO REGISTRO
    if (!isFirstWeighing && !validateSelectedDate(fecha_weighing)) {
      const lastDateFormatted = lastWeighingDate.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })

      const selectedDateFormatted = new Date(fecha_weighing).toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })

      setErrorMessage(
        `❌ FECHA INVÁLIDA - CRONOLOGÍA INCORRECTA:\n\n` +
          `📅 Fecha que intentas registrar: ${selectedDateFormatted}\n` +
          `🚫 Fecha del ÚLTIMO registro: ${lastDateFormatted}\n\n` +
          `⚠️ Este conejo ya tiene ${rabbitWeighingHistory.length} registro(s) de pesaje.\n` +
          `📈 El registro #${rabbitWeighingHistory.length + 1} debe tener una fecha POSTERIOR al último registro.\n\n` +
          `💡 Esto mantiene la cronología correcta de los pesajes.`,
      )
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
        // Limpiar datos de validación de fechas
        setMinAllowedDate("")
        setRabbitWeighingHistory([])
        setIsFirstWeighing(true)
        setLastWeighingDate(null)

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
              min={minAllowedDate} // Establecer fecha mínima basada en el ÚLTIMO registro
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
            />
            {/* Mostrar información sobre restricciones de fecha */}
            {!isFirstWeighing && minAllowedDate && lastWeighingDate && (
              <small className="text-blue-600 text-xs block mt-1">
                📅 Debe ser posterior a:{" "}
                {lastWeighingDate.toLocaleString("es-ES", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            )}
            {isFirstWeighing && (
              <small className="text-green-600 text-xs block mt-1">✅ Primer pesaje - cualquier fecha es válida</small>
            )}
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

            {/* INFORMACIÓN DETALLADA DEL HISTORIAL CON CRONOLOGÍA */}
            <div className="mt-2 p-2 bg-blue-50 rounded border">
              <p className="font-semibold text-blue-800">📊 Cronología de Pesajes:</p>
              <p>
                Registros existentes:{" "}
                <span className="font-semibold text-blue-600">{rabbitWeighingHistory.length}</span>
              </p>

              {isFirstWeighing ? (
                <p className="text-green-600 font-semibold">
                  ✅ Este será el PRIMER pesaje (#{rabbitWeighingHistory.length + 1}) - cualquier fecha es válida
                </p>
              ) : (
                <div>
                  <p className="text-orange-600 font-semibold">
                    ⚠️ Este será el pesaje #{rabbitWeighingHistory.length + 1}
                  </p>
                  {lastWeighingDate && (
                    <p className="text-red-600 font-semibold">
                      🚫 Debe ser POSTERIOR al último registro:{" "}
                      {lastWeighingDate.toLocaleString("es-ES", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              )}

              {/* Mostrar los últimos 3 registros ordenados cronológicamente */}
              {rabbitWeighingHistory.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs text-gray-500">Últimos registros (más reciente primero):</p>
                  {rabbitWeighingHistory
                    .sort((a, b) => new Date(b.fecha_weighing) - new Date(a.fecha_weighing))
                    .slice(0, 3)
                    .map((record, index) => (
                      <p key={index} className="text-xs text-gray-500">
                        • #{rabbitWeighingHistory.length - index}:{" "}
                        {new Date(record.fecha_weighing).toLocaleString("es-ES")} - {record.peso_actual}g
                        {index === 0 && <span className="text-red-500 font-bold"> ← ÚLTIMO</span>}
                      </p>
                    ))}
                </div>
              )}
            </div>

            {peso_actual && (
              <div className="mt-2">
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
