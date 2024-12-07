"use client";

import Footer from "@/components/Nav/footer";
import React, { useState } from "react";
import PublicNav from "@/components/Nav/PublicNav";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const teamMembers = [
  {
    name: "Luis Alvaro Solano Mondragon",
    role: "Pertenezco a la comunidad LGBTI",
    email: "luissolanor2022@gmail.com",
    age: 18,
    image: "/assets/img/luis.jpg",
  },
  {
    name: "Nestor Sarmiento Barrios",
    role: "Pertenezco a la comunidad LGBTI",
    email: "nestor.sarbarrios@gmail.com",
    age: 18,
    image: "/assets/img/nestor.jpg",
  },
  {
    name: "Leidy Paola Guio Cespedes",
    role: "Orgullo Afrodescendiente",
    email: "paolacespedes@gmail.com",
    age: 20,
    image: "/assets/img/paola.jpg",
  },
  {
    name: "Jose Gabriel Diaz Rodriguez",
    role: "Pertenezco a la comunidad LGBTI",
    email: "gabrieldiazrodriguez2006@gmail.com",
    age: 18,
    image: "/assets/img/gabriel.jpg",
  },
];

function Carousel({ member }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-full max-w-md mx-auto my-4 h-80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-lg shadow-lg h-full">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${isHovered ? '-100%' : '0%'})` }}
        >
          <div className="flex-none w-full h-full">
            <Image
              src={member.image}
              alt={member.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <Card className="flex-none w-full h-full">
            <CardContent className="flex flex-col justify-center items-center h-full p-6 text-center">
              <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{member.name}</CardTitle>
              <p className="text-gray-700 font-medium mb-2">{member.role}</p>
              <p className="text-sm text-gray-600 mb-1">{member.email}</p>
              <p className="text-sm text-gray-500">Edad: {member.age}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuienesSomosPage() {
  return (
    <> 
    <div className="min-h-screen bg-white">
      <PublicNav />
      <div className="container mx-auto pt-32 pb-32 px-4">
        <div className="mb-12 md:max-w-4xl mx-auto  px-4">
          <h1 className="text-4xl font-bold text-gray-800 pt-8 text-center mb-4">Nuestro Equipo</h1>
          <p className="mt-4 ">
            Somos un equipo de desarrollo dedicado a analizar y crear software
            que satisface las necesidades de nuestros clientes. Nuestro objetivo es brindar soluciones
            eficientes y seguras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <Carousel key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default QuienesSomosPage;

