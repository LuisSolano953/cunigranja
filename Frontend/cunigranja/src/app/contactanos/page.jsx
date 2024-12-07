'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import PublicNav from "@/components/Nav/publicnav";
import Footer from "@/components/Nav/footer";
import { Mail, Phone, User } from 'lucide-react';

export default function Contactanos() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 300);
  }, []);

  const openWhatsApp = (phoneNumber) => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  return (
    <>
      <br />
      <div className="min-h-screen pt-20">
        <div className="w-full bg-white shadow-md fixed top-0 left-0 z-10">
          <PublicNav />
        </div>

        <div className="container mx-auto m-16">
          <div
            className={`grid sm:grid-cols-1 md:grid-cols-2 gap-12 items-stretch mb-16 transition-opacity duration-1000 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative w-full h-full flex items-center">
              <Image
                src="/assets/img/grupo.jpg"
                alt="Grupo trabajando en la granja de conejos Cunigranja"
                className="rounded-lg shadow-lg object-cover"
                width={650}
                height={450}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card className="shadow-md transition-all duration-300 ease-in-out hover:scale-105 ">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-black">Contáctanos</h2>
                  <div className="text-lg text-black">
                    <p className="font-semibold flex items-center">
                      <Mail className="mr-2 text-red-500" size={20} />
                      Correo Electrónico:
                    </p>
                    <a 
                      href="mailto:cunigranja@gmail.com" 
                      className="text-blue-600 hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open('https://mail.google.com/mail/?view=cm&fs=1&to=cunigranja@gmail.com', '_blank');
                      }}
                    >
                      cunigranja@gmail.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md transition-all duration-300 ease-in-out hover:scale-105 ">
                <CardContent className="p-6">
                  <div className="text-lg text-black">
                    <p className="font-semibold flex items-center">
                      <Phone className="mr-2 text-green-500" size={20} />
                      Teléfonos:
                    </p>
                    <p 
                      className="cursor-pointer text-blue-600 hover:underline"
                      onClick={() => openWhatsApp('573222908671')}
                    >
                      3222908671
                    </p>
                    <p 
                      className="cursor-pointer text-blue-600 hover:underline"
                      onClick={() => openWhatsApp('573135673847')}
                    >
                      3135673847
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md transition-all duration-300 ease-in-out hover:scale-105 ">
                <CardContent className="p-6">
                  <div className="text-lg text-black">
                    <p className="font-semibold flex items-center">
                      <User className="mr-2 text-blue-500" size={20} />
                      Persona Encargada:
                    </p>
                    <p>Luis Alvaro Solano Mondragon - Gerente</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 items-stretch mb-16 transition-opacity duration-1000">
            <Card className="shadow-md transition-all duration-300 ease-in-out hover:scale-105 ">
              <CardContent className="p-8 h-full flex flex-col justify-between">
                <h2 className="text-2xl font-semibold mb-6 text-black">Ubicación</h2>
                <p className="text-lg mb-6 text-black">
                  Dirección: Centro Agropecuario La granja Sena Chicoral - Espinal, El Espinal, Tolima
                </p>
                <p className="text-lg mb-6 text-black">
                  Estamos ubicados vía Chicoral en el Espinal Tolima, accesible para nuestros
                  aprendices y colaboradores.
                </p>
                <a
                  href="https://maps.app.goo.gl/XdCnsCdLJzLDZ3eg9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Ver en Google Maps
                </a>
              </CardContent>
            </Card>

            <div className="relative w-full h-full flex items-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.5461749438386!2d-74.81690792426805!3d4.1463097960106865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f28d8f4a51a6f%3A0x3f5f9d7c3aa8e0e0!2sCentro%20Agropecuario%20La%20Granja%20SENA!5e0!3m2!1sen!2sco!4v1701812037884!5m2!1sen!2sco"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

