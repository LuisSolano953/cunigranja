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
  const [rabbits, setRabbits] = useState([]) // Para obtener la lista de conejas

  const titlesReproduction = ["ID", "Fecha", "Total conejos", "Nacidos Vivos", " nacidos Muertos", "Coneja"]

  // Función para obtener las conejas y hacer el mapeo por nombre
  async function fetchRabbits() {
    try {
      const response = await axiosInstance.get("/Api/Rabbit/GetRabbit")
      if (response.status === 200) {
        const femaleRabbits = response.data.filter((rabbit) => rabbit.sexo_rabbit === "Hembra")
        setRabbits(femaleRabbits)
        return femaleRabbits
      }
      return []
    } catch (error) {
      console.error("Error al obtener conejas:", error)
      return []
    }
  }

  async function fetchReproduction() {
    try {
      setIsLoading(true)

      // Obtener conejas primero
      const rabbitsData = await fetchRabbits()

      const response = await axiosInstance.get("/Api/Reproduction/GetReproduction")
      console.log("=== RESPUESTA DE LA API ===")
      console.log("API Response:", response.data)

      if (response.status === 200) {
        const data = response.data.map((item) => {
          console.log("=== PROCESANDO ITEM ===")
          console.log("Item original:", item)

          // SOLUCIÓN TEMPORAL: Buscar el ID de la coneja por nombre
          let foundRabbitId = null
          if (item.name_rabbit && rabbitsData.length > 0) {
            const matchingRabbit = rabbitsData.find((rabbit) => rabbit.name_rabbit === item.name_rabbit)
            if (matchingRabbit) {
              foundRabbitId = matchingRabbit.Id_rabbit || matchingRabbit.id_rabbit
              console.log(`✅ ID encontrado por nombre: ${item.name_rabbit} -> ID: ${foundRabbitId}`)
            } else {
              console.log(`❌ No se encontró coneja con nombre: ${item.name_rabbit}`)
            }
          }

          // Si el API ya incluye Id_rabbit, usarlo directamente
          const rabbitId = item.Id_rabbit || foundRabbitId

          const mappedItem = {
            // Para la tabla
            id: item.Id_reproduction,
            fecha: new Date(item.fecha_nacimiento).toLocaleDateString("es-ES"),
            total: item.total_conejos,
            vivos: item.nacidos_vivos,
            muertos: item.nacidos_muertos,
            conejo: item.name_rabbit,

            // Para el formulario de actualización
            Id_reproduction: item.Id_reproduction,
            fecha_nacimiento: item.fecha_nacimiento,
            total_conejos: item.total_conejos,
            nacidos_vivos: item.nacidos_vivos,
            nacidos_muertos: item.nacidos_muertos,
            Id_rabbit: rabbitId, // Usar el ID encontrado
            name_rabbit: item.name_rabbit,

            // Para debug
            _originalItem: item,
            _foundByName: !!foundRabbitId,
            _directFromAPI: !!item.Id_rabbit,
          }

          console.log("Item mapeado:", mappedItem)
          return mappedItem
        })

        console.log("=== DATOS FINALES ===")
        console.log("Processed data:", data)
        console.log("Registros con ID de rabbit:", data.filter((item) => item.Id_rabbit).length)

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
      const numericId = Number.parseInt(id, 10)
      const url = `/Api/Reproduction/DeleteReproduction?id=${numericId}`
      const response = await axiosInstance.delete(url)

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
    console.log("=== ABRIENDO MODAL DE EDICIÓN ===")
    console.log("Datos del registro seleccionado:", row)
    console.log("ID de rabbit:", row.Id_rabbit)
    console.log("Método de obtención:", row._directFromAPI ? "Directo de API" : "Por nombre")

    setSelectedReproduction(row)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedReproduction(null)
  }

  const handleUpdateSuccess = () => {
    fetchReproduction()
    handleCloseEditModal()
  }

  return (
    <NavPrivada>
      <ContentPage
        TitlePage={TitlePage}
        Data={RegisterReproductionData}
        TitlesTable={titlesReproduction}
        FormPage={RegisterReproduction}
        refreshData={fetchReproduction}
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
            <DialogTitle>Actualizar Reproducción</DialogTitle>
          </DialogHeader>
     
            {selectedReproduction && (
              

                <UpdateReproduction
                  reproductionData={selectedReproduction}
                  onClose={handleCloseEditModal}
                  onUpdate={handleUpdateSuccess}
                />
              
            )}
         
        </DialogContent>
      </Dialog>
    </NavPrivada>
  )
}

export default Reproductionpage
