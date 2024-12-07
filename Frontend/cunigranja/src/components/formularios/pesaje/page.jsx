"use client";

import axiosInstance from "@/lib/axiosInstance";

async function sendData(body) {
  const response = await axiosInstance.post("Api/weighing/CreateWeighing", body);
  return response;
}

function Weighing() {
  
  async function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const id_weighing = form.get("id_weighing");
    const fecha_weighing = form.get("fecha_weighing");
    const peso_actual = form.get("peso_actual");
    const ganancia_peso = form.get("ganancia_peso");

    const body = {
      id_weighing: parseInt(id_weighing, 10), // Convierte a entero
      fecha_weighing: fecha_weighing,
      peso_actual: peso_actual,
      ganancia_peso: ganancia_peso,
    };

    try {
      const response = await sendData(body);
      console.log(response);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      const { errors, status } = error.response?.data || {};
      if (status === 400) {
        alert("Errores: " + JSON.stringify(errors));
      } else {
        alert("Ocurrió un error inesperado.");
      }
    }
  }

  return (
    <div className="max-w-[400px] mx-auto p-5 border border-[#ffffff] rounded-md bg-white">
      <h2 className="text-center text-xl mb-4">Registrar Pesaje</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Campo Id_weighing */}
        

        {/* Campo fecha_weighing */}
        <label htmlFor="fecha_weighing" className="text-sm mb-1">Fecha del Pesaje:</label>
        <input
          type="date"
          name="fecha_weighing"
          id="fecha_weighing"
          className="w-full p-2 border border-[#c2c2c2] rounded-md"
          required
        />

        {/* Campo peso_actual */}
        <label htmlFor="peso_actual" className="text-sm mb-1">Peso Actual:</label>
        <input
          type="text"
          name="peso_actual"
          id="peso_actual"
          className="w-full p-2 border border-[#c2c2c2] rounded-md"
          maxLength="250"
          required
        />

        {/* Campo ganancia_peso */}
        <label htmlFor="ganancia_peso" className="text-sm mb-1">Ganancia de Peso:</label>
        <input
          type="text"
          name="ganancia_peso"
          id="ganancia_peso"
          className="w-full p-2 border border-[#c2c2c2] rounded-md"
          maxLength="250"
          required
        />

        <button
          type="submit"
          className="w-full p-3 bg-[#0a0a0a] text-white text-sm rounded-md cursor-pointer hover:bg-[#494949]"
        >
          Guardar Pesaje
        </button>
      </form>
    </div>
  );
}

export default Weighing;
