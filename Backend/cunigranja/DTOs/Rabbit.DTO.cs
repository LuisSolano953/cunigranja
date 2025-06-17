using System;

namespace cunigranja.DTOs
{
    public class RabbitDTO
    {
        public int Id_rabbit { get; set; }
        public string name_rabbit { get; set; }
        public DateTime fecha_registro { get; set; }
        public int peso_inicial { get; set; }
        public string sexo_rabbit { get; set; }
        public string estado { get; set; }
        public int peso_actual { get; set; }
        public string nombre_race { get; set; }
        public string estado_cage { get; set; }
        // Añadir los IDs de jaula y raza para que estén disponibles en el frontend
        public int Id_cage { get; set; }
        public int Id_race { get; set; }
    }
}
