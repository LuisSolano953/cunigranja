'use client';

import Registermounts from './Registermounts';
import { useEffect, useState } from "react";
import NavPrivada from "@/components/Nav/NavPrivada";
import ContentPage from "@/components/utils/ContentPage";
import axiosInstance from "@/lib/axiosInstance";

function Mountspage() {
  const TitlePage = "Montas";
 
  const [RegisterMountsData, setRegisterMountsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const titlesFood = ["ID", "Tiempo", "Fecha", "Cantidad", "Conejo"];

  async function FetchMounts() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/Api/Mounts/GetMounts");
      console.log("API Response:", response.data);
      
      if (response.status === 200) {
        const data = response.data.map((item) => ({
          id: item.id_mounts,
          fecha: item.fecha_mounts,
          tiempo : item.tiempo_mounts,
          cantidad: item.cantidad_mounts,
          conejo: item.name_rabbit,
        }));
        console.log("Processed data:", data);
        setRegisterMountsData(data);
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error);
      setError("No se pudieron cargar los datos de los alimentos.");
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    FetchMounts();
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
      const url = `/Api/Mounts/DeleteMounts?id=${numericId}`
      console.log("URL de eliminación:", url)
  
      const response = await axiosInstance.delete(url)
  
      console.log("Respuesta de eliminación:", response)
  
      if (response.status === 200) {
        console.log('Registro con ID ${numericId} eliminado correctamente.')
  
        // Refrescar los datos después de eliminar
        FetchMounts()
      } else {
        console.warn("La API no devolvió un estado 200:", response)
      }
  
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
        Data={RegisterMountsData} 
        TitlesTable={titlesFood}  
        FormPage={() =><Registermounts refreshData={FetchMounts}/>}
        onDelete={handleDelete}
        endpoint="/Api/Feeding/DeleteFeeding"
      />
    </NavPrivada>
  )
}

export default Mountspage