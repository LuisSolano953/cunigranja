"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

const RegisterHealth = () => {
  const [name_health, setNameHealth] = useState("");
  const [fecha_health, setFechaHealth] = useState("");

  async function handlerSubmit(e) {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/Api/Health/CreateHealth", {
        name_health,
        fecha_health,
      });

      if (response.status === 200) {
        alert(response.data.message);
        // Limpiar los campos después de un registro exitoso
        setNameHealth("");
        setFechaHealth("");
      }
    } catch (error) {
      console.error("Error al registrar la salud:", error);
      alert(error.response?.data?.message || "Error desconocido al registrar la salud.");
    }
  }

  return (
    <form
      onSubmit={handlerSubmit}
      className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10 border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Registrar Salud</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Nombre de Salud:</label>
        <input
          type="text"
          value={name_health}
          onChange={(e) => setNameHealth(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Fecha de Salud:</label>
        <input
          type="date"
          value={fecha_health}
          onChange={(e) => setFechaHealth(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
      >
        Registrar Salud
      </button>
    </form>
  );
};

export default RegisterHealth;