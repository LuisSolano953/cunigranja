  "use client"

  import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
  import { useState } from "react"
  import { Button } from "../ui/button"

  export const MODAL_STYLE_CLASSES = "max-h-[90vh] overflow-y-auto sm:max-w-[500px]"

  function ModalDialog({ TitlePage, FormPage, refreshData }) {
    const [isOpen, setIsOpen] = useState(false)

    // Cierra el modal
    const handleCloseForm = () => {
      setIsOpen(false)
    }

    return (
      <>
        {/* Botón para abrir el modal */}
        <Button onClick={() => setIsOpen(true)}>Registrar {TitlePage}</Button>

        {/* Modal */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className={MODAL_STYLE_CLASSES}>
            {/* Título centrado */}
            <DialogHeader className="text-center">
              <DialogTitle className="text-lg sm:text-xl font-semibold">
                Registrar {TitlePage}
              </DialogTitle>
            </DialogHeader>

            {/* Formulario */}
            <div className="mt-4">
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