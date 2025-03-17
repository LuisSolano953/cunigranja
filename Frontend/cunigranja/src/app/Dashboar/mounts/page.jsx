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

  const titlesFood = ["ID", "Tiempo", "Fecha", "Cantidad", "Nombre"];

  async function fetchFeeding() {
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
          nombre: item.nombre_rabi,
        }));
        console.log("Processed data:", data);
        setRegisterMountsData(data);
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
      console.error("Error al eliminar la monta:", error);
      setError("No se pudo eliminar la monta.");
    }
  };

  console.log("RegisterMountsData:", RegisterMountsData);
  return (
    <NavPrivada>
      <ContentPage 
        TitlePage={TitlePage} 
        Data={RegisterMountsData} 
        TitlesTable={titlesFood}  
        FormPage={Registermounts}
        onDelete={handleDelete}
        endpoint="/Api/Feeding/DeleteFeeding"
      />
    </NavPrivada>
  );
}

export default Mountspage;