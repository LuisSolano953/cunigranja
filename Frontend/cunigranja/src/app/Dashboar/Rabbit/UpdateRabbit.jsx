"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useEffect, useState } from "react"

const UpdateRabbit = ({ rabbitData, onClose, onUpdate }) => {
  const [name_rabbit, setNameRabbit] = useState("")
  const [fecha_registro, setFechaRegistro] = useState("")
  const [peso_inicial, setPesoInicial] = useState("")
  const [originalPesoInicial, setOriginalPesoInicial] = useState("")
  const [sexo_rabbit, setSexoRabbit] = useState("")
  const [estado, setEstado] = useState("Activo")
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
  const [weighingRecords, setWeighingRecords] = useState([])
  const [isLoadingWeighings, setIsLoadingWeighings] = useState(false)
  const [rabbits, setRabbits] = useState([])

  // Depuración: Mostrar el contenido completo de rabbitData
  useEffect(() => {
    console.log("rabbitData recibido:", rabbitData)
    console.log("Propiedades de ID disponibles:", {
      id: rabbitData?.id,
      Id: rabbitData?.Id,
      id_rabbit: rabbitData?.id_rabbit,
      Id_rabbit: rabbitData?.Id_rabbit,
    })
  }, [rabbitData])

  // Initialize form with rabbit data when component mounts
  useEffect(() => {
    if (rabbitData) {
      console.log("Inicializando formulario con datos:", rabbitData)
      setNameRabbit(rabbitData.name_rabbit || "")

      // Verificar si tenemos fecha_registro o fecha_salida
      const fechaToUse = rabbitData.fecha_registro || rabbitData.fecha_salida || rabbitData.fecha
      console.log("Fecha a utilizar:", fechaToUse)

      // Formatear la fecha para el input date (YYYY-MM-DD)
      const formattedDate = fechaToUse ? new Date(fechaToUse).toISOString().split("T")[0] : ""
      console.log("Fecha formateada:", formattedDate)

      setFechaRegistro(formattedDate)
      setPesoInicial(rabbitData.peso_inicial || "")
      setOriginalPesoInicial(rabbitData.peso_inicial || "")
      setSexoRabbit(rabbitData.sexo_rabbit || "")
      setEstado(rabbitData.estado || "Activo")
      setPesoActual(rabbitData.peso_actual || "")
      setIdCage(rabbitData.Id_cage || "")
      setIdRace(rabbitData.Id_race || "")

      // Cargar los registros de pesaje para este conejo
      if (rabbitData.id_rabbit || rabbitData.Id_rabbit) {
        fetchWeighingRecords(rabbitData.id_rabbit || rabbitData.Id_rabbit)
      }
    }
  }, [rabbitData])

  // Fetch weighing records for this rabbit
  const fetchWeighingRecords = async (rabbitId) => {
    try {
      setIsLoadingWeighings(true)
      const response = await axiosInstance.get(`/Api/Weighing/GetWeighingByRabbit?id_rabbit=${rabbitId}`)
      if (response.status === 200) {
        console.log("Registros de pesaje:", response.data)
        setWeighingRecords(response.data || [])
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // Es un caso esperado: no hay registros de pesaje
        console.warn("No hay pesajes para este conejo.")
        setWeighingRecords([])
      } else {
        console.error("Error al obtener registros de pesaje:", error)
      }
    } finally {
      setIsLoadingWeighings(false)
    }
  }

  // Recalculate current weight when initial weight changes
  useEffect(() => {
    if (peso_inicial && originalPesoInicial && weighingRecords.length > 0) {
      // Calcular la diferencia entre el nuevo peso inicial y el original
      const pesoInicialDiff = Number.parseFloat(peso_inicial) - Number.parseFloat(originalPesoInicial)
      console.log("Diferencia de peso inicial:", pesoInicialDiff)

      // Obtener el último registro de pesaje para obtener el peso actual medido
      const lastWeighing = weighingRecords[weighingRecords.length - 1]

      if (lastWeighing) {
        // Recalcular el peso actual basado en el último peso medido y la diferencia del peso inicial
        const lastMeasuredWeight = Number.parseFloat(lastWeighing.peso_actual || 0)

        // Calcular la ganancia de peso con el nuevo peso inicial
        const newGananciaPeso = lastMeasuredWeight - Number.parseFloat(peso_inicial)

        // El nuevo peso actual es el peso inicial más la ganancia de peso
        const newPesoActual = Number.parseFloat(peso_inicial) + newGananciaPeso

        console.log("Recálculo de peso actual:", {
          pesoInicialOriginal: originalPesoInicial,
          nuevoPesoInicial: peso_inicial,
          diferencia: pesoInicialDiff,
          ultimoPesoMedido: lastMeasuredWeight,
          nuevaGananciaPeso: newGananciaPeso,
          nuevoPesoActual: newPesoActual,
        })

        // Actualizar el peso actual en el formulario
        setPesoActual(newPesoActual.toFixed(2))
      }
    }
  }, [peso_inicial, originalPesoInicial, weighingRecords])

  // Fetch mounts data for dropdown
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
        }

        if (rabbitsRes.status === 200) {
          console.log("Datos de conejos:", rabbitsRes.data)
          setRabbits(rabbitsRes.data)
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

  // Función mejorada para verificar la capacidad de la jaula
  const checkCageCapacity = (idCage) => {
    if (!idCage) return { current: 0, total: 0, remaining: 0, hasCapacity: false }

    // Convertir a número para asegurar comparaciones correctas
    const numericCageId = Number.parseInt(idCage, 10)

    // Encontrar la jaula seleccionada
    const selected = cage.find((c) => Number.parseInt(c.Id_cage, 10) === numericCageId)
    if (!selected) return { current: 0, total: 0, remaining: 0, hasCapacity: false }

    // Obtener la capacidad máxima
    const total = Number.parseInt(selected.cantidad_animales, 10) || 0

    // Contar cuántos conejos ACTIVOS están en esta jaula
    const current = rabbits.filter((r) => {
      const rabbitCageId = Number.parseInt(r.Id_cage, 10)
      return rabbitCageId === numericCageId && r.estado === "Activo"
    }).length

    const remaining = total - current
    const hasCapacity = current < total

    return { current, total, remaining, hasCapacity }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Verificar si tenemos alguna propiedad de ID
      if (!rabbitData) {
        throw new Error("No se recibieron datos del conejo para actualizar")
      }

      // Intentar obtener el ID de cualquier propiedad disponible
      const rabbitId = rabbitData.id || rabbitData.Id || rabbitData.id_rabbit || rabbitData.Id_rabbit

      if (!rabbitId) {
        console.error("Datos del conejo recibidos:", JSON.stringify(rabbitData, null, 2))
        throw new Error("ID del conejo no encontrado para actualizar")
      }

      const numericId = Number.parseInt(rabbitId, 10)
      console.log("ID del conejo a actualizar:", numericId)

      // Guardar la jaula anterior para actualizarla después
      const previousCageId = Number.parseInt(rabbitData.Id_cage, 10)
      const newCageId = Number.parseInt(Id_cage, 10)
      const cageChanged = previousCageId !== newCageId

      const payload = {
        Id_rabbit: numericId,
        name_rabbit,
        fecha_registro,
        peso_inicial: Number.parseFloat(peso_inicial),
        sexo_rabbit,
        estado,
        peso_actual: Number.parseFloat(peso_actual),
        Id_cage: newCageId,
        Id_race: Number.parseInt(Id_race),
      }

      console.log("Enviando datos de actualización:", payload)

      const response = await axiosInstance.post(`/Api/Rabbit/UpdateRabbit`, payload)

      if (response.status === 200) {
        // No actualizamos el estado de ninguna jaula, solo cambiamos el Id_cage del conejo

        setSuccessMessage("Conejo actualizado correctamente")

        // Actualizar la lista de conejos para reflejar los cambios
        const updatedRabbits = rabbits.map((r) => {
          if (Number.parseInt(r.Id_rabbit, 10) === numericId) {
            return { ...r, ...payload }
          }
          return r
        })
        setRabbits(updatedRabbits)
      }
    } catch (error) {
      console.error("Error al actualizar el conejo:", error)
      setErrorMessage(error.response?.data?.message || error.message || "Error desconocido al actualizar el conejo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setSuccessMessage("")
    setErrorMessage("")
    if (typeof onUpdate === "function") {
      onUpdate() // Actualiza datos globales (ej. recarga tabla)
    }
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
      {(errorMessage || successMessage) && (
        <>
          {/* Overlay con cobertura extendida */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            style={{
              height: "125vh",
              width: "100%",
              top: 0,
              left: 0,
              position: "fixed",
              overflow: "hidden",
            }}
          ></div>

          {/* Contenedor del modal con posición ajustada */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pointer-events-none">
            <div
              className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full pointer-events-auto"
              style={{
                marginTop: "350px",
              }}
            >
              <h2 className="text-xl font-semibold text-center mb-4">{errorMessage ? "Error" : "Éxito"}</h2>
              <p className="text-center mb-6">
                {errorMessage
                  ? "Ha ocurrido un error en la operación. Por favor, inténtelo de nuevo."
                  : "La operación se ha completado con éxito."}
              </p>
              <button
                onClick={closeModal}
                className={`w-full py-2 px-4 ${
                  errorMessage ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                } text-white font-semibold rounded-lg shadow-md transition duration-300`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400 relative"
      >
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
              value={formatDateForInput(fecha_registro)}
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
              onChange={(e) => {
                setPesoInicial(e.target.value)
              }}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            />
            {originalPesoInicial !== peso_inicial && (
              <p className="text-xs text-orange-500 mt-1">
                Cambiar el peso inicial recalculará el peso actual basado en los registros de pesaje.
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Peso actual:</label>
            <input
              type="number"
              step="0.01"
              value={peso_actual}
              onChange={(e) => setPesoActual(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10 bg-gray-100"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">Se calcula automáticamente basado en los registros de pesaje</p>
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
                const isFull = !status.hasCapacity && item.Id_cage != rabbitData?.Id_cage // permite la actual si ya estaba seleccionada
                return (
                  <option key={item.Id_cage} value={item.Id_cage} disabled={isFull}>
                    {item.estado_cage} - {status.current}/{status.total} {isFull ? "(Llena)" : ""}
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

        {isLoadingWeighings ? (
          <div className="text-center text-sm text-gray-500 mb-4">Cargando registros de pesaje...</div>
        ) : weighingRecords.length > 0 ? (
          <div className="mb-4 px-3">
            <p className="text-sm font-medium mb-2">Registros de pesaje ({weighingRecords.length}):</p>
            <div className="text-xs text-gray-600 max-h-32 overflow-y-auto border rounded p-2">
            {weighingRecords.map((record, index) => (
            <div key={record.id_weighing || `record-${index}`} className="mb-1 pb-1 border-b border-gray-100 last:border-0">
                  <span className="font-medium">{new Date(record.fecha_weighing).toLocaleDateString()}:</span> Peso:{" "}
                  {record.peso_actual}kg, Ganancia: {record.ganancia_peso}kg
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500 mb-4">No hay registros de pesaje para este conejo</div>
        )}

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors w-full"
          >
            {isSubmitting ? "Actualizando..." : "Actualizar Conejo"}
          </button>
        </div>
      </form>
    </>
  )
}

export default UpdateRabbit
