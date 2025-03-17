"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

const RegisterRace = () => {
  const [nombre_race, setNombreRace] = useState("");

  const races = ["Chinchilla", "Ruso Californiano", "Nueva Zelanda", "Mariposa"];

  async function handlerSubmit(e) {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/Api/Race/CreateRace", {
        nombre_race,
      });

      if (response.status === 200) {
        alert(response.data.message);
        setNombreRace(""); // Limpiar selección después de registrar
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
        <label className="block text-gray-700 font-medium mb-2">Seleccione la Raza:</label>
        <select
          value={nombre_race}
          onChange={(e) => setNombreRace(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>Seleccione una raza</option>
          {races.map((race) => (
            <option key={race} value={race}>
              {race}
            </option>
          ))}
        </select>
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
