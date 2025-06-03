"use client"

import { useEffect, useState } from "react"
import AlertModal from "@/components/utils/AlertModal"
import axiosInstance from "@/lib/axiosInstance"

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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [weighingRecords, setWeighingRecords] = useState([])
  const [isLoadingWeighings, setIsLoadingWeighings] = useState(false)
  const [rabbits, setRabbits] = useState([])
  const [showWeightWarning, setShowWeightWarning] = useState(false)
  const [recalculatingWeight, setRecalculatingWeight] = useState(false)

  // Inicializar formulario con datos del conejo cuando el componente se monta
  useEffect(() => {
    if (rabbitData) {
      console.log("Inicializando formulario con datos:", rabbitData)
      setNameRabbit(rabbitData.name_rabbit || "")

      const fechaToUse = rabbitData.fecha_registro || rabbitData.fecha_salida || rabbitData.fecha
      const formattedDate = fechaToUse ? new Date(fechaToUse).toISOString().split("T")[0] : ""

      setFechaRegistro(formattedDate)
      setPesoInicial(rabbitData.peso_inicial || "")
      setOriginalPesoInicial(rabbitData.peso_inicial || "")
      setSexoRabbit(rabbitData.sexo_rabbit || "")
      setEstado(rabbitData.estado || "Activo")
      setPesoActual(rabbitData.peso_actual || "")
      setIdCage(rabbitData.Id_cage || "")
      setIdRace(rabbitData.Id_race || "")

      if (rabbitData.id_rabbit || rabbitData.Id_rabbit) {
        fetchWeighingRecords(rabbitData.id_rabbit || rabbitData.Id_rabbit)
      }
    }
  }, [rabbitData])

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
        console.warn("No hay pesajes para este conejo.")
        setWeighingRecords([])
      } else {
        console.error("Error al obtener registros de pesaje:", error)
      }
    } finally {
      setIsLoadingWeighings(false)
    }
  }

  useEffect(() => {
    if (peso_inicial && originalPesoInicial && peso_inicial !== originalPesoInicial) {
      setShowWeightWarning(true)
    } else {
      setShowWeightWarning(false)
    }
  }, [peso_inicial, originalPesoInicial])

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
          setRace(raceRes.data)
        }
        if (cageRes.status === 200) {
          setCage(cageRes.data)
        }
        if (rabbitsRes.status === 200) {
          setRabbits(rabbitsRes.data)
        }
      } catch (err) {
        console.error("Error al cargar datos:", err)
        setErrorMessage("Error al cargar los datos.")
        setShowErrorAlert(true)
      } finally {
        setIsLoading({ cage: false, race: false })
      }
    }

    fetchData()
  }, [])

  const checkCageCapacity = (idCage) => {
    if (!idCage) return { current: 0, total: 0, remaining: 0, hasCapacity: false }

    const numericCageId = Number.parseInt(idCage, 10)
    const selected = cage.find((c) => Number.parseInt(c.Id_cage, 10) === numericCageId)
    if (!selected) return { current: 0, total: 0, remaining: 0, hasCapacity: false }

    const total = Number.parseInt(selected.cantidad_animales, 10) || 0
    const current = rabbits.filter((r) => {
      const rabbitCageId = Number.parseInt(r.Id_cage, 10)
      return rabbitCageId === numericCageId && r.estado === "Activo"
    }).length

    const remaining = total - current
    const hasCapacity = current < total

    return { current, total, remaining, hasCapacity }
  }

  // ✅ FUNCIÓN MANUAL CORREGIDA - No suma ganancias negativas
  const recalculateWeightManually = async (rabbitId, newPesoInicial) => {
    try {
      setRecalculatingWeight(true)
      console.log("🔧 Recalculando peso manualmente...")
      console.log(`📊 Peso inicial nuevo: ${newPesoInicial}g`)

      const weighingResponse = await axiosInstance.get(`/Api/Weighing/GetWeighingByRabbit?id_rabbit=${rabbitId}`)
      if (weighingResponse.status !== 200) {
        throw new Error("No se pudieron obtener los registros de pesaje")
      }

      const weighings = weighingResponse.data || []
      console.log(`📋 Registros de pesaje obtenidos: ${weighings.length}`)

      if (weighings.length === 0) {
        console.log("ℹ️ No hay pesajes, actualizando solo el peso actual")
        const updateResponse = await axiosInstance.post(`/Api/Rabbit/UpdateRabbitWeight`, {
          Id_rabbit: rabbitId,
          peso_actual: newPesoInicial,
        })

        if (updateResponse.status === 200) {
          console.log("✅ Peso actual actualizado correctamente")
          setPesoActual(newPesoInicial)
        }
        return
      }

      weighings.sort((a, b) => new Date(a.fecha_weighing) - new Date(b.fecha_weighing))

      let pesoAnterior = Number.parseInt(newPesoInicial, 10)
      let pesoAcumulado = Number.parseInt(newPesoInicial, 10) // ✅ Empezamos con el peso inicial

      console.log(`🏁 Iniciando cálculo con peso inicial: ${pesoAcumulado}g`)

      for (const weighing of weighings) {
        const pesoActualRegistro = Number.parseInt(weighing.peso_actual, 10)
        const gananciaReal = pesoActualRegistro - pesoAnterior

        console.log(`📈 Pesaje ${weighing.id_weighing}:`)
        console.log(`   Peso anterior: ${pesoAnterior}g`)
        console.log(`   Peso actual: ${pesoActualRegistro}g`)
        console.log(`   Ganancia real: ${gananciaReal}g`)

        // ✅ CLAVE: Solo sumar ganancias positivas al peso acumulado
        if (gananciaReal > 0) {
          pesoAcumulado += gananciaReal
          console.log(`   ✅ Ganancia positiva sumada. Peso acumulado: ${pesoAcumulado}g`)
        } else {
          console.log(`   ❌ Ganancia negativa/cero IGNORADA. Peso acumulado: ${pesoAcumulado}g`)
        }

        // Actualizar el registro con la ganancia real (puede ser negativa)
        await axiosInstance.post(`/Api/Weighing/UpdateWeighing`, {
          id_weighing: weighing.id_weighing,
          fecha_weighing: weighing.fecha_weighing,
          peso_actual: pesoActualRegistro,
          ganancia_peso: gananciaReal, // Guardamos la ganancia real
          Id_rabbit: rabbitId,
        })

        // El peso anterior para el siguiente cálculo es el peso actual del registro
        pesoAnterior = pesoActualRegistro
      }

      console.log(`🎯 Peso final acumulado calculado: ${pesoAcumulado}g`)

      const updateResponse = await axiosInstance.post(`/Api/Rabbit/UpdateRabbitWeight`, {
        Id_rabbit: rabbitId,
        peso_actual: pesoAcumulado, // ✅ Usar el peso acumulado (sin ganancias negativas)
      })

      if (updateResponse.status === 200) {
        console.log("✅ Peso actual actualizado correctamente")
        setPesoActual(pesoAcumulado.toString())
        fetchWeighingRecords(rabbitId)
      }

      return true
    } catch (error) {
      console.error("❌ Error al recalcular el peso manualmente:", error)
      throw error
    } finally {
      setRecalculatingWeight(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      if (!rabbitData) {
        throw new Error("No se recibieron datos del conejo para actualizar")
      }

      const rabbitId = rabbitData.id || rabbitData.Id || rabbitData.id_rabbit || rabbitData.Id_rabbit

      if (!rabbitId) {
        console.error("Datos del conejo recibidos:", JSON.stringify(rabbitData, null, 2))
        throw new Error("ID del conejo no encontrado para actualizar")
      }

      const numericId = Number.parseInt(rabbitId, 10)
      console.log("🔍 ID del conejo a actualizar:", numericId)

      const pesoInicialInt = Number.parseInt(peso_inicial, 10)
      const pesoActualInt = Number.parseInt(peso_actual, 10)

      const payload = {
        Id_rabbit: numericId,
        name_rabbit,
        fecha_registro,
        peso_inicial: pesoInicialInt,
        sexo_rabbit,
        estado,
        peso_actual: pesoActualInt,
        Id_cage: Number.parseInt(Id_cage, 10),
        Id_race: Number.parseInt(Id_race, 10),
      }

      console.log("📤 Enviando datos de actualización:", payload)

      const response = await axiosInstance.post(`/Api/Rabbit/UpdateRabbit`, payload)

      if (response.status === 200) {
        if (Number.parseInt(originalPesoInicial, 10) !== pesoInicialInt) {
          console.log("⚖️ El peso inicial cambió, recalculando pesos...")
          console.log(`   Peso original: ${originalPesoInicial}g → Nuevo: ${pesoInicialInt}g`)

          try {
            const recalcResponse = await axiosInstance.post("/Api/Weighing/RecalculateRabbitWeight", {
              Id_rabbit: numericId,
              peso_actual: pesoInicialInt,
              fecha_weighing: new Date().toISOString(),
              ganancia_peso: 0,
              Id_user: 1,
            })

            console.log("✅ Peso recalculado correctamente con el endpoint:", recalcResponse.data)

            const updatedRabbitResponse = await axiosInstance.get(`/Api/Rabbit/ConsultRabbit?id=${numericId}`)
            if (updatedRabbitResponse.status === 200) {
              const updatedRabbit = updatedRabbitResponse.data
              setPesoActual(updatedRabbit.peso_actual)
              console.log(`🔄 Peso actual actualizado desde API: ${updatedRabbit.peso_actual}g`)
            }
          } catch (recalcError) {
            console.error("❌ Error al recalcular el peso con el endpoint:", recalcError)

            console.log("🔧 Intentando recalcular manualmente...")
            try {
              await recalculateWeightManually(numericId, pesoInicialInt)
              console.log("✅ Recálculo manual completado con éxito")
            } catch (manualError) {
              console.error("❌ Error en el recálculo manual:", manualError)
            }
          }
        }

        setSuccessMessage("Conejo actualizado correctamente")
        setShowSuccessAlert(true)

        const updatedRabbits = rabbits.map((r) => {
          if (Number.parseInt(r.Id_rabbit, 10) === numericId) {
            return { ...r, ...payload }
          }
          return r
        })
        setRabbits(updatedRabbits)

        fetchWeighingRecords(numericId)
      }
    } catch (error) {
      console.error("❌ Error al actualizar el conejo:", error)
      setErrorMessage(error.response?.data?.message || error.message || "Error desconocido al actualizar el conejo.")
      setShowErrorAlert(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)
    setSuccessMessage("")
    if (typeof onUpdate === "function") {
      onUpdate()
    }
    if (typeof onClose === "function") {
      onClose()
    }
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
    setErrorMessage("")
    if (typeof onUpdate === "function") {
      onUpdate()
    }
    if (typeof onClose === "function") {
      onClose()
    }
  }

  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  const handleNumericInput = (e, setter) => {
    const value = e.target.value.replace(/\D/g, "")
    setter(value)
  }

  return (
    <>
      <AlertModal type="success" message={successMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />
      <AlertModal type="error" message={errorMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400 relative"
      >
        <h2 className="text-xl font-bold text-center mb-6">Actualizar Conejo</h2>

        {showWeightWarning && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-sm text-yellow-800">
            <p className="font-semibold">⚠️ Advertencia:</p>
            <p>
              Cambiar el peso inicial recalculará el peso actual del conejo.
              <br />
              <span className="font-medium">✅ Regla:</span> Las ganancias negativas se IGNORAN y NO se suman al peso
              acumulado.
            </p>
          </div>
        )}

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
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={peso_inicial}
              onChange={(e) => handleNumericInput(e, setPesoInicial)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Peso actual:</label>
            <input
              type="text"
              value={peso_actual}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10 bg-gray-100"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">Se recalculará automáticamente (sin ganancias negativas)</p>
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
                const isFull = !status.hasCapacity && item.Id_cage != rabbitData?.Id_cage
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
                <div
                  key={record.id_weighing || `record-${index}`}
                  className="mb-1 pb-1 border-b border-gray-100 last:border-0"
                >
                  <span className="font-medium">{new Date(record.fecha_weighing).toLocaleDateString()}:</span> Peso:{" "}
                  {record.peso_actual}g, Ganancia:{" "}
                  <span className={record.ganancia_peso < 0 ? "text-red-600" : "text-green-600"}>
                    {record.ganancia_peso}g
                  </span>
                  {record.ganancia_peso < 0 && <span className="text-red-500 text-xs"> (ignorada)</span>}
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
            disabled={isSubmitting || recalculatingWeight}
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors w-full disabled:opacity-50"
          >
            {isSubmitting || recalculatingWeight ? "Actualizando..." : "Actualizar Conejo"}
          </button>
        </div>
      </form>
    </>
  )
}

export default UpdateRabbit
