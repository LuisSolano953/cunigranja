'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import PublicNav from "@/components/Nav/publicnav";
import Footer from "@/components/Nav/footer";
import { Card, CardContent } from "@/components/ui/card";

async function Login(credentials) {
    const response = await axiosInstance.post('Api/User/Login', credentials);
    return response;
}

function LoginPage() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error

    const closeModal = () => {
        setErrorMessage('');
    };

    async function handleSubmit(event) {
        event.preventDefault();
        const formLogin = new FormData(event.currentTarget);
        const email = formLogin.get('email');
        const password = formLogin.get('password');

        const credentials = {
            email: email,
            password: password
        }
        try {
            const responseLogin = await Login(credentials);
            console.log(responseLogin);
            if (responseLogin.status === 200) {
                localStorage.setItem('token', responseLogin.data.token);
                router.push("/Dashboar");
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response?.data?.message || "Error al iniciar sesión. Intente nuevamente.");
        }
    }

    return (
        <>
            <PublicNav />
            <div className="flex justify-center items-center min-h-screen bg-white p-4">
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 shadow-lg rounded-lg transform translate-x-2 translate-y-2"></div>
                    <Card className="relative w-full flex flex-col md:flex-row overflow-hidden shadow-xl">
                        <div className="md:w-1/2 bg-gray-100 p-8 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold mb-4 text-gray-800">Bienvenido</h2>
                            <p className="text-lg text-gray-600">
                                Nos alegra verte de nuevo. Inicia sesión para acceder a tu cuenta y disfrutar de nuestros servicios.
                            </p>
                        </div>
                        <CardContent className="md:w-1/2 p-8">
                            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6 shadow-lg p-6 rounded-lg bg-white" style={{ boxShadow: '0 0px 60px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                                <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="email"
                                        id="login"
                                        placeholder="Correo electrónico"
                                        className="w-full p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="mb-6">
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Contraseña"
                                        className="w-full p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <button
                                        type="submit"
                                        className="w-full py-2 px-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                                    >
                                        Iniciar sesión
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <a
                                        href="/user/register"
                                        className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md text-center transition duration-300 ease-in-out"
                                    >
                                        Crear cuenta nueva
                                    </a>
                                </div>

                                <div className="text-center">
                                    <a href="/user/password" className="text-sm text-gray-600 hover:text-pink-600">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modal */}
            {errorMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold text-center mb-4">Error</h2>
                        <p className="text-center mb-6">{errorMessage}</p>
                        <button
                            onClick={closeModal}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
             <Footer />
        </>
    );
}

export default LoginPage;
