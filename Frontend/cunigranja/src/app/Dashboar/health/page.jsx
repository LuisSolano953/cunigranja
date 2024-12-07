'use client';

import { NavPrivada } from '../../../components/Nav/NavPrivada';
import RegisterHealth from '@/components/formularios/health/page';

function Healthpage() {
  return (
    <>
      <NavPrivada title={"Sanidad"}>
        <RegisterHealth />
      </NavPrivada>
    </>
  );
}

export default Healthpage;
