using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace cunigranja.DTOs
{
    public class RabiDTO
    {
        public int Id_rabi { get; set; } = 0;



        public string nombre_rabi { get; set; }

        [DataType(DataType.Date)]
        public DateTime fecha_salida { get; set; }

        public int peso_inicial { get; set; }

        public string sexo_rabi { get; set; }

        public int ganancia_peso { get; set; }

        public string estado { get; set; }

        public string name_race {  get; set; }

        public string estado_cage {  get; set; }
    }
}
