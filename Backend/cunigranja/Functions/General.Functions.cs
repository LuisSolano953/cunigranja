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

        public async Task<ResponseSend> SendEmail(string EmailDestination, string resetToken)
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
                    Subject = "Restablecimiento de Contraseña - CUNI_GRANJA",
                    IsBodyHtml = true
                };

                // Crear el cuerpo del correo con HTML y la imagen incrustada
                string imageUrl = "https://ejemplo.com/ruta/a/tu/imagen.png"; // Reemplaza con la URL de tu imagen
                string resetLink = $"https://tudominio.com/reset-password?token={resetToken}"; // Reemplaza con tu URL de restablecimiento

                message.Body = $@"
                <html>
                <body style='font-family: Arial, sans-serif;'>
                    <div style='text-align: center;'>
                        <img src='{imageUrl}' alt='Logo' style='max-width: 200px;'>
                        <h2>Restablecimiento de Contraseña</h2>
                        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
                        <a href='{resetLink}' style='background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;'>
                            Restablecer Contraseña
                        </a>
                        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
                    </div>
                </body>
                </html>";

                await smtpClient.SendMailAsync(message);
                responseSend.Message = "Correo enviado exitosamente";
                responseSend.status = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
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