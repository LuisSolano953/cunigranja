"use client"

import RegisterWeighing from "./RegisterWeighing"
import UpdateWeighing from "./UpdateWeighing"
import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import axiosInstance from "@/lib/axiosInstance"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function WeighingPage() {
  const TitlePage = "Pesajes"

  const [RegisterWeighingData, setRegisterWeighingData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedWeighing, setSelectedWeighing] = useState(null)

  const titlesWeighing = ["ID", "Fecha registro", "peso actual", "ganancia de peso", "Conejo", "Responsable"]

  async function FetchWeighing() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/Api/Weighing/GetWeighing")
      console.log("API Response:", response.data)

      if (response.status === 200) {
        // Añadir este log para ver la estructura exacta del primer elemento
        if (response.data.length > 0) {
          console.log("Primer elemento de la respuesta:", JSON.stringify(response.data[0], null, 2))
        }

        const data = response.data.map((item) => ({
          id: item.Id_weighing,
          fecha: new Date(item.fecha_weighing).toLocaleDateString("es-ES"),
          peso_actual: item.peso_actual,
          ganacia_peso: item.ganancia_peso,
          conejo: item.name_rabbit,
          responsable: item.name_user,
        }))
        console.log("Processed data:", data)
        setRegisterWeighingData(data)
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error)
      setError("No se pudieron cargar los datos de los pesajes.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    FetchWeighing()
  }, [])

  const handleDelete = async (id) => {
    try {
      console.log("Intentando eliminar registro con ID:", id)

      const numericId = Number.parseInt(id, 10)

      if (isNaN(numericId)) {
        throw new Error("ID inválido")
      }

      const url = `/Api/Weighing/DeleteWeighing?id_weighing=${numericId}`

      console.log("URL de eliminación:", url)

      const response = await axiosInstance.delete(url)

      setTimeout(() => {
        FetchWeighing()
      }, 500)

      return response
    } catch (error) {
      console.error("Error detallado al eliminar", error.response?.data || error.message || error)
      throw error
    }
  }

  const handleUpdate = (row) => {
    console.log("Datos para actualizar:", row)
    setSelectedWeighing(row)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedWeighing(null)
  }

  const handleUpdateSuccess = () => {
    // Refresh the data
    FetchWeighing()
    // Close the modal
    handleCloseEditModal()
  }

  return (
    <NavPrivada>
      <ContentPage
        TitlePage={TitlePage}
        Data={RegisterWeighingData}
        TitlesTable={titlesWeighing}
        FormPage={RegisterWeighing}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        isLoading={isLoading}
        error={error}
        refreshData={FetchWeighing}
        endpoint="/Api/Weighing/DeleteWeighing"
        showDeleteButton={false}
      />

      {/* Edit Modal - Con espaciado y scroll como el formulario de registro */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Actualizar Pesaje</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedWeighing && (
              <UpdateWeighing
                weighingData={selectedWeighing}
                onClose={handleCloseEditModal}
                onUpdate={handleUpdateSuccess}
                refreshData={FetchWeighing}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </NavPrivada>
  )
}

export default WeighingPage
