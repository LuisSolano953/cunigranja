"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Search,
  Edit,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  UserCheck,
  UserX,
  FileSpreadsheet,
  FileText,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import DeleteRecord from "./Delete"
import GraficoConejo from "./graficos"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

function DataTable({
  Data,
  TitlesTable,
  onDelete,
  onUpdate,
  endpoint,
  refreshData,
  showDeleteButton = true,
  showEditButton = true,
  showChartButton = false,
  showStatusButton = false,
  onToggleStatus = null,
  isUserTable = false,
  isRabbitTable = false,
  isFoodTable = false,
  checkIfInUse = null,
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredData, setFilteredData] = useState([])
  const [currentItems, setCurrentItems] = useState([])
  const [selectedRabbitId, setSelectedRabbitId] = useState(null)
  const [isChartOpen, setIsChartOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [itemsInUse, setItemsInUse] = useState(new Set())
  const [loadingInUse, setLoadingInUse] = useState(false)
  const itemsPerPage = 5

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Verificar qué alimentos están en uso
  useEffect(() => {
    if (isFoodTable && checkIfInUse && Data.length > 0) {
      const checkAllItems = async () => {
        setLoadingInUse(true)
        const inUseSet = new Set()

        for (const item of Data) {
          const itemId = item.Id_food || item.id_food || item.Id || item.id
          if (itemId) {
            try {
              const isInUse = await checkIfInUse(itemId)
              if (isInUse) {
                inUseSet.add(itemId)
              }
            } catch (error) {
              console.error(`Error checking if item ${itemId} is in use:`, error)
            }
          }
        }

        setItemsInUse(inUseSet)
        setLoadingInUse(false)
      }

      checkAllItems()
    }
  }, [Data, isFoodTable, checkIfInUse])

  // Filtrado y ordenamiento
  useEffect(() => {
    const filtered = Data.filter((row) =>
      Object.values(row).some(
        (cell) =>
          cell !== null && cell !== undefined && cell.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )

    const sortedFiltered = [...filtered].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }

      const idA = a.Id || a.id
      const idB = b.Id || b.id

      if (idA && idB) {
        return idB - idA
      }

      return 0
    })

    setFilteredData(sortedFiltered)

    if (searchTerm) {
      setCurrentPage(1)
    }
  }, [Data, searchTerm])

  // Paginación
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    setCurrentItems(filteredData.slice(indexOfFirstItem, indexOfLastItem))
  }, [filteredData, currentPage])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleOpenChart = (rabbitId) => {
    setSelectedRabbitId(rabbitId)
    setIsChartOpen(true)
  }

  const handleCloseChart = () => {
    setIsChartOpen(false)
  }

  const isInactiveRow = (row) => {
    if (isUserTable) {
      return row.blockard === 1 || row.estado === "Inactivo"
    }

    if (isRabbitTable) {
      return row.estado === "Inactivo" || row.estado === "inactivo"
    }

    if (isFoodTable) {
      return row.estado_food === "Inactivo" || row.estado === "Inactivo"
    }

    return false
  }

  const getCurrentStatus = (row) => {
    if (isUserTable) {
      return row.blockard === 1 ? "Inactivo" : "Activo"
    }
    if (isRabbitTable) {
      return row.estado
    }
    if (isFoodTable) {
      return row.estado_food || row.estado
    }
    return "Activo"
  }

  const shouldShowEditButton = (row) => {
    if (!showEditButton) {
      return false
    }

    if (isFoodTable) {
      const itemId = row.Id_food || row.id_food || row.Id || row.id
      const isInUse = itemsInUse.has(itemId)
      return !isInUse
    }

    return true
  }

  // Función para exportar a Excel con estilos profesionales
  const exportToExcel = () => {
    try {
      // Usar los datos filtrados si hay búsqueda, sino todos los datos
      const dataToExport = filteredData.length > 0 ? filteredData : Data

      // Preparar los datos para Excel
      const excelData = dataToExport.map((row) => {
        const newRow = {}
        TitlesTable.forEach((title, index) => {
          const key = Object.keys(row)[index]
          const value = key ? row[key] : null
          newRow[title] = value !== null && value !== undefined ? value : ""
        })
        return newRow
      })

      // Crear el workbook
      const wb = XLSX.utils.book_new()

      // Crear la hoja con los datos
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Obtener el rango de datos
      const range = XLSX.utils.decode_range(ws["!ref"])

      // Configurar estilos para los headers
      for (let col = range.s.c; col <= range.e.c; col++) {
        const headerCell = XLSX.utils.encode_cell({ r: 0, c: col })
        if (!ws[headerCell]) continue

        // Estilo para headers
        ws[headerCell].s = {
          font: {
            bold: true,
            color: { rgb: "FFFFFF" },
            sz: 12,
          },
          fill: {
            fgColor: { rgb: "428BCA" }, // Azul similar al PDF
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        }
      }

      // Aplicar estilos a las celdas de datos
      for (let row = range.s.r + 1; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
          if (!ws[cellAddress]) continue

          // Alternar colores de filas
          const isEvenRow = row % 2 === 0
          ws[cellAddress].s = {
            font: {
              sz: 10,
            },
            fill: {
              fgColor: { rgb: isEvenRow ? "F5F5F5" : "FFFFFF" },
            },
            alignment: {
              horizontal: "left",
              vertical: "center",
            },
            border: {
              top: { style: "thin", color: { rgb: "CCCCCC" } },
              bottom: { style: "thin", color: { rgb: "CCCCCC" } },
              left: { style: "thin", color: { rgb: "CCCCCC" } },
              right: { style: "thin", color: { rgb: "CCCCCC" } },
            },
          }
        }
      }

      // Configurar ancho de columnas automático
      const colWidths = TitlesTable.map((title) => {
        // Calcular ancho basado en el contenido
        let maxWidth = title.length
        dataToExport.forEach((row) => {
          const key = Object.keys(row)[TitlesTable.indexOf(title)]
          const value = key ? String(row[key] || "") : ""
          maxWidth = Math.max(maxWidth, value.length)
        })
        return { wch: Math.min(Math.max(maxWidth + 2, 10), 50) }
      })
      ws["!cols"] = colWidths

      // Agregar título y fecha en las primeras filas
      XLSX.utils.sheet_add_aoa(
        ws,
        [
          ["REPORTE DE DATOS"],
          [`Generado el: ${new Date().toLocaleDateString("es-ES")}`],
          [], // Fila vacía
        ],
        { origin: "A1" },
      )

      // Mover los datos hacia abajo
      const newData = [TitlesTable, ...excelData.map((row) => TitlesTable.map((title) => row[title]))]
      XLSX.utils.sheet_add_aoa(ws, newData, { origin: "A4" })

      // Estilo para el título
      ws["A1"].s = {
        font: {
          bold: true,
          sz: 16,
          color: { rgb: "000000" },
        },
        alignment: {
          horizontal: "center",
        },
      }

      // Estilo para la fecha
      ws["A2"].s = {
        font: {
          sz: 10,
          color: { rgb: "666666" },
        },
      }

      // Fusionar celdas para el título
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: TitlesTable.length - 1 } }]

      // Actualizar el rango
      ws["!ref"] = XLSX.utils.encode_range({
        s: { c: 0, r: 0 },
        e: { c: TitlesTable.length - 1, r: dataToExport.length + 3 },
      })

      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(wb, ws, "Datos")

      // Descargar el archivo
      XLSX.writeFile(wb, "datos_exportados.xlsx")

      console.log("Archivo Excel exportado exitosamente")
    } catch (error) {
      console.error("Error al exportar a Excel:", error)
      alert("Error al exportar a Excel")
    }
  }

  // Función para exportar a PDF (corregida con importación correcta)
  const exportToPDF = () => {
    try {
      // Usar los datos filtrados si hay búsqueda, sino todos los datos
      const dataToExport = filteredData.length > 0 ? filteredData : Data

      // Crear nuevo documento PDF
      const doc = new jsPDF()

      // Configurar el título
      doc.setFontSize(16)
      doc.text("Reporte de Datos", 14, 15)

      // Agregar fecha
      doc.setFontSize(10)
      doc.text(`Generado el: ${new Date().toLocaleDateString("es-ES")}`, 14, 25)

      // Preparar los datos para la tabla
      const tableData = dataToExport.map((row) => {
        return TitlesTable.map((_, index) => {
          const key = Object.keys(row)[index]
          const value = key ? row[key] : null
          return value !== null && value !== undefined ? String(value) : ""
        })
      })

      // Crear la tabla usando autoTable correctamente importado
      autoTable(doc, {
        head: [TitlesTable],
        body: tableData,
        startY: 35,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 35, left: 14, right: 14 },
        didDrawPage: (data) => {
          // Agregar número de página
          doc.setFontSize(8)
          doc.text(`Página ${data.pageNumber}`, data.settings.margin.left, doc.internal.pageSize.height - 10)
        },
      })

      // Descargar el archivo
      doc.save("datos_exportados.pdf")

      console.log("Archivo PDF exportado exitosamente")
    } catch (error) {
      console.error("Error al exportar a PDF:", error)
      alert("Error al exportar a PDF")
    }
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage
  const indexOfLastItem = Math.min(indexOfFirstItem + itemsPerPage, filteredData.length)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2 px-3 sm:px-6">
        <CardTitle className="text-lg sm:text-xl">Registros</CardTitle>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {loadingInUse && <div className="text-sm text-gray-500">Verificando uso de alimentos...</div>}

          {/* Botones de exportación */}
          {Data.length > 0 && (
            <div className="flex gap-2">
              <Button
                onClick={exportToExcel}
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-800 hover:bg-green-50 border-green-300"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </Button>

              <Button
                onClick={exportToPDF}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1 text-sm sm:text-base"
            />
          </div>

          {/* Tabla responsive */}
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    {TitlesTable.map((title, index) => (
                      <TableHead
                        key={index}
                        className="font-bold text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4"
                      >
                        {title}
                      </TableHead>
                    ))}
                    <TableHead className="font-bold text-black text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((row, rowIndex) => {
                      const rowKey = row.Id || row.id || `row-${rowIndex}-${Date.now()}`
                      const isInactive = isInactiveRow(row)
                      const showEdit = shouldShowEditButton(row)

                      return (
                        <TableRow
                          key={rowKey}
                          className={`hover:bg-gray-50 transition-colors ${
                            isInactive ? "bg-red-50 border-l-4 border-l-red-500" : ""
                          }`}
                        >
                          {TitlesTable.map((title, cellIndex) => {
                            const dataKey = Object.keys(row)[cellIndex]
                            const cellValue = dataKey ? row[dataKey] : null

                            return (
                              <TableCell
                                key={`${rowKey}-cell-${cellIndex}`}
                                className={`text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 ${
                                  isInactive ? "text-red-700 font-medium" : ""
                                }`}
                              >
                                <div className="max-w-[150px] sm:max-w-none truncate" title={cellValue}>
                                  {cellValue !== null && cellValue !== undefined ? cellValue : "N/A"}
                                </div>
                              </TableCell>
                            )
                          })}
                          <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                            <div
                              className={`flex ${isMobile ? "flex-col space-y-1" : "flex-row space-x-1 sm:space-x-2"}`}
                            >
                              {/* Botón de editar */}
                              {showEdit && (
                                <Button
                                  variant="outline"
                                  size={isMobile ? "sm" : "sm"}
                                  onClick={() => onUpdate && onUpdate(row)}
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 w-full sm:w-auto border-blue-300"
                                >
                                  <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  <span className="hidden sm:inline">Editar</span>
                                  <span className="sm:hidden">Edit</span>
                                </Button>
                              )}

                              {/* Mensaje si el alimento está en uso */}
                              {isFoodTable && !showEdit && (
                                <div className="text-xs text-orange-700 px-2 py-1 bg-orange-100 rounded border border-orange-300 font-medium">
                                  <span className="hidden sm:inline">🔒 En uso - No editable</span>
                                  <span className="sm:hidden">🔒 En uso</span>
                                </div>
                              )}

                              {/* Botón de eliminar */}
                              {showDeleteButton && !isUserTable && !isRabbitTable && !isFoodTable && (
                                <div className="w-full sm:w-auto">
                                  <DeleteRecord
                                    endpoint={endpoint}
                                    id={row.Id || row.id}
                                    onDelete={() => onDelete && onDelete(row.Id || row.id)}
                                    refreshData={refreshData}
                                  />
                                </div>
                              )}

                              {/* Botón de gráfico para conejos */}
                              {showChartButton && isRabbitTable && (
                                <Button
                                  variant="outline"
                                  size={isMobile ? "sm" : "sm"}
                                  onClick={() => handleOpenChart(row.Id || row.id)}
                                  className="text-green-600 hover:text-green-800 hover:bg-green-50 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 w-full sm:w-auto border-green-300"
                                >
                                  <BarChart2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  <span className="hidden sm:inline">Gráfico</span>
                                  <span className="sm:hidden">Chart</span>
                                </Button>
                              )}

                              {/* Botón para activar/inactivar */}
                              {(isUserTable || isRabbitTable || isFoodTable) && onToggleStatus && (
                                <Button
                                  variant="outline"
                                  size={isMobile ? "sm" : "sm"}
                                  onClick={() => onToggleStatus(row)}
                                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 w-full sm:w-auto font-medium ${
                                    isInactive
                                      ? "text-green-600 hover:text-green-800 hover:bg-green-50 border-green-300"
                                      : "text-red-600 hover:text-red-800 hover:bg-red-50 border-red-300"
                                  }`}
                                >
                                  {isInactive ? (
                                    <>
                                      <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                      <span className="hidden sm:inline">Activar</span>
                                      <span className="sm:hidden">Act</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserX className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                      <span className="hidden sm:inline">Inactivar</span>
                                      <span className="sm:hidden">Inact</span>
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={TitlesTable.length + 1} className="text-center py-4 text-sm sm:text-base">
                        No hay datos disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-center space-y-2 px-3 sm:px-6">
        {totalPages > 0 && (
          <>
            <div className={`flex ${isMobile ? "flex-wrap justify-center gap-1" : "space-x-2"}`}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                {!isMobile && <span className="ml-1">Anterior</span>}
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (!isMobile) return true
                  return Math.abs(page - currentPage) <= 1
                })
                .map((page) => (
                  <Button
                    key={`page-${page}`}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    {page}
                  </Button>
                ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                {!isMobile && <span className="mr-1">Siguiente</span>}
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 text-center">
              Mostrando {indexOfFirstItem + 1} - {indexOfLastItem} de {filteredData.length} resultados
            </div>
          </>
        )}
      </CardFooter>

      {/* Chart Modal */}
      {isChartOpen && <GraficoConejo rabbitId={selectedRabbitId} isOpen={isChartOpen} onClose={handleCloseChart} />}
    </Card>
  )
}

export default DataTable
