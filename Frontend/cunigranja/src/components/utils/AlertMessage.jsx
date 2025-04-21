// components/AlertMessage.jsx

import React from 'react';

const AlertMessage = ({ type = 'success', message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';
  const buttonColor = type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Fondo oscuro opcional */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[-1]"></div>

      <div className={`p-6 w-[90vw] sm:w-[28rem] rounded-lg border shadow-lg ${bgColor} ${borderColor}`}>
        <h2 className={`text-lg font-semibold text-center mb-2 ${textColor}`}>
          {type === 'success' ? 'Éxito' : 'Error'}
        </h2>
        <p className={`text-center mb-4 ${textColor}`}>{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md transition duration-300 ${buttonColor}`}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default AlertMessage;
