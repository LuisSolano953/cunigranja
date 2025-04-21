"use client";

import React from "react";

import Footer from "@/components/Nav/footer"
import PublicNav from "@/components/Nav/PublicNav"; 
const Documento = () => {
  return (
    <>
    <div className="flex flex-col min-h-screen bg-white">
      {/* Barra de navegación en la parte superior */}
      <PublicNav />

      {/* Contenido de la página */}
      <div className="flex flex-col items-center justify-center py-12 px-6">
        {/* Título centrado */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Manual tecnico
        </h1>

        {/* Texto centrado y justificado sin recuadro */}
        <div className="max-w-3xl w-full">
          <p className="text-justify text-gray-800">
            Este es un documento de toma de requisitos que se ha desarrollado para poder visualizar y
            entender cómo se está desarrollando el proyecto de cunigranja, proyecto que es llevado por un
            equipo de desarrollo.
          </p>
        </div>

        {/* Contenedor del PDF */}
        <div className="w-full max-w-3xl overflow-hidden mt-8">
          <iframe
            src="./assets/img/PLANTILLA DOCUMENTO ESPECIFICACION REQUISITOS VERSION MYGR.pdf"
            title="Documentación"
            className="w-full h-[800px] border-none"
          />
        </div>
      </div>
    </div>
     <Footer />
    </>
  );
};

export default Documento;
