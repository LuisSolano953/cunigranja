"use client"

import RegisterWeighing from "./RegisterWeighing"
import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import axiosInstance from "@/lib/axiosInstance"

function WeighingPage() {
  const TitlePage = "Pesajes"

  const [RegisterWeighingData, setRegisterWeighingData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  const titlesWeighing = ["ID", "Fecha registro","peso actual", "ganancia de peso", "Conejo", "Responsable"]

  async function FetchWeighing() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/Api/Weighing/GetWeighing")
      console.log("API Response:", response.data)

      if (response.status === 200) {
        const data = response.data.map((item) => ({
          id: item.id_weighing, // No need for extra parsing
          fecha: new Date(item.fecha_weighing).toLocaleDateString("es-ES"),
          peso_actual:item.peso_actual,
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

      // Ensure ID is a number
      const numericId = Number.parseInt(id, 10)

      if (isNaN(numericId)) {
        throw new Error("ID inválido")
      }

      const url = `/Api/Weighing/DeleteWeighing?id_weighing=${numericId}`;

      console.log("URL de eliminación:", url)

      const response = await axiosInstance.delete(url)

      // Refresh data after successful deletion
      // Using a small timeout to ensure the server has processed the deletion
      setTimeout(() => {
        FetchWeighing()
      }, 500)

      return response
    } catch (error) {
      console.error("Error detallado al eliminar", error.response?.data || error.message || error)
      throw error
    }
  }

  return (
    <NavPrivada>
      <ContentPage
        TitlePage={TitlePage}
        Data={RegisterWeighingData}
        TitlesTable={titlesWeighing}
        FormPage={() => <RegisterWeighing refreshData={FetchWeighing} />}
        onDelete={handleDelete}
        isLoading={isLoading}
        error={error}
        refreshData={FetchWeighing}
        showDeleteButton={false}
      />
    </NavPrivada>
  )
}

export default WeighingPage

