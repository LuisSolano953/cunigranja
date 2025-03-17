"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

const RegisterMortality = () => {
  const [causa_mortality, setCausaMortality] = useState("");
  const [cantidad_mortality, setCantidadMortality] = useState("");
  const [fecha_mortality, setFechaMortality] = useState("");

  async function handlerSubmit(e) {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/Api/Mortality/CreateMortality", {
        causa_mortality,
        cantidad_mortality,
        fecha_mortality,
      });

      if (response.status === 200) {
        alert("Registro de mortalidad exitoso: " + response.data.message);
        // Limpiar los campos después de un registro exitoso
        setCausaMortality("");
        setCantidadMortality("");
        setFechaMortality("");
      }
    } catch (error) {
      console.error("Error al registrar la mortalidad:", error);
      alert(error.response?.data?.message || "Error desconocido al registrar la mortalidad.");
    }
  }

  return (
    <form onSubmit={handlerSubmit} className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10 border border-gray-200">
      <h2 className="text-xl font-bold text-center mb-4">Registrar Mortalidad</h2>
      
      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Causa de Mortalidad:</label>
        <input
          type="text"
          value={causa_mortality}
          onChange={(e) => setCausaMortality(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Cantidad:</label>
        <input
          type="number"
          value={cantidad_mortality}
          onChange={(e) => setCantidadMortality(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Fecha de Mortalidad:</label>
        <input
          type="date"
          value={fecha_mortality}
          onChange={(e) => setFechaMortality(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
      >
        Registrar Mortalidad
      </button>
    </form>
  );
};

export default RegisterMortality;
