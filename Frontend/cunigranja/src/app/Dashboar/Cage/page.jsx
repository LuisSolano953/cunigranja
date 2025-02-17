'use client';
import { useEffect, useState } from "react";
import NavPrivada from "@/components/Nav/NavPrivada";
import ContentPage from "@/components/utils/ContentPage";
import RegisterCage from "./RegisterCage";
import axiosInstance from "@/lib/axiosInstance";


function Cagepage() {
  const TitlePage ="Jaula";

  // const CageData = [
  //   [ 1, 'A316', "ken99@yahoo.com" ],
  //   [ 2, 'A242', "Abe45@gmail.com" ],
  //   [ 3, 'A874', "Silas22@gmail.com" ],
  //   [ 4, 'A721', "carmella@hotmail.com" ],
  // ];

  // const titleCage = [
  //   'id', 'codigo', 'nombre'
  // ];



  const [RegisterCageData, setRegisterCageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  
  const titlesCage = ["Id","Estado" ];
 
  async function fetchFood() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/Api/Cage/GetCage");
      console.log("API Response:", response.data); 
      
      if (response.status === 200) {
        const data = response.data.map((item) => ({
          id: item.id_cage,
          estado: item.estado_cage
        }));
        console.log("Processed data:", data);
        setRegisterCageData(data);
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error);
      setError("No se pudieron cargar los datos de los alimentos.");
    } finally {
      setIsLoading(false);
    }}

  useEffect(() => {
    fetchFood();
  }, []);

  console.log("RegisterFoodData:",RegisterCageData);
  return (
    <NavPrivada >
      <ContentPage TitlePage={TitlePage} Data={RegisterCageData} TitlesTable={titlesCage} FormPage={RegisterCage} />
     
    </NavPrivada>
  );
}

export default Cagepage;

