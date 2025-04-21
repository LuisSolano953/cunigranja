"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useEffect, useState } from "react"

const UpdateReproduction = ({ reproductionData, onClose, onUpdate }) => {
  const [fecha_nacimiento, setFechaNacimiento] = useState("")
  const [total_conejos, setTotalConejos] = useState("")
  const [nacidos_vivos, setNacidosVivos] = useState("")
  const [nacidos_muertos, setNacidosMuertos] = useState("")
  const [Id_rabbit, setIdRabbit] = useState("")
  const [rabbit, setRabbit] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Initialize form with reproduction data when component mounts
  useEffect(() => {
    if (reproductionData) {
      setFechaNacimiento(reproductionData.fecha_nacimiento || "")
      setTotalConejos(reproductionData.total_conejos || "")
      setNacidosVivos(reproductionData.nacidos_vivos || "")
      setNacidosMuertos(reproductionData.nacidos_muertos || "")
      setIdRabbit(reproductionData.Id_rabbit || "")
    }
  }, [reproductionData])

  // Fetch rabbit data for dropdown
  useEffect(() => {
    async function fetchRabbit() {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get("/Api/Rabbit/GetRabbit")
        if (response.status === 200) {
          console.log("Datos de conejos recibidos:", response.data)

          // Filtrar solo conejos hembra
          const femaleRabbits = response.data.filter((rabbit) => rabbit.sexo_rabbit === "Hembra")

          console.log("Conejos hembra filtrados:", femaleRabbits)
          setRabbit(femaleRabbits)
        }
      } catch (error) {
        console.error("Error al obtener las conejos:", error)
        setErrorMessage("Error al obtener las conejos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRabbit()
  }, [])

  // Calcular nacidos muertos automáticamente cuando cambia total o vivos
  useEffect(() => {
    if (total_conejos && nacidos_vivos) {
      const total = Number.parseInt(total_conejos, 10)
      const vivos = Number.parseInt(nacidos_vivos, 10)

      // Asegurarse que vivos no exceda el total
      if (vivos > total) {
        setErrorMessage("Los nacidos vivos no pueden exceder el total de conejos")
        return
      } else {
        setErrorMessage("")
      }

      const muertos = total - vivos
      setNacidosMuertos(muertos.toString())
    } else {
      setNacidosMuertos("0")
    }
  }, [total_conejos, nacidos_vivos])

  // Validar que nacidos vivos no exceda el total
  const handleNacidosVivosChange = (e) => {
    const vivos = Number.parseInt(e.target.value, 10) || 0
    const total = Number.parseInt(total_conejos, 10) || 0

    if (vivos > total && total > 0) {
      setErrorMessage("Los nacidos vivos no pueden exceder el total de conejos")
    } else {
      setErrorMessage("")
    }

    setNacidosVivos(e.target.value)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Validaciones
    if (!fecha_nacimiento || !total_conejos || !nacidos_vivos || !Id_rabbit) {
      setErrorMessage("Todos los campos son obligatorios")
      return
    }

    const total = Number.parseInt(total_conejos, 10)
    const vivos = Number.parseInt(nacidos_vivos, 10)

    if (vivos > total) {
      setErrorMessage("Los nacidos vivos no pueden exceder el total de conejos")
      return
    }

    try {
      // Asegurarse de que el ID sea un número
      const numericId = Number.parseInt(reproductionData.id, 10)

      console.log("Intentando actualizar reproducción con ID:", numericId)
      console.log("Datos a enviar:", {
        fecha_nacimiento,
        total_conejos,
        nacidos_vivos,
        nacidos_muertos,
        Id_rabbit: Number.parseInt(Id_rabbit),
      })

      const response = await axiosInstance.post(`/Api/Reproduction/UpdateReproduction`, {
        id_reproduction: numericId,
        fecha_nacimiento,
        total_conejos: Number.parseInt(total_conejos),
        nacidos_vivos: Number.parseInt(nacidos_vivos),
        nacidos_muertos: Number.parseInt(nacidos_muertos),
        Id_rabbit: Number.parseInt(Id_rabbit),
      })

      if (response.status === 200) {
        setSuccessMessage("Reproducción actualizada correctamente")

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
      console.error("Error al actualizar la reproducción:", error)
      setErrorMessage(error.response?.data?.message || "Error desconocido al actualizar la reproducción.")
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
            <h2 className="text-xl font-semibold text-center mb-4 text-red-600">Error</h2>
            <p className="text-center mb-6">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage("")}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4 text-blue-600">Éxito</h2>
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

      <form
        onSubmit={handleSubmit}
        className="p-5 bg-white shadow-lg rounded-lg max-w-md mx-auto border border-gray-400"
      >
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Coneja:</label>
          {isLoading ? (
            <div className="text-center py-2 border border-gray-300 rounded-lg bg-gray-50">Cargando conejas...</div>
          ) : (
            <select
              value={Id_rabbit}
              onChange={(e) => setIdRabbit(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            >
              <option value="">Seleccione una coneja</option>
              {Array.isArray(rabbit) && rabbit.length > 0 ? (
                rabbit.map((conejo) => (
                  <option key={conejo.Id_rabbit || conejo.id_rabbit} value={conejo.Id_rabbit || conejo.id_rabbit}>
                    {conejo.name_rabbit} (Hembra)
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No hay conejas disponibles
                </option>
              )}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="fecha_reproduction" className="block text-gray-700 font-medium mb-2">
              Fecha de Nacimiento:
            </label>
            <input
              type="date"
              value={formatDateForInput(fecha_nacimiento)}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              name="fecha_reproduction"
              id="fecha_reproduction"
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>

          <div>
            <label htmlFor="total_conejos" className="block text-gray-800 font-medium mb-2">
              Total de Conejos:
            </label>
            <input
              type="number"
              value={total_conejos}
              onChange={(e) => setTotalConejos(e.target.value)}
              name="total_conejos"
              id="total_conejos"
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              min="0"
              placeholder="Ingrese el total"
            />
          </div>

          <div>
            <label htmlFor="nacidos_vivos" className="block text-gray-800 font-medium mb-2">
              Nacidos Vivos:
            </label>
            <input
              type="number"
              value={nacidos_vivos}
              onChange={handleNacidosVivosChange}
              name="nacidos_vivos"
              id="nacidos_vivos"
              className={`w-full border ${
                Number.parseInt(nacidos_vivos, 10) > Number.parseInt(total_conejos, 10) && total_conejos
                  ? "border-red-500"
                  : "border-gray-400"
              } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600`}
              required
              min="0"
              max={total_conejos || undefined}
              placeholder="Ingrese nacidos vivos"
            />
            {Number.parseInt(nacidos_vivos, 10) > Number.parseInt(total_conejos, 10) && total_conejos && (
              <p className="text-red-500 text-xs mt-1">No puede exceder el total de conejos</p>
            )}
          </div>

          <div>
            <label htmlFor="nacidos_muertos" className="block text-gray-800 font-medium mb-2">
              Nacidos Muertos:
            </label>
            <input
              type="number"
              value={nacidos_muertos}
              readOnly
              name="nacidos_muertos"
              id="nacidos_muertos"
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-100"
              required
              min="0"
              placeholder="Calculado automáticamente"
            />
            <p className="text-xs text-gray-500 mt-1">Se calcula automáticamente</p>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            type="button"
            onClick={closeModal}
            className="w-1/2 bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-1/2 bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Actualizar
          </button>
        </div>
      </form>
    </>
  )
}

export default UpdateReproduction
