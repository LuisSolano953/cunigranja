"use client"

import axiosInstance from "@/lib/axiosInstance"
import { useEffect, useState } from "react"

const UpdateFeeding = ({ feedingData, onClose, onUpdate }) => {
  const [fecha_feeding, setFechaFeeding] = useState("")
  const [hora_feeding, setHoraFeeding] = useState("")
  const [cantidad_feeding, setCantidadFeeding] = useState("")
  const [Id_food, setIdFood] = useState("")
  const [food, setFood] = useState([])
  const [Id_rabbit, setIdRabbit] = useState("")
  const [rabbit, setRabbit] = useState([])
  const [Id_user, setIdUser] = useState("")
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState({ users: false, rabbit: false, food: false })
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [selectedFood, setSelectedFood] = useState(null)
  const [originalCantidad, setOriginalCantidad] = useState("")
  const [originalFoodId, setOriginalFoodId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [debug, setDebug] = useState({})
  const [idsFound, setIdsFound] = useState(false)

  // Campo calculado automáticamente - solo para mostrar al usuario
  const [existencia_actual, setExistenciaActual] = useState("")

  // Depuración: Mostrar el contenido completo de feedingData
  useEffect(() => {
    console.log("feedingData recibido en UpdateFeeding:", feedingData)
    if (feedingData) {
      console.log("Propiedades disponibles en feedingData:", Object.keys(feedingData))
      setDebug({
        ...debug,
        feedingData: feedingData,
        keys: Object.keys(feedingData),
      })
    }
  }, [feedingData])

  // Modificar la función formatDecimal para que redondee correctamente los números
  const formatDecimal = (num) => {
    if (num === null || num === undefined) return ""
    // Convertir a número para asegurar el formato correcto
    const numValue = Number.parseFloat(num)
    // Redondear a 1 decimal
    return Math.round(numValue * 10) / 10
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

  // Carga de datos de usuarios, conejos y alimentos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading({ users: true, rabbit: true, food: true })
        const [usersRes, rabbitRes, foodRes] = await Promise.all([
          axiosInstance.get("/Api/User/AllUser"),
          axiosInstance.get("/Api/Rabbit/GetRabbit"),
          axiosInstance.get("/Api/Food/GetFood"),
        ])

        if (usersRes.status === 200) {
          console.log("Datos de usuarios:", usersRes.data)
          setUsers(usersRes.data)
          setDebug((prev) => ({ ...prev, users: usersRes.data }))
        }

        if (rabbitRes.status === 200) {
          console.log("Datos de conejos:", rabbitRes.data)
          setRabbit(rabbitRes.data)
          setDebug((prev) => ({ ...prev, rabbits: rabbitRes.data }))
        }

        if (foodRes.status === 200) {
          console.log("Datos de alimentos:", foodRes.data)
          setFood(foodRes.data)
          setDebug((prev) => ({ ...prev, foods: foodRes.data }))
        }
      } catch (err) {
        console.error("Error al cargar datos:", err)
        setErrorMessage(extractErrorMessage(err))
      } finally {
        setIsLoading({ users: false, rabbit: false, food: false })
      }
    }

    fetchData()
  }, [])

  // Buscar IDs basados en nombres cuando tenemos los datos necesarios
  useEffect(() => {
    if (feedingData && users.length > 0 && rabbit.length > 0 && food.length > 0 && !idsFound) {
      console.log("Buscando IDs basados en nombres...")

      // Buscar ID de usuario basado en el nombre
      if (!feedingData.Id_user && feedingData.name_user) {
        const foundUser = users.find((user) => user.name_user?.toLowerCase() === feedingData.name_user?.toLowerCase())
        if (foundUser) {
          console.log(`Usuario encontrado: ${foundUser.name_user} (ID: ${foundUser.Id_user})`)
          setIdUser(foundUser.Id_user.toString())
        } else {
          console.warn(`No se encontró usuario con nombre: ${feedingData.name_user}`)
        }
      } else if (feedingData.Id_user) {
        setIdUser(feedingData.Id_user.toString())
      }

      // Buscar ID de conejo basado en el nombre
      if (!feedingData.Id_rabbit && feedingData.name_rabbit) {
        const foundRabbit = rabbit.find(
          (item) => item.name_rabbit?.toLowerCase() === feedingData.name_rabbit?.toLowerCase(),
        )
        if (foundRabbit) {
          console.log(`Conejo encontrado: ${foundRabbit.name_rabbit} (ID: ${foundRabbit.Id_rabbit})`)
          setIdRabbit(foundRabbit.Id_rabbit.toString())
        } else {
          console.warn(`No se encontró conejo con nombre: ${feedingData.name_rabbit}`)
        }
      } else if (feedingData.Id_rabbit) {
        setIdRabbit(feedingData.Id_rabbit.toString())
      }

      // Buscar ID de alimento basado en el nombre
      if (!feedingData.Id_food && feedingData.name_food) {
        const foundFood = food.find(
          (item) => (item.nombre_food || item.name_food)?.toLowerCase() === feedingData.name_food?.toLowerCase(),
        )
        if (foundFood) {
          console.log(`Alimento encontrado: ${foundFood.nombre_food || foundFood.name_food} (ID: ${foundFood.Id_food})`)
          setIdFood(foundFood.Id_food.toString())
          setOriginalFoodId(foundFood.Id_food.toString())
          setSelectedFood(foundFood)
        } else {
          console.warn(`No se encontró alimento con nombre: ${feedingData.name_food}`)
        }
      } else if (feedingData.Id_food) {
        setIdFood(feedingData.Id_food.toString())
        setOriginalFoodId(feedingData.Id_food.toString())
      }

      setIdsFound(true)
    }
  }, [feedingData, users, rabbit, food, idsFound])

  // Inicialización y carga de datos de feedingData
  useEffect(() => {
    if (feedingData) {
      console.log("Datos recibidos para editar:", feedingData)

      // Formatear la fecha para el input date (YYYY-MM-DD)
      let formattedDate = ""
      if (feedingData.fecha_feeding) {
        try {
          const date = new Date(feedingData.fecha_feeding)
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, "0")
            const day = String(date.getDate()).padStart(2, "0")
            formattedDate = `${year}-${month}-${day}`
          }
        } catch (error) {
          console.error("Error al formatear fecha:", error)
        }
      }

      // Establecer los valores en el estado
      setFechaFeeding(formattedDate)
      setHoraFeeding(feedingData.hora_feeding || "")
      setCantidadFeeding(feedingData.cantidad_feeding?.toString() || "")

      // Guardar valores originales para cálculos posteriores
      setOriginalCantidad(feedingData.cantidad_feeding?.toString() || "")

      // Formatear existencia_actual para eliminar decimales innecesarios
      if (feedingData.existencia_actual !== undefined) {
        const existenciaNum = Number(feedingData.existencia_actual)
        // Redondear a 1 decimal y eliminar ceros finales
        const existenciaStr = existenciaNum.toFixed(1).replace(/\.0$/, "")
        setExistenciaActual(existenciaStr)
      } else {
        setExistenciaActual("")
      }

      setDataLoaded(true)

      // Actualizar debug
      setDebug((prev) => ({
        ...prev,
        initialValues: {
          fecha: formattedDate,
          hora: feedingData.hora_feeding,
          cantidad: feedingData.cantidad_feeding,
          Id_food: feedingData.Id_food,
          Id_rabbit: feedingData.Id_rabbit,
          Id_user: feedingData.Id_user,
          existencia: feedingData.existencia_actual,
        },
      }))
    }
  }, [feedingData])

  // Establecer el alimento seleccionado cuando tenemos tanto los datos de alimentos como el ID de alimento
  useEffect(() => {
    if (food.length > 0 && Id_food) {
      console.log("Buscando alimento con ID:", Id_food, "en lista de", food.length, "alimentos")

      // Mostrar todos los IDs de alimentos para depuración
      console.log(
        "IDs de alimentos disponibles:",
        food.map((f) => f.Id_food),
      )

      const foundFood = food.find((item) => item.Id_food.toString() === Id_food.toString())

      if (foundFood) {
        console.log("Alimento encontrado:", foundFood)
        setSelectedFood(foundFood)
      } else {
        console.warn("No se encontró el alimento con ID:", Id_food)
      }
    }
  }, [food, Id_food])

  // Manejar cambio de alimento seleccionado
  const handleFoodChange = (foodId) => {
    // Si cambia el alimento, esto es una operación compleja que requiere:
    // 1. Devolver la cantidad original al alimento original
    // 2. Tomar la nueva cantidad del nuevo alimento

    // Por simplicidad, no permitiremos cambiar el alimento en la edición
    if (foodId !== originalFoodId) {
      setErrorMessage("No se permite cambiar el alimento en la edición. Por favor, cree un nuevo registro.")
      setIdFood(originalFoodId)
      return
    }

    setIdFood(foodId)
  }

  // Calcular existencia actual cuando cambia la cantidad o el alimento seleccionado
  useEffect(() => {
    if (selectedFood && cantidad_feeding && originalCantidad) {
      // Convertir a números para cálculos
      const cantidadNueva = Number(cantidad_feeding) || 0
      const cantidadOriginal = Number(originalCantidad) || 0

      // Calcular la diferencia entre la cantidad nueva y la original
      const diferencia = cantidadNueva - cantidadOriginal

      // Si la nueva cantidad es mayor, verificar si hay suficiente alimento
      if (diferencia > 0) {
        const saldoDisponible = Number.parseFloat(selectedFood.saldo_existente) || 0

        if (diferencia / 1000 > saldoDisponible) {
          setErrorMessage(`No hay suficiente alimento. Saldo disponible: ${formatDecimal(saldoDisponible)} kg`)
          return
        }
      }

      // Calcular la nueva existencia
      // Si la cantidad aumenta, el saldo disminuye más
      // Si la cantidad disminuye, el saldo disminuye menos (o aumenta relativamente)
      const saldoActual = Number.parseFloat(selectedFood?.saldo_existente) || 0

      const nuevaExistencia = saldoActual - diferencia / 1000

      // Formatear el número para mostrar máximo 1 decimal
      setExistenciaActual(formatDecimal(nuevaExistencia))

      setErrorMessage("")
    }
  }, [selectedFood, cantidad_feeding, originalCantidad])

  // Modificar la función HandleSubmit para asegurar que existencia_actual se redondee correctamente
  async function HandleSubmit(e) {
    e.preventDefault()
    try {
      setIsSubmitting(true)

      // Verificar si tenemos el ID del registro
      if (!feedingData) {
        throw new Error("No se encontraron datos para actualizar")
      }

      // Intentar obtener el ID
      const feedingId = feedingData.id_feeding || feedingData.Id_feeding || feedingData.id

      if (!feedingId) {
        console.error("Datos de alimentación recibidos:", feedingData)
        throw new Error("ID de alimentación no encontrado para actualizar")
      }

      // Verificar que tengamos todos los IDs necesarios
      if (!Id_food || !Id_rabbit || !Id_user) {
        throw new Error("Faltan IDs importantes para actualizar el registro. Por favor, verifica los datos.")
      }

      const numericId = Number.parseInt(feedingId, 10)
      console.log("ID de alimentación a actualizar:", numericId)

      // Preparar los datos para enviar
      const payload = {
        Id_feeding: numericId,
        fecha_feeding,
        hora_feeding,
        cantidad_feeding: Number.parseInt(cantidad_feeding),
        Id_food: Number.parseInt(Id_food),
        Id_rabbit: Number.parseInt(Id_rabbit),
        Id_user: Number.parseInt(Id_user),
        existencia_actual: Math.round(Number(existencia_actual) * 10) / 10, // Redondear a 1 decimal
      }

      console.log("Enviando datos de actualización:", payload)

      // Enviar la solicitud
      const response = await axiosInstance.post(`/Api/Feeding/UpdateFeeding`, payload)

      if (response.status === 200) {
        setSuccessMessage("Alimentación actualizada correctamente.")

        // Llamar a onUpdate si existe para actualizar los datos sin recargar la página
        if (typeof onUpdate === "function") {
          onUpdate()
        }

        // No recargamos la página, solo cerramos el modal después de 1.5 segundos
        setTimeout(() => {
          if (typeof onClose === "function") {
            onClose()
          }
        }, 1500)
      }
    } catch (error) {
      console.error("Error al actualizar la alimentación:", error)
      setErrorMessage(extractErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setSuccessMessage("")
    setErrorMessage("")
    if (typeof onClose === "function") {
      onClose()
    }
    if (typeof onUpdate === "function") {
      onUpdate() // Actualiza datos globales (ej. recarga tabla)
    }
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
              <p className="text-center mb-6">{errorMessage || successMessage}</p>
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

      {/* Formulario */}
      <form
        onSubmit={HandleSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400 relative"
      >
       

        <div className="grid grid-cols-2 gap-4 mb-6">
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
          <div>
            <label className="block text-gray-700 font-medium mb-2">Cantidad:</label>
            <input
              type="text"
              value={cantidad_feeding}
              onChange={(e) => setCantidadFeeding(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            />
            {selectedFood && (
              <small className="text-gray-500">
                Original: {originalCantidad} {selectedFood.unidad_food || "g"}
              </small>
            )}
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
              {users.map((user) => (
                <option key={user.Id_user} value={user.Id_user}>
                  {user.name_user}
                </option>
              ))}
            </select>
            {!Id_user && <small className="text-red-500">Seleccione un responsable</small>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Alimento:</label>
            <select
              value={Id_food}
              onChange={(e) => handleFoodChange(e.target.value)}
              disabled
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            >
              <option value="">Seleccione</option>
              {food.map((item) => (
                <option key={item.Id_food} value={item.Id_food}>
                  {item.nombre_food || item.name_food}
                </option>
              ))}
            </select>
            <small className="text-gray-500">No se puede cambiar el alimento</small>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Conejo:</label>
            <select
              value={Id_rabbit}
              onChange={(e) => setIdRabbit(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-gray-600 h-10"
              required
            >
              <option value="">Seleccione</option>
              {rabbit.map((item) => (
                <option key={item.Id_rabbit} value={item.Id_rabbit}>
                  {item.name_rabbit}
                </option>
              ))}
            </select>
            {!Id_rabbit && <small className="text-red-500">Seleccione un conejo</small>}
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Existencia después de alimentación:</label>
          <input
            type="text"
            value={existencia_actual ? `${existencia_actual} kg` : ""}
            disabled
            readOnly
            className="w-full border border-gray-400 rounded-lg p-2 bg-gray-100 focus:ring-2 focus:ring-gray-600 h-10"
          />
          <small className="text-gray-500">Calculado automáticamente</small>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting || !Id_food || !Id_rabbit || !Id_user}
            className={`${
              !Id_food || !Id_rabbit || !Id_user ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-600"
            } text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full`}
          >
            {isSubmitting ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {(!Id_food || !Id_rabbit || !Id_user) && (
          <p className="text-red-500 text-center mt-2 text-sm">
            Faltan IDs importantes. Por favor, verifica que los selectores tengan valores seleccionados.
          </p>
        )}
      </form>
    </>
  )
}

export default UpdateFeeding
