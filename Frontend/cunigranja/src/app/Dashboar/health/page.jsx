"use client"

import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import RegisterHealth from "./RegisterHealth"
import axiosInstance from "@/lib/axiosInstance"

export function Healthpage() {
  const TitlePage = "Sanidad"

  const [RegisterHealthData, setRegisterHealthData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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
          fecha: item.fecha_health,
          descripcion: item.descripcion_health,
          valor: item.valor_health,
          responsable: item.name_user,
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

      // Esperar un momento antes de refrescar los datos
      

      return response
    } catch (error) {
      console.error("Error detallado al eliminar:", error.response?.data || error.message || error)
      throw error
    }
  }
  

  return (
    <NavPrivada>
      <ContentPage
        TitlePage={TitlePage}
        Data={RegisterHealthData}
        TitlesTable={titlesHealth}
        FormPage={() => <RegisterHealth refreshData={fetchHealth} />}
        onDelete={handleDelete}
        endpoint="/Api/Health/DeleteHealth"
      />
    </NavPrivada>
  )
}

export default Healthpage

