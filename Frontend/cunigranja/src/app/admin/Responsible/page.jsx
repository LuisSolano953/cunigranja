"use client"

import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import axiosInstance from "@/lib/axiosInstance"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/authContext"
import DataTable from "@/components/utils/DataTable"
import AlertModal from "@/components/utils/AlertModal"

function UserPage() {
  const TitlePage = "Usuarios"
  const { toast } = useToast()
  const { user } = useAuth()

  const [userData, setUserData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados para alertas
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const titlesUser = ["ID", "Nombre", "Tipo de Usuario", "Correo Electrónico", "Estado"]

  async function fetchUsers() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("Api/User/AllUser")
      console.log("API Response:", response.data)

      if (response.status === 200) {
        // Obtenemos el email del usuario actual
        const currentUserEmail = user?.email

        // Procesamos y filtramos los datos para excluir al usuario actual
        const data = response.data
          .filter((item) => {
            // Si no hay usuario logueado, mostramos todos los usuarios
            if (!currentUserEmail) return true

            // Filtramos para excluir al usuario actual por su email
            return item.email_user !== currentUserEmail
          })
          .map((item) => ({
            id: item.Id_user,
            nombre: item.name_user,
            tipo: item.tipo_user || "No especificado",
            email: item.email_user,
            estado: item.estado || (item.blockard === 1 ? "Inactivo" : "Activo"),
            // Mantener datos originales para el DataTable
            Id_user: item.Id_user,
            name_user: item.name_user,
            tipo_user: item.tipo_user,
            email_user: item.email_user,
            blockard: item.blockard || 0,
          }))

        console.log("Processed user data (excluding current user):", data)
        setUserData(data)
      }
    } catch (error) {
      console.error("Error al obtener los usuarios:", error)
      setError("No se pudieron cargar los datos de usuarios.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [user])

  // Función para manejar la activación/desactivación de usuarios
  const handleToggleUserStatus = async (userRow) => {
    try {
      const userId = userRow.Id_user || userRow.id
      const currentStatus = userRow.blockard

      // Nuevo estado (invertir el estado actual)
      const newStatus = currentStatus === 1 ? 0 : 1

      console.log(`Cambiando estado del usuario ${userId} de ${currentStatus} a ${newStatus}`)

      // Obtener el usuario completo primero
      const userResponse = await axiosInstance.get(`Api/User/ConsulUser?Id_user=${userId}`)

      if (userResponse.status !== 200) {
        throw new Error("No se pudo obtener la información del usuario")
      }

      // Obtener el usuario actual
      const currentUser = userResponse.data
      console.log("Usuario actual:", currentUser)

      // Verificar que no estamos intentando desactivar nuestro propio usuario
      if (currentUser.email_user === user?.email) {
        setAlertMessage("No puedes cambiar el estado de tu propia cuenta")
        setShowErrorAlert(true)
        return
      }

      // Actualizar solo el campo blockard
      currentUser.blockard = newStatus

      console.log("Datos a enviar para actualización:", currentUser)

      // Intentar actualizar el usuario usando el método POST
      const updateResponse = await axiosInstance.post("Api/User/UpdateUser", currentUser)

      console.log("Respuesta de actualización:", updateResponse)

      if (updateResponse.status === 200) {
        setAlertMessage(`Usuario ${newStatus === 1 ? "desactivado" : "activado"} exitosamente`)
        setShowSuccessAlert(true)

        // Recargar los datos
        fetchUsers()
      } else {
        throw new Error(`Error en la respuesta: ${updateResponse.status}`)
      }
    } catch (error) {
      console.error("Error detallado al cambiar el estado del usuario:", error)

      // Mostrar información más detallada sobre el error
      let errorMessage = "No se pudo cambiar el estado del usuario."

      if (error.response) {
        console.log("Error response data:", error.response.data)
        if (error.response.data && error.response.data.errors) {
          errorMessage += " Detalles: " + JSON.stringify(error.response.data.errors)
        }
      }

      setAlertMessage(errorMessage)
      setShowErrorAlert(true)
    }
  }

 
  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false)
    setAlertMessage("")
  }

  return (
    <NavPrivada>
      {/* Alertas */}
     
      <AlertModal type="error" message={alertMessage} isOpen={showErrorAlert} onClose={handleCloseErrorAlert} />

      <ContentPage
        TitlePage={TitlePage}
        Data={userData}
        TitlesTable={titlesUser}
        refreshData={fetchUsers}
        isLoading={isLoading}
        error={error}
        showDeleteButton={false}
        showEditButton={false}
        CustomDataTable={(props) => (
          <DataTable {...props} isUserTable={true} showStatusButton={true} onToggleStatus={handleToggleUserStatus} />
        )}
      />
    </NavPrivada>
  )
}

export default UserPage
