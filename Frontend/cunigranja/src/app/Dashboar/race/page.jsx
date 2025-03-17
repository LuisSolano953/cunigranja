"use client"
import { useEffect, useState } from "react";
import NavPrivada from "@/components/Nav/NavPrivada";
import ContentPage from "@/components/utils/ContentPage";
import RegisterRace from "./RegisterRace";
import axiosInstance from "@/lib/axiosInstance";

function Racepage() {
  const TitlePage = "Raza";
 
  const [RegisterRaceData, setRegisterRaceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const titlesRace = ["ID", "Nombre"];

  async function fetchRace() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/Api/Race/GetRace");
      console.log("API Response:", response.data);
      fetchRace();
      if (response.status === 200) {
        const data = response.data.map((item) => ({
          id: item.id_race,
          nombre: item.nombre_race,
          
        }));
        console.log("Processed data:", data);
        setRegisterRaceData(data);
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error);
      setError("No se pudieron cargar los datos de las razas.");
    } finally {
      setIsLoading(false);
    }
  }
  

  useEffect(() => {
    fetchRace();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/Api/Race/DeleteRace?Id_race=${id}`);
      fetchFood(); // Recargar los datos después de eliminar
    } catch (error) {
      console.error("Error al eliminar la raza:", error);
      setError("No se pudo eliminar la raza.");
    }
  };

  console.log("RegisterRaceData:", RegisterRaceData);
  return (
    <NavPrivada>
      <ContentPage 
        TitlePage={TitlePage} 
        Data={RegisterRaceData} 
        TitlesTable={titlesRace}  
        FormPage={RegisterRace}
        onDelete={handleDelete}
        endpoint="/Api/Race/DeleteRace"
      />
    </NavPrivada>
  );
}


export default Racepage;
