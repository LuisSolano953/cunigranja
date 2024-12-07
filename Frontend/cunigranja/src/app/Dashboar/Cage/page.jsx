'use client';
import { NavPrivada } from '@/components/Nav/NavPrivada';
import ContentPage from '@/components/utils/ContentPage';


function Cagepage() {
  const TitlePage ="Jaula";

  const CageData = [
    [ 1, 'A316', "ken99@yahoo.com" ],
    [ 2, 'A242', "Abe45@gmail.com" ],
    [ 3, 'A874', "Silas22@gmail.com" ],
    [ 4, 'A721', "carmella@hotmail.com" ],
  ];

  const titleCage = [
    'id', 'codigo', 'nombre'
  ];




  return (
    <NavPrivada >
      <ContentPage TitlePage={TitlePage} Data={CageData} TitlesTable={titleCage}/>
     
    </NavPrivada>
  );
}

export default Cagepage;

