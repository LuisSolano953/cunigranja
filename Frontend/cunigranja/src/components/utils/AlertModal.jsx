"use client"

export default function AlertModal({ type, message, onClose, isOpen }) {
  if (!isOpen) return null

  const gradients = type === "error"
    ? {
        border: "linear-gradient(to right, #b91c1c, #dc2626, #ef4444, #f87171)",
        header: "linear-gradient(135deg, #fee2e2 0%, #fca5a5 50%, #f87171 100%)",
        button: "linear-gradient(to right, #b91c1c, #dc2626, #ef4444, #f87171)",
        buttonHover: "linear-gradient(to right, #991b1b, #b91c1c, #dc2626, #ef4444)",
        iconBg: "linear-gradient(to bottom right, #dc2626, #ef4444)",
      }
    : {
        border: "linear-gradient(to right, #2563eb, #3b82f6, #60a5fa, #93c5fd)",
        header: "linear-gradient(135deg, #dbeafe 0%, #93c5fd 50%, #60a5fa 100%)",
        button: "linear-gradient(to right, #1d4ed8, #2563eb, #3b82f6, #60a5fa)",
        buttonHover: "linear-gradient(to right, #1e40af, #1d4ed8, #2563eb, #3b82f6)",
        iconBg: "linear-gradient(to bottom right, #2563eb, #3b82f6)",
      }

 return (
  <div className="absolute inset-0 z-50 flex items-center justify-center p-4 ">
    {/* Fondo oscuro detrás de la alerta */}
    <div
  className="absolute bg-grey opacity-20 rounded-xl backdrop-blur-sm z-0"
  style={{
    width: "465px",
    height: "250px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  }}
></div>


    {/* Alerta con borde y contenido encima */}
    <div
      className="relative z-10 bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto border-2"
      style={{
        borderRadius: "16px",
        boxShadow:
          type === "error"
            ? "0 10px 25px -5px rgba(239, 68, 68, 0.6), 0 8px 10px 2px rgba(209, 17, 17, 0.4)"
            : "0 10px 25px -5px rgba(59, 130, 246, 0.6), 0 8px 10px 2px rgba(5, 74, 185, 0.4)",
        borderColor: type === "error" ? "#fca5a5" : "#93c5fd ",
      }}
    >
      {/* Header */}
      <div
        className="rounded-t-xl -mt-6 -mx-6 px-6 py-4 mb-4 flex items-center"
        style={{
          background: gradients.header,
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        }}
      >
        <div className="mr-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
            style={{ background: gradients.iconBg }}
          >
            {type === "error" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <h2 className={`text-xl font-bold ${type === "error" ? "text-red-800" : "text-blue-800"}`}>
          {type === "error" ? "Error" : "¡Operación Exitosa!"}
        </h2>
      </div>

      {/* Message */}
      <div className="mb-6 px-2">
        <p className={`text-center ${type === "error" ? "text-red-600" : "text-blue-600"} font-medium`}>
          {message}
        </p>
      </div>

      {/* Button */}
      <button
        onClick={onClose}
        className="w-full py-3 px-4 rounded-xl text-white font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50"
        style={{
          background: gradients.button,
          borderRadius: "12px",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = gradients.buttonHover)}
        onMouseOut={(e) => (e.currentTarget.style.background = gradients.button)}
      >
        Cerrar
      </button>
    </div>
  </div>
)}
