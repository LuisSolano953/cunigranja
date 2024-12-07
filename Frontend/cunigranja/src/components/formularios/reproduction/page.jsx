"use client";

import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

async function SenData(Body) {
  const response = await axiosInstance.post('Api/Reproduction/CreateReproduction', Body);
  return response;
}

function Reproduction() {
  const [fecha_reproduction, setfecha_reproduction] = useState('');

  async function handlersubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fecha_reproduction = form.get('fecha_reproduction');
    const Body = {
      fecha_reproduction: fecha_reproduction,
    };

    try {
      const response = await SenData(Body);
      console.log(response);
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      const { errors, status } = error.response.data;
      if (status === 400) {
        alert("el estatus es : " + status);
      }
    }
  }

  return (
    <div className="w-72 mx-auto p-5 border border-gray-300 rounded-xl bg-gray-50 shadow-lg">
      <h2 className="text-center text-xl mb-2">Registrar Fecha de Reproducción</h2>
      <form onSubmit={handlersubmit} className="flex flex-col gap-3">
        <label htmlFor="reproduction-date" className="text-sm">Fecha de Reproducción:</label>
        <input
          type="date"
          value={fecha_reproduction}
          onChange={(e) => setfecha_reproduction(e.target.value)}
          name="fecha_reproduction"
          id="fecha_reproduction"
          className="p-2 text-sm border border-gray-300 rounded-md"
        />
        <button type="submit" className="p-3 bg-black text-white text-sm rounded-md cursor-pointer hover:bg-gray-600">
          Guardar Fecha
        </button>
      </form>
    </div>
  );
};

export default Reproduction;
