"use client"
import { useEffect, useState } from "react";
import NavPrivada from "@/components/Nav/NavPrivada";
import ContentPage from "@/components/utils/ContentPage";
import RegisterMortality from "./RegisterMortality";
import axiosInstance from "@/lib/axiosInstance";


export function Mortalitypage() {
  const TitlePage = "Mortalidad";
 
  const [RegisterMortalityData, setRegisterMortalityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const titlesMortality = ["ID", "Cantidad", "Fecha", "Conejo", "Responsable"];

  async function fetchMortality() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/Api/Mortality/AllMortality");
      console.log("API Response:", response.data);
      fetchMortality();
      if (response.status === 200) {
        const data = response.data.map((item) => ({
          id: item.id_mortality,
          nombre: item.name_mortality,
          fecha: item.fecha_mortality,
          conejo: item.nombre_rabi,
          responsable: item.name_user
        }));
        console.log("Processed data:", data);
        setRegisterMortalityData(data);
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error);
      setError("No se pudieron cargar los datos de los alimentos.");
    } finally {
      setIsLoading(false);
    }
  }
  

  useEffect(() => {
    fetchMortality();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/Api/Mortal/DeleteMortality?Id_mortality=${id}`);
      fetchHealth(); // Recargar los datos después de eliminar
    } catch (error) {
      console.error("Error al eliminar Mortalidad:", error);
      setError("No se pudo eliminar la Mortalidad");
    }
  };

  console.log("RegisterMortalityData:", RegisterMortalityData);
  return (
    <NavPrivada>
      <ContentPage 
        TitlePage={TitlePage} 
        Data={RegisterMortalityData} 
        TitlesTable={titlesMortality}  
        FormPage={RegisterMortality}
        onDelete={handleDelete}
        endpoint="/Api/Mortality/DeleteMortality"
      />
    </NavPrivada>
  );
}

export default Mortalitypage;
