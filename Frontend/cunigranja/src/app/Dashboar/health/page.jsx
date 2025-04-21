"use client"

import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import UpdateHealth from "./UpdateHealth"
import RegisterHealth from "./RegisterHealth"
import axiosInstance from "@/lib/axiosInstance"
import { MODAL_STYLE_CLASSES } from "@/components/utils/ModalDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Healthpage() {
  const TitlePage = "Sanidad"

  const [RegisterHealthData, setRegisterHealthData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [error, setError] = useState(null)
  const [selectedHealth, setSelectedHealth] = useState(null)

  const titlesHealth = ["ID", "Nombre", "Fecha", "Descripcion", "Valor", "Responsable"]

  async function fetchHealth() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/Api/Health/AllHealth")
      console.log("API Response:", response.data)

      if (response.status === 200) {
        const data = response.data.map((item) => ({
          id: item.id_health,
          nombre: item.name_health,
          fecha: new Date(item.fecha_health).toLocaleDateString("es-ES"),
          descripcion: item.descripcion_health,
          valor: item.valor_health,
          responsable: item.name_user,

          // Campos para el formulario de actualización - nombres exactos que espera UpdateHealth
          name_health: item.name_health,
          fecha_health: item.fecha_health,
          descripcion_health: item.descripcion_health,
          valor_health: item.valor_health,
          Id_user: item.id_user,
        }))
        console.log("Processed data:", data)
        setRegisterHealthData(data)
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error)
      setError("No se pudieron cargar los datos de los alimentos.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  const handleDelete = async (id) => {
    try {
      console.log("Intentando eliminar registro con ID:", id)

      // Asegurarse de que el ID sea un número
      const numericId = Number.parseInt(id, 10)

      // Usar el formato correcto para la solicitud DELETE
      const url = `/Api/Health/DeleteHealth?id=${numericId}`
      console.log("URL de eliminación:", url)

      const response = await axiosInstance.delete(url)

      console.log("Respuesta de eliminación:", response)

      // Recargar datos después de eliminar
      setTimeout(() => {
        fetchHealth()
      }, 1000)

      return response
    } catch (error) {
      console.error("Error detallado al eliminar:", error.response?.data || error.message || error)
      throw error
    }
  }

  const handleUpdate = (row) => {
    console.log("Datos seleccionados para editar:", row)
    setSelectedHealth(row)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedHealth(null)
  }

  const handleUpdateSuccess = () => {
    // Refresh the data
    fetchHealth()

    // Close the modal
    handleCloseEditModal()
  }

  return (
    <NavPrivada>
      <ContentPage
        TitlePage={TitlePage}
        Data={RegisterHealthData}
        TitlesTable={titlesHealth}
        FormPage={() => <RegisterHealth refreshData={fetchHealth} />}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        endpoint="/Api/Health/DeleteHealth"
        isLoading={isLoading}
        error={error}
      />

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className={MODAL_STYLE_CLASSES}>
          <DialogHeader>
            <DialogTitle>Editar Sanidad</DialogTitle>
          </DialogHeader>
          <div className="">
            {selectedHealth && (
              <UpdateHealth healthData={selectedHealth} onClose={handleCloseEditModal} onUpdate={handleUpdateSuccess} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </NavPrivada>
  )
}

export default Healthpage

