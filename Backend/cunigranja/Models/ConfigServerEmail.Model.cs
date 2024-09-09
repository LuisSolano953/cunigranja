namespace cunigranja.Models
{
    public class ConfigServer
    {
        public string HostName { get; set; }
        public int PorHost { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ResponseSend
    {
        public bool status { get; set; }

        public string Message { get; set; }

    }

}
