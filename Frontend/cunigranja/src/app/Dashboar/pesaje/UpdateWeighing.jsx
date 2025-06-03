"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useState, useEffect } from "react"
import AlertModal from "@/components/utils/AlertModal"

const UpdateWeighing = ({ weighingData, onClose, onUpdate, refreshData }) => {
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
  const [originalWeighingData, setOriginalWeighingData] = useState(null)

  // Cargar datos iniciales del formulario
  useEffect(() => {
    if (weighingData) {
      fetchWeighingDetails(weighingData.id)
    }
  }, [weighingData])

  // Función para obtener los detalles completos del pesaje
  const fetchWeighingDetails = async (weighingId) => {
    try {
      console.log("Obteniendo datos del pesaje ID:", weighingId)

      // Usar la misma URL que funciona en la página principal
      const response = await axiosInstance.get("/Api/Weighing/GetWeighing")

      if (response.status === 200) {
        const allWeighings = response.data
        const weighingRecord = allWeighings.find((w) => w.Id_weighing == weighingId)

        if (weighingRecord) {
          console.log("Datos del pesaje encontrados:", weighingRecord)

          // Formatear la fecha para el input datetime-local
          const formattedDate = weighingRecord.fecha_weighing
            ? new Date(weighingRecord.fecha_weighing).toISOString().slice(0, 16)
            : ""

          setFechaWeighing(formattedDate)
          setPesoActual(weighingRecord.peso_actual?.toString() || "")
          setGananciaPeso(weighingRecord.ganancia_peso?.toString() || "")
          setIdRabbit(weighingRecord.Id_rabbit?.toString() || "")
          setIdUser(weighingRecord.Id_user?.toString() || "")
          setOriginalWeighingData(weighingRecord)

          console.log("Valores establecidos:", {
            fecha: formattedDate,
            peso: weighingRecord.peso_actual,
            ganancia: weighingRecord.ganancia_peso,
            rabbit: weighingRecord.Id_rabbit,
            user: weighingRecord.Id_user,
          })
        } else {
          throw new Error(`No se encontró el registro de pesaje con ID ${weighingId}`)
        }
      }
    } catch (error) {
      console.error("Error al cargar datos de pesaje:", error)
      setErrorMessage("Error al cargar los datos del pesaje")
      setShowErrorAlert(true)
    }
  }

  // Cargar conejos y usuarios
  useEffect(() => {
    async function fetchData() {
      try {
        const [rabbitRes, userRes] = await Promise.all([
          axiosInstance.get("/Api/Rabbit/GetRabbit"),
          axiosInstance.get("/Api/User/AllUser"),
        ])

        const allRabbits = rabbitRes.data || []
        setRabbit(allRabbits)

        const allUsers = userRes.data || []
        const activeUsers = allUsers.filter(
          (user) =>
            (user.blockard === 0 || user.blockard === undefined || user.blockard === null) &&
            user.estado !== "Inactivo",
        )
        setUsers(activeUsers)

        console.log("Conejos cargados:", allRabbits.length)
        console.log("Usuarios activos cargados:", activeUsers.length)
      } catch (error) {
        console.error("Error al obtener datos:", error)
        setErrorMessage("Error al cargar los datos")
        setShowErrorAlert(true)
      }
    }
    fetchData()
  }, [])

  // Cargar datos del conejo cuando cambia la selección
  useEffect(() => {
    async function fetchRabbitData() {
      if (!id_rabbit) {
        setSelectedRabbitData(null)
        return
      }

      try {
        const rabbitId = Number.parseInt(id_rabbit, 10)
        if (isNaN(rabbitId)) return

        const response = await axiosInstance.get(`/Api/Rabbit/ConsultRabbit?id=${rabbitId}`)
        if (response.status === 200) {
          setSelectedRabbitData(response.data)
        }
      } catch (error) {
        console.error("Error al obtener datos del conejo:", error)
      }
    }

    fetchRabbitData()
  }, [id_rabbit])

  // Recalcular ganancia cuando cambia el peso
  useEffect(() => {
    if (selectedRabbitData && peso_actual && originalWeighingData) {
      const currentWeight = Number.parseFloat(peso_actual)
      const originalWeight = Number.parseFloat(originalWeighingData.peso_actual || 0)
      const originalGain = Number.parseFloat(originalWeighingData.ganancia_peso || 0)

      if (currentWeight !== originalWeight) {
        const estimatedPreviousWeight = originalWeight - originalGain
        const newGain = currentWeight - estimatedPreviousWeight
        setGananciaPeso(newGain.toFixed(2))
      }
    }
  }, [selectedRabbitData, peso_actual, originalWeighingData])

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    // Validaciones
    if (!fecha_weighing || !id_rabbit || !id_user || !peso_actual) {
      setErrorMessage("Todos los campos son obligatorios")
      setShowErrorAlert(true)
      return
    }

    const weighingId = Number.parseInt(weighingData.id, 10)
    const rabbitId = Number.parseInt(id_rabbit, 10)
    const userId = Number.parseInt(id_user, 10)
    const currentMeasuredWeight = Number.parseFloat(peso_actual)
    const calculatedGain = Number.parseFloat(ganancia_peso)

    if (isNaN(weighingId) || weighingId <= 0) {
      setErrorMessage(`ID de pesaje inválido: ${weighingData.id}`)
      setShowErrorAlert(true)
      return
    }

    if (isNaN(rabbitId) || rabbitId <= 0) {
      setErrorMessage(`ID del conejo inválido: ${id_rabbit}`)
      setShowErrorAlert(true)
      return
    }

    if (isNaN(userId) || userId <= 0) {
      setErrorMessage(`ID del usuario inválido: ${id_user}`)
      setShowErrorAlert(true)
      return
    }

    setIsSubmitting(true)

    const body = {
      Id_weighing: weighingId,
      fecha_weighing: new Date(fecha_weighing).toISOString(),
      peso_actual: currentMeasuredWeight,
      ganancia_peso: calculatedGain,
      Id_rabbit: rabbitId,
      Id_user: userId,
    }

    console.log("=== INTENTANDO ACTUALIZACIÓN ===")
    console.log("Datos a enviar:", body)

    // Lista de endpoints a probar (diferentes variaciones de URL)
    const endpointsToTry = [
      "/Api/Weighing/UpdateWeighing", // Mayúscula (como en GetWeighing que funciona)
      "/Api/weighing/UpdateWeighing", // Minúscula (como en el controlador)
    ]

    let success = false
    let lastError = null

    for (const endpoint of endpointsToTry) {
      try {
        console.log(`Probando endpoint: ${endpoint}`)

        const response = await axiosInstance.post(endpoint, body)

        console.log(`✅ Éxito con ${endpoint}:`, response.status, response.data)

        if (response.status === 200) {
          setSuccessMessage("Pesaje actualizado exitosamente.")
          setShowSuccessAlert(true)
          success = true
          break
        }
      } catch (error) {
        console.log(`❌ Error con ${endpoint}:`, error.response?.status, error.message)
        lastError = error

        // Si no es error 405, no probar más endpoints
        if (error.response?.status !== 405) {
          break
        }
      }
    }

    if (!success) {
      console.error("=== TODOS LOS ENDPOINTS FALLARON ===")
      console.error("Último error:", lastError)

      const errorMsg = lastError?.response?.data?.message || lastError?.message || "Error al actualizar pesaje"
      setErrorMessage(`Error ${lastError?.response?.status || "desconocido"}: ${errorMsg}`)
      setShowErrorAlert(true)
    }

    setIsSubmitting(false)
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)
    if (typeof onUpdate === "function") {
      onUpdate()
    }
    if (typeof onClose === "function") {
      onClose()
    }
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
  }

  const isRabbitAvailable = (rabbitItem) => {
    const rabbitId = rabbitItem.Id_rabbit || rabbitItem.id_rabbit
    return (
      rabbitItem.estado === "Activo" ||
      (originalWeighingData && rabbitId.toString() === originalWeighingData.Id_rabbit?.toString())
    )
  }

  return (
    <>
      <AlertModal type="success" message={successMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />
      <AlertModal type="error" message={errorMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto border border-gray-400"
      >
        <h2 className="text-xl font-bold text-center mb-6">Actualizar Pesaje</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Conejo: <span className="text-red-500">*</span>
            </label>
            <select
              value={id_rabbit}
              onChange={(e) => setIdRabbit(e.target.value)}
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10 bg-white cursor-pointer hover:border-gray-500 transition-colors"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="">Seleccione</option>
              {rabbit.map((r) => {
                const rabbitId = r.Id_rabbit || r.id_rabbit
                const isAvailable = isRabbitAvailable(r)
                const isOriginal =
                  originalWeighingData && rabbitId.toString() === originalWeighingData.Id_rabbit?.toString()

                return (
                  <option
                    key={rabbitId}
                    value={rabbitId}
                    disabled={!isAvailable}
                    style={{
                      color: isAvailable ? "black" : "gray",
                      fontWeight: isOriginal ? "bold" : "normal",
                    }}
                  >
                    {r.name_rabbit} {isOriginal ? "(Actual)" : ""} {!isAvailable ? "(Inactivo)" : ""}
                  </option>
                )
              })}
            </select>
            <p className="text-xs text-gray-500 mt-1">Se muestran conejos activos y el conejo actual del registro</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Fecha del Pesaje:</label>
            <input
              type="datetime-local"
              value={fecha_weighing}
              onChange={(e) => setFechaWeighing(e.target.value)}
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10 hover:border-gray-500 transition-colors"
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
                if (value === "" || Number.parseFloat(value) >= 0) {
                  setPesoActual(value)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E") {
                  e.preventDefault()
                }
              }}
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10 hover:border-gray-500 transition-colors"
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
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10 bg-white cursor-pointer hover:border-gray-500 transition-colors"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="">Seleccione</option>
              {users.map((u) => {
                const userId = u.Id_user || u.id_user
                return (
                  <option key={userId} value={userId}>
                    {u.name_user}
                  </option>
                )
              })}
            </select>
            <p className="text-xs text-gray-500 mt-1">Usuarios activos ({users.length} disponibles)</p>
          </div>
        </div>

        {selectedRabbitData && (
          <div className="mb-4 text-xs text-gray-600 border-t pt-2">
            <p>Información del conejo seleccionado:</p>
            <p>
              Estado:{" "}
              <span
                className={`font-semibold ${
                  selectedRabbitData.estado === "Activo" || selectedRabbitData.estado === "activo"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {selectedRabbitData.estado}
              </span>
            </p>
            <p>Peso inicial: {selectedRabbitData.peso_inicial} g</p>
            <p>Peso actual acumulado: {selectedRabbitData.peso_actual} g</p>
            {peso_actual && (
              <div>
                <p
                  className={`font-semibold ${
                    Number.parseFloat(ganancia_peso) >= 0 ? "text-blue-600" : "text-orange-600"
                  }`}
                >
                  Ganancia calculada: {ganancia_peso} g (recalculada para actualización)
                </p>
                {Number.parseFloat(ganancia_peso) < 0 && (
                  <p className="text-orange-600 text-xs mt-1 font-medium">
                    ⚠️ Ganancia negativa detectada. En modo actualización, esto no afectará el peso acumulado del conejo.
                  </p>
                )}
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
              <p className="text-blue-800 font-medium text-xs">
                ℹ️ <strong>Modo Actualización:</strong> Los cambios en este pesaje NO afectarán el peso acumulado del
                conejo. Solo se actualizará el registro del pesaje.
              </p>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Información:</strong> Al actualizar el pesaje:
            <br />• Solo se modificará el registro del pesaje
            <br />• El peso acumulado del conejo NO se verá afectado
          </p>
        </div>

        <button
          type="submit"
          className="w-full p-3 mt-4 bg-black text-white rounded hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Actualizando..." : "Actualizar Pesaje"}
        </button>
      </form>
    </>
  )
}

export default UpdateWeighing
