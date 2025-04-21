"use client";  // ✅ NECESARIO PARA Next.js 13+ (App Router)

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";

const RegisterMounts = ({ refreshData }) => {
  const [fecha_mounts, setFechaMounts] = useState("");
  const [tiempo_mounts, setTiempoMounts] = useState("");
  const [cantidad_mounts, setCantidadMounts] = useState("");
  const [id_rabbit, setIdRabbit] = useState("");
  const [conejos, setConejos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchConejos() {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/Api/Rabbit/GetRabbit");
        if (response.status === 200) {
          setConejos(response.data);
        }
      } catch (error) {
        console.error("Error al obtener conejos:", error);
        setErrorMessage("Error al obtener conejos");
      } finally {
        setIsLoading(false);
      }
    }

    fetchConejos();
  }, []);

  async function handlerSubmit(e) {
    e.preventDefault();

    if (!fecha_mounts || !tiempo_mounts || !cantidad_mounts || !id_rabbit) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/Api/Mounts/CreateMounts", {
        fecha_mounts: new Date(fecha_mounts).toISOString().split("T")[0],
        tiempo_mounts: `${fecha_mounts}T${tiempo_mounts}:00`,
        cantidad_mounts: parseInt(cantidad_mounts),
        id_rabbit: parseInt(id_rabbit),
      });

      if (response.status === 200) {
        setSuccessMessage(response.data.message || "Registro exitoso");
        setFechaMounts("");
        setTiempoMounts("");
        setCantidadMounts("");
        setIdRabbit("");
      }
    } catch (error) {
      console.error("Error al registrar la monta:", error);
      setErrorMessage(error.response?.data?.message || "Error desconocido al registrar la monta.");
    } finally {
      setIsLoading(false);
    }
  }

  const closeModal = () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (successMessage && refreshData && typeof refreshData === "function") {
      refreshData();
    }
  };

  return (
    <>
      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Error</h2>
            <p className="text-center mb-6">{errorMessage}</p>
            <button
              onClick={closeModal}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Éxito</h2>
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

      <form
        onSubmit={handlerSubmit}
        className="p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registro de Montas</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="fecha_mounts" className="block text-gray-700 font-medium mb-2">
              Fecha de Monta:
            </label>
            <input
              type="date"
              id="fecha_mounts"
              value={fecha_mounts}
              onChange={(e) => setFechaMounts(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>

          <div>
            <label htmlFor="tiempo_mounts" className="block text-gray-700 font-medium mb-2">
              Tiempo de Monta:
            </label>
            <input
              type="time"
              id="tiempo_mounts"
              value={tiempo_mounts}
              onChange={(e) => setTiempoMounts(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>

          <div>
            <label htmlFor="cantidad_mounts" className="block text-gray-700 font-medium mb-2">
              Cantidad:
            </label>
            <input
              type="number"
              id="cantidad_mounts"
              value={cantidad_mounts}
              onChange={(e) => setCantidadMounts(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              min="1"
              placeholder="Ingrese la cantidad"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Conejo:</label>
            {isLoading && conejos.length === 0 ? (
              <div className="text-center py-2 border border-gray-300 rounded-lg bg-gray-50">Cargando conejos...</div>
            ) : (
              <select
                value={id_rabbit}
                onChange={(e) => setIdRabbit(e.target.value)}
                className="w-full border border-gray-400 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-600"
                required
              >
                <option value="">Seleccione un conejo</option>
                {conejos.map((conejo) => (
                  <option key={conejo.Id_rabbit} value={conejo.id_rabbit}>
                    {conejo.name_rabbit}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors w-full"
          >
            {isLoading ? "Registrando..." : "Registrar Monta"}
          </button>
        </div>
      </form>
    </>
  );
};

export default RegisterMounts;
