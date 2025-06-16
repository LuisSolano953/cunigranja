"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function AlertModal({ type, message, onClose, isOpen }) {
  const [position, setPosition] = useState("top")

  useEffect(() => {
    if (isOpen) {
      // Detectar si hay scroll y posicionar la alerta apropiadamente
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Si hay scroll significativo o el documento es más alto que la ventana, mostrar abajo
      if (scrollTop > 100 || documentHeight > windowHeight + 200) {
        setPosition("bottom")
      } else {
        setPosition("center")
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  // Clases de posicionamiento según el scroll
  const positionClasses = {
    center: "fixed inset-0 flex items-center justify-center z-50",
    bottom: "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50",
    top: "fixed top-6 left-1/2 transform -translate-x-1/2 z-50",
  }

  return (
    <div className={positionClasses[position]}>
      <motion.div
        initial={{
          scale: 0.9,
          opacity: 0,
          y: position === "bottom" ? 50 : position === "top" ? -50 : 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
        }}
        exit={{
          scale: 0.9,
          opacity: 0,
          y: position === "bottom" ? 50 : position === "top" ? -50 : 0,
        }}
        className="bg-white rounded-xl shadow-2xl border-2 p-6 max-w-md w-full mx-4"
        style={{
          borderColor: type === "error" ? "#ef4444" : "#10b981",
        }}
      >
        <div
          className={`flex items-center justify-center mb-4 ${type === "error" ? "text-red-500" : "text-green-500"}`}
        >
          <div
            className={`w-12 h-12 rounded-full ${type === "error" ? "bg-red-100" : "bg-green-100"} flex items-center justify-center`}
          >
            {type === "error" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
          {type === "error" ? "Error" : "¡Éxito!"}
        </h2>
        <p className="text-center mb-6 text-gray-600 text-sm leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-3 px-4 bg-gradient-to-r ${
            type === "error"
              ? "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              : "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          } text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1`}
        >
          Cerrar
        </button>
      </motion.div>
    </div>
  )
}
