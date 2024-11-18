"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import axiosIsntance from "@/lib/axiosInstance";
import style from "./page.modulepassword.css"
import PublicNav from "@/components/Nav/PublicNav";


function ResetPassword() {
    const [Email,setEmail]=useState('');
    const [success,setSuccess]=useState('');
    const [error,setError]=useState('');
    const [isSubmitting,setSubmitting] = useState(false);
    const [msSuccess, setMsSuccess]=useState('');
    
    async function  handlersubmit(event) {

        event.preventDefault();
        setSubmitting(true);
        setError("ocurrio un error");
    
    

    try {
        const response = await axiosIsntance.post('/Api/User/ResetPassUser',{Email: email});
        setMsSuccess(response.data.error.message)
        setSuccess(true);
    } catch (error) {
        setError(error)
    }finally {
        setSubmitting(false);        
    }
}

if (success) {
    return (
        <>
        <PublicNav/>
        <p>
            {msSuccess}
        </p>
        </>
    )

}
    return (  
    <form className="form" onSubmit={handlersubmit}>
        <div className="form-row">
            <div className="form-group ">
                <h3>Recuperar contraseña</h3>
            <label for="Email">Email</label>
            <input type="email"  className="Email" id="Email" placeholder="Email"
           value={Email} onChange={(e)=>setEmail(e.target.value)}required/>
            
            </div>
           {error &&(
                
                <p>{error}</p>
           )}
        </div>  
        <button type="submit" className="btnn btn-primary" disabled={isSubmitting}>
            {isSubmitting? 'Enviando....':'Reestablecer password'}</button>
        <a className="link" href="../user/login">inicio</a>
        </form>
   );
}

export default ResetPassword;