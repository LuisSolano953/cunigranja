"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

const RegisterCage = () => {
  
  const [estado_cage, setEstadoCage] = useState("");
  
  async function handlerSubmit(e) {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/Api/Cage/CreateCage", {
        estado_cage
      });

      if (response.status === 200) {
        alert("Jaula registrada correctamente: " + response.data.message);
        setEstadoCage("");
      }
    } catch (error) {
      console.error("Error al registrar la jaula:", error);
      alert(error.response?.data?.message || "Error desconocido al registrar la jaula.");
    }
  }

  return (
    <form onSubmit={handlerSubmit} className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10 border border-gray-200">
      <h2 className="text-xl font-bold text-center mb-4">Registrar Jaula</h2>

      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Estado:</label>
        <select
          value={estado_cage}
          onChange={(e) => setEstadoCage(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccione un estado</option>
          <option value="Disponible">Disponible</option>
          <option value="Ocupada">Ocupada</option>
          <option value="Mantenimiento">Mantenimiento</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
      >
        Registrar Jaula
      </button>
    </form>
  );
};

export default RegisterCage;
