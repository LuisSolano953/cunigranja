'use client';


import RegisterFeeding from './RegisterFeeding';
import { useEffect, useState } from "react";
import NavPrivada from "@/components/Nav/NavPrivada";
import ContentPage from "@/components/utils/ContentPage";
import axiosInstance from "@/lib/axiosInstance";

function Feedingpage() {
  const TitlePage = "Alimentacion";
 
  const [RegisterFeedingData, setRegisterFeedingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const titlesFood = ["ID", "Fecha", "Hora", "Cantidad"];

  async function fetchFeeding() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/Api/Feeding/GetFeeding");
      console.log("API Response:", response.data);
      fetchFeeding();
      if (response.status === 200) {
        const data = response.data.map((item) => ({
          id: item.id_feeding,
          fecha: item.fecha_feeding,
          hora: item.hora_feeding,
          cantidad: item.cantidad_feeding
         
        }));
        console.log("Processed data:", data);
        setRegisterFeedingData(data);
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error);
      setError("No se pudieron cargar los datos de los alimentos.");
    } finally {
      setIsLoading(false);
    }
  }
  

  useEffect(() => {
    fetchFeeding();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/Api/Feeding/DeleteFeeding?Id_feeding=${id}`);
      fetchFeeding(); // Recargar los datos después de eliminar
    } catch (error) {
      console.error("Error al eliminar el alimento:", error);
      setError("No se pudo eliminar el alimento.");
    }
  };

  console.log("RegisterFeedingData:", RegisterFeedingData);
  return (
    <NavPrivada>
      <ContentPage 
        TitlePage={TitlePage} 
        Data={RegisterFeedingData} 
        TitlesTable={titlesFood}  
        FormPage={RegisterFeeding}
        onDelete={handleDelete}
        endpoint="/Api/Feeding/DeleteFeeding"
      />
    </NavPrivada>
  );
}


export default Feedingpage;
