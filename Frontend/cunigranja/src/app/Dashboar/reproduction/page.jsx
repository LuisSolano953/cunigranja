"use client"

import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import RegisterReproduction from "./RegisterReproduction"
import UpdateReproduction from "./UpdateReproduction"
import axiosInstance from "@/lib/axiosInstance"
import { MODAL_STYLE_CLASSES } from "@/components/utils/ModalDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
 
function Reproductionpage() {
  const TitlePage = "Reproducción"

  const [RegisterReproductionData, setRegisterReproductionData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedReproduction, setSelectedReproduction] = useState(null)

  const titlesReproduction = ["ID", "Fecha", "Total conejos", "Nacidos Vivos", " nacidos Muertos", "Coneja"]

  async function fetchReproduction() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/Api/Reproduction/GetReproduction")
      console.log("API Response:", response.data)

      if (response.status === 200) {
        const data = response.data.map((item) => ({
          id: item.Id_reproduction,
          fecha: new Date(item.fecha_nacimiento).toLocaleDateString("es-ES"),
          total: item.total_conejos,
          vivos: item.nacidos_vivos,
          muertos: item.nacidos_muertos,
          conejo: item.name_rabbit,
          // Add these fields for the update form
          fecha_nacimiento: item.fecha_nacimiento,
          total_conejos: item.total_conejos,
          nacidos_vivos: item.nacidos_vivos,
          nacidos_muertos: item.nacidos_muertos,
          Id_rabbit: item.Id_rabbit,
        }))

        console.log("Processed data:", data)
        setRegisterReproductionData(data)
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error)
      setError("No se pudieron cargar los datos de reproducción.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReproduction()
  }, [])

  const handleDelete = async (id) => {
    try {
      console.log("Intentando eliminar registro de reproducción con ID:", id)

      // Asegurarse de que el ID sea un número
      const numericId = Number.parseInt(id, 10)

      // Usar el formato correcto para la solicitud DELETE
      const url = `/Api/Reproduction/DeleteReproduction?id=${numericId}`
      console.log("URL de eliminación:", url)

      const response = await axiosInstance.delete(url)

      // Recargar datos después de un tiempo
      setTimeout(() => {
        fetchReproduction()
      }, 1000)

      return response
    } catch (error) {
      console.error("Error detallado al eliminar:", error.response?.data || error.message || error)
      throw error
    }
  }

  const handleUpdate = (row) => {
    setSelectedReproduction(row)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedReproduction(null)
  }
 
  const handleUpdateSuccess = () => {
    // Refresh the data
    fetchReproduction()

    // Close the modal
    handleCloseEditModal()
  }

  return (
    <NavPrivada>
      <ContentPage
        TitlePage={TitlePage}
        Data={RegisterReproductionData}
        TitlesTable={titlesReproduction}
        FormPage={() => <RegisterReproduction refreshData={fetchReproduction} />}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        endpoint="/Api/Reproduction/DeleteReproduction"
        isLoading={isLoading}
        error={error}
      />

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className={MODAL_STYLE_CLASSES}>
          <DialogHeader>
            <DialogTitle>Editar Reproducción</DialogTitle>
          </DialogHeader>
          <div className="">
            {selectedReproduction && (
              <UpdateReproduction
                reproductionData={selectedReproduction}
                onClose={handleCloseEditModal}
                onUpdate={handleUpdateSuccess}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </NavPrivada>
  )
}

export default Reproductionpage

