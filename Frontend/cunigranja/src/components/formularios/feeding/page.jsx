"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

const RegisterFeeding = () => {
  const [fecha_feeding, setFechaFeeding] = useState("");
  const [hora_feeding, setHoraFeeding] = useState("");
  const [cantidad_feeding, setCantidadFeeding] = useState("");

  async function handlerSubmit(e) {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/Api/Feeding/CreateFeeding", {
        fecha_feeding,
        hora_feeding,
        cantidad_feeding,
      });

      if (response.status === 200) {
        alert(response.data.message);
        // Limpiar los campos después de un registro exitoso
        setFechaFeeding("");
        setHoraFeeding("");
        setCantidadFeeding("");
      }
    } catch (error) {
      console.error("Error al registrar la alimentación:", error);
      alert(error.response?.data?.message || "Error desconocido al registrar la alimentación.");
    }
  }

  return (
    <form
      onSubmit={handlerSubmit}
      className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10 border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Registrar Alimentación</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Fecha de la Alimentación:</label>
        <input
          type="date"
          value={fecha_feeding}
          onChange={(e) => setFechaFeeding(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Hora de la Alimentación:</label>
        <input
          type="time"
          value={hora_feeding}
          onChange={(e) => setHoraFeeding(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Cantidad de Alimentación:</label>
        <input
          type="text"
          value={cantidad_feeding}
          onChange={(e) => setCantidadFeeding(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="Ingrese la cantidad de alimentación"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
      >
        Registrar Alimentación
      </button>
    </form>
  );
};

export default RegisterFeeding;