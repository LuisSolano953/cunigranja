"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MODAL_STYLE_CLASSES } from "@/components/utils/ModalDialog"
import DataTable from "@/components/utils/DataTable" // Import the updated DataTable

export default function ContentPage({
  TitlePage,
  Data,
  TitlesTable,
  FormPage,
  onDelete,
  onUpdate,
  endpoint,
  refreshData,
  isLoading,
  error,
  showDeleteButton = true,
  showEditButton = true, // Nueva prop para mostrar/ocultar el botón de editar
  showChartButton = false,
  showUserStatusButton = false,
  onToggleUserStatus = null,
  isUserTable = false, // Nueva prop para identificar si es la tabla de usuarios
  CustomDataTable = null,
}) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleOpenForm = () => {
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    if (refreshData) refreshData()
  }

  // Use the custom DataTable if provided, otherwise use the default one
  const TableComponent = CustomDataTable || DataTable

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{TitlePage}</h1>
        {/* Solo mostrar el botón de agregar si no es la tabla de usuarios y hay un FormPage */}
        {!isUserTable && FormPage && (
          <Button onClick={handleOpenForm} className="bg-black hover:bg-gray-800 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8">Cargando datos...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <TableComponent
          Data={Data}
          TitlesTable={TitlesTable}
          onDelete={onDelete}
          onUpdate={onUpdate}
          endpoint={endpoint}
          refreshData={refreshData}
          showDeleteButton={showDeleteButton}
          showEditButton={showEditButton} // Pasar la prop al DataTable
          showChartButton={showChartButton}
          showUserStatusButton={showUserStatusButton}
          onToggleUserStatus={onToggleUserStatus}
          isUserTable={isUserTable} // Pasar la prop al DataTable
        />
      )}

      {/* Form Modal - Solo mostrar si hay un FormPage */}
      {FormPage && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className={MODAL_STYLE_CLASSES}>
            <DialogHeader>
              <DialogTitle>Agregar {TitlePage}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {FormPage && <FormPage refreshData={refreshData} onCloseForm={handleCloseForm} />}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
