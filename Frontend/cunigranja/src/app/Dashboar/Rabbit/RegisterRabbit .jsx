"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useState, useEffect, useCallback } from "react"
import AlertModal from "@/components/utils/AlertModal"

// Cambiamos a sintaxis de flecha como en RegisterRace
const RegisterRabbit = ({ onCloseForm, refreshData }) => {
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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rabbits, setRabbits] = useState([])
  const [cageCapacity, setCageCapacity] = useState({})
  const [cageOccupancy, setCageOccupancy] = useState({})

  // Estados para validación de nombre duplicado
  const [isValidatingName, setIsValidatingName] = useState(false)
  const [nameValidationError, setNameValidationError] = useState("")

  // Función para cerrar el formulario - usando useCallback para mantener la referencia estable
  const closeForm = useCallback(() => {
    console.log("Cerrando formulario desde closeForm...")

    // Intentar cerrar el formulario de todas las formas posibles
    if (typeof onCloseForm === "function") {
      console.log("Llamando a onCloseForm...")
      onCloseForm()
    }

    // Forzar el cierre del modal usando el evento global
    try {
      console.log("Intentando cerrar modal con evento global...")
      const closeEvent = new CustomEvent("close-modal", { detail: { id: "rabbit-form" } })
      window.dispatchEvent(closeEvent)
    } catch (e) {
      console.error("Error al disparar evento global:", e)
    }

    // Intentar cerrar el diálogo usando la API del DOM
    try {
      console.log("Intentando cerrar diálogo con DOM API...")
      const dialogs = document.querySelectorAll('dialog, [role="dialog"]')
      dialogs.forEach((dialog) => {
        // @ts-ignore
        if (dialog.close && typeof dialog.close === "function") {
          // @ts-ignore
          dialog.close()
        }
      })
    } catch (e) {
      console.error("Error al cerrar diálogos:", e)
    }
  }, [onCloseForm])

  // Registrar el evento global para cerrar el modal
  useEffect(() => {
    // Función para manejar el evento de escape
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        console.log("Tecla Escape detectada, cerrando formulario...")
        closeForm()
      }
    }

    // Agregar event listeners
    window.addEventListener("keydown", handleEscapeKey)

    // Limpiar event listeners al desmontar
    return () => {
      window.removeEventListener("keydown", handleEscapeKey)
    }
  }, [closeForm])

  // Función para validar si el nombre del conejo ya existe (sin mostrar alerta)
  const validateRabbitName = async (rabbitName) => {
    if (!rabbitName.trim()) {
      setNameValidationError("")
      return true
    }

    try {
      setIsValidatingName(true)
      // Consultar todos los conejos para verificar si el nombre ya existe
      const response = await axiosInstance.get("/Api/Rabbit/GetRabbit")

      if (response.status === 200) {
        const existingRabbits = response.data

        console.log("Validando nombre de conejo:", rabbitName)
        console.log(
          "Conejos existentes:",
          existingRabbits.map((rabbit) => ({ id: rabbit.Id_rabbit, name: rabbit.name_rabbit })),
        )

        // Verificar si ya existe un conejo con ese nombre
        const rabbitExists = existingRabbits.some(
          (rabbit) => rabbit.name_rabbit?.toString().toLowerCase() === rabbitName.toString().toLowerCase(),
        )

        if (rabbitExists) {
          setNameValidationError(`El nombre "${rabbitName}" ya está registrado`)
          return false
        } else {
          setNameValidationError("")
          return true
        }
      }
    } catch (error) {
      console.error("Error al validar nombre de conejo:", error)
      setNameValidationError("Error al validar el nombre del conejo")
      return false
    } finally {
      setIsValidatingName(false)
    }
  }

  // Manejar cambio en el nombre del conejo con validación silenciosa
  const handleRabbitNameChange = async (e) => {
    const value = e.target.value
    setNameRabbit(value)

    // Validar después de un pequeño delay para evitar muchas consultas
    if (value.trim()) {
      setTimeout(() => {
        validateRabbitName(value)
      }, 500)
    } else {
      setNameValidationError("")
    }
  }

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
        setShowErrorAlert(true)
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

    // Validaciones básicas
    if (!name_rabbit.trim()) {
      setErrorMessage("El nombre del conejo es obligatorio.")
      setShowErrorAlert(true)
      return
    }

    if (!fecha_registro || !peso_inicial || !sexo_rabbit || !estado || !Id_cage || !Id_race) {
      setErrorMessage("Todos los campos son obligatorios.")
      setShowErrorAlert(true)
      return
    }

    setIsSubmitting(true)

    try {
      // Validar una vez más antes de enviar y AHORA SÍ mostrar error si existe
      const isValid = await validateRabbitName(name_rabbit)
      if (!isValid) {
        setErrorMessage(`El nombre "${name_rabbit}" ya está registrado. Por favor, elija otro nombre.`)
        setShowErrorAlert(true)
        setIsSubmitting(false)
        return
      }

      // Verificar si la jaula seleccionada tiene capacidad disponible
      const cageStatus = checkCageCapacity(Id_cage)

      if (!cageStatus.hasCapacity) {
        setErrorMessage(
          `La jaula seleccionada está llena. Capacidad máxima: ${cageStatus.total} conejos. Actualmente tiene ${cageStatus.current} conejos.`,
        )
        setShowErrorAlert(true)
        setIsSubmitting(false)
        return
      }

      const formattedDate = new Date(fecha_registro).toISOString().split("T")[0]

      const data = {
        Id_rabbit: 0,
        name_rabbit: name_rabbit.trim(),
        fecha_registro: formattedDate,
        peso_inicial: Number.parseInt(peso_inicial, 10),
        sexo_rabbit: sexo_rabbit,
        estado: estado,
        // Always set peso_actual equal to peso_inicial for new rabbits
        peso_actual: Number.parseInt(peso_inicial, 10),
        Id_cage: Number.parseInt(Id_cage, 10),
        Id_race: Number.parseInt(Id_race, 10),
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

        setSuccessMessage(response.data.message || "Conejo registrado con éxito")
        setShowSuccessAlert(true)

        // Limpiar el formulario
        setNameRabbit("")
        setFechaRegistro("")
        setPesoInicial("")
        setSexoRabbit("")
        setEstado("Activo")
        setPesoActual("")
        setIdCage("")
        setIdRace("")
        setNameValidationError("") // Limpiar error de validación
      }
    } catch (error) {
      console.error("Error completo:", error)
      if (error.response?.data) {
        const errData = error.response.data
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
      setShowErrorAlert(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // IMPORTANTE: Implementamos la misma lógica que en UpdateRabbit con mejoras
  const handleCloseSuccessAlert = () => {
    console.log("handleCloseSuccessAlert llamado")
    setShowSuccessAlert(false)
    setSuccessMessage("")

    // Primero actualizamos los datos si es necesario
    if (typeof refreshData === "function") {
      console.log("Llamando a refreshData...")
      refreshData() // Actualiza datos globales (ej. recarga tabla)
    }

    // Usar setTimeout para asegurar que la alerta se cierre primero
    setTimeout(() => {
      console.log("Ejecutando cierre de formulario después de timeout...")
      closeForm()
    }, 100)
  }

  // IMPORTANTE: Implementamos la misma lógica que en UpdateRabbit con mejoras
  const handleCloseErrorAlert = () => {
    console.log("handleCloseErrorAlert llamado")
    setShowErrorAlert(false)
    setErrorMessage("")

    // También cerrar el formulario cuando se cierra la alerta de error
    if (typeof refreshData === "function") {
      console.log("Llamando a refreshData...")
      refreshData() // Actualiza datos globales (ej. recarga tabla)
    }

    // Usar setTimeout para asegurar que la alerta se cierre primero
    setTimeout(() => {
      console.log("Ejecutando cierre de formulario después de timeout...")
      closeForm()
    }, 100)
  }

  return (
    <>
      {/* Alerta de éxito */}
      <AlertModal type="success" message={successMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />

      {/* Alerta de error */}
      <AlertModal type="error" message={errorMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <form
        id="rabbit-form"
        onSubmit={handlerSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400 relative"
      >
        <h2 className="text-xl font-bold text-center mb-6">Registrar Conejo</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nombre conejo: <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name_rabbit}
                onChange={handleRabbitNameChange}
                className={`w-full border rounded-lg p-2 focus:ring-2 h-10 ${
                  nameValidationError ? "border-red-300 focus:ring-red-300" : "border-gray-400 focus:ring-gray-600"
                }`}
                placeholder="Ej: Conejo-001, Bunny, etc."
                required
              />
              {isValidatingName && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                </div>
              )}
            </div>
            {/* Mostrar error de validación silencioso debajo del campo */}
            {nameValidationError && <small className="text-red-500 mt-1 block">{nameValidationError}</small>}
            {!nameValidationError && <small className="text-gray-500">Ingrese un nombre único para el conejo</small>}
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
              min="0"
              value={peso_inicial}
              onChange={(e) => {
                const value = e.target.value
                // Solo permitir números enteros positivos o cero
                if (value === "" || (Number.parseInt(value) >= 0 && !value.includes("."))) {
                  setPesoInicial(value)
                }
              }}
              onKeyDown={(e) => {
                // Prevenir el signo menos, punto decimal, y notación científica
                if (e.key === "-" || e.key === "." || e.key === "e" || e.key === "E") {
                  e.preventDefault()
                }
              }}
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
            disabled={isSubmitting || isValidatingName}
            className={`font-semibold py-3 px-6 rounded-lg transition-colors w-full ${
              isSubmitting || isValidatingName
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-600"
            }`}
          >
            {isSubmitting ? "Registrando..." : isValidatingName ? "Validando..." : "Registrar Conejo"}
          </button>
        </div>
      </form>
    </>
  )
}

export default RegisterRabbit
