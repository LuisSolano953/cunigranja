  "use client";

  import axiosInstance from "@/lib/axiosInstance";
  import { useState } from "react";

  const RegisterCage = () => {
    const [estado_cage, setEstadoCage] = useState("");
    const [cantidad_animales, setCantidadAnimales] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handlerSubmit(e) {
      e.preventDefault();

      try {
        const response = await axiosInstance.post("/Api/Cage/CreateCage", {
          estado_cage,
          cantidad_animales
        });

        if (response.status === 200) {
          setSuccessMessage("Jaula registrada correctamente: " + response.data.message);
          setEstadoCage("");
          setCantidadAnimales("");
        }
      } catch (error) {
        console.error("Error al registrar la jaula:", error);
        setErrorMessage(error.response?.data?.message || "Error desconocido al registrar la jaula.");
      }
    }

    const closeModal = () => {
      setSuccessMessage("");
      setErrorMessage("");
    };

    return (
      <>
        {/* Modales de error y éxito */}
        {errorMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold text-center mb-4 text-red-600">Error</h2>
              <p className="text-center mb-6">{errorMessage}</p>
              <button
                onClick={closeModal}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold text-center mb-4 text-blue-600">Éxito</h2>
              <p className="text-center mb-6">{successMessage}</p>
              <button
                onClick={closeModal}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handlerSubmit} className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10 border border-gray-200">
          

          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-2">Numero de jaula:</label>
            <input 
              type="text" 
              value={estado_cage}
              onChange={(e) => setEstadoCage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
          </div>
          <div className="mb-3" >
            <label className="block text-gray-700 font-medium mb-2">cantidad animales:</label>
            <input
              type="number"
              step="0.01"
              value={cantidad_animales}
              onChange={(e) => {
                setCantidadAnimales(e.target.value)
              }}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Registrar Jaula
          </button>
        </form>
      </>
    );
  };

  export default RegisterCage;
