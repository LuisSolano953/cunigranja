using cunigranja.Models;
using System.Net.Mail;
using System.Net;
using System.Text;

namespace cunigranja.Functions
{
    public class GeneralFunctions
    {
        public ConfigServer configServer { get; set; }

        public GeneralFunctions(IConfiguration configuration)
        {
            configServer = configuration.GetSection("ConfigServerEmail").Get<ConfigServer>();
        }

        public async Task<ResponseSend> SendEmail(string EmailDestination)
        {
            ResponseSend responseSend = new ResponseSend();

            try
            {
                SmtpClient smtpClient = new SmtpClient
                {
                    Host = configServer.HostName,
                    Port = configServer.PorHost,
                    Credentials = new NetworkCredential(configServer.Email, configServer.Password),
                    EnableSsl = true
                };
                MailAddress remitente = new MailAddress(configServer.Email, "CUNI_GRANJA", Encoding.UTF8);
                MailAddress destinatario = new MailAddress(EmailDestination);
                MailMessage message = new MailMessage(remitente, destinatario)
                {
                    Subject = "PRUEBA ENVIO CORREO ADSO ",
                    Body = "cuerpo del correo",
                    IsBodyHtml = true
                };

                await smtpClient.SendMailAsync(message);
                responseSend.Message = "Correo enviado exitosamente";
                responseSend.status = true;
            }
            catch (Exception ex)
            {
                // Registra el error en un log para análisis
                Console.WriteLine(ex.Message);
                // Manda un mensaje más amigable al cliente
                responseSend.Message = "Ocurrió un error al enviar el correo. Inténtalo más tarde.";
                responseSend.status = false;
            }

            return responseSend;
        }

        public void AddLog(string newLog)
        {
            string carpetaLog = AppDomain.CurrentDomain.BaseDirectory + "Log//";
            if (!Directory.Exists(carpetaLog))
            {
                Directory.CreateDirectory(carpetaLog);
            }
            string RutaLog = carpetaLog + AppDomain.CurrentDomain.FriendlyName + "_" + DateTime.Now.ToString("dd-MM-yyy") + ".Log";
            var registro = DateTime.Now + "" + newLog + "\n";
            var BytsNewlog = new UTF8Encoding(true).GetBytes(registro);
            using (FileStream Log = File.Open(RutaLog, FileMode.Append))
            {
                Log.Write(BytsNewlog, 0, BytsNewlog.Length);
            }
        }

        public string[] Validate(dynamic collection)
        {
            string[] errores = new string[collection.Count];
            int indice = 0;
            foreach (var item in collection)
            {
                if (item == String.Empty)
                {
                    errores[indice] = "el campo item es vacío";
                }
                indice++;
            }
            return errores;
        }

        public bool IsValidEmail(string email)
        {
            try
            {
                var addr = new MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}