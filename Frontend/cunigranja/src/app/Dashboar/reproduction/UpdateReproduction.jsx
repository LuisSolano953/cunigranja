"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useEffect, useState } from "react"
import AlertModal from "@/components/utils/AlertModal"

const UpdateReproduction = ({ reproductionData, onClose, onUpdate }) => {
  const [fecha_nacimiento, setFechaNacimiento] = useState("")
  const [total_conejos, setTotalConejos] = useState("")
  const [nacidos_vivos, setNacidosVivos] = useState("")
  const [nacidos_muertos, setNacidosMuertos] = useState("")
  const [Id_rabbit, setIdRabbit] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rabbit, setRabbit] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [dataInitialized, setDataInitialized] = useState(false)

  // Función para formatear fecha para input date (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ""

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")

      return `${year}-${month}-${day}`
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return ""
    }
  }

  // Función para validar entrada numérica
  const handleNumericInput = (e, setter, maxValue = null) => {
    const value = e.target.value

    // Permitir solo números
    if (value === "" || /^\d+$/.test(value)) {
      const numValue = Number.parseInt(value, 10)

      // Validar valor máximo si se proporciona
      if (maxValue !== null && numValue > maxValue && maxValue > 0) {
        return // No actualizar si excede el máximo
      }

      setter(value)
    }
  }

  // Función para prevenir entrada de caracteres no numéricos
  const handleKeyPress = (e) => {
    // Permitir: backspace, delete, tab, escape, enter
    if (
      [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Permitir: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return
    }
    // Asegurar que es un número
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }

  // Función para inicializar los datos del formulario
  const initializeFormData = () => {
    if (!reproductionData || dataInitialized) return

    console.log("=== INICIALIZANDO DATOS DEL FORMULARIO ===")
    console.log("reproductionData completo:", reproductionData)

    // Formatear y establecer la fecha
    const formattedDate = formatDateForInput(reproductionData.fecha_nacimiento)
    console.log("Fecha original:", reproductionData.fecha_nacimiento)
    console.log("Fecha formateada:", formattedDate)
    setFechaNacimiento(formattedDate)

    // Establecer los campos numéricos
    setTotalConejos(reproductionData.total_conejos?.toString() || "")
    setNacidosVivos(reproductionData.nacidos_vivos?.toString() || "")
    setNacidosMuertos(reproductionData.nacidos_muertos?.toString() || "")

    console.log("Campos numéricos establecidos:", {
      total: reproductionData.total_conejos,
      vivos: reproductionData.nacidos_vivos,
      muertos: reproductionData.nacidos_muertos,
    })

    setDataInitialized(true)
  }

  // Función para establecer la coneja seleccionada
  const setSelectedRabbit = () => {
    if (!reproductionData || !rabbit.length || !dataInitialized) return

    console.log("=== ESTABLECIENDO CONEJA SELECCIONADA ===")
    console.log("ID de coneja en reproductionData:", reproductionData.Id_rabbit)
    console.log("Tipo de ID:", typeof reproductionData.Id_rabbit)

    // Probar diferentes variaciones del nombre del campo
    const possibleIds = [
      reproductionData.Id_rabbit,
      reproductionData.id_rabbit,
      reproductionData.rabbit_id,
      reproductionData.rabbitId,
    ]

    console.log("IDs posibles:", possibleIds)

    let targetRabbitId = null
    for (const id of possibleIds) {
      if (id !== undefined && id !== null) {
        targetRabbitId = id
        break
      }
    }

    if (!targetRabbitId) {
      console.warn("No se encontró ID de coneja en los datos")
      return
    }

    console.log("ID objetivo de coneja:", targetRabbitId)
    console.log("Lista de conejas disponibles:")
    rabbit.forEach((r, index) => {
      const rabbitId = r.Id_rabbit || r.id_rabbit
      console.log(`  ${index}: ID=${rabbitId} (${typeof rabbitId}), Nombre=${r.name_rabbit}`)
    })

    // Buscar la coneja con diferentes comparaciones
    let selectedRabbit = null

    // Comparación directa
    selectedRabbit = rabbit.find((r) => (r.Id_rabbit || r.id_rabbit) === targetRabbitId)

    if (!selectedRabbit) {
      // Comparación convirtiendo a string
      selectedRabbit = rabbit.find((r) => (r.Id_rabbit || r.id_rabbit)?.toString() === targetRabbitId?.toString())
    }

    if (!selectedRabbit) {
      // Comparación convirtiendo a número
      selectedRabbit = rabbit.find((r) => Number(r.Id_rabbit || r.id_rabbit) === Number(targetRabbitId))
    }

    if (selectedRabbit) {
      const rabbitId = (selectedRabbit.Id_rabbit || selectedRabbit.id_rabbit).toString()
      setIdRabbit(rabbitId)
      console.log("✅ Coneja seleccionada correctamente:", selectedRabbit.name_rabbit, "ID:", rabbitId)
    } else {
      console.error("❌ No se pudo encontrar la coneja con ID:", targetRabbitId)
      console.log("Intentando buscar por nombre si está disponible...")

      // Como último recurso, mostrar todas las conejas para debug
      console.log("Todas las conejas disponibles para debug:")
      rabbit.forEach((r) => {
        console.log(`- ${r.name_rabbit}: ID=${r.Id_rabbit || r.id_rabbit}`)
      })
    }
  }

  // Cargar conejas al montar el componente
  useEffect(() => {
    async function fetchRabbit() {
      try {
        setIsLoading(true)
        console.log("Cargando lista de conejas...")
        const response = await axiosInstance.get("/Api/Rabbit/GetRabbit")

        if (response.status === 200) {
          console.log("Respuesta completa de conejas:", response.data)

          // Filtrar solo conejos hembra
          const femaleRabbits = response.data.filter((rabbit) => rabbit.sexo_rabbit === "Hembra")
          console.log("Conejas hembra filtradas:", femaleRabbits.length)
          setRabbit(femaleRabbits)
        }
      } catch (error) {
        console.error("Error al obtener las conejas:", error)
        setErrorMessage("Error al obtener las conejas")
        setShowErrorAlert(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRabbit()
  }, [])

  // Inicializar datos del formulario cuando se reciben los datos
  useEffect(() => {
    initializeFormData()
  }, [reproductionData])

  // Establecer coneja seleccionada cuando se cargan las conejas Y los datos están inicializados
  useEffect(() => {
    setSelectedRabbit()
  }, [rabbit, dataInitialized])

  // Calcular nacidos muertos automáticamente
  useEffect(() => {
    if (total_conejos && nacidos_vivos) {
      const total = Number.parseInt(total_conejos, 10)
      const vivos = Number.parseInt(nacidos_vivos, 10)

      if (vivos > total) {
        setErrorMessage("Los nacidos vivos no pueden exceder el total de conejos")
        return
      } else {
        setErrorMessage("")
      }

      const muertos = total - vivos
      setNacidosMuertos(muertos.toString())
    } else if (total_conejos) {
      setNacidosMuertos(total_conejos)
    } else {
      setNacidosMuertos("0")
    }
  }, [total_conejos, nacidos_vivos])

  // Manejar cambio en nacidos vivos con validación
  const handleNacidosVivosChange = (e) => {
    const value = e.target.value

    // Permitir solo números
    if (value === "" || /^\d+$/.test(value)) {
      const vivos = Number.parseInt(value, 10) || 0
      const total = Number.parseInt(total_conejos, 10) || 0

      if (vivos > total && total > 0) {
        setErrorMessage("Los nacidos vivos no pueden exceder el total de conejos")
      } else {
        setErrorMessage("")
      }

      setNacidosVivos(value)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Validaciones
    if (!fecha_nacimiento || !total_conejos || !nacidos_vivos || !Id_rabbit) {
      setErrorMessage("Todos los campos son obligatorios")
      setShowErrorAlert(true)
      return
    }

    const total = Number.parseInt(total_conejos, 10)
    const vivos = Number.parseInt(nacidos_vivos, 10)

    if (vivos > total) {
      setErrorMessage("Los nacidos vivos no pueden exceder el total de conejos")
      setShowErrorAlert(true)
      return
    }

    if (total <= 0) {
      setErrorMessage("El total de conejos debe ser mayor a 0")
      setShowErrorAlert(true)
      return
    }

    try {
      setIsSubmitting(true)

      const numericId = Number.parseInt(reproductionData.id, 10)

      console.log("Enviando datos de actualización:", {
        id_reproduction: numericId,
        fecha_nacimiento,
        total_conejos: total,
        nacidos_vivos: vivos,
        nacidos_muertos: Number.parseInt(nacidos_muertos, 10),
        Id_rabbit: Number.parseInt(Id_rabbit, 10),
      })

      const response = await axiosInstance.post(`/Api/Reproduction/UpdateReproduction`, {
        id_reproduction: numericId,
        fecha_nacimiento,
        total_conejos: total,
        nacidos_vivos: vivos,
        nacidos_muertos: Number.parseInt(nacidos_muertos, 10),
        Id_rabbit: Number.parseInt(Id_rabbit, 10),
      })

      if (response.status === 200) {
        setSuccessMessage("Reproducción actualizada correctamente")
        setShowSuccessAlert(true)

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
      setShowErrorAlert(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)
    if (typeof onClose === "function") {
      onClose()
    }
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
  }

  return (
    <>
      <AlertModal type="success" message={successMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />
      <AlertModal type="error" message={errorMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <form
        onSubmit={handleSubmit}
        className="p-5 bg-white shadow-lg rounded-lg max-w-md mx-auto border border-gray-400"
      >
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Coneja:</label>
          {isLoading ? (
            <div className="text-center py-2 border border-gray-300 rounded-lg bg-gray-50">Cargando conejas...</div>
          ) : (
            <>
              <select
                value={Id_rabbit}
                onChange={(e) => {
                  console.log("Coneja seleccionada manualmente:", e.target.value)
                  setIdRabbit(e.target.value)
                }}
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
             
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="fecha_reproduction" className="block text-gray-700 font-medium mb-2">
              Fecha de Nacimiento:
            </label>
            <input
              type="date"
              value={fecha_nacimiento}
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
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={total_conejos}
              onChange={(e) => handleNumericInput(e, setTotalConejos)}
              onKeyDown={handleKeyPress}
              name="total_conejos"
              id="total_conejos"
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              placeholder="Ingrese el total"
            />
          </div>

          <div>
            <label htmlFor="nacidos_vivos" className="block text-gray-800 font-medium mb-2">
              Nacidos Vivos:
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={nacidos_vivos}
              onChange={handleNacidosVivosChange}
              onKeyDown={handleKeyPress}
              name="nacidos_vivos"
              id="nacidos_vivos"
              className={`w-full border ${
                Number.parseInt(nacidos_vivos, 10) > Number.parseInt(total_conejos, 10) && total_conejos
                  ? "border-red-500"
                  : "border-gray-400"
              } rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600`}
              required
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
              type="text"
              value={nacidos_muertos}
              readOnly
              name="nacidos_muertos"
              id="nacidos_muertos"
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600 bg-gray-100"
              required
              placeholder="Calculado automáticamente"
            />
            <p className="text-xs text-gray-500 mt-1">Se calcula automáticamente</p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Actualizando..." : "Actualizar Reproducción"}
          </button>
        </div>
      </form>
    </>
  )
}

export default UpdateReproduction
