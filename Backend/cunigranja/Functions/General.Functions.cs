using cunigranja.Models;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.IO;

namespace cunigranja.Functions
{
    public class GeneralFunctions
    {
        private static readonly object _lockObject = new object();
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
                    Subject = "Restablecimiento de Contraseña - CUNIGRANJA",
                    IsBodyHtml = true
                };

                // Crear el enlace de restablecimiento con el token
                string resetLink = $"http://localhost:3000/user/reset_password?token={resetToken}";


                // Crear el cuerpo del correo con HTML y la imagen incrustada
                string imageUrl = "https://i.imgur.com/HZ5gs1C.png";
                message.Body = $@"
                        <!DOCTYPE html>
                        <html lang=""es"">
                        <head>
                            <meta charset=""UTF-8"">
                            <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                            <title>Restablecimiento de Contraseña</title>
                            <style>
                                body {{
                                    font-family: 'Segoe UI', Arial, sans-serif;
                                    line-height: 1.6;
                                    color: #333333;
                                    margin: 0;
                                    padding: 0;
                                    background-color: #f9f9f9;
                                }}
                                .container {{
                                    max-width: 600px;
                                    margin: 0 auto;
                                    padding: 20px;
                                    background-color: #ffffff;
                                    border-radius: 8px;
                                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                                }}
                                .header {{
                                    text-align: center;
                                    padding: 20px 0;
                                    border-bottom: 1px solid #eeeeee;
                                }}
                                .logo {{
                                    max-width: 150px;
                                    margin-bottom: 15px;
                                }}
                                .content {{
                                    padding: 30px 20px;
                                    text-align: justify;
                                }}
                                h1 {{
                                    color: #4CAF50;
                                    font-size: 24px;
                                    margin-top: 0;
                                    margin-bottom: 20px;
                                    text-align: center;
                                }}
                                p {{
                                    margin-bottom: 20px;
                                    font-size: 16px;
                                }}
                                .button-container {{
                                    text-align: center;
                                    margin: 25px 0;
                                }}
                                .button {{
                                    display: inline-block;
                                    background-color: #4CAF50;
                                    color: white !important;
                                    padding: 12px 30px;
                                    text-decoration: none;
                                    border-radius: 5px;
                                    font-size: 16px;
                                    font-weight: bold;
                                }}
                                .expiry {{
                                    font-size: 14px;
                                    color: #666666;
                                    margin-top: 25px;
                                    font-style: italic;
                                    text-align: center;
                                }}
                                .footer {{
                                    text-align: center;
                                    padding-top: 20px;
                                    border-top: 1px solid #eeeeee;
                                    color: #777777;
                                    font-size: 14px;
                                }}
                                .security-note {{
                                    background-color: #f8f9fa;
                                    border-left: 4px solid #4CAF50;
                                    padding: 10px 15px;
                                    margin: 20px 0;
                                    text-align: left;
                                    font-size: 14px;
                                }}
                                .image-container {{
                                    text-align: center;
                                    margin: 20px 0;
                                }}
                                .image {{
                                    max-width: 200px;
                                    border-radius: 8px;
                                }}
                                .link-text {{
                                    word-break: break-all;
                                    font-size: 12px;
                                    color: #999999;
                                    margin-top: 10px;
                                }}
                            </style>
                        </head>
                        <body>
                            <div class=""container"">
                                <div class=""header"">
                                    <h1>Restablecimiento de Contraseña</h1>
                                </div>
        
                                <div class=""content"">
                                    <div class=""image-container"">
                                        <img src=""{imageUrl}"" alt=""Conejo"" class=""image"">
                                    </div>
            
                                    <p>Estimado(a) usuario,</p>
            
                                    <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta en CUNIGRANJA. Para garantizar la seguridad de su información, hemos generado un enlace único para que pueda crear una nueva contraseña.</p>
            
                                    <div class=""button-container"">
                                        <a href=""{resetLink}"" class=""button"">Restablecer Contraseña</a>
                                    </div>
            
                                    <p class=""expiry"">Este enlace expirará en 30 minutos por razones de seguridad.</p>
            
                                    <div class=""security-note"">
                                        <strong>Nota de seguridad:</strong> Si usted no solicitó este cambio de contraseña, por favor ignore este correo o contacte a nuestro equipo de soporte inmediatamente.
                                    </div>
                                </div>
        
                                <div class=""footer"">
                                    <p>© 2024 CUNIGRANJA. Todos los derechos reservados.</p>
                                    <p>Si tiene problemas con el botón, copie y pegue este enlace en su navegador:</p>
                                    <p class=""link-text"">{resetLink}</p>
                                </div>
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
            try
            {
                string carpetaLog = AppDomain.CurrentDomain.BaseDirectory + "Log//";
                if (!Directory.Exists(carpetaLog))
                {
                    Directory.CreateDirectory(carpetaLog);
                }

                string RutaLog = carpetaLog + AppDomain.CurrentDomain.FriendlyName + "_" + DateTime.Now.ToString("dd-MM-yyy") + ".Log";
                var registro = DateTime.Now + "" + newLog + "\n";
                var BytsNewlog = new UTF8Encoding(true).GetBytes(registro);

                // Usar lock para evitar que múltiples hilos accedan al archivo simultáneamente
                lock (_lockObject)
                {
                    // Usar File.AppendAllText en lugar de FileStream para simplificar
                    File.AppendAllText(RutaLog, registro);
                }
            }
            catch (Exception ex)
            {
                // Capturar cualquier excepción para evitar que falle la aplicación
                Console.WriteLine("Error al escribir en el log: " + ex.Message);
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
