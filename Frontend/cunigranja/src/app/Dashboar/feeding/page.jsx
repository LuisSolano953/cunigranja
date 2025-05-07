"use client"

import RegisterFeeding from "./RegisterFeeding"
import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import axiosInstance from "@/lib/axiosInstance"
import UpdateFeeding from "./UpdateFeeding"
import { MODAL_STYLE_CLASSES } from "@/components/utils/ModalDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function Feedingpage() {
  const TitlePage = "Alimentación"
  const [RegisterFeedingData, setRegisterFeedingData] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFeeding, setSelectedFeeding] = useState(null)

  const titlesFood = ["ID", "Fecha", "Hora", "Cantidad", "Alimento", "Conejo", "Responsable", "Existencia actual"]

  async function fetchFeeding() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/Api/Feeding/GetFeeding")

      if (response.status === 200) {
        console.log("Datos originales de la API:", response.data)

        // Verificar la estructura de los datos recibidos
        if (response.data.length > 0) {
          console.log("Ejemplo del primer registro:", response.data[0])
          console.log("Propiedades disponibles:", Object.keys(response.data[0]))
        }

        const data = response.data.map((item) => {
          // Verificar y mostrar los IDs importantes para depuración
          console.log(`Registro ID ${item.Id_feeding || "?"} - IDs importantes:`, {
            Id_food: item.Id_food,
            Id_rabbit: item.Id_rabbit,
            Id_user: item.Id_user,
          })

          // Primero creamos un objeto con las propiedades para la tabla
          const displayData = {
            id: item.Id_feeding,
            fecha: new Date(item.fecha_feeding).toLocaleDateString("es-ES"),
            hora: item.hora_feeding?.slice(0, 5) || "",
            cantidad: item.cantidad_feeding,
            alimento: item.name_food,
            conejo: item.name_rabbit,
            responsable: item.name_user,
            existencia: Math.round(item.existencia_actual * 10) / 10,
          }

          // Luego añadimos todas las propiedades originales para actualización
          return {
            ...displayData,
            // Datos para el formulario de actualización - IMPORTANTE: mantener los nombres originales
            Id_feeding: item.Id_feeding,
            id_feeding: item.Id_feeding,
            fecha_feeding: item.fecha_feeding,
            hora_feeding: item.hora_feeding,
            cantidad_feeding: item.cantidad_feeding,
            // Asegurarnos de que los IDs estén presentes
            Id_food: item.Id_food || item.id_food,
            Id_rabbit: item.Id_rabbit || item.id_rabbit,
            Id_user: item.Id_user || item.id_user,
            existencia_actual: Math.round(item.existencia_actual * 10) / 10,
            name_food: item.name_food,
            name_rabbit: item.name_rabbit,
            name_user: item.name_user,
          }
        })

        console.log("Datos transformados:", data)
        setRegisterFeedingData(data)
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error)
      setError("No se pudieron cargar los datos de los alimentos.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeeding()
  }, [])

  const handleDelete = async (id) => {
    try {
      console.log("Intentando eliminar registro con ID:", id)

      // Asegurarse de que el ID sea un número
      const numericId = Number.parseInt(id, 10)

      // Usar el formato correcto para la solicitud DELETE
      const url = `/Api/Feeding/DeleteFeeding?id=${numericId}`
      console.log("URL de eliminación:", url)

      const response = await axiosInstance.delete(url)

      console.log("Respuesta de eliminación:", response)

      // Recargar datos después de eliminar
      setTimeout(() => {
        fetchFeeding()
      }, 1000)

      return response
    } catch (error) {
      console.error("Error detallado al eliminar:", error.response?.data || error.message || error)
      throw error
    }
  }

  const handleUpdate = (row) => {
    console.log("Datos seleccionados para editar:", row)

    // IMPORTANTE: Ya no verificamos los IDs aquí, permitimos que el formulario se abra
    // y el componente UpdateFeeding se encargará de buscar los IDs basados en los nombres

    setSelectedFeeding(row)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedFeeding(null)
  }

  const handleUpdateSuccess = () => {
    // Refresh the data
    fetchFeeding()

    // Close the modal
    handleCloseEditModal()
  }

  return (
    <NavPrivada>
      <ContentPage
        TitlePage={TitlePage}
        Data={RegisterFeedingData}
        TitlesTable={titlesFood}
        FormPage={() => <RegisterFeeding onRegisterSuccess={fetchFeeding} />}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        endpoint="/Api/Feeding/DeleteFeeding"
        isLoading={isLoading}
        error={error}
        refreshData={fetchFeeding}
        showDeleteButton={false}
      />
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className={MODAL_STYLE_CLASSES}>
          <DialogHeader>
            <DialogTitle>Actualizar Alimentación</DialogTitle>
          </DialogHeader>
          <div className="">
            {selectedFeeding && (
              <UpdateFeeding
                feedingData={selectedFeeding}
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

export default Feedingpage
  