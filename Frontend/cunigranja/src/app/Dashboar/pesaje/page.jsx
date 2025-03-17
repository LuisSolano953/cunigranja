'use client';

import RegisterWeighing from './RegisterWeighing';
import { useEffect, useState } from "react";
import NavPrivada from "@/components/Nav/NavPrivada";
import ContentPage from "@/components/utils/ContentPage";
import axiosInstance from "@/lib/axiosInstance";

function Weighingpage() {
  const TitlePage = "Pesaje";
 
  const [RegisterWeighingData, setRegisterWeighingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const titlesWeighing = ["ID", "Fecha","Peso", "conejo", "Responsable"];

  async function fetchWeighing() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/Api/Weighing/GetWeighing");
      console.log("API Response:", response.data);
      
      if (response.status === 200) {
        const data = response.data.map((item) => ({
          id: item.id_weighing,
          fecha:item.fecha_weighing,
          peso: item.peso_weighing,
          responsable: item.name_user,
          nombre: item.nombre_rabi,
        }));
        console.log("Processed data:", data);
        setRegisterWeighingData(data);
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error);
      setError("No se pudieron cargar los datos del pesaje.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchWeighing();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/Api/Weighing/DeleteWeighing?Id_weighing=${id}`);
      fetchWeighing(); // Recargar los datos después de eliminar
    } catch (error) {
      console.error("Error al eliminar el pesaje:", error);
      setError("No se pudo eliminar el pesaje.");
    }
  };

  console.log("RegisterWeighingData:", RegisterWeighingData);
  return (
    <NavPrivada>
      <ContentPage 
        TitlePage={TitlePage} 
        Data={RegisterWeighingData} 
        TitlesTable={titlesWeighing}  
        FormPage={RegisterWeighing}
        onDelete={handleDelete}
        endpoint="/Api/Weighing/DeleteWeighing"
      />
    </NavPrivada>
  );
}

export default Weighingpage;