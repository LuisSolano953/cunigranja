"use client"

import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import axiosInstance from "@/lib/axiosInstance"
import RegisterEntrada from "./RegisterEntrada"
import UpdateEntrada from "./UpdateEntrada"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MODAL_STYLE_CLASSES } from "@/components/utils/ModalDialog"

function Entradapage() {
  const TitlePage = "Insumos"

  const [RegisterEntradaData, setRegisterEntradaData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEntrada, setSelectedEntrada] = useState(null)

  const titlesFood = ["ID", "Alimento", "Fecha", "Cantidad", "Valor unitario", "Valor total", "Existencia actual"]

  async function FetchEntrada() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/Api/Entrada/GetEntrada")
      console.log("API Response:", response.data)

      if (response.status === 200) {
        const data = response.data.map((item) => ({
          ID: item.Id_entrada,
          Alimento: item.foodmodel?.name_food || item.name_food || "N/A",
          Fecha: item.fecha_entrada,
          Cantidad: item.cantidad_entrada,
          "Valor unitario": item.valor_entrada,
          "Valor total": item.valor_total,
          "Existencia actual": item.existencia_actual,
        }))
        console.log("Processed data:", data)
        setRegisterEntradaData(data)
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error)
      setError("No se pudieron cargar los datos de los alimentos.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    FetchEntrada()
  }, [])

  const handleDelete = async (id) => {
    try {
      console.log("Intentando eliminar registro con ID:", id)

      // Asegurar que el ID sea un número válido
      const numericId = Number(id)

      if (isNaN(numericId)) {
        console.error("ID inválido:", id)
        return
      }

      // Formatear correctamente la URL
      const url = `/Api/Entrada/DeleteEntrada?id=${numericId}`
      console.log("URL de eliminación:", url)

      const response = await axiosInstance.delete(url)

      console.log("Respuesta de eliminación:", response)

      if (response.status === 200) {
        console.log(`Registro con ID ${numericId} eliminado correctamente.`)

        // Refrescar los datos después de eliminar
        FetchEntrada()
      } else {
        console.warn("La API no devolvió un estado 200:", response)
      }

      return response
    } catch (error) {
      console.error("Error detallado al eliminar:", error.response?.data || error.message || error)
      throw error
    }
  }

  const handleUpdate = (row) => {
    console.log("Datos seleccionados para editar:", row)
    // Asegurarse de que el objeto tenga la propiedad ID
    setSelectedEntrada(row)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedEntrada(null)
  }

  const handleUpdateSuccess = () => {
    // Refresh the data
    FetchEntrada()

    // Close the modal
    handleCloseEditModal()
  }

  return (
    <NavPrivada>
      <ContentPage
        TitlePage={TitlePage}
        Data={RegisterEntradaData}
        TitlesTable={titlesFood}
        FormPage={() => <RegisterEntrada refreshData={FetchEntrada} />}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        endpoint="/Api/Entrada/DeleteEntrada"
      />
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className={MODAL_STYLE_CLASSES}>
          <DialogHeader>
            <DialogTitle>Actualizar Entrada de Alimento</DialogTitle>
          </DialogHeader>
          <div className="">
            {selectedEntrada && (
              <UpdateEntrada
                entradaData={selectedEntrada}
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

export default Entradapage
