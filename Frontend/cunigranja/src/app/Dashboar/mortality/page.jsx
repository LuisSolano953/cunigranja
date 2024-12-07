'use client';

import { NavPrivada } from '../../../components/Nav/NavPrivada';
import RegisterMortality from '@/components/formularios/mortality/page';

function Mortalitypage() {
  return (
    <>
      <NavPrivada title={"Jaula"}>
        <RegisterMortality />
      </NavPrivada>
    </>
  );
}

export default Mortalitypage;
