// pesajepage.js
'use client';

import { NavPrivada } from '../../../components/Nav/NavPrivada';
import Weighing from '@/components/formularios/pesaje/page';

function pesajepage() {
  return (
    <>
      <NavPrivada title={"Pesaje"}>
        <Weighing />
      </NavPrivada>
    </>
  );
}

export default pesajepage;
