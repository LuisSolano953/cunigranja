'use client';

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

function DataTable({ Data, TitlesTable}) {
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar los datos basados en el término de búsqueda
    const filteredData = Data.filter((row) =>
        row.some((dato) =>
            dato.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <>
            <Input
                placeholder="¿Qué buscas?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
            />
            <Table>
                <TableHeader>
                    <TableRow>
                        {TitlesTable.map((title, index) => (
                            <TableHead key={index}>{title}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {row.map((dato, cellIndex) => (
                                <TableCell key={cellIndex}>{dato}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default DataTable;
