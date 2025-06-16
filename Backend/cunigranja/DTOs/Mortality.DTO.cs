using System.ComponentModel.DataAnnotations;

namespace cunigranja.DTOs
{
    public class MortalityDTO
    {
        public int Id_mortality { get; set; } = 0;

        public string causa_mortality { get; set; }

        [DataType(DataType.Date)]
    
        public DateTime fecha_mortality { get; set; }

        public string name_rabbit{  get; set; }
        public int Id_rabbit{  get; set;}
        public string name_user { get; set; }
    }
}
