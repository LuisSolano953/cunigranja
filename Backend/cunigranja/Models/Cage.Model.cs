using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class CageModel
    {
        [Key]
        public int Id_cage{ get; set; }
        public string capacidad_cage { get; set; }
        public string tamaño_cage { get; set; }
        public string ubicacion_cage { get; set; }
        public int ficha_conejo { get; set; }
        public string sexo_conejo { get; set; }
        public DateTime fecha_ingreso { get; set; }
        public DateTime fecha_salida { get; set; }
        public string raza_conejo { get; set; }
        public string estado_cage { get; set; }
        public int edad_conejo { get; set; }


    }
}
