"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useState, useEffect } from "react"
import AlertModal from "@/components/utils/AlertModal"

const UpdateMortality = ({ mortalityData, onClose, onUpdate }) => {
  const [fecha_mortality, setFechaMortality] = useState("")
  const [causa_mortality, setCausaMortality] = useState("")
  const [id_rabbit, setIdRabbit] = useState("")
  const [id_user, setIdUser] = useState("")
  const [rabbit, setRabbit] = useState([])
  const [users, setUsers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [originalRabbitId, setOriginalRabbitId] = useState("")

  // Función para validar que no contenga números
  const containsNumbers = (text) => {
    return /\d/.test(text)
  }

  // Manejar cambios en el input de causa y validar números
  const handleCausaChange = (e) => {
    const inputValue = e.target.value

    // Verificar si contiene números
    if (containsNumbers(inputValue)) {
      setAlertMessage("La causa de muerte no puede contener números")
      setShowErrorAlert(true)
      return // No actualizar el estado si contiene números
    }

    // Si no contiene números, actualizar
    setCausaMortality(inputValue)

    // Limpiar cualquier error previo
    if (alertMessage && showErrorAlert) {
      setAlertMessage("")
      setShowErrorAlert(false)
    }
  }

  // Cargar datos iniciales del formulario
  useEffect(() => {
    if (mortalityData) {
      // Obtener los datos del registro de mortalidad
      fetchMortalityDetails(mortalityData.id)
    }
  }, [mortalityData])

  // Función para obtener los detalles completos de la mortalidad
  const fetchMortalityDetails = async (mortalityId) => {
    try {
      const response = await axiosInstance.get(`/Api/Mortality/ConsulMortality?id=${mortalityId}`)

      if (response.status === 200) {
        const data = response.data

        // Formatear la fecha para el input date
        const formattedDate = data.fecha_mortality ? new Date(data.fecha_mortality).toISOString().split("T")[0] : ""

        setFechaMortality(formattedDate)

        // Verificar si la causa contiene números
        const causa = data.causa_mortality || ""
        if (containsNumbers(causa)) {
          console.warn("La causa de muerte contiene números:", causa)
        }
        setCausaMortality(causa)

        setIdRabbit(data.Id_rabbit?.toString() || "")
        setIdUser(data.Id_user?.toString() || "")
        setOriginalRabbitId(data.Id_rabbit?.toString() || "")

        console.log("Datos de mortalidad cargados:", data)
      }
    } catch (error) {
      console.error("Error al cargar datos de mortalidad:", error)
      setAlertMessage("Error al cargar los datos de la mortalidad")
      setShowErrorAlert(true)
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [rabbitRes, userRes] = await Promise.all([
          axiosInstance.get("/Api/Rabbit/GetRabbit"),
          axiosInstance.get("/Api/User/AllUser"),
        ])

        // Para el update, mostrar todos los conejos (activos e inactivos)
        // pero marcar cuáles están disponibles
        const allRabbits = rabbitRes.data || []
        setRabbit(allRabbits)

        // Filtrar solo usuarios activos
        const allUsers = userRes.data || []
        const activeUsers = allUsers.filter(
          (user) =>
            (user.blockard === 0 || user.blockard === undefined || user.blockard === null) &&
            user.estado !== "Inactivo",
        )
        setUsers(activeUsers)
      } catch (error) {
        console.error("Error al obtener datos:", error)
      }
    }
    fetchData()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    // Validación final antes de enviar
    if (containsNumbers(causa_mortality)) {
      setAlertMessage("La causa de muerte no puede contener números")
      setShowErrorAlert(true)
      return
    }

    if (!fecha_mortality || !causa_mortality || !id_rabbit || !id_user) {
      setAlertMessage("Todos los campos son obligatorios")
      setIsSuccess(false)
      setShowErrorAlert(true)
      return
    }

    // Convertir IDs a números
    const rabbitId = Number.parseInt(id_rabbit, 10)
    const userId = Number.parseInt(id_user, 10)
    const mortalityId = Number.parseInt(mortalityData.id, 10)

    // Validar que los IDs sean números válidos
    if (isNaN(rabbitId) || rabbitId <= 0) {
      setAlertMessage(`ID del conejo inválido: ${id_rabbit}`)
      setShowErrorAlert(true)
      return
    }

    if (isNaN(userId) || userId <= 0) {
      setAlertMessage(`ID del usuario inválido: ${id_user}`)
      setShowErrorAlert(true)
      return
    }

    if (isNaN(mortalityId) || mortalityId <= 0) {
      setAlertMessage(`ID de mortalidad inválido: ${mortalityData.id}`)
      setShowErrorAlert(true)
      return
    }

    setIsSubmitting(true)

    // FORMATO EXACTO COMO EN SWAGGER PARA UPDATE - Solo usar MortalityModel
    const body = {
      Id_mortality: mortalityId,
      causa_mortality: causa_mortality.trim(),
      fecha_mortality: fecha_mortality,
      Id_rabbit: rabbitId,
      Id_user: userId,
    }

    console.log("Enviando datos de actualización:", body)
    console.log("Conejo original:", originalRabbitId, "Conejo nuevo:", rabbitId)

    try {
      const response = await fetch("https://localhost:7208/Api/Mortality/UpdateMortality", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const responseData = await response.json()

      setAlertMessage(
        responseData.message ||
          "Mortalidad actualizada exitosamente. Los estados de los conejos han sido actualizados.",
      )
      setIsSuccess(true)
      setShowSuccessAlert(true)
    } catch (error) {
      console.error("Error:", error)
      setAlertMessage(error.message || "Error al actualizar mortalidad")
      setIsSuccess(false)
      setShowErrorAlert(true)
    } finally {
      setIsSubmitting(false)
    }
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
    setAlertMessage("")
  }

  // Función para determinar si un conejo está disponible
  const isRabbitAvailable = (rabbitItem) => {
    const rabbitId = rabbitItem.Id_rabbit || rabbitItem.id_rabbit
    // El conejo está disponible si:
    // 1. Está activo, O
    // 2. Es el conejo original de esta mortalidad
    return rabbitItem.estado === "Activo" || rabbitId.toString() === originalRabbitId
  }

  return (
    <>
      <AlertModal type="success" message={alertMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />
      <AlertModal type="error" message={alertMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-2xl mx-auto border border-gray-400"
      >
        

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Conejo:</label>
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
                const isOriginal = rabbitId.toString() === originalRabbitId

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
            <label className="block text-gray-700 font-medium mb-2">Fecha de la Muerte:</label>
            <input
              type="date"
              value={fecha_mortality}
              onChange={(e) => setFechaMortality(e.target.value)}
              required
              max={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10 hover:border-gray-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Causa de la Muerte:</label>
            <input
              type="text"
              value={causa_mortality}
              onChange={handleCausaChange}
              required
              placeholder="Ej: Enfermedad, Accidente, etc."
              className={`w-full border rounded-lg p-2 focus:ring-2 h-10 hover:border-gray-500 transition-colors ${
                containsNumbers(causa_mortality)
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-400 focus:ring-gray-600"
              }`}
            />
            <p className="text-xs text-red-500 mt-1">⚠️ No se permiten números en la causa de muerte</p>
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Información:</strong> Al actualizar la mortalidad:
            <br />• Si cambia el conejo, el conejo anterior se reactivará
            <br />• El nuevo conejo seleccionado se marcará como "Inactivo"
          </p>
        </div>

        <button
          type="submit"
          className="w-full p-3 mt-4 bg-black text-white rounded hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
          disabled={isSubmitting || containsNumbers(causa_mortality)}
        >
          {isSubmitting ? "Actualizando..." : "Actualizar Mortalidad"}
        </button>
      </form>
    </>
  )
}

export default UpdateMortality
