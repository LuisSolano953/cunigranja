"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useEffect, useState } from "react"
import AlertModal from "@/components/utils/AlertModal"

const UpdateHealth = ({ healthData, onClose, onUpdate }) => {
  const [name_health, setNameHealth] = useState("")
  const [fecha_health, setFechaHealth] = useState("")
  const [descripcion_health, setDescripcionHealth] = useState("")
  const [valor_health, setValorHealth] = useState("")
  const [Id_user, setIdUser] = useState("")
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [debugInfo, setDebugInfo] = useState({})

  // Función para validar que no contenga números
  const containsNumbers = (text) => {
    return /\d/.test(text)
  }

  // Manejar cambios en el input y validar números
  const handleNameChange = (e) => {
    const inputValue = e.target.value

    // Verificar si contiene números
    if (containsNumbers(inputValue)) {
      setErrorMessage("El nombre de sanidad no puede contener números")
      setShowErrorAlert(true)
      return // No actualizar el estado si contiene números
    }

    // Si no contiene números, actualizar
    setNameHealth(inputValue)

    // Limpiar cualquier error previo
    if (errorMessage && showErrorAlert) {
      setErrorMessage("")
      setShowErrorAlert(false)
    }
  }

  // Initialize form with Health data when component mounts
  useEffect(() => {
    // Función para inicializar datos
    const initializeData = () => {
      if (healthData) {
        console.log("Datos de sanidad recibidos:", healthData)
        setDebugInfo(healthData)

        // Extraer datos de diferentes posibles estructuras
        const id = healthData.Id_health || healthData.id_health || healthData.id || ""
        const name = healthData.name_health || ""
        const fecha = healthData.fecha_health || ""
        const valor = healthData.valor_health || ""
        const descripcion = healthData.descripcion_health || ""
        const userId = healthData.Id_user || healthData.id_user || ""

        console.log("Datos extraídos:", { id, name, fecha, valor, descripcion, userId })

        // Verificar si el nombre contiene números
        if (containsNumbers(name)) {
          console.warn("El nombre contiene números:", name)
        }

        setNameHealth(name)
        setFechaHealth(fecha)
        setValorHealth(valor)
        setDescripcionHealth(descripcion)
        setIdUser(userId.toString()) // Convertir a string para el select
      }
    }

    initializeData()
  }, [healthData])

  // Fetch users when component mounts
  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get("/Api/User/AllUser")
        if (response.status === 200) {
          // Filtrar solo usuarios activos
          const allUsers = response.data || []
          const activeUsers = allUsers.filter(
            (user) =>
              (user.blockard === 0 || user.blockard === undefined || user.blockard === null) &&
              user.estado !== "Inactivo",
          )
          console.log("Usuarios totales:", allUsers.length, "Usuarios activos:", activeUsers.length)
          setUsers(activeUsers)
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error)
        setErrorMessage("Error al obtener usuarios")
        setShowErrorAlert(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    // Validación final antes de enviar
    if (containsNumbers(name_health)) {
      setErrorMessage("El nombre de sanidad no puede contener números")
      setShowErrorAlert(true)
      return
    }

    try {
      // Obtener el ID de diferentes posibles campos
      const healthId = healthData.Id_health || healthData.id_health || healthData.id
      const numericId = Number.parseInt(healthId, 10)

      if (isNaN(numericId)) {
        throw new Error("ID de sanidad inválido")
      }

      console.log("Intentando actualizar sanidad con ID:", numericId)

      // Preparar datos para enviar
      const updateData = {
        Id_health: numericId,
        name_health,
        fecha_health,
        descripcion_health,
        valor_health: Number(valor_health),
        Id_user: Number(Id_user),
      }

      console.log("Datos a enviar:", updateData)

      const response = await axiosInstance.post(`/Api/Health/UpdateHealth`, updateData)

      if (response.status === 200) {
        setSuccessMessage("Sanidad actualizada correctamente")
        setShowSuccessAlert(true)
      }
    } catch (error) {
      console.error("Error al actualizar la sanidad:", error)

      // Extraer mensaje de error detallado
      let errorMsg = "Error desconocido al actualizar la sanidad."

      if (error.response) {
        if (error.response.data && typeof error.response.data === "string") {
          errorMsg = error.response.data
        } else if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message
        } else if (error.response.data && error.response.data.errors) {
          // Formatear errores de validación
          const validationErrors = Object.entries(error.response.data.errors)
            .map(([key, value]) => `${key}: ${value.join(", ")}`)
            .join("; ")
          errorMsg = `Errores de validación: ${validationErrors}`
        }
      }

      setErrorMessage(errorMsg)
      setShowErrorAlert(true)
    }
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)
    // Call the onUpdate callback to refresh the data
    if (typeof onUpdate === "function") {
      onUpdate()
    }
    // Cerrar el formulario después de un breve retraso
    if (typeof onClose === "function") {
      onClose()
    }
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
    setErrorMessage("")
  }

  // Formatear la fecha para el input date (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toISOString().split("T")[0]
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return ""
    }
  }

  return (
    <>
      {/* Alerta de éxito */}
      <AlertModal type="success" message={successMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />

      {/* Alerta de error */}
      <AlertModal type="error" message={errorMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

     

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="p-5 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Actualizar Sanidad</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nombre de Sanidad:</label>
            <input
              type="text"
              value={name_health}
              onChange={handleNameChange}
              className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 ${
                containsNumbers(name_health)
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-400 focus:ring-gray-600"
              }`}
              required
              placeholder="Ingrese el nombre"
            />
            <p className="text-xs text-red-500 mt-1">⚠️ No se permiten números en el nombre</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Fecha de Sanidad:</label>
            <input
              type="date"
              value={formatDateForInput(fecha_health)}
              onChange={(e) => setFechaHealth(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Descripción:</label>
            <input
              type="text"
              value={descripcion_health}
              onChange={(e) => setDescripcionHealth(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              placeholder="Ingrese la descripción"
            />
          </div>

          <div>
  <label className="block text-gray-700 font-medium mb-2">Valor:</label>
  <input
    type="number"
    min="0"
    value={valor_health}
    onChange={(e) => {
      const value = e.target.value;
      // Permitimos vacío para que el usuario pueda borrar
      if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
        setValorHealth(value);
      }
    }}
    onPaste={(e) => {
      const pasted = e.clipboardData.getData('text');
      if (parseFloat(pasted) < 0) {
        e.preventDefault(); // Bloquea pegar negativos
      }
    }}
    className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
    required
    placeholder="Ingrese el valor"
  />
</div>

        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Responsable:</label>
          {isLoading ? (
            <div className="text-center py-2 border border-gray-300 rounded-lg bg-gray-50">Cargando usuarios...</div>
          ) : (
            <select
              value={Id_user}
              onChange={(e) => setIdUser(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            >
              <option value="">Seleccione un responsable</option>
              {users.map((user) => {
                // Obtener el ID del usuario de diferentes posibles campos
                const userId = user.id_user || user.Id_user || user.id
                return (
                  <option key={`user-${userId}`} value={userId}>
                    {user.name_user || user.nombre || "Usuario sin nombre"}
                  </option>
                )
              })}
            </select>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={containsNumbers(name_health)}
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Actualizar
          </button>
        </div>
      </form>
    </>
  )
}

export default UpdateHealth
