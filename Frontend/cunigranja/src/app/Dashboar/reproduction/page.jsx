'use client';

import { NavPrivada } from '../../../components/Nav/NavPrivada';
import Reproduction from '@/components/formularios/reproduction/page';

function reproductionpage() {
  return (
    <>
      <NavPrivada title={"Reproduccion"}>
        <Reproduction />
      </NavPrivada>
    </>
  );
}

export default reproductionpage;
