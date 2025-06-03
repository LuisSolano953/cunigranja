"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"

export const MODAL_STYLE_CLASSES = "max-h-[90vh] overflow-y-auto w-[95vw] max-w-[500px] sm:w-full"

function ModalDialog({ TitlePage, FormPage, refreshData }) {
  const [isOpen, setIsOpen] = useState(false)

  // Cierra el modal - usando useCallback para mantener la referencia estable
  const handleCloseForm = useCallback(() => {
    console.log("handleCloseForm llamado - cerrando modal")
    setIsOpen(false)
  }, [])

  // Escuchar el evento personalizado para cerrar el modal
  useEffect(() => {
    const handleCloseModalEvent = (event) => {
      console.log("Evento close-modal recibido", event.detail)
      setIsOpen(false)
    }

    // Registrar el evento global
    window.addEventListener("close-modal", handleCloseModalEvent)

    // Limpiar al desmontar
    return () => {
      window.removeEventListener("close-modal", handleCloseModalEvent)
    }
  }, [])

  return (
    <>
      {/* Botón para abrir el modal - Responsive */}
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2"
      >
        <span className="hidden sm:inline">Registrar {TitlePage}</span>
        <span className="sm:hidden">+ {TitlePage}</span>
      </Button>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={MODAL_STYLE_CLASSES}>
          {/* Título centrado - Responsive */}
          <DialogHeader className="text-center px-2 sm:px-4">
            <DialogTitle className="text-base sm:text-lg md:text-xl font-semibold break-words">
              Registrar {TitlePage}
            </DialogTitle>
          </DialogHeader>

          {/* Formulario - Responsive padding */}
          <div className="mt-2 sm:mt-4 px-2 sm:px-4">
            {typeof FormPage === "function" ? (
              <FormPage
                refreshData={typeof refreshData === "function" ? refreshData : () => {}}
                onCloseForm={handleCloseForm}
              />
            ) : (
              FormPage
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ModalDialog
