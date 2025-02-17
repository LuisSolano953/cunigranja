'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import PublicNav from "@/components/Nav/PublicNav";
import { Card, CardContent } from "@/components/ui/card";

async function SendData(Body) {
    const response = await axiosInstance.post('Api/User/CreateUser', Body);
    return response;
}

function Registrarse() {
    const [error, setError] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const router = useRouter();

    const closeModal = () => {
        setModalMessage('');
        router.push('/user/login');
    };

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        const form = new FormData(event.currentTarget);
        const name_user = form.get('name_user');
        const email_user = form.get('email_user');
        const password_user = form.get('password_user');
        const inputConfirmar = form.get('inputConfirmar');

        const Body = {
            name_user: name_user,
            email_user: email_user,
            inputConfirmar: inputConfirmar,
            password_user: password_user,
        }

        if (password_user !== inputConfirmar) {
            setError("La contraseña y la confirmación no coinciden");
            return;
        }

        try {
            const response = await SendData(Body);
            console.log(response);
            setModalMessage(response.data.message);
        } catch (error) {
            console.log(error);
            const { errors, status } = error.response.data;

            if (status === 400) {
                setError("Error en el registro. Por favor, intente nuevamente.");
            }
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <PublicNav />
            <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-0 bg-gray-200 shadow-lg rounded-lg transform translate-x-2 translate-y-2"></div>
                    <Card className="relative w-full shadow-xl">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold text-center mb-6">Registrarse</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name_user" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="name_user"
                                        id="name_user"
                                        placeholder="Crear nombre de usuario"
                                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email_user" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email_user"
                                        id="email_user"
                                        placeholder="Correo electrónico"
                                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password_user" className="block text-sm font-medium text-gray-700 mb-1">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        name="password_user"
                                        id="password_user"
                                        placeholder="Crear contraseña"
                                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="inputConfirmar" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirmar contraseña
                                    </label>
                                    <input
                                        type="password"
                                        name="inputConfirmar"
                                        id="inputConfirmar"
                                        placeholder="Confirmar contraseña creada"
                                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                                >
                                    Crear cuenta 
                                </button>
                            </form>
                            <div className="mt-4 space-y-4">
                <button
                  onClick={() => router.push("/user/login")}
                  className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                >
                  Volver al inicio de sesión
                </button>
               
              </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {modalMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold text-center mb-4">Registro exitoso</h2>
                        <p className="text-center mb-6">{modalMessage}</p>
                        <button
                            onClick={closeModal}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                        >
                            Ir al Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Registrarse;

