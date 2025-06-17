"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";

function UpdateRecord({ endpoint, id, data, onUpdate, FormComponent }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = async (updatedData) => {
    try {
      const response = await axiosInstance.put(`${endpoint}?Id_food=${id}`, updatedData);
      if (response.status === 200) {
        onUpdate(response.data);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error al actualizar el registro:", error);
      alert("No se pudo actualizar el registro.");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800"
      >
        Editar
      </Button>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Registro</DialogTitle>
          </DialogHeader>
          <FormComponent initialData={data} onSubmit={handleUpdate} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UpdateRecord;