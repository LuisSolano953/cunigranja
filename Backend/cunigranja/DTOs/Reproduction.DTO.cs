﻿using System.ComponentModel.DataAnnotations;

namespace cunigranja.DTOs
{
    public class ReproductionDTO
    {

        public int Id_reproduction { get; set; } = 0;
        [DataType(DataType.Date)]
        public DateTime fecha_nacimiento { get; set; }
   
        public int total_conejos { get; set; }
        public int nacidos_vivos { get; set; }

        public int nacidos_muertos { get; set; }
        public int Id_rabbit { get; set; }
        public string name_rabbit{ get; set; }
    }
}
