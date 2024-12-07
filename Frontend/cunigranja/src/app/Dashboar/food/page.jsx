'use client';

import { NavPrivada } from '../../../components/Nav/NavPrivada';
import RegisterFood from '@/components/formularios/food/page';

function Foodpage() {
  return (
    <>
      <NavPrivada title={"Aimento"}>
        <RegisterFood />
      </NavPrivada>
    </>
  );
}

export default Foodpage;
