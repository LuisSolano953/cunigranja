"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

const RegisterRace = () => {
  const [id_race, setIdRace] = useState("");
  const [nombre_race, setNombreRace] = useState("");

  async function handlerSubmit(e) {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/Api/Race/CreateRace", {
        id_race,
        nombre_race,
      });

      if (response.status === 200) {
        alert(response.data.message);
        // Limpiar los campos después de un registro exitoso
        setIdRace("");
        setNombreRace("");
      }
    } catch (error) {
      console.error("Error al registrar la raza:", error);
      alert(error.response?.data?.message || "Error desconocido al registrar la raza.");
    }
  }

  return (
    <form
      onSubmit={handlerSubmit}
      className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10 border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Registrar Raza</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">ID de la Raza:</label>
        <input
          type="number"
          value={id_race}
          onChange={(e) => setIdRace(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="Ingrese el ID de la raza"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Nombre de la Raza:</label>
        <input
          type="text"
          value={nombre_race}
          onChange={(e) => setNombreRace(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="Ingrese el nombre de la raza"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
      >
        Registrar Raza
      </button>
    </form>
  );
};

export default RegisterRace;
