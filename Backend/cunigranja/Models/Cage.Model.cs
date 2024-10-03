namespace cunigranja.Models
{
    public class CageModel
    {
        public int Id_jaula{ get; set; }
        public string capacidad_jaula { get; set; }
        public string tamaño_jaula { get; set; }
        public string ubicacio_jaula { get; set; }
        public int ficha_conejo { get; set; }
        public string sexo_jaula { get; set; }
        public DateTime fecha_ingreso { get; set; }
        public DateTime fecha_salida { get; set; }
        public string raza_conejo { get; set; }
        public string estado_jaula { get; set; }
        public int edad_conejo { get; set; }


    }
}
