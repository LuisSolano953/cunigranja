"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

const RegisterFood = () => {
  const [name_food, setNameFood] = useState("");
  const [cantidad_food, setCantidadFood] = useState("");

  async function handlerSubmit(e) {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/Api/Food/CreateFood", {
        name_food,
        cantidad_food,
      });

      if (response.status === 200) {
        alert(response.data.message);
        // Limpiar los campos después de un registro exitoso
        setIdFood("");
        setNameFood("");
        setCantidadFood("");
      }
    } catch (error) {
      console.error("Error al registrar el alimento:", error);
      console.log(error);
      alert(error.response?.data?.message || "Error desconocido al registrar el alimento.");
    }
  }

  return (
    <form
      onSubmit={handlerSubmit}
      className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10 border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Registrar Alimento</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Nombre del Alimento:</label>
        <input
          type="text"
          value={name_food}
          onChange={(e) => setNameFood(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
          placeholder="Ingrese el nombre del alimento"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Cantidad:</label>
        <input
          type="number"
          value={cantidad_food}
          onChange={(e) => setCantidadFood(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
          placeholder="Ingrese la cantidad del alimento"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-600 transition-colors"
      >
        Registrar Alimento
      </button>
    </form>
  );
};

export default RegisterFood;
