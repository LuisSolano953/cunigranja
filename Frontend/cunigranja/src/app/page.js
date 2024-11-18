'use client'
import PublicNav from "@/components/Nav/PublicNav";
import {useState} from "react";
import { Button } from "@/components/ui/button";


export default function Home() {

  const [contador,stateContador]=useState(0);
  const [Email,setEmail]=useState("");
  return (
    <>
    <PublicNav/>
    <div>
      <h1>contador en:{contador}</h1>
    </div>
 

    <Button  onClick={()=>stateContador(contador+1)}>suma</Button>
    
    <Button onClick={()=>stateContador(contador-1)}>resta</Button>
    
    <Button onClick={()=>stateContador(contador*3)}>Multiplicacion</Button>
    
    <Button onClick={()=>stateContador(contador/2)}>Divicion</Button>

      <hr/>

      <div>
        <h3>valor Email: {Email}    </h3>
      </div>
    <form>

      <label>Email</label>
      <input type="email" onChange={(e)=>setEmail(e.target.value)} value={Email}/>

    </form>



   
    </>
  );
}
