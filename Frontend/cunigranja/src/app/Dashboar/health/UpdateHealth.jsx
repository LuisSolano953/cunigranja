"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useEffect, useState } from "react"

const UpdateHealth = ({ healthData, onClose, onUpdate }) => {
    const [name_health, setNameHealth] = useState("")
    const [fecha_health, setFechaHealth] = useState("")
    const [descripcion_health, setDescripcionHealth] = useState("")
    const [valor_health, setValorHealth] = useState("")
    const [Id_user, setIdUser] = useState("")
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
  



  // Initialize form with Health data when component mounts
  useEffect(() => {
    if (healthData) {
        setNameHealth(healthData.name_health || "")
        setFechaHealth(healthData.fecha_health ||"")
        setValorHealth(healthData.valor_health ||"")
        setDescripcionHealth(healthData.descripcion_health ||"")
        setIdUser(healthData.Id_user ||"")
      
    }
  }, [healthData])


 // Fetch users when component mounts
 useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get("/Api/User/AllUser")
        if (response.status === 200) {
          setUsers(response.data)
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error)
        setErrorMessage("Error al obtener usuarios")
      } finally {
        setIsLoading(false)
      }
    }
 
    fetchUsers()
  }, []) 


  
  async function HandleSubmit(e) {
    e.preventDefault()

    try {
      // Asegurarse de que el ID sea un número
      const numericId = Number.parseInt(healthData.id, 10)

      console.log("Intentando actualizar sanidad con ID:", numericId)
      console.log("Datos a enviar:",{
        name_health,
        fecha_health,
        descripcion_health,
        valor_health,
        Id_user: Number.parseInt(Id_user), // Convertir a número

      })

      // Alternativa 1: Enviar el ID en el cuerpo de la solicitud
      const response = await axiosInstance.post(`/Api/Health/UpdateHealth`, {
        Id_health:numericId,
        name_health,
        fecha_health,
        descripcion_health,
        valor_health,
        Id_user: Number.parseInt(Id_user), // Convertir a número
      });

     

      if (response.status === 200) {
        setSuccessMessage("sanidad actualizada correctamente: " )

        // Call the onUpdate callback to refresh the data
        if (typeof onUpdate === "function") {
          setTimeout(() => {
            onUpdate()
            if (typeof onClose === "function") {
              onClose()
            }
          }, 1500)
        }
      }
    } catch (error) {
      console.error("Error al actualizar la sanidad:", error)
      setErrorMessage(error.response?.data?.message || "Error desconocido al actualizar la sanidad.")
    }
  }

  const closeModal = () => {
    setSuccessMessage("")
    setErrorMessage("")
    if (typeof onClose === "function") {
      onClose()
    }
  }
  // Formatear la fecha para el input date (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  return (
    <>
       {/* Modales de error y éxito */}
       {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Error</h2>
            <p className="text-center mb-6">{errorMessage}</p>
            <button
              onClick={closeModal}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Éxito</h2>
            <p className="text-center mb-6">{successMessage}</p>
            <button
              onClick={closeModal}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form
        onSubmit={HandleSubmit}
        className="p-5 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registrar Salud</h2>

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
                <option key={user.id_user} value={user.id_user}>
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
            Actualizar
          </button>
        </div>
      </form>
    </>
  )
}

export default UpdateHealth

