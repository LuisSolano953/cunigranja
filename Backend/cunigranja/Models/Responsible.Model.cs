using System.ComponentModel.DataAnnotations;

namespace cunigranja.Models
{
    public class ResponsibleModel
    {
        [Key]
        public int Id_responsible { get; set; }
        public string name_responsible { get; set; }
        public string  tipo_responsible { get; set; }
  

        }
}
