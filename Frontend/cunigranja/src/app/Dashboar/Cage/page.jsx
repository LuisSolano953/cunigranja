"use client"
import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import RegisterCage from "./RegisterCage"
import UpdateCage from "./UpdateCage"
import axiosInstance from "@/lib/axiosInstance"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function Cagepage() {
  const TitlePage = "Jaula"

  const [RegisterCageData, setRegisterCageData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCage, setSelectedCage] = useState(null)

  const titlesCage = ["ID", "numero de jaula", "Candidad de animales"]

  async function fetchCage() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/Api/Cage/GetCage")
      console.log("API Response:", response.data)

      if (response.status === 200) {
        const data = response.data.map((item) => ({
          id: item.Id_cage,
          estado: item.estado_cage,
          cantidadanimales: item.cantidad_animales
        }))
        console.log("Processed data:", data)
        setRegisterCageData(data)
      }
    } catch (error) {
      setError("No se pudieron cargar los datos de los alimentos.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCage()
  }, [])

  const handleDelete = async (id) => {
    try {
      console.log("Intentando eliminar registro con ID:", id)

      // Asegurarse de que el ID sea un número
      const numericId = Number.parseInt(id, 10)

      // Usar el formato correcto para la solicitud DELETE
      const url = `/Api/Cage/DeleteCage?id=${numericId}`
      console.log("URL de eliminación:", url)

      const response = await axiosInstance.delete(url)

      console.log("Respuesta de eliminación:", response)

      // Esperar un momento antes de refrescar los datos
      setTimeout(() => {
        fetchCage() // Recargar datos después de la eliminación
      }, 1000)

      return response
    } catch (error) {
      console.error("Error detallado al eliminar:", error.response?.data || error.message || error)
      throw error
    }
  }

  const handleUpdate = (row) => {
    setSelectedCage(row)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedCage(null)
  }

  const handleUpdateSuccess = () => {
    // Refresh the data
    fetchCage()

    // Close the modal
    handleCloseEditModal()
  }

  return (
    <NavPrivada>
      <ContentPage
        TitlePage={TitlePage}
        Data={RegisterCageData}
        TitlesTable={titlesCage}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        FormPage={RegisterCage}
        refreshData={fetchCage}
        showDeleteButton={false}
      />

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Jaula</DialogTitle>
          </DialogHeader>
          <div className="">
            {selectedCage && (
              <UpdateCage cageData={selectedCage} onClose={handleCloseEditModal} onUpdate={handleUpdateSuccess} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </NavPrivada>
  )
}

export default Cagepage

