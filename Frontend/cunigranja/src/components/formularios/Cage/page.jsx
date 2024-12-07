"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

const RegisterCage = () => {
  const [capacidad_cage, setCapacidadCage] = useState("");
  const [tamaño_cage, setTamañoCage] = useState("");
  const [ubicacion_cage, setUbicacionCage] = useState("");
  const [ficha_conejo, setFichaConejo] = useState("");
  const [sexo_conejo, setSexoConejo] = useState("");
  const [fecha_ingreso, setFechaIngreso] = useState("");
  const [fecha_salida, setFechaSalida] = useState("");
  const [estado_cage, setEstadoCage] = useState("");
  const [edad_conejo, setEdadConejo] = useState("");

  async function handlerSubmit(e) {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/Api/Cage/CreateCage", {
        capacidad_cage,
        tamaño_cage,
        ubicacion_cage,
        ficha_conejo,
        sexo_conejo,
        fecha_ingreso,
        fecha_salida,
        estado_cage,
        edad_conejo,
      });

      if (response.status === 200) {
        alert("Jaula registrada correctamente: " + response.data.message);
        // Limpiar los campos después de un registro exitoso
        setCapacidadCage("");
        setTamañoCage("");
        setUbicacionCage("");
        setFichaConejo("");
        setSexoConejo("");
        setFechaIngreso("");
        setFechaSalida("");
        setEstadoCage("");
        setEdadConejo("");
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
        <label className="block text-gray-700 font-medium mb-2">Capacidad:</label>
        <input
          type="text"
          value={capacidad_cage}
          onChange={(e) => setCapacidadCage(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Tamaño:</label>
        <input
          type="text"
          value={tamaño_cage}
          onChange={(e) => setTamañoCage(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Ubicación:</label>
        <input
          type="text"
          value={ubicacion_cage}
          onChange={(e) => setUbicacionCage(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Ficha del Conejo:</label>
        <input
          type="text"
          value={ficha_conejo}
          onChange={(e) => setFichaConejo(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Sexo del Conejo:</label>
        <select
          value={sexo_conejo}
          onChange={(e) => setSexoConejo(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Seleccionar</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Fecha de Ingreso:</label>
        <input
          type="date"
          value={fecha_ingreso}
          onChange={(e) => setFechaIngreso(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Fecha de Salida:</label>
        <input
          type="date"
          value={fecha_salida}
          onChange={(e) => setFechaSalida(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Estado:</label>
        <input
          type="text"
          value={estado_cage}
          onChange={(e) => setEstadoCage(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Edad del Conejo:</label>
        <input
          type="number"
          value={edad_conejo}
          onChange={(e) => setEdadConejo(e.target.value)}
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
  );
};

export default RegisterCage;
