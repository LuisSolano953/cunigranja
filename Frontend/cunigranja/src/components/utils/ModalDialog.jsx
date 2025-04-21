"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "../ui/button"
import { X } from "lucide-react"

// Definimos las clases de estilo para los modales como una constante
// que podemos reutilizar en toda la aplicación
export const MODAL_STYLE_CLASSES = "max-h-[90vh] overflow-y-auto sm:max-w-[500px]"

function ModalDialog({ TitlePage, FormPage, refreshData }) {
  const [isOpen, setIsOpen] = useState(false)

  // Función para cerrar el modal
  const handleCloseForm = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Registrar {TitlePage}</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={MODAL_STYLE_CLASSES}>
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Registrar {TitlePage}</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="">
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
