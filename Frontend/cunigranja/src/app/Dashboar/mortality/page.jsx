"use client"
import { useEffect, useState } from "react"
import NavPrivada from "@/components/Nav/NavPrivada"
import ContentPage from "@/components/utils/ContentPage"
import RegisterMortality from "./RegisterMortality"
import axiosInstance from "@/lib/axiosInstance"

function Mortalitypage() {
  const TitlePage = "Mortalidad"

  const [RegisterMortalityData, setRegisterMortalityData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const titlesMortality = ["ID", "Conejo", "Fecha muerte", "Causa de muerte", "Responsable"]

  async function fetchMortality() {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get("/Api/Mortality/AllMortality")
      console.log("API Response:", response.data)

      if (response.status === 200) {
        // Añadir este log para ver la estructura exacta del primer elemento
        if (response.data.length > 0) {
          console.log("Primer elemento de la respuesta:", JSON.stringify(response.data[0], null, 2))
        }

        const data = response.data.map((item) => {
          // Intentar formatear la fecha correctamente
          let formattedDate = "N/A"
          try {
            if (item.fecha_mortality) {
              formattedDate = new Date(item.fecha_mortality).toLocaleDateString("es-ES")
            }
          } catch (error) {
            console.error("Error al formatear la fecha:", error)
          }

          return {
            id: item.id_mortality,
            // Usar name_rabbit en lugar de nombre_rabi
            conejo: item.name_rabbit || item.nombre_rabbit || "Sin nombre",
            fecha: formattedDate,
            causa: item.causa_mortality || "No especificada",
            responsable: item.name_user || "Sin asignar",
          }
        })

        console.log("Processed data:", data)
        setRegisterMortalityData(data)
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error)
      setError("No se pudieron cargar los datos de la Mortalidad.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMortality()
  }, [])

  const handleDelete = async (id) => {
    try {
      console.log("Intentando eliminar registro con ID", id)
      const numericId = Number.parseInt(id, 10)

      if (isNaN(numericId)) {
        throw new Error("ID invalido")
      }

      const url = `/Api/Mortality/DeleteMortality?id=${numericId}`

      console.log("URL de eliminación:", url)

      const response = await axiosInstance.delete(url)

      setTimeout(() => {
        fetchMortality()
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
        Data={RegisterMortalityData}
        TitlesTable={titlesMortality}
        FormPage={RegisterMortality}
        onDelete={handleDelete}
        isLoading={isLoading}
        error={error}
        refreshData={fetchMortality}
        endpoint="/Api/Mortality/DeleteMortality"
      />
    </NavPrivada>
  )
}

export default Mortalitypage
