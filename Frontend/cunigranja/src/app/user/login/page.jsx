"use client"
import { useRouter } from "next/navigation";
import axiosIsntance from "@/lib/axiosInstance";
import styles from "./page.modulelogin.css"
import PublicNav from "@/components/Nav/publicnav";

async function Login(credentials){
    const response = await axiosIsntance.post('Api/User/Login', credentials);
    return response;
}

function LoginPage() {

    const router=useRouter();

    async function handlersumit(event) {
        event.preventDefault();
        const formlogin= new FormData(event.currentTarget);
        const email= formlogin.get('email');
        const password= formlogin.get('password');

        const credentials={
            email: email,
            password: password
        }
        try {
            const responseLogin = await Login(credentials);
            console.log(responseLogin);
            if (responseLogin.status===200){
                alert(responseLogin.data.token);
                localStorage.setItem('token', responseLogin.data.token);
                router.push("/siderbar");
            }

        } catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }

    }


    return ( 
        <>
        <PublicNav/>
            <form onSubmit={handlersumit} className="com">
                <h1 className="H1">Iniciar Sesión</h1>

                <div className="mb-3">
                    <input type="text" name="email" id="login" placeholder="Correo electrónico " />
                </div>

                <div className="mb-3">
                    <input type="password" name="password" id="password" placeholder="Contraseña" />
                </div>

                <div className="mb-3">
                    <button type="submit">Iniciar sesión</button>
                </div>

                <a className="link" href="/user/password">¿Olvidaste tu contraseña?</a>
                <br />
                <a className="crear-cuenta" href="/user/register">Crear cuenta nueva</a>
            </form>

        </>
    );
}

export default LoginPage;
