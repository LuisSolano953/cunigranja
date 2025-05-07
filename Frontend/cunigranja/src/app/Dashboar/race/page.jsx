"use client"
import { useEffect, useState } from "react";
import NavPrivada from "@/components/Nav/NavPrivada";
import ContentPage from "@/components/utils/ContentPage";
import RegisterRace from "./RegisterRace";
import UpdateRace from "./UpdateRace"
import axiosInstance from "@/lib/axiosInstance"
import { MODAL_STYLE_CLASSES } from "@/components/utils/ModalDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
 

function Racepage() {
  const TitlePage = "Raza";
 
  const [RegisterRaceData, setRegisterRaceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
   
    const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("")
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedRace, setSelectedRace] = useState(null)

  const titlesRace = ["ID", "Nombre"];

  async function fetchRace() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/Api/Race/GetRace");
      console.log("API Response:", response.data);
     
      if (response.status === 200) {
        const data = response.data.map((item) => ({
          id: item.Id_race,
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
  const handleUpdate = (row) => {
    setSelectedRace(row)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedRace(null)
  }
 
  const handleUpdateSuccess = () => {
    // Refresh the data
    fetchRace()

    // Close the modal
    handleCloseEditModal()
  }
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
        refreshData={fetchRace}
        onUpdate={handleUpdate}
        showDeleteButton={false}
      />
     {/* Edit Modal */}
     <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className={MODAL_STYLE_CLASSES}>
          <DialogHeader>
            <DialogTitle>Editar Reproducción</DialogTitle>
          </DialogHeader>
          <div className="">
            {selectedRace && (
              <UpdateRace
                raceData={selectedRace}
                onClose={handleCloseEditModal}
                onUpdate={handleUpdateSuccess}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </NavPrivada>
  );
}


export default Racepage;
