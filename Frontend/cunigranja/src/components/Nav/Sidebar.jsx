'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Utensils, Apple, Skull, Box, Stethoscope, Dna, Baby, Weight } from 'lucide-react';
import Link from 'next/link'; // Importar Link de Next.js

export function Sidebar() {
  const sidebarItems = [
    { name: 'Alimento', icon: <Utensils className="h-6 w-6" />, href: '/Dashboar/food' },
    { name: 'Alimentación', icon: <Apple className="h-6 w-6" />, href: '/Dashboar/feeding' },
    { name: 'Mortalidad', icon: <Skull className="h-6 w-6" />, href: '/Dashboar/mortality' },
    { name: 'Jaula', icon: <Box className="h-6 w-6" />, href: '/Dashboar/Cage' },
    { name: 'Sanidad', icon: <Stethoscope className="h-6 w-6" />, href: '/health' },
    { name: 'Raza', icon: <Dna className="h-6 w-6" />, href: '/Dashboar/race' },
    { name: 'Reproducción', icon: <Baby className="h-6 w-6" />, href: '/Dashboar/reproduction' },
    { name: 'Pesaje', icon: <Weight className="h-6 w-6" />, href: '/Dashboar/pesaje' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      {/* Encabezado del Sidebar */}
      <div className="flex items-center justify-center h-20 bg-gray-900 text-white">
        <span className="text-3xl font-semibold">Cunigranja</span>
      </div>

      {/* Área Scrollable */}
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <nav className="mt-6 px-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link key={item.name} href={item.href} passHref>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-4 text-lg font-medium py-3 px-4 rounded-lg text-gray-700 hover:bg-black hover:text-white transition-colors"
              >
                {/* Ícono */}
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                {/* Texto alineado a la izquierda */}
                <span className="text-left flex-1">{item.name}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
