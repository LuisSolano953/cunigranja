"use client"

import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import RegisterRabbit from "./RegisterRabbit "
import axiosInstance from "@/lib/axiosInstance"
import UpdateRabbit from "./UpdateRabbit"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MODAL_STYLE_CLASSES } from "@/components/utils/ModalDialog"
import DataTable from "@/components/utils/DataTable" // Import the updated DataTable component

export function RabbitPage() {
  const TitlePage = "Conejos"

  const [RegisterRabiData, setRegisterRabiData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedRabbit, setSelectedRabbit] = useState(null)

  // Estos títulos deben coincidir exactamente con las propiedades del objeto que creamos abajo
  const titlesRabi = [
    "ID",
    "Nombre",
    "Fecha registro",
    "Peso inicial",
    "sexo",
    "Estado",
    "peso actual",
    "Raza",
    "Jaula",
  ]

  async function fetchRabbit() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/Api/Rabbit/GetRabbit")
      console.log("Datos originales de la API:", response.data)

      if (response.status === 200) {
        // Creamos un array de propiedades que coincida exactamente con el orden de titlesRabi
        const propertyKeys = [
          "Id", // ID
          "name", // Nombre
          "fecha", // Fecha salida
          "peso_inicial", // Peso inicial
          "sexo", // sexo
          "estado", // Estado
          "peso_actual", // peso actual
          "raza", // Raza
          "jaula", // Jaula
        ]

        const data = response.data.map((item) => {
          // Primero creamos un objeto con las propiedades en el orden correcto para la tabla
          const displayData = {
            Id: item.id_rabbit,
            name: item.name_rabbit,
            fecha: new Date(item.fecha_registro).toLocaleDateString("es-ES"),
            peso_inicial: item.peso_inicial,
            sexo: item.sexo_rabbit,
            estado: item.estado,
            peso_actual: item.peso_actual,
            raza: item.nombre_race,
            jaula: item.estado_cage,
          }

          // Luego añadimos las propiedades adicionales para actualización
          return {
            ...displayData,
            // Campos adicionales para actualizar
            Id: item.Id_rabbit, // Añadimos id para que DataTable pueda usarlo como key
            Id_rabbit: item.Id_rabbit, // Añadimos explícitamente id_rabbit
            name_rabbit: item.name_rabbit,
            fecha_registro: item.fecha_registro,
            sexo_rabbit: item.sexo_rabbit,
            estado: item.estado,
            Id_race: item.Id_race,
            Id_cage: item.Id_cage,
          }
        })

        console.log("Datos procesados para la tabla:", data)
        setRegisterRabiData(data)
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error)
      setError("No se pudieron cargar los datos de los conejos.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRabbit()
  }, [])

  const handleUpdate = (row) => {
    console.log("Datos seleccionados para editar:", row)
    // Asegurarse de que el objeto tenga la propiedad id_rabbit
    setSelectedRabbit(row)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedRabbit(null)
  }

  const handleUpdateSuccess = () => {
    // Refresh the data
    fetchRabbit()

    // Close the modal
    handleCloseEditModal()
  }

  return (
    <NavPrivada>
      <ContentPage
        TitlePage={TitlePage}
        Data={RegisterRabiData}
        TitlesTable={titlesRabi}
        FormPage={() => <RegisterRabbit refreshData={fetchRabbit} />}
        refreshData={fetchRabbit}
        onUpdate={handleUpdate}
        isLoading={isLoading}
        error={error}
        showDeleteButton={false}
        showChartButton={true} // Add this prop to show the chart button
        CustomDataTable={DataTable} // Use the custom DataTable component
      />
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className={MODAL_STYLE_CLASSES}>
          <DialogHeader>
            <DialogTitle>Actualizar Conejo</DialogTitle>
          </DialogHeader>
          <div className="">
            {selectedRabbit && (
              <UpdateRabbit rabbitData={selectedRabbit} onClose={handleCloseEditModal} onUpdate={handleUpdateSuccess} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </NavPrivada>
  )
}

export default RabbitPage
