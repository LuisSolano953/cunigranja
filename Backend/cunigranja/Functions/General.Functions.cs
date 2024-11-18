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
                SmtpClient smtpClient = new SmtpClient();
                smtpClient.Host = configServer.HostName;
                smtpClient.Port = configServer.PorHost;
                smtpClient.Credentials = new NetworkCredential(configServer.Email, configServer.Password);
                smtpClient.EnableSsl = true;
                MailAddress remitente = new MailAddress(configServer.Email, "CUNI_GRANJA", Encoding.UTF8);
                MailAddress destinatario = new MailAddress(EmailDestination);
                MailMessage message = new MailMessage(remitente, destinatario);

                message.Subject = "PRUEBA ENVIO CORREO ADSO ";
                message.Body = " cuerpo del correo";

                message.IsBodyHtml = true;

                await smtpClient.SendMailAsync(message);
                responseSend.Message = "correo enviado";
                responseSend.status = true;

            }
            catch (Exception ex)
            {
                AddLog(ex.ToString());
                responseSend.Message = ex.Message;
                responseSend.status = false;
            }
            return responseSend;




        
    }
    public void AddLog (string newLog)
        {
            string carpetaLog = AppDomain.CurrentDomain.BaseDirectory + "Log//";
            if (!Directory.Exists(carpetaLog)) 
            {
                Directory.CreateDirectory(carpetaLog);            
            }
            string RutaLog=carpetaLog+AppDomain.CurrentDomain.FriendlyName + "_" + DateTime.Now.ToString("dd-MM-yyy") + ".Log";
            var registro = DateTime.Now + "" + newLog + "\n";
            var BytsNewlog = new UTF8Encoding(true).GetBytes(registro);
            using (FileStream Log= File.Open(RutaLog,FileMode.Append))
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

    }
}
