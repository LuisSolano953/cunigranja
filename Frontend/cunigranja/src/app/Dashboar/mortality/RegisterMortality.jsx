"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useState, useEffect } from "react"

const RegisterMortality = ({ refreshData, onCloseForm }) => {
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

  useEffect(() => {
    async function fetchData() {
      try {
        const [rabbitRes, userRes] = await Promise.all([
          axiosInstance.get("/Api/Rabbit/GetRabbit"),
          axiosInstance.get("/Api/User/AllUser"),
        ])
        setRabbit(rabbitRes.data || [])
        setUsers(userRes.data || [])
      } catch (error) {
        console.error("Error al obtener datos:", error)
      }
    }
    fetchData()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    if (!fecha_mortality || !causa_mortality || !id_rabbit || !id_user) {
      setAlertMessage("Todos los campos son obligatorios")
      setIsSuccess(false)
      setShowAlert(true)
      return
    }

    setIsSubmitting(true)

    const body = {
      fecha_mortality: new Date(fecha_mortality).toISOString(),
      causa_mortality,
      id_rabbit: Number.parseInt(id_rabbit, 10) || 0,
      id_user: Number.parseInt(id_user, 10) || 0,
    }

    try {
      const response = await axiosInstance.post("/Api/Mortality/CreateMortality", body)
      setAlertMessage(response.data.message || "Registro exitoso")
      setIsSuccess(true)
      setShowAlert(true)

      // Refrescar datos
      if (typeof refreshData === "function") {
        refreshData()
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error al registrar mortalidad"
      setAlertMessage(errorMsg)
      setIsSuccess(false)
      setShowAlert(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Función para cerrar la alerta y el formulario
  const handleCloseAlert = () => {
    setShowAlert(false)

    // Si fue exitoso, también cerrar el formulario
    if (isSuccess && typeof onCloseForm === "function") {
      // Limpiar campos antes de cerrar
      setFechaMortality("")
      setCausaMortality("")
      setIdRabbit("")
      setIdUser("")

      // Cerrar el formulario
      onCloseForm()
    }
  }

  return (
    <>
      {/* Alerta modal */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">{isSuccess ? "Éxito" : "Error"}</h2>
            <p className="text-center mb-6">{alertMessage}</p>
            <button
              onClick={handleCloseAlert}
              className={`w-full py-2 px-4 ${
                isSuccess ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
              } text-white font-semibold rounded-lg shadow-md transition duration-300`}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-2xl mx-auto mt-10 border border-gray-400"
      >
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Conejo:</label>
            <select
              value={id_rabbit}
              onChange={(e) => setIdRabbit(e.target.value)}
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
            >
              <option value="">Seleccione un Conejo</option>
              {rabbit.map((r) => (
                <option key={r.id_rabbit} value={r.id_rabbit}>
                  {r.name_rabbit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Fecha de la Muerte:</label>
            <input
              type="date"
              value={fecha_mortality}
              onChange={(e) => setFechaMortality(e.target.value)}
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Causa de la Muerte:</label>
            <input
              type="text"
              value={causa_mortality}
              onChange={(e) => setCausaMortality(e.target.value)}
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
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
              <option value="">Seleccione un Usuario</option>
              {users.map((u) => (
                <option key={u.id_user} value={u.id_user}>
                  {u.name_user}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-3 mt-4 bg-black text-white rounded hover:bg-gray-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registrando..." : "Guardar Mortalidad"}
        </button>
      </form>
    </>
  )
}

export default RegisterMortality
