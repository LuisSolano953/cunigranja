// Importaciones necesarias
"use client"
import { useEffect, useState } from "react";
import NavPrivada from "@/components/Nav/NavPrivada";
import ContentPage from "@/components/utils/ContentPage";
import RegisterFood from "./RegisterFood";
import axiosInstance from "@/lib/axiosInstance";


export function FoodPage() {
  const TitlePage = "Alimento";
 
  const [RegisterFoodData, setRegisterFoodData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const titlesFood = ["ID", "Nombre", "Estado", "Valor", "Unidad"];

  async function fetchFood() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/Api/Food/GetFood");
      console.log("API Response:", response.data);
      fetchFood();
      if (response.status === 200) {
        const data = response.data.map((item) => ({
          id: item.id_food,
          nombre: item.name_food,
          estado: item.estado_food,
          valor: item.valor_food.toString(),
          unidad: item.unidad_food,
        }));
        console.log("Processed data:", data);
        setRegisterFoodData(data);
      }
    } catch (error) {
      console.error("Error al obtener los registros:", error);
      setError("No se pudieron cargar los datos de los alimentos.");
    } finally {
      setIsLoading(false);
    }
  }
  

  useEffect(() => {
    fetchFood();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/Api/Food/DeleteFood?Id_food=${id}`);
      fetchFood(); // Recargar los datos después de eliminar
    } catch (error) {
      console.error("Error al eliminar el alimento:", error);
      setError("No se pudo eliminar el alimento.");
    }
  };

  console.log("RegisterFoodData:", RegisterFoodData);
  return (
    <NavPrivada>
      <ContentPage 
        TitlePage={TitlePage} 
        Data={RegisterFoodData} 
        TitlesTable={titlesFood}  
        FormPage={RegisterFood}
        onDelete={handleDelete}
        endpoint="/Api/Food/DeleteFood"
      />
    </NavPrivada>
  );
}

export default FoodPage;
