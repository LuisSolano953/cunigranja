using System.ComponentModel.DataAnnotations;

namespace cunigranja.DTOs
{
    public class DesteteDTO
    {
        


            public int Id_destete { get; set; } = 0;

            [DataType(DataType.Date)]

            public DateTime fecha_destete { get; set; }


            public int peso_destete { get; set; }

            public string name_rabbit {  get; set; }

        
    }
}
