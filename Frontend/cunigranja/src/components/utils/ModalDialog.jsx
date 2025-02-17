import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";


function ModalDialog({TitlePage, FormPage}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                Agregar {TitlePage}
            </Button>
            <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Agregar {TitlePage}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="">
                        <FormPage/>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ModalDialog;
