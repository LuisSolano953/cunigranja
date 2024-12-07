'use client';

import { NavPrivada } from '../../../components/Nav/NavPrivada';
import RegisterFeeding from '@/components/formularios/feeding/page';

function Feedingpage() {
  return (
    <>
      <NavPrivada title={"Alimentacion"}>
        <RegisterFeeding />
      </NavPrivada>
    </>
  );
}

export default Feedingpage;
