"use client"

import RegisterFood from "./RegisterFood"
import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import axiosInstance from "@/lib/axiosInstance"
import UpdateFood from "./UpdateFood"
import { MODAL_STYLE_CLASSES } from "@/components/utils/ModalDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function Foodpage() {
  const TitlePage = "Alimentos"
  const [RegisterFoodData, setRegisterFoodData] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFood, setSelectedFood] = useState(null)

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

  useEffect(() => {
    fetchFood()
  }, [])

  const handleDelete = async (id) => {
    try {
      console.log("Intentando eliminar alimento con ID:", id)

      // Asegurarse de que el ID sea un número
      const numericId = Number.parseInt(id, 10)

      // Verificar si el alimento está siendo utilizado
      const checkResponse = await axiosInstance.get(`/Api/Feeding/GetFeedingByFood/${numericId}`)

      if (checkResponse.data.length > 0) {
        alert(
          `No se puede eliminar este alimento porque está siendo utilizado en ${checkResponse.data.length} registros de alimentación.`,
        )
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
    // Refresh the data
    fetchFood()
  }

  return (
    <NavPrivada>
      <ContentPage
        TitlePage={TitlePage}
        Data={RegisterFoodData}
        TitlesTable={titlesFood}
        FormPage={() => <RegisterFood onRegisterSuccess={fetchFood} />}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        endpoint="/Api/Food/DeleteFood"
        isLoading={isLoading}
        error={error}
        refreshData={fetchFood}
        showDeleteButton={false}
      />
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className={MODAL_STYLE_CLASSES}>
          <DialogHeader>
            <DialogTitle>Editar Alimento</DialogTitle>
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
