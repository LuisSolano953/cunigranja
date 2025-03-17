'use client';

import { useEffect, useState } from "react";
import NavPrivada from "@/components/Nav/NavPrivada";
import ContentPage from "@/components/utils/ContentPage";
import RegisterReproduction from './RegisterReproduction';
import axiosInstance from "@/lib/axiosInstance";


function Reproductionpage() {
  const TitlePage = "Reproducción";
 
  const [RegisterReproductionData, setRegisterReproductionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const titlesReproduction = ["ID", "Fecha", "Total", "Vivos", "Muertos","Fecha de Monta"];

  async function fetchReproduction() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/Api/Reproduction/GetReproduction");
      console.log("API Response:", response.data);
      fetchReproduction();
      if (response.status === 200) {
        const data = response.data.map((item) => ({
          id: item.id_reproduction,
          fecha: item.fecha_nacimiento,
          total: item.total_conejos,
          vivos: item.nacidos_vivos,
          muertos: item.nacidos_muertos,
          Monta : item.fecha_mounts
        }));
        console.log("Processed data:", data);
        setRegisterReproductionData(data);
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error);
      setError("No se pudieron cargar los datos de los alimentos.");
    } finally {
      setIsLoading(false);
    }
  }
  

  useEffect(() => {
    fetchReproduction();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/Api/Reproduction/DeleteReproduction?Id_Reproduction=${id}`);
      fetchReproduction(); // Recargar los datos después de eliminar
    } catch (error) {
      console.error("Error al eliminar el alimento:", error);
      setError("No se pudo eliminar el alimento.");
    }
  };

  console.log("RegisterReproductionData:", RegisterReproductionData);
  return (
    <NavPrivada>
      <ContentPage 
        TitlePage={TitlePage} 
        Data={RegisterReproductionData} 
        TitlesTable={titlesReproduction}  
        FormPage={RegisterReproduction}
        onDelete={handleDelete}
        endpoint="/Api/Reproduction/DeleteReproduction"
      />
    </NavPrivada>
  );
}

export default Reproductionpage;
