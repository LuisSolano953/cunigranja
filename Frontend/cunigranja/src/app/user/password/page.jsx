"use client"
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import PublicNav from "@/components/Nav/PublicNav";
import { Card, CardContent } from "@/components/ui/card";

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [msSuccess, setMsSuccess] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const response = await axiosInstance.post('/Api/User/ResetPassUser', { Email: email });
            setMsSuccess(response.data.error.message);
            setSuccess(true);
        } catch (error) {
            setError('Ocurrió un error al restablecer la contraseña. Por favor, inténtelo de nuevo.');
        } finally {
            setSubmitting(false);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <PublicNav />
                <div className="flex-grow flex items-center justify-center px-4 py-12">
                    <Card className="w-full max-w-md shadow-[0_0_60px_rgba(0,0,0,0.1)]">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold text-center mb-6">Restablecimiento de Contraseña</h2>
                            <p className="text-center text-green-600">{msSuccess}</p>
                            <a href="../user/login" className="mt-4 block text-center text-blue-600 hover:underline">
                                Volver al inicio de sesión
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <PublicNav />
            <div className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 shadow-lg rounded-lg transform translate-x-2 translate-y-2"></div>
                    <Card className="relative w-full shadow-[0_0_60px_rgba(0,0,0,0.1)] bg-white">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold text-center mb-6">Recuperar Contraseña</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Ingrese su email"
                                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Enviando...' : 'Restablecer Contraseña'}
                                </button>
                            </form>
                            <a href="../user/login" className="mt-4 block text-center text-blue-600 hover:underline">
                                Volver al inicio de sesión
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;

