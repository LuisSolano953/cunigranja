"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, Edit, ChevronLeft, ChevronRight, BarChart2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import DeleteRecord from "./Delete"
import GraficoConejo from "./graficos"

function DataTable({
  Data,
  TitlesTable,
  onDelete,
  onUpdate,
  endpoint,
  refreshData,
  showDeleteButton = true,
  showChartButton = false,
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredData, setFilteredData] = useState([])
  const [currentItems, setCurrentItems] = useState([])
  const [selectedRabbitId, setSelectedRabbitId] = useState(null)
  const [isChartOpen, setIsChartOpen] = useState(false)
  const itemsPerPage = 5

  // Move filtering logic to useEffect to avoid state updates during render
  useEffect(() => {
    const filtered = Data.filter((row) =>
      Object.values(row).some(
        (cell) =>
          cell !== null && cell !== undefined && cell.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
    setFilteredData(filtered)

    // Reset to page 1 when search term changes
    if (searchTerm) {
      setCurrentPage(1)
    }
  }, [Data, searchTerm])

  // Calculate pagination in useEffect
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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage
  const indexOfLastItem = Math.min(indexOfFirstItem + itemsPerPage, filteredData.length)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Registros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="flex-1"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  {TitlesTable.map((title, index) => (
                    <TableHead key={index} className="font-bold text-black">
                      {title}
                    </TableHead>
                  ))}
                  <TableHead className="font-bold text-black">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((row, rowIndex) => {
                    // Generate a unique key using rowIndex and a unique identifier if available
                    const rowKey = row.Id || row.id || `row-${rowIndex}-${Date.now()}`

                    return (
                      <TableRow key={rowKey} className="hover:bg-gray-50">
                        {TitlesTable.map((title, cellIndex) => {
                          // Get the corresponding key for this column
                          const dataKey = Object.keys(row)[cellIndex]
                          const cellValue = dataKey ? row[dataKey] : null

                          return (
                            <TableCell key={`${rowKey}-cell-${cellIndex}`}>
                              {cellValue !== null && cellValue !== undefined ? cellValue : "N/A"}
                            </TableCell>
                          )
                        })}
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onUpdate && onUpdate(row)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            {showDeleteButton && (
                              <DeleteRecord
                                endpoint={endpoint}
                                id={row.Id || row.id}
                                onDelete={() => onDelete && onDelete(row.Id || row.id)}
                                refreshData={refreshData}
                              />
                            )}
                            {showChartButton && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenChart(row.Id || row.id)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <BarChart2 className="w-4 h-4 mr-1" />
                                Gráfico
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={TitlesTable.length + 1} className="text-center py-4">
                      No hay datos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        {totalPages > 0 && (
          <>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm text-gray-600">
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
