"use client"

import { cn } from "@/lib/utils"

export function LoadingScreen({ isLoading, text = "Cargando HP...", className }) {
  if (!isLoading) return null

  return (
    <div
      className={cn(
        "fixed inset-0 bg-white bg-opacity-95 z-50 flex flex-col items-center justify-center",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center gap-6">
        {/* 🐰 Imagen con zoom infinito */}
        <img
          src="/img/CUNIGRANJA-1.JPG"
          alt="Cargando"
          className="w-32 h-32 object-contain animate-zoom-pulse"
        />

        <p className="text-xl font-semibold text-gray-800 animate-pulse">
          {text}
        </p>
      </div>

      {/* Animación personalizada */}
      <style jsx>{`
        @keyframes zoom-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        .animate-zoom-pulse {
          animation: zoom-pulse 1.8s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}
