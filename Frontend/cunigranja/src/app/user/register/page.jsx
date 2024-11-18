
'use client'
import axiosInstance from "@/lib/axiosInstance";
import style from "./page.moduleregistrer.css"
import PublicNav from "@/components/Nav/publicnav";

async function SenData(Body) {
    const  response = await axiosInstance.post('Api/User/CreateUser',Body);
    return response
}

function Registrarse() {

    
        async function handlersubmit(event) {
            event.preventDefault();
           
            const form = new FormData(event.currentTarget);
            const name_user = form.get('name_user');
            const email_user = form.get('email_user');
            const password_user= form.get('password_user');
            const inputConfirmar= form.get('inputConfirmar');

            const Body ={
                name_user: name_user,
                email_user: email_user,
                inputConfirmar: inputConfirmar,
                password_user: password_user,
            }

            if(password_user !== inputConfirmar) {
                alert("la contraseña y la confirmacion no coinciden ");
        }

        try {
            const response = await SenData(Body)
            console.log(response)
            alert(response.data.message);
            
        }
      catch (error){
        console.log(error);
        const {errors, status}= error.response.data;

        if (status === 400){
            alert("el estatus es : "+status)
        }

       
    
      }
    }
    return (
        <>
        <PublicNav/>
            <form className="form" onSubmit={handlersubmit} >
                
                <div className="form-group ">
                   
                    <label htmlFor="name_user">Nombre</label>
                    <input type="text" className="form-control" name="name_user" id="name_user" placeholder="crear nombre de usuario"/>
                   
                    
                    
                    <label htmlFor="email_user">Email</label>
                    <input type="email" className   ="form-control" name="email_user" id="email_user" placeholder="correo electronico"/>
                    
                   
                    <label htmlFor="password_user">Contraseña</label>
                    <input type="password" className="form-control" name="password_user" id="password_user" placeholder="crear contraseña"/>
                   
                
              
                    <label htmlFor="inputConfirmar">Confirmar contraseña</label>
                    <input type="text" className="form-control" name="inputConfirmar" id="inputConfirmar" placeholder="confimar contraseña creada"/>
                  
                </div>
                        
                <button type="submit" className="btnn btn-primary">Crear cuenta</button>
                </form>
            </>
           );
        
}

export default Registrarse;