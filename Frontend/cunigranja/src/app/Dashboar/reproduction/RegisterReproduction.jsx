"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"

export default function RegisterReproduction({ refreshData, onCloseForm }) {
  const [fecha_nacimiento, setFechaNacimiento] = useState("")
  const [total_conejos, setTotalConejos] = useState("")
  const [nacidos_vivos, setNacidosVivos] = useState("")
  const [nacidos_muertos, setNacidosMuertos] = useState("0")
  const [Id_rabbit, setIdRabbit] = useState("")
  const [rabbit, setRabbit] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cargar datos de conejos para el dropdown
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
        console.error("Error al obtener los conejos:", error)
        setErrorMessage("Error al obtener los conejos")
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
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    // Validaciones
    if (!fecha_nacimiento || !total_conejos || !nacidos_vivos || !Id_rabbit) {
      setErrorMessage("Todos los campos son obligatorios")
      setIsSubmitting(false)
      return
    }

    const total = Number.parseInt(total_conejos, 10)
    const vivos = Number.parseInt(nacidos_vivos, 10)

    if (vivos > total) {
      setErrorMessage("Los nacidos vivos no pueden exceder el total de conejos")
      setIsSubmitting(false)
      return
    }

    try {
      const data = {
        id_reproduction: 0,
        fecha_nacimiento,
        total_conejos: Number.parseInt(total_conejos, 10),
        nacidos_vivos: Number.parseInt(nacidos_vivos, 10),
        nacidos_muertos: Number.parseInt(nacidos_muertos, 10),
        Id_rabbit: Number.parseInt(Id_rabbit, 10),
      }

      console.log("Enviando datos:", data)

      const response = await axiosInstance.post("/Api/Reproduction/CreateReproduction", data)

      if (response.status === 200) {
        setSuccessMessage(response.data.message || "Registro exitoso")

        // Limpiar formulario
        setFechaNacimiento("")
        setTotalConejos("")
        setNacidosVivos("")
        setNacidosMuertos("0")
        setIdRabbit("")

        // Refrescar datos en la página principal
        if (refreshData) {
          setTimeout(() => {
            refreshData()
          }, 1000)
        }
      }
    } catch (error) {
      console.error("Error al registrar reproducción:", error)
      setErrorMessage(error.response?.data?.message || "Error al registrar la reproducción")
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    if (successMessage && onCloseForm) {
      onCloseForm()
    }
    setSuccessMessage("")
    setErrorMessage("")
  }

  return (
    <>
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
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400 relative"
      >
        <h2 className="text-xl font-bold text-center mb-6">Registrar Reproducción</h2>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Coneja:</label>
          {isLoading ? (
            <div className="text-center py-2 border border-gray-300 rounded-lg bg-gray-50">Cargando conejas...</div>
          ) : (
            <select
              value={Id_rabbit}
              onChange={(e) => setIdRabbit(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-600 h-10"
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
            <label htmlFor="fecha_nacimiento" className="block text-gray-700 font-medium mb-2">
              Fecha de Nacimiento:
            </label>
            <input
              type="date"
              value={fecha_nacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              name="fecha_nacimiento"
              id="fecha_nacimiento"
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600 h-10"
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
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600 h-10"
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
              } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600 h-10`}
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
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600 h-10 bg-gray-100"
              required
              min="0"
              placeholder="Calculado automáticamente"
            />
            <p className="text-xs text-gray-500 mt-1">Se calcula automáticamente</p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors w-full"
          >
            {isSubmitting ? "Registrando..." : "Registrar Reproducción"}
          </button>
        </div>
      </form>
    </>
  )
}
