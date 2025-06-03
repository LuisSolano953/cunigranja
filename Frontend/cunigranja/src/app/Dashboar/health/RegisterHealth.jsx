"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import AlertModal from "@/components/utils/AlertModal"

const RegisterHealth = ({ refreshData, onCloseForm }) => {
  const [name_health, setNameHealth] = useState("")
  const [fecha_health, setFechaHealth] = useState("")
  const [descripcion_health, setDescripcionHealth] = useState("")
  const [valor_health, setValorHealth] = useState("")
  const [Id_user, setIdUser] = useState("")
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")

  // Establecer la fecha actual al cargar el componente
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setFechaHealth(today)
  }, [])

  // Fetch users when component mounts
  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get("/Api/User/AllUser")
        if (response.status === 200) {
          // Filtrar solo usuarios activos (blockard = 0 o estado != "Inactivo")
          const allUsers = response.data || []
          const activeUsers = allUsers.filter(user => 
            (user.blockard === 0 || user.blockard === undefined || user.blockard === null) && 
            (user.estado !== "Inactivo")
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

  async function handlerSubmit(e) {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")
    setDebugInfo("")

    if (!name_health || !fecha_health || !descripcion_health || !valor_health || !Id_user) {
      setErrorMessage("Todos los campos son obligatorios")
      setShowErrorAlert(true)
      return
    }

    try {
      // Formatear la fecha correctamente para el backend
      const formattedDate = new Date(fecha_health).toISOString().split("T")[0]

      // Crear el objeto de datos
      const healthData = {
        Id_health: 0, // El backend asignará el ID real
        name_health,
        fecha_health: formattedDate,
        descripcion_health,
        valor_health: Number(valor_health), // Convertir a número
        Id_user: Number(Id_user), // Convertir a número
      }

      // Mostrar los datos que se enviarán para depuración
      setDebugInfo(JSON.stringify(healthData, null, 2))

      console.log("Enviando datos:", healthData)

      const response = await axiosInstance.post("/Api/Health/CreateHealth", healthData)

      if (response.status === 200) {
        setSuccessMessage(response.data.message || "Registro exitoso")
        setShowSuccessAlert(true)
        // Limpiar los campos después de un registro exitoso
        setNameHealth("")
        setFechaHealth(new Date().toISOString().split("T")[0])
        setValorHealth("")
        setDescripcionHealth("")
        setIdUser("")
      }
    } catch (error) {
      console.error("Error al registrar la salud:", error)

      // Extraer mensaje de error detallado
      let errorMsg = "Error desconocido al registrar la salud."

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
    setSuccessMessage("")
    setDebugInfo("")

    // Luego refrescamos los datos si es necesario
    if (refreshData && typeof refreshData === "function") {
      refreshData()
    }

    // Cerrar el formulario cuando se cierra la alerta
    if (onCloseForm && typeof onCloseForm === "function") {
      onCloseForm()
    }
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
    setErrorMessage("")
  }

  return (
    <>
      {/* Alerta de éxito */}
      <AlertModal type="success" message={successMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />

      {/* Alerta de error */}
      <AlertModal type="error" message={errorMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      {/* Formulario */}
      <form
        onSubmit={handlerSubmit}
        className="p-5 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nombre de Salud:</label>
            <input
              type="text"
              value={name_health}
              onChange={(e) => setNameHealth(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              placeholder="Ingrese el nombre"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Fecha de Salud:</label>
            <input
              type="date"
              value={fecha_health}
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
              value={valor_health}
              onChange={(e) => setValorHealth(e.target.value)}
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
              {users.map((user) => (
                <option key={user.id_user || user.Id_user} value={user.id_user || user.Id_user}>
                  {user.name_user}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Registrar Salud
          </button>
        </div>
      </form>
    </>
  )
}

export default RegisterHealth
