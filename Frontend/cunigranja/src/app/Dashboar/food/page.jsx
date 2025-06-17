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

        const data = response.data.map((item) => ({
          id: item.Id_food || item.id_food,
          nombre: item.name_food,
          estado: item.estado_food,
          valor: item.valor_food,
          unidad: item.unidad_food,
          saldo: item.saldo_existente,
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

  const checkIfFoodInUse = async (foodId) => {
    try {
      const numericId = Number.parseInt(foodId, 10)

      try {
        const entriesResponse = await axiosInstance.get(`/Api/Entrada/GetEntradaByFood/${numericId}`)
        if (entriesResponse.data && entriesResponse.data.length > 0) {
          return true
        }
      } catch (entriesError) {
        console.log(`No hay entradas para alimento ${numericId}`)
      }

      try {
        const feedingResponse = await axiosInstance.get(`/Api/Feeding/GetFeedingByFood/${numericId}`)
        if (feedingResponse.data && feedingResponse.data.length > 0) {
          return true
        }
      } catch (feedingError) {
        console.log(`No hay alimentaciones para alimento ${numericId}`)
      }

      return false
    } catch (error) {
      console.error("Error checking if food is in use:", error)
      return false
    }
  }

  useEffect(() => {
    fetchFood()
  }, [])

  const handleDelete = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10)
      const isInUse = await checkIfFoodInUse(numericId)

      if (isInUse) {
        setAlertMessage("No se puede eliminar este alimento porque está siendo utilizado en otros registros.")
        setShowErrorAlert(true)
        return null
      }

      const response = await axiosInstance.delete(`/Api/Food/DeleteFood?id=${numericId}`)
      setTimeout(() => fetchFood(), 1000)
      return response
    } catch (error) {
      console.error("Error al eliminar:", error)
      throw error
    }
  }

  const handleUpdate = (row) => {
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

  // Función MODIFICADA para activar/desactivar con lógica automática
  const handleToggleFoodStatus = async (food) => {
    try {
      const currentStatus = food.estado_food || food.estado
      let newStatus

      // MODIFICACIÓN: Cuando se activa, usar "Existente" en lugar de "Activo"
      if (currentStatus === "Inactivo") {
        newStatus = "Existente" // El backend evaluará automáticamente el estado correcto
      } else {
        newStatus = "Inactivo"
      }

      // Crear el objeto FoodModel completo
      const foodModel = {
        Id_food: food.Id_food || food.id,
        name_food: food.name_food || food.nombre,
        estado_food: newStatus,
        valor_food: food.valor_food || food.valor,
        unidad_food: food.unidad_food || food.unidad,
        saldo_existente: food.saldo_existente || food.saldo,
      }

      console.log("Cambiando estado del alimento:", foodModel)

      const response = await axiosInstance.put("/Api/Food/ToggleFoodStatus", foodModel)

      if (response.status === 200) {
        // Mensaje más específico según la acción
        if (currentStatus === "Inactivo") {
          setAlertMessage("Alimento activado correctamente. El estado se ajustó automáticamente según el saldo.")
        } else {
          setAlertMessage("Alimento desactivado correctamente.")
        }

        setShowSuccessAlert(true)
        fetchFood() // Recargar datos para ver el estado final
      }
    } catch (error) {
      console.error("Error al cambiar estado del alimento:", error)

      let errorMessage = "Error al cambiar el estado del alimento"

      if (error.response) {
        if (error.response.status === 405) {
          errorMessage = "Método no permitido. Verifique la configuración del servidor."
        } else if (error.response.data) {
          errorMessage = error.response.data.message || error.response.data || errorMessage
        }
      }

      setAlertMessage(errorMessage)
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
