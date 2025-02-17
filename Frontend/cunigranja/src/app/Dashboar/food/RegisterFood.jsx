import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";
import React from "react";

const RegisterFood = () => {
  const [name_food, setNameFood] = useState("");
  const [estado_food, setEstadoFood] = useState("Existente"); // Valor por defecto
  const [valor_food, setValorFood] = useState("");
  const [unidadCantidad, setUnidadCantidad] = useState(""); // Número de unidad
  const [unidadTipo, setUnidadTipo] = useState("kg"); // Tipo de unidad por defecto
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handlerSubmit(e) {
    e.preventDefault();

    const unidad_food = `${unidadCantidad} ${unidadTipo}`; // Concatenar número + unidad seleccionada

    try {
      const response = await axiosInstance.post("/Api/Food/CreateFood", {
        name_food,
        estado_food,
        valor_food,
        unidad_food,
      });

      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setNameFood("");
        setEstadoFood("Existente");
        setValorFood("");
        setUnidadCantidad("");
        setUnidadTipo("kg");
      }
    } catch (error) {
      console.error("Error al registrar el alimento:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error desconocido al registrar el alimento."
      );
    }
  }

  const closeModal = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <>
      {/* Modales de error y éxito */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Error</h2>
            <p className="text-center mb-6">{errorMessage}</p>
            <button
              onClick={closeModal}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Éxito</h2>
            <p className="text-center mb-6">{successMessage}</p>
            <button
              onClick={closeModal}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form
        onSubmit={handlerSubmit}
        className="p-5 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10 border border-gray-400"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Registrar Alimento
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nombre del Alimento:
            </label>
            <input
              type="text"
              value={name_food}
              onChange={(e) => setNameFood(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              placeholder="Ingrese el nombre"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Estado:</label>
            <select
              value={estado_food}
              onChange={(e) => setEstadoFood(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            >
             
              <option value="Existente">Existente</option>
              <option value="Agotado">Agotado</option>
              <option value="Casi por acabar">Casi por acabar</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Valor:</label>
            <input
              type="text"
              value={valor_food}
              onChange={(e) => setValorFood(e.target.value)}
              className="w-full border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
              placeholder="Ingrese el valor"
            />
          </div>

          {/* Campo de unidad dividido en número y selección de tipo */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">Unidad:</label>
            <div className="flex">
              <input
                type="number"
                value={unidadCantidad}
                onChange={(e) => setUnidadCantidad(e.target.value)}
                className="w-2/3 border border-gray-400 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
                required
                placeholder="Cantidad"
              />
              <select
                value={unidadTipo}
                onChange={(e) => setUnidadTipo(e.target.value)}
                className="w-1/3 border border-gray-400 rounded-r-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Registrar Alimento
          </button>
        </div>
      </form>
    </>
  );
};

export default RegisterFood;
