"use client"

import RegisterFood from "./RegisterFood"
import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import axiosInstance from "@/lib/axiosInstance"
import UpdateFood from "./UpdateFood"
import { MODAL_STYLE_CLASSES } from "@/components/utils/ModalDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DataTable from "@/components/utils/DataTable"
import AlertModal from "@/components/utils/AlertModal"

function Foodpage() {
  const TitlePage = "Alimentos"
  const [RegisterFoodData, setRegisterFoodData] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFood, setSelectedFood] = useState(null)

  // Estados para alertas
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const titlesFood = ["ID", "Nombre", "Estado", "Valor", "Unidad", "Saldo existente"]

  async function fetchFood() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/Api/Food/GetFood")

      if (response.status === 200) {
        console.log("Datos de alimentos:", response.data)

        // Transformar datos para la tabla
        const data = response.data.map((item) => ({
          id: item.Id_food || item.id_food,
          nombre: item.name_food,
          estado: item.estado_food,
          valor: item.valor_food,
          unidad: item.unidad_food,
          saldo: item.saldo_existente,
          // Mantener todos los datos originales para edición
          ...item,
        }))

        setRegisterFoodData(data)
      }
    } catch (error) {
      console.error("Error al obtener los alimentos:", error)
      setError("No se pudieron cargar los datos de los alimentos.")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para verificar si un alimento está en uso
  const checkIfFoodInUse = async (foodId) => {
    try {
      console.log(`Verificando si el alimento ${foodId} está en uso...`)
      const numericId = Number.parseInt(foodId, 10)

      // Verificar en entradas
      try {
        const entriesResponse = await axiosInstance.get(`/Api/Entrada/GetEntradaByFood/${numericId}`)
        console.log(`Entradas para alimento ${numericId}:`, entriesResponse.data)
        if (entriesResponse.data && entriesResponse.data.length > 0) {
          console.log(`Alimento ${numericId} está en uso en entradas`)
          return true
        }
      } catch (entriesError) {
        console.log(`No hay entradas para alimento ${numericId} o error:`, entriesError.response?.status)
      }

      // Verificar en alimentación
      try {
        const feedingResponse = await axiosInstance.get(`/Api/Feeding/GetFeedingByFood/${numericId}`)
        console.log(`Alimentaciones para alimento ${numericId}:`, feedingResponse.data)
        if (feedingResponse.data && feedingResponse.data.length > 0) {
          console.log(`Alimento ${numericId} está en uso en alimentaciones`)
          return true
        }
      } catch (feedingError) {
        console.log(`No hay alimentaciones para alimento ${numericId} o error:`, feedingError.response?.status)
      }

      console.log(`Alimento ${numericId} NO está en uso`)
      return false
    } catch (error) {
      console.error("Error checking if food is in use:", error)
      return false // En caso de error, asumir que no está en uso
    }
  }

  useEffect(() => {
    fetchFood()
  }, [])

  const handleDelete = async (id) => {
    try {
      console.log("Intentando eliminar alimento con ID:", id)

      // Asegurarse de que el ID sea un número
      const numericId = Number.parseInt(id, 10)

      // Verificar si el alimento está siendo utilizado
      const isInUse = await checkIfFoodInUse(numericId)

      if (isInUse) {
        setAlertMessage("No se puede eliminar este alimento porque está siendo utilizado en otros registros.")
        setShowErrorAlert(true)
        return null
      }

      // Usar el formato correcto para la solicitud DELETE
      const url = `/Api/Food/DeleteFood?id=${numericId}`
      console.log("URL de eliminación:", url)

      const response = await axiosInstance.delete(url)

      console.log("Respuesta de eliminación:", response)

      // Recargar datos después de eliminar
      setTimeout(() => {
        fetchFood()
      }, 1000)

      return response
    } catch (error) {
      console.error("Error detallado al eliminar:", error.response?.data || error.message || error)
      throw error
    }
  }

  const handleUpdate = (row) => {
    console.log("Datos seleccionados para editar:", row)
    setSelectedFood(row)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedFood(null)
  }

  const handleUpdateSuccess = () => {
    fetchFood()
  }

  // Función para activar/desactivar alimentos
  const handleToggleFoodStatus = async (food) => {
    try {
      const newStatus = food.estado_food === "Activo" ? "Inactivo" : "Activo"

      const payload = {
        Id_food: food.Id_food || food.id,
        name_food: food.name_food || food.nombre,
        estado_food: newStatus,
        valor_food: food.valor_food || food.valor,
        unidad_food: food.unidad_food || food.unidad,
        saldo_existente: food.saldo_existente || food.saldo,
      }

      console.log("Actualizando estado del alimento:", payload)

      const response = await axiosInstance.post("/Api/Food/UpdateFood", payload)

      if (response.status === 200) {
        setAlertMessage(`Alimento ${newStatus.toLowerCase()} correctamente`)
        setShowSuccessAlert(true)
        fetchFood() // Recargar datos
      }
    } catch (error) {
      console.error("Error al cambiar estado del alimento:", error)
      setAlertMessage("Error al cambiar el estado del alimento")
      setShowErrorAlert(true)
    }
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)
    setAlertMessage("")
  }

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
    setAlertMessage("")
  }

  return (
    <NavPrivada>
      {/* Alertas */}
      <AlertModal type="success" message={alertMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />
      <AlertModal type="error" message={alertMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <ContentPage
        TitlePage={TitlePage}
        Data={RegisterFoodData}
        TitlesTable={titlesFood}
        FormPage={RegisterFood}
        onRegisterSuccess={fetchFood}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        endpoint="/Api/Food/DeleteFood"
        isLoading={isLoading}
        error={error}
        refreshData={fetchFood}
        showDeleteButton={false}
        CustomDataTable={(props) => (
          <DataTable
            {...props}
            isFoodTable={true}
            showStatusButton={true}
            onToggleStatus={handleToggleFoodStatus}
            checkIfInUse={checkIfFoodInUse}
          />
        )}
      />

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className={MODAL_STYLE_CLASSES}>
          <DialogHeader>
            <DialogTitle>Actualizar Alimento</DialogTitle>
          </DialogHeader>
          <div className="">
            {selectedFood && (
              <UpdateFood foodData={selectedFood} onClose={handleCloseEditModal} onUpdate={handleUpdateSuccess} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </NavPrivada>
  )
}

export default Foodpage
