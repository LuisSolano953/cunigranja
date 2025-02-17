"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import DeleteRecord from "./Delete";

function DataTable({ Data, TitlesTable, onDelete, endpoint }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredData = Data.filter((row) =>
        Object.values(row).some((cell) =>
            cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
                                {currentItems.map((row) => (
                                    <TableRow key={row.id} className="hover:bg-gray-50">
                                        {TitlesTable.map((title) => (
                                            <TableCell key={`${row.id}-${title}`}>
                                                {row[title.toLowerCase().replace(' ', '_')]}
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onUpdate(row)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Editar
                                                </Button>
                                                <DeleteRecord 
                                                    endpoint={endpoint}
                                                    id={row.id}
                                                    onDelete={() => onDelete(row.id)}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-2">
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
                            key={page}
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
                    Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} de {filteredData.length} resultados
                </div>
            </CardFooter>
        </Card>
    );
}

export default DataTable;

