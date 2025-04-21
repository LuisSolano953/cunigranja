"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"

export default function RegisterRabbit({ refreshData, onCloseForm }) {
  // Estados del formulario
  const [name_rabbit, setNameRabbit] = useState("")
  const [fecha_registro, setFechaRegistro] = useState("")
  const [peso_inicial, setPesoInicial] = useState("")
  const [sexo_rabbit, setSexoRabbit] = useState("")
  const [estado, setEstado] = useState("Activo")
  // peso_actual is managed internally but not shown to the user
  const [peso_actual, setPesoActual] = useState("")
  const [Id_cage, setIdCage] = useState("")
  const [cage, setCage] = useState([])
  const [Id_race, setIdRace] = useState("")
  const [race, setRace] = useState([])
  const [isLoading, setIsLoading] = useState({ cage: false, race: false })
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  const [apiResponse, setApiResponse] = useState("")
  const [rabbits, setRabbits] = useState([])
  const [cageCapacity, setCageCapacity] = useState({})
  const [cageOccupancy, setCageOccupancy] = useState({})

  // Cargar datos de jaulas y razas al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading({ cage: true, race: true })
        const [cageRes, raceRes, rabbitsRes] = await Promise.all([
          axiosInstance.get("/Api/Cage/GetCage"),
          axiosInstance.get("/Api/Race/GetRace"),
          axiosInstance.get("/Api/Rabbit/GetRabbit"),
        ])

        if (raceRes.status === 200) {
          console.log("Datos de razas:", raceRes.data)
          setRace(raceRes.data)
        }

        if (cageRes.status === 200) {
          console.log("Datos de jaulas:", cageRes.data)
          setCage(cageRes.data)

          // Crear un objeto con la capacidad de cada jaula
          const capacityMap = {}
          cageRes.data.forEach((cage) => {
            capacityMap[cage.Id_cage] = cage.cantidad_animales
          })
          setCageCapacity(capacityMap)
        }

        if (rabbitsRes.status === 200) {
          console.log("Datos de conejos:", rabbitsRes.data)
          setRabbits(rabbitsRes.data)

          // Contar cuántos conejos hay en cada jaula
          const occupancyMap = {}
          rabbitsRes.data.forEach((rabbit) => {
            const cageId = rabbit.Id_cage || rabbit.id_cage
            if (cageId && rabbit.estado === "Activo") {
              occupancyMap[cageId] = (occupancyMap[cageId] || 0) + 1
            }
          })
          setCageOccupancy(occupancyMap)
        }
      } catch (err) {
        console.error("Error al cargar datos:", err)
        setErrorMessage("Error al cargar los datos.")
      } finally {
        setIsLoading({ cage: false, race: false })
      }
    }

    fetchData()
  }, [])

  // When peso_inicial changes, automatically set peso_actual to the same value
  useEffect(() => {
    if (peso_inicial) {
      setPesoActual(peso_inicial)
    }
  }, [peso_inicial])

  // Verificar si una jaula tiene capacidad disponible
  const checkCageCapacity = (cageId) => {
    if (!cageId) return { hasCapacity: false, remaining: 0, total: 0, current: 0 }

    // Convertir a número para asegurar comparaciones correctas
    const numericCageId = Number.parseInt(cageId, 10)

    // Encontrar la jaula seleccionada
    const selectedCage = cage.find((c) => Number.parseInt(c.Id_cage, 10) === numericCageId)
    if (!selectedCage) return { hasCapacity: false, remaining: 0, total: 0, current: 0 }

    // Obtener la capacidad máxima
    const capacity = Number.parseInt(selectedCage.cantidad_animales, 10) || 0

    // Contar cuántos conejos ACTIVOS están en esta jaula
    const occupancy = rabbits.filter((r) => {
      const rabbitCageId = Number.parseInt(r.Id_cage || r.id_cage, 10)
      return rabbitCageId === numericCageId && r.estado === "Activo"
    }).length

    return {
      hasCapacity: occupancy < capacity,
      remaining: capacity - occupancy,
      total: capacity,
      current: occupancy,
    }
  }

  async function handlerSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")
    setDebugInfo("")
    setApiResponse("")

    if (!name_rabbit || !fecha_registro || !peso_inicial || !sexo_rabbit || !estado || !Id_cage || !Id_race) {
      setErrorMessage("Todos los campos son obligatorios.")
      setIsSubmitting(false)
      return
    }

    // Verificar si la jaula seleccionada tiene capacidad disponible
    const cageStatus = checkCageCapacity(Id_cage)

    if (!cageStatus.hasCapacity) {
      setErrorMessage(
        `La jaula seleccionada está llena. Capacidad máxima: ${cageStatus.total} conejos. Actualmente tiene ${cageStatus.current} conejos.`,
      )
      setIsSubmitting(false)
      return
    }

    try {
      const formattedDate = new Date(fecha_registro).toISOString().split("T")[0]

      const data = {
        Id_rabbit: 0,
        name_rabbit: name_rabbit,
        fecha_registro: formattedDate,
        peso_inicial: Number.parseFloat(peso_inicial),
        sexo_rabbit: sexo_rabbit,
        estado: estado,
        // Always set peso_actual equal to peso_inicial for new rabbits
        peso_actual: Number.parseFloat(peso_inicial),
        Id_cage: Number.parseInt(Id_cage),
        Id_race: Number.parseInt(Id_race),
      }

      console.log("Enviando datos:", data)

      const response = await axiosInstance.post("/Api/Rabbit/CreateRabbit", data)

      if (response.status === 200) {
        // Actualizar la lista de conejos para reflejar el nuevo conejo
        setRabbits((prev) => [...prev, data])

        // Actualizar el contador de ocupación de la jaula
        setCageOccupancy((prev) => ({
          ...prev,
          [Id_cage]: (prev[Id_cage] || 0) + 1,
        }))

        // No actualizamos el estado de la jaula

        setSuccessMessage(response.data.message || "Registro exitoso")
        setNameRabbit("")
        setFechaRegistro("")
        setPesoInicial("")
        setSexoRabbit("")
        setEstado("Activo")
        setPesoActual("")
        setIdCage("")
        setIdRace("")
        if (refreshData) refreshData()
      }
    } catch (error) {
      console.error("Error completo:", error)
      if (error.response?.data) {
        const errData = error.response.data
        setApiResponse(JSON.stringify(errData, null, 2))
        if (errData.errors) {
          let msg = ""
          for (const key in errData.errors) {
            msg += `${key}: ${errData.errors[key].join(", ")} `
          }
          setErrorMessage(msg)
        } else {
          setErrorMessage(errData.message || "Error al registrar el conejo.")
        }
      } else {
        setErrorMessage("Error desconocido al registrar el conejo.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    if (successMessage && onCloseForm) {
      onCloseForm() // Cierra el formulario (ej. modal padre)
    }
    setSuccessMessage("") // Cierra la alerta
    setErrorMessage("")
    setDebugInfo("")
    setApiResponse("")
  }

  return (
    <>
      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Error</h2>
            <p className="text-center mb-6">{errorMessage}</p>
            <button
              onClick={closeModal}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
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
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handlerSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400 relative"
      >
        <h2 className="text-xl font-bold text-center mb-6">Registrar Conejo</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nombre conejo:</label>
            <input
              type="text"
              value={name_rabbit}
              onChange={(e) => setNameRabbit(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Fecha registro:</label>
            <input
              type="date"
              value={fecha_registro}
              onChange={(e) => setFechaRegistro(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Peso inicial:</label>
            <input
              type="number"
              step="0.01"
              value={peso_inicial}
              onChange={(e) => setPesoInicial(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Sexo:</label>
            <select
              value={sexo_rabbit}
              onChange={(e) => setSexoRabbit(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            >
              <option value="">Seleccione</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Estado del conejo:</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            >
              <option value="">Seleccione un estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Jaula:</label>
            <select
              value={Id_cage}
              onChange={(e) => setIdCage(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            >
              <option value="">Seleccione</option>
              {cage.map((item) => {
                const status = checkCageCapacity(item.Id_cage)
                const isFull = !status.hasCapacity
                return (
                  <option key={item.Id_cage} value={item.Id_cage} disabled={isFull}>
                    {item.Id_cage} - {status.current}/{status.total} {isFull ? "(Llena)" : ""}
                  </option>
                )
              })}
            </select>
            {Id_cage && (
              <p className="text-xs text-gray-600 mt-1">
                {(() => {
                  const status = checkCageCapacity(Id_cage)
                  return `Capacidad: ${status.current}/${status.total} conejos (${status.remaining} disponibles)`
                })()}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Raza:</label>
            <select
              value={Id_race}
              onChange={(e) => setIdRace(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            >
              <option value="">Seleccione</option>
              {race.map((item) => (
                <option key={item.Id_race} value={item.Id_race}>
                  {item.nombre_race}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors w-full"
          >
            {isSubmitting ? "Registrando..." : "Registrar Conejo"}
          </button>
        </div>
      </form>
    </>
  )
}
