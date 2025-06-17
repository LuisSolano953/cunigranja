"use client"

import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import RegisterRabbit from "./RegisterRabbit "
import axiosInstance from "@/lib/axiosInstance"
import UpdateRabbit from "./UpdateRabbit"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MODAL_STYLE_CLASSES } from "@/components/utils/ModalDialog"
import DataTable from "@/components/utils/DataTable"
import AlertModal from "@/components/utils/AlertModal"

export function RabbitPage() {
  const TitlePage = "Conejos"

  const [RegisterRabiData, setRegisterRabiData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedRabbit, setSelectedRabbit] = useState(null)

  // Estados para alertas
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  // Estos títulos deben coincidir exactamente con las propiedades del objeto que creamos abajo
  const titlesRabi = [
    "ID",
    "Nombre",
    "Fecha registro",
    "Peso inicial",
    "Sexo",
    "Estado",
    "Peso actual",
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
        const data = response.data.map((item) => {
          // Primero creamos un objeto con las propiedades en el orden correcto para la tabla
          const displayData = {
            Id: item.Id_rabbit,
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
            Id_rabbit: item.Id_rabbit,
            name_rabbit: item.name_rabbit,
            fecha_registro: item.fecha_registro,
            sexo_rabbit: item.sexo_rabbit,
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
    setSelectedRabbit(row)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedRabbit(null)
  }

  const handleUpdateSuccess = () => {
    fetchRabbit()
    handleCloseEditModal()
  }

  //  Función optimizada para verificar registros de mortalidad
  const checkMortalityRecord = async (rabbitId) => {
    try {
      console.log(" Verificando registros de mortalidad para rabbit ID:", rabbitId)

      // Usar el nuevo endpoint específico
      const response = await axiosInstance.get(`/Api/Mortality/GetMortalityByRabbit?rabbitId=${rabbitId}`)

      if (response.status === 200) {
        console.log(" Respuesta del servidor:", response.data)
        const mortalityRecords = response.data || []

        console.log(` Registros encontrados: ${mortalityRecords.length}`)

        if (mortalityRecords.length > 0) {
          console.log(" Registros de mortalidad:", mortalityRecords)
          return true
        }

        return false
      }

      return false
    } catch (error) {
      console.error(" Error al verificar registros de mortalidad:", error)

      // Si el endpoint específico falla, intentar con el endpoint general
      try {
        console.log(" Intentando con endpoint general...")
        const response = await axiosInstance.get("/Api/Mortality/AllMortality")

        if (response.status === 200 && response.data) {
          const mortalityRecords = response.data.filter(
            (record) => record.Id_rabbit == rabbitId || record.id_rabbit == rabbitId,
          )

          console.log(` Registros encontrados (método alternativo): ${mortalityRecords.length}`)
          return mortalityRecords.length > 0
        }
      } catch (fallbackError) {
        console.error(" Error en método alternativo:", fallbackError)
      }

      return false
    }
  }

  // Función para activar/desactivar conejos con verificación de mortalidad
  const handleToggleRabbitStatus = async (rabbit) => {
    try {
      console.log(" Procesando cambio de estado para conejo:", rabbit)

      const currentStatus = rabbit.estado
      const newStatus = currentStatus === "Activo" ? "Inactivo" : "Activo"

      console.log(` Cambio de estado: ${currentStatus} → ${newStatus}`)

      //  Si se está intentando activar el conejo, verificar registros de mortalidad
      if (newStatus === "Activo") {
        console.log(" Intentando activar conejo - Verificando mortalidad...")

        const rabbitId = rabbit.Id_rabbit || rabbit.Id
        console.log("ID del conejo a verificar:", rabbitId)

        const hasMortalityRecords = await checkMortalityRecord(rabbitId)
        console.log(" Resultado verificación mortalidad:", hasMortalityRecords)

        if (hasMortalityRecords) {
          console.log(" BLOQUEANDO ACTIVACIÓN - Se encontraron registros de mortalidad")
          setAlertMessage(
            ` No es posible activar el conejo "${rabbit.name_rabbit || rabbit.name}" porque tiene registros de mortalidad. Por favor, revise y gestione los registros en el módulo de mortalidad antes de activarlo.`,
          )
          setShowErrorAlert(true)
          return //  Salir sin activar el conejo
        }

        console.log(" No se encontraron registros de mortalidad - Procediendo con la activación")
      }

      // Proceso normal para cambio de estado
      const payload = {
        Id_rabbit: rabbit.Id_rabbit || rabbit.Id,
        name_rabbit: rabbit.name_rabbit || rabbit.name,
        fecha_registro: rabbit.fecha_registro,
        peso_inicial: rabbit.peso_inicial,
        sexo_rabbit: rabbit.sexo_rabbit || rabbit.sexo,
        estado: newStatus,
        peso_actual: rabbit.peso_actual,
        Id_cage: rabbit.Id_cage,
        Id_race: rabbit.Id_race,
      }

      console.log(" Enviando payload de actualización:", payload)

      const response = await axiosInstance.post("/Api/Rabbit/UpdateRabbit", payload)

      if (response.status === 200) {
        console.log(" Estado actualizado correctamente")
        setAlertMessage(` Conejo ${newStatus.toLowerCase()} correctamente`)
        setShowSuccessAlert(true)
        fetchRabbit() // Recargar datos
      }
    } catch (error) {
      console.error(" Error al cambiar estado del conejo:", error)
      setAlertMessage(" Error al cambiar el estado del conejo")
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
      {/* Alertas */}
      <AlertModal type="success" message={alertMessage} isOpen={showSuccessAlert} onClose={handleCloseSuccessAlert} />
      <AlertModal type="error" message={alertMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <ContentPage
        TitlePage="Conejos"
        Data={RegisterRabiData}
        TitlesTable={titlesRabi}
        FormPage={RegisterRabbit}
        refreshData={fetchRabbit}
        onUpdate={handleUpdate}
        isLoading={isLoading}
        error={error}
        showDeleteButton={false}
        showChartButton={true}
        CustomDataTable={(props) => (
          <DataTable
            {...props}
            isRabbitTable={true}
            showStatusButton={true}
            onToggleStatus={handleToggleRabbitStatus}
          />
        )}
      />

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className={MODAL_STYLE_CLASSES}>
          <DialogHeader>
            <DialogTitle>Ver Información del Conejo</DialogTitle>
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
