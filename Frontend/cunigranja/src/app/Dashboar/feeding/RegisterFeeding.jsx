"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

const RegisterFeeding = () => {
  const [fecha_feeding, setFechaFeeding] = useState("");
  const [hora_feeding, setHoraFeeding] = useState("");
  const [cantidad_feeding, setCantidadFeeding] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handlerSubmit(e) {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/Api/Feeding/CreateFeeding", {
        fecha_feeding,
        hora_feeding,
        cantidad_feeding,
      });

      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setFechaFeeding("");
        setHoraFeeding("");
        setCantidadFeeding("");
      }
    } catch (error) {
      console.error("Error al registrar la alimentación:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error desconocido al registrar la alimentación."
      );
    }
  }

  const closeModal = () => {
    setErrorMessage("");
    setSuccessMessage("");
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Registrar Alimentación
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Fecha:</label>
            <input
              type="date"
              value={fecha_feeding}
              onChange={(e) => setFechaFeeding(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Hora de la Alimentación:</label>
            <input
              type="time"
              value={hora_feeding}
              onChange={(e) => setHoraFeeding(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Cantidad de Alimentación:</label>
            <input
              type="text"
              value={cantidad_feeding}
              onChange={(e) => setCantidadFeeding(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Ingrese la cantidad "
              required
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Registrar Alimentación
          </button>
        </div>
      </form>
    </>
  );
};

export default RegisterFeeding;
