'use client';

import { NavPrivada } from '../../../components/Nav/NavPrivada';
import RegisterRace from '@/components/formularios/race/page';

function Racepage() {
  return (
    <>
      <NavPrivada title={"raza"}>
        <RegisterRace />
      </NavPrivada>
    </>
  );
}

export default Racepage;
