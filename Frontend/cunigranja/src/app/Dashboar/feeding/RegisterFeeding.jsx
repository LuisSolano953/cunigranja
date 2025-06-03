"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axiosInstance"
import AlertModal from "@/components/utils/AlertModal"

const RegisterFeeding = ({ refreshData, onCloseForm }) => {
  const [fecha_feeding, setFechaFeeding] = useState("")
  const [hora_feeding, setHoraFeeding] = useState("")
  const [cantidad_feeding, setCantidadFeeding] = useState("100") // Por defecto 100 gramos
  const [Id_food, setIdFood] = useState("")
  const [food, setFood] = useState([])
  const [Id_rabbit, setIdRabbit] = useState("")
  const [rabbit, setRabbit] = useState([])
  const [Id_user, setIdUser] = useState("")
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState({ users: false, rabbit: false, food: false })
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3

  // Campo calculado automáticamente - solo para mostrar al usuario
  const [existencia_actual_g, setExistenciaActualG] = useState("")

  // Función para formatear números con 2 decimales
  const formatDecimal = (num) => {
    if (num === null || num === undefined) return ""
    // Convertir a número para asegurar el formato correcto
    const numValue = Number.parseFloat(num)
    // Redondear a 2 decimales
    return Math.round(numValue * 100) / 100
  }

  // Función para extraer el mensaje de error de diferentes formatos de respuesta
  const extractErrorMessage = (error) => {
    if (!error) return "Error desconocido"

    // Si es un string, devolverlo directamente
    if (typeof error === "string") return error

    // Si es un objeto de respuesta de axios
    if (error.response) {
      // Si la respuesta tiene un mensaje de error en formato string
      if (typeof error.response.data === "string") {
        return error.response.data
      }

      // Si la respuesta tiene un objeto con mensaje
      if (error.response.data && typeof error.response.data.message === "string") {
        return error.response.data.message
      }

      // Si la respuesta tiene un objeto con title (común en errores ASP.NET Core)
      if (error.response.data && typeof error.response.data.title === "string") {
        return error.response.data.title
      }

      // Si hay errores detallados
      if (error.response.data && error.response.data.errors) {
        // Convertir el objeto de errores a un array de mensajes
        const errorMessages = Object.values(error.response.data.errors).flat().join(", ")
        return errorMessages || "Error de validación"
      }

      // Si no podemos extraer un mensaje específico
      return `Error ${error.response.status}: ${error.response.statusText}`
    }

    // Si es un error con mensaje
    if (error.message) return error.message

    // Si todo lo demás falla, convertir a string
    try {
      return JSON.stringify(error)
    } catch {
      return "Error desconocido"
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading({ users: true, rabbit: true, food: true })

        // Obtener datos en paralelo para mejorar rendimiento
        const [usersRes, rabbitRes, foodRes] = await Promise.all([
          axiosInstance.get("/Api/User/AllUser"),
          axiosInstance.get("/Api/Rabbit/GetRabbit"),
          axiosInstance.get("/Api/Feeding/GetAvailableFood"), // Intentar usar un endpoint específico para alimentos disponibles
        ])

        if (usersRes.status === 200) {
          // Filtrar solo usuarios activos (blockard = 0 o estado != "Inactivo")
          const allUsers = usersRes.data || []
          const activeUsers = allUsers.filter(
            (user) =>
              (user.blockard === 0 || user.blockard === undefined || user.blockard === null) &&
              user.estado !== "Inactivo",
          )
          console.log("Usuarios totales:", allUsers.length, "Usuarios activos:", activeUsers.length)
          setUsers(activeUsers)
        }

        if (rabbitRes.status === 200) {
          setRabbit(rabbitRes.data)
        }

        if (foodRes.status === 200) {
          // Ya deberían venir filtrados del backend, pero por si acaso
          const availableFood = foodRes.data.filter(
            (item) => item.saldo_existente > 0 && item.estado_food !== "Inactivo",
          )
          setFood(availableFood)
        }
      } catch (err) {
        // Si falla el endpoint específico, intentar con el endpoint general
        if (err.response && err.response.status === 404 && err.response.config.url.includes("GetAvailableFood")) {
          try {
            const foodRes = await axiosInstance.get("/Api/Food/GetFood")
            if (foodRes.status === 200) {
              // Filtrar alimentos con saldo existente > 0 y no inactivos
              const availableFood = foodRes.data.filter(
                (item) => item.saldo_existente > 0 && item.estado_food !== "Inactivo",
              )
              setFood(availableFood)
            }
          } catch (foodErr) {
            console.error("Error al cargar alimentos:", foodErr)
            setErrorMessage(extractErrorMessage(foodErr))
            setShowErrorAlert(true)
          }
        } else {
          console.error("Error al cargar datos:", err)
          setErrorMessage(extractErrorMessage(err))
          setShowErrorAlert(true)
        }
      } finally {
        setIsLoading({ users: false, rabbit: false, food: false })
      }
    }

    fetchData()
  }, [])

  // Manejar cambio de alimento seleccionado
  const handleFoodChange = (foodId) => {
    setIdFood(foodId)
    if (foodId) {
      // Buscar por Id_food (con I mayúscula)
      const foodSelected = food.find((item) => item.Id_food?.toString() === foodId.toString())

      // Si no se encuentra, intentar con id_food (con i minúscula)
      if (!foodSelected) {
        const foodSelectedAlt = food.find((item) => item.id_food?.toString() === foodId.toString())
        setSelectedFood(foodSelectedAlt)
      } else {
        setSelectedFood(foodSelected)
      }

      // Resetear cantidad si se cambia el alimento
      setCantidadFeeding("100") // Por defecto 100 gramos
      setExistenciaActualG("")
    } else {
      setSelectedFood(null)
    }
  }

  // Calcular existencia actual cuando cambia la cantidad
  useEffect(() => {
    if (selectedFood && cantidad_feeding) {
      const cantidadGramos = Number(cantidad_feeding)

      // Ya no convertimos a kilogramos, usamos directamente los gramos
      const cantidadAlimentacion = cantidadGramos

      // Saldo existente ya está en gramos
      const saldoExistente = Number(selectedFood.saldo_existente)

      // Verificar si hay suficiente alimento
      if (cantidadAlimentacion > saldoExistente) {
        setErrorMessage(`No hay suficiente alimento. Saldo disponible: ${formatDecimal(saldoExistente)} g`)
        setShowErrorAlert(true)
        setExistenciaActualG("")
      } else {
        setErrorMessage("")
        setShowErrorAlert(false)

        // Calcular el nuevo saldo en gramos
        const nuevoSaldo = saldoExistente - cantidadAlimentacion

        // Formatear el número para mostrar 2 decimales
        setExistenciaActualG(formatDecimal(nuevoSaldo))
      }
    } else {
      setExistenciaActualG("")
    }
  }, [selectedFood, cantidad_feeding])

  // Establecer fecha y hora actuales al cargar el componente
  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")

    setFechaFeeding(`${year}-${month}-${day}`)
    setHoraFeeding(`${hours}:${minutes}`)
  }, [])

  // Función para actualizar directamente el saldo de un alimento
  const updateFoodBalance = async (foodId, newSaldo) => {
    try {
      const response = await axiosInstance.post("/Api/Food/RecalculateFoodBalance", {
        id_food: foodId,
        new_saldo: newSaldo,
      })
      return response
    } catch (error) {
      console.error("Error al actualizar saldo de alimento:", error)
      throw error
    }
  }

  // Función para crear un registro de alimentación con enfoque de dos pasos
  const createFeedingTwoStep = async (feedingData) => {
    try {
      // 1. Crear el registro de alimentación
      const response = await axiosInstance.post("/Api/Feeding/CreateFeeding", feedingData)

      // 2. Si hay error de transacción, intentar actualizar directamente el saldo
      if (response.status === 200) {
        return response
      }
    } catch (error) {
      // Si es un error de transacción, intentar el enfoque alternativo
      if (
        error.response &&
        error.response.status === 500 &&
        error.response.data &&
        error.response.data.includes("transaction")
      ) {
        console.log("Error de transacción detectado, intentando enfoque alternativo...")

        // Calcular el nuevo saldo
        const cantidadGramos = Number(feedingData.cantidad_feeding)
        const saldoExistente = Number(selectedFood.saldo_existente)
        const nuevoSaldo = saldoExistente - cantidadGramos

        // Intentar actualizar directamente el saldo del alimento
        try {
          await updateFoodBalance(feedingData.Id_food, nuevoSaldo)

          // Reintentar la creación del registro de alimentación
          const retryResponse = await axiosInstance.post("/Api/Feeding/CreateFeeding", feedingData)
          return retryResponse
        } catch (updateError) {
          console.error("Error en el enfoque alternativo:", updateError)
          throw updateError
        }
      }

      // Si no es un error de transacción o falló el enfoque alternativo, relanzar el error
      throw error
    }
  }

  async function handlerSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    if (!fecha_feeding || !hora_feeding || !cantidad_feeding || !Id_food || !Id_rabbit || !Id_user) {
      setErrorMessage("Todos los campos son obligatorios.")
      setShowErrorAlert(true)
      setIsSubmitting(false)
      return
    }

    try {
      // Formatear la fecha correctamente para el backend
      const fechaPartes = fecha_feeding.split("-")
      const año = Number(fechaPartes[0])
      const mes = Number(fechaPartes[1]) - 1 // Los meses en JavaScript son 0-11
      const dia = Number(fechaPartes[2])

      // Crear fecha con hora 12:00 para evitar problemas de zona horaria
      const fechaObj = new Date(año, mes, dia, 12, 0, 0)

      // Formatear la fecha como string en formato yyyy-MM-dd
      const fechaFormateada = `${fechaObj.getFullYear()}-${String(fechaObj.getMonth() + 1).padStart(2, "0")}-${String(fechaObj.getDate()).padStart(2, "0")}`

      // Calcular el nuevo saldo para enviarlo al backend
      const cantidadGramos = Number(cantidad_feeding)
      const saldoExistente = Number(selectedFood.saldo_existente)
      const nuevoSaldo = saldoExistente - cantidadGramos

      // Redondear a 2 decimales para evitar problemas con muchos decimales
      const nuevoSaldoRedondeado = Math.round(nuevoSaldo * 100) / 100

      // Preparar los datos para enviar al backend
      // IMPORTANTE: Usar mayúsculas en los nombres de propiedades para que coincidan con el modelo del backend
      const feedingData = {
        Id_feeding: 0,
        fecha_feeding: fechaFormateada,
        hora_feeding: hora_feeding,
        cantidad_feeding: Number(cantidad_feeding),
        Id_food: Number(Id_food),
        Id_rabbit: Number(Id_rabbit),
        Id_user: Number(Id_user),
        existencia_actual: nuevoSaldoRedondeado,
      }

      console.log("Datos a enviar:", feedingData)

      // Intentar crear el registro con el enfoque de dos pasos
      const response = await createFeedingTwoStep(feedingData)

      if (response && response.status === 200) {
        setSuccessMessage(response.data.message || "Registro exitoso")
        setShowSuccessAlert(true)

        // Limpiar el formulario
        setFechaFeeding("")
        setHoraFeeding("")
        setCantidadFeeding("100") // Volver al valor por defecto
        setExistenciaActualG("")
        setIdFood("")
        setIdRabbit("")
        setIdUser("")
        setSelectedFood(null)
        setRetryCount(0) // Resetear contador de reintentos
      }
    } catch (error) {
      console.error("Error:", error)

      // Si es un error de transacción y no hemos excedido el máximo de reintentos
      if (
        error.response &&
        error.response.status === 500 &&
        error.response.data &&
        error.response.data.includes("transaction") &&
        retryCount < MAX_RETRIES
      ) {
        // Incrementar contador de reintentos
        setRetryCount((prevCount) => prevCount + 1)

        // Esperar un momento antes de reintentar
        setTimeout(() => {
          handlerSubmit(e)
        }, 1000)

        return
      }

      setErrorMessage(extractErrorMessage(error))
      setShowErrorAlert(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)
    setSuccessMessage("")
    // Actualizar los datos sin recargar la página
    if (refreshData) {
      refreshData()
    }
    // Cerrar el formulario después de cerrar la alerta
    if (onCloseForm) {
      onCloseForm()
    }
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
    setErrorMessage("")
  }

  return (
    <>
      {/* Alerta de éxito */}
      <AlertModal type="success" message={successMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />

      {/* Alerta de error */}
      <AlertModal type="error" message={errorMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <form
        onSubmit={handlerSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registrar Alimentación</h2>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Conejo:</label>
            <select
              value={Id_rabbit}
              onChange={(e) => setIdRabbit(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            >
              <option value="">Seleccione</option>
              {rabbit && rabbit.length > 0 ? (
                rabbit.map((item) => (
                  <option key={item.id_rabbit || item.Id_rabbit} value={item.id_rabbit || item.Id_rabbit}>
                    {item.name_rabbit}
                  </option>
                ))
              ) : (
                <option disabled>No hay conejos disponibles</option>
              )}
            </select>
            {isLoading.rabbit && <p className="text-sm text-gray-500 mt-1">Cargando conejos...</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Alimento:</label>
            <select
              value={Id_food}
              onChange={(e) => handleFoodChange(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            >
              <option value="">Seleccione</option>
              {food && food.length > 0 ? (
                food.map((item) => (
                  <option key={item.Id_food || item.id_food} value={item.Id_food || item.id_food}>
                    {item.name_food} ({formatDecimal(item.saldo_existente)} g)
                  </option>
                ))
              ) : (
                <option disabled>No hay alimentos disponibles</option>
              )}
            </select>
            {isLoading.food && <p className="text-sm text-gray-500 mt-1">Cargando alimentos...</p>}
            {!isLoading.food && (!food || food.length === 0) && (
              <p className="text-red-500 text-sm mt-1">No hay alimentos disponibles</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Cantidad alimento (gramos):</label>
            <input
              type="number"
              value={cantidad_feeding}
              onChange={(e) => setCantidadFeeding(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
              min="1"
              step="1"
            />
            {selectedFood && (
              <small className="text-gray-500">Disponible: {formatDecimal(selectedFood.saldo_existente)} g</small>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Fecha:</label>
              <input
                type="date"
                value={fecha_feeding}
                onChange={(e) => setFechaFeeding(e.target.value)}
                className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Hora:</label>
              <input
                type="time"
                value={hora_feeding}
                onChange={(e) => setHoraFeeding(e.target.value)}
                className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Responsable:</label>
            <select
              value={Id_user}
              onChange={(e) => setIdUser(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            >
              <option value="">Seleccione</option>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <option key={user.id_user || user.Id_user} value={user.id_user || user.Id_user}>
                    {user.name_user}
                  </option>
                ))
              ) : (
                <option disabled>No hay usuarios disponibles</option>
              )}
            </select>
            {isLoading.users && <p className="text-sm text-gray-500 mt-1">Cargando usuarios...</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Existencia después de alimentación:</label>
            <input
              type="text"
              value={existencia_actual_g ? `${existencia_actual_g} g` : ""}
              readOnly
              className="w-full border border-gray-400 rounded-lg p-2 bg-gray-100 focus:outline-none h-10"
            />
            <small className="text-gray-500">Saldo restante después de la alimentación</small>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting || !existencia_actual_g}
            className={`text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full ${
              isSubmitting || !existencia_actual_g ? "bg-gray-400" : "bg-black hover:bg-gray-600"
            }`}
          >
            {isSubmitting
              ? retryCount > 0
                ? `Reintentando (${retryCount}/${MAX_RETRIES})...`
                : "Registrando..."
              : "Registrar Alimentación"}
          </button>
        </div>
      </form>
    </>
  )
}

export default RegisterFeeding
