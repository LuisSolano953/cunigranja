import { Dialog,DialogTitle,DialogHeader,DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
function ModalDialog({TitlePage}) {
    const [isOpen, setIsOpen]=useState(false);
    return ( 
        <>
        <Button onClick={()=>setIsOpen(true)}>
            agregar {TitlePage}
        </Button>

          <Dialog open={isOpen} onOpenChange={()=>setIsOpen(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Agregar {TitlePage}</DialogTitle>
                    </DialogHeader>
                    <div className="">
                        <h1>formulario</h1>
                    </div>
                </DialogContent>
          </Dialog>
        </>
     );
}

export default ModalDialog;