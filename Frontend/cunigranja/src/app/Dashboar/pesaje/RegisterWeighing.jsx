"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useState, useEffect } from "react"

const RegisterWeighing = ({ refreshData, onCloseForm }) => {
  const [fecha_weighing, setFechaWeighing] = useState("")
  const [ganancia_peso, setGananciaPeso] = useState("")
  const [id_rabbit, setIdRabbit] = useState("")
  const [peso_actual, setPesoActual] = useState("")
  const [id_user, setIdUser] = useState("")
  const [rabbit, setRabbit] = useState([])
  const [selectedRabbitData, setSelectedRabbitData] = useState(null)
  const [users, setUsers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [rabbit, userRes] = await Promise.all([
          axiosInstance.get("/Api/Rabbit/GetRabbit"),
          axiosInstance.get("/Api/User/AllUser"),
        ])
        setRabbit(rabbit.data || [])
        setUsers(userRes.data || [])
      } catch (error) {
        console.error("Error al obtener datos:", error)
      }
    }
    fetchData()
  }, [])

  // When rabbit selection changes, fetch the rabbit data to get peso_inicial
  useEffect(() => {
    async function fetchRabbitData() {
      if (!id_rabbit) {
        setSelectedRabbitData(null)
        setPesoActual("")
        setGananciaPeso("")
        return
      }

      try {
        // Importante: Asegurarse de que el ID sea un número entero
        const rabbitId = Number.parseInt(id_rabbit, 10)

        if (isNaN(rabbitId)) {
          console.error("ID de conejo inválido:", id_rabbit)
          setErrorMessage("ID de conejo inválido")
          return
        }

        // Añadir un parámetro de timestamp para evitar caché
        const timestamp = new Date().getTime()

        // Usar el formato correcto para el endpoint: id=123 (sin llaves)
        const response = await axiosInstance.get(`/Api/Rabbit/ConsultRabbit?id=${rabbitId}&_t=${timestamp}`)

        if (response.status === 200) {
          console.log("Datos del conejo seleccionado:", response.data)
          setSelectedRabbitData(response.data)
          // Clear the current weight input to force user to enter new measurement
          setPesoActual("")
          setGananciaPeso("")
        }
      } catch (error) {
        console.error("Error al obtener datos del conejo:", error)
        // Mostrar información más detallada sobre el error
        if (error.response) {
          console.log("Detalles del error:", error.response.data)

          // Si hay errores específicos de validación, mostrarlos
          if (error.response.data && error.response.data.errors) {
            const errorDetails = JSON.stringify(error.response.data.errors)
            setErrorMessage(`Error de validación: ${errorDetails}`)
          } else {
            setErrorMessage(`Error al obtener datos del conejo: ${error.response.status} ${error.response.statusText}`)
          }
        } else {
          setErrorMessage(`Error al obtener datos del conejo: ${error.message}`)
        }
      }
    }

    fetchRabbitData()
  }, [id_rabbit])

  // Calculate weight gain automatically when peso_actual changes
  useEffect(() => {
    if (selectedRabbitData && peso_actual) {
      const currentWeight = Number.parseFloat(peso_actual)
      const initialWeight = Number.parseFloat(selectedRabbitData.peso_inicial)

      // Calculate the weight gain as current weight - initial weight
      const weightGain = currentWeight - initialWeight

      // Update the ganancia_peso field
      setGananciaPeso(weightGain.toFixed(2))
      setIsCalculating(false)
    }
  }, [selectedRabbitData, peso_actual])

  // Función para verificar si el peso actual del conejo se actualizó correctamente
  async function verifyRabbitUpdate(rabbitId) {
    try {
      const timestamp = new Date().getTime()
      // Asegurarse de que el ID sea un número entero
      const numericId = Number.parseInt(rabbitId, 10)

      if (isNaN(numericId)) {
        console.error("ID de conejo inválido para verificación:", rabbitId)
        return null
      }

      const response = await axiosInstance.get(`/Api/Rabbit/ConsultRabbit?id=${numericId}&_t=${timestamp}`)
      if (response.status === 200) {
        const updatedRabbit = response.data
        console.log("Datos del conejo después de la actualización:", updatedRabbit)
        return updatedRabbit
      }
    } catch (error) {
      console.error("Error al verificar la actualización del conejo:", error)
      return null
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmitting) return

    // Validate form data
    if (!fecha_weighing || !id_rabbit || !id_user || !peso_actual) {
      setErrorMessage("Todos los campos son obligatorios")
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")
    setDebugInfo("")

    try {
      // Obtener los datos más recientes del conejo antes de actualizar
      const timestamp = new Date().getTime()
      // Asegurarse de que el ID sea un número entero
      const rabbitId = Number.parseInt(id_rabbit, 10)

      if (isNaN(rabbitId)) {
        throw new Error("ID de conejo inválido")
      }

      const rabbitResponse = await axiosInstance.get(`/Api/Rabbit/ConsultRabbit?id=${rabbitId}&_t=${timestamp}`)
      const freshRabbitData = rabbitResponse.data

      console.log("Datos frescos del conejo antes de actualizar:", freshRabbitData)
      let debugText = `Peso actual antes de actualizar: ${freshRabbitData.peso_actual}\n`

      // First, create the weighing record
      const weighingBody = {
        Id_weighing: 0,
        fecha_weighing: new Date(fecha_weighing).toISOString(),
        ganancia_peso: Number.parseFloat(ganancia_peso) || 0,
        peso_actual: Number.parseFloat(peso_actual) || 0,
        Id_rabbit: rabbitId,
        Id_user: Number.parseInt(id_user, 10) || 0,
      }

      console.log("Enviando datos de pesaje:", weighingBody)
      const response = await axiosInstance.post("/Api/Weighing/CreateWeighing", weighingBody)
      debugText += `Registro de pesaje creado con éxito. Ganancia: ${weighingBody.ganancia_peso}\n`

      // Then, update the rabbit's current weight by adding the weight gain
      if (response.status === 200 && freshRabbitData) {
        // Calcular el nuevo peso acumulado sumando la ganancia de peso al peso actual existente
        const currentPesoActual = Number.parseFloat(freshRabbitData.peso_actual) || 0
        const weightGain = Number.parseFloat(ganancia_peso) || 0
        const newPesoActual = currentPesoActual + weightGain

        console.log("Cálculo de nuevo peso acumulado:", {
          pesoActualExistente: currentPesoActual,
          gananciaPeso: weightGain,
          nuevoPesoAcumulado: newPesoActual,
        })

        debugText += `Cálculo: ${currentPesoActual} + ${weightGain} = ${newPesoActual}\n`

        // Asegurarse de que todos los IDs sean números enteros
        const rabbitCageId = Number.parseInt(freshRabbitData.id_cage || freshRabbitData.Id_cage, 10)
        const rabbitRaceId = Number.parseInt(freshRabbitData.id_race || freshRabbitData.Id_race, 10)

        if (isNaN(rabbitCageId) || isNaN(rabbitRaceId)) {
          throw new Error("ID de jaula o raza inválido")
        }

        // Crear un objeto con solo los campos necesarios para actualizar el conejo
        const rabbitUpdateData = {
          Id_rabbit: rabbitId,
          name_rabbit: freshRabbitData.name_rabbit,
          fecha_registro: freshRabbitData.fecha_registro,
          peso_inicial: Number.parseFloat(freshRabbitData.peso_inicial),
          sexo_rabbit: freshRabbitData.sexo_rabbit,
          estado: freshRabbitData.estado,
          peso_actual: newPesoActual, // Usar el peso acumulado
          Id_cage: rabbitCageId,
          Id_race: rabbitRaceId,
        }

        console.log("Enviando datos de actualización del conejo:", rabbitUpdateData)

        try {
          // Update the rabbit record with the new accumulated weight
          const updateResponse = await axiosInstance.post("/Api/Rabbit/UpdateRabbit", rabbitUpdateData)
          console.log("Respuesta de actualización del conejo:", updateResponse.data)
          debugText += `Conejo actualizado con éxito. Nuevo peso acumulado: ${newPesoActual}\n`

          // Verificar si la actualización se realizó correctamente
          setTimeout(async () => {
            const verifiedRabbit = await verifyRabbitUpdate(id_rabbit)
            if (verifiedRabbit) {
              debugText += `Verificación: Peso actual después de actualizar: ${verifiedRabbit.peso_actual}\n`
              if (Math.abs(verifiedRabbit.peso_actual - newPesoActual) < 0.01) {
                debugText += `✅ La actualización se realizó correctamente.\n`
              } else {
                debugText += `❌ La actualización NO se realizó correctamente. El peso actual debería ser ${newPesoActual} pero es ${verifiedRabbit.peso_actual}\n`
              }
              setDebugInfo(debugText)
            }
          }, 1000)
        } catch (updateError) {
          console.error("Error al actualizar el conejo:", updateError)
          debugText += `❌ Error al actualizar el conejo: ${updateError.message}\n`
          if (updateError.response?.data) {
            debugText += `Detalles: ${JSON.stringify(updateError.response.data)}\n`
          }
          setDebugInfo(debugText)
          throw updateError
        }
      }

      setSuccessMessage("Pesaje registrado con éxito y peso del conejo actualizado")

      // Reset form
      setFechaWeighing("")
      setGananciaPeso("")
      setIdRabbit("")
      setPesoActual("")
      setIdUser("")
      setSelectedRabbitData(null)

      // Refresh the data in the parent component
      if (typeof refreshData === "function") {
        setTimeout(() => {
          refreshData()
        }, 1500)
      }
    } catch (error) {
      console.error("Error completo:", error)
      const errorMsg = error.response?.data?.message || error.message || "Error al registrar pesaje"
      setErrorMessage(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setSuccessMessage("")
    setErrorMessage("")
    if (typeof refreshData === "function") {
      refreshData()
    }
    if (typeof onCloseForm === "function") {
      onCloseForm()
    }
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
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto border border-gray-400 relative"
      >
        <h2 className="text-xl font-bold text-center mb-6">Registrar Pesaje</h2>

        {debugInfo && (
          <div className="mb-4 p-3 bg-gray-100 rounded text-xs font-mono whitespace-pre-wrap">
            <h3 className="font-bold mb-1">Información de depuración:</h3>
            {debugInfo}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Conejo:</label>
            <select
              value={id_rabbit}
              onChange={(e) => setIdRabbit(e.target.value)}
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
            >
              <option value="">Seleccione</option>
              {rabbit.map((r) => (
                <option key={r.id_rabbit || r.Id_rabbit} value={r.id_rabbit || r.Id_rabbit}>
                  {r.name_rabbit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Fecha del Pesaje:</label>
            <input
              type="datetime-local"
              value={fecha_weighing}
              onChange={(e) => setFechaWeighing(e.target.value)}
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Peso actual medido (kg):</label>
            <input
              type="number"
              step="0.01"
              value={peso_actual}
              onChange={(e) => {
                setPesoActual(e.target.value)
                setIsCalculating(true)
              }}
              required
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Ganancia de Peso (kg):</label>
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
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
            >
              <option value="">Seleccione</option>
              {users.map((u) => (
                <option key={u.id_user || u.Id_user} value={u.id_user || u.Id_user}>
                  {u.name_user}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedRabbitData && (
          <div className="mb-4 text-xs text-gray-600 border-t pt-2">
            <p>Información del conejo seleccionado:</p>
            <p>Peso inicial: {selectedRabbitData.peso_inicial} kg</p>
            <p>Peso actual acumulado: {selectedRabbitData.peso_actual} kg</p>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrar Pesaje"}
          </button>
        </div>
      </form>
    </>
  )
}

export default RegisterWeighing
