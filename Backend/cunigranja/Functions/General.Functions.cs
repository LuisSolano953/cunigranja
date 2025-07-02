using cunigranja.Models;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.IO;
using Microsoft.AspNetCore.Rewrite;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc.RazorPages;

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

                MailAddress remitente = new MailAddress(configServer.Email, "CUNIGRANJA", Encoding.UTF8);
                MailAddress destinatario = new MailAddress(EmailDestination);

                MailMessage message = new MailMessage(remitente, destinatario)
                {
                    Subject = "Restablecimiento de Contraseña - CUNIGRANJA",
                    IsBodyHtml = true
                };

                // Crear el enlace de restablecimiento con el token
                string resetLink = $"http://10.6.96.50:3002/user/reset_password?token={resetToken}";

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
            background-color: #f0f4f8;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }}
        .header {{
            text-align: center;
            padding: 30px 0;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            position: relative;
        }}
        .content {{
            padding: 40px 30px;
            text-align: justify;
        }}
        h1 {{
            color: white;
            font-size: 28px;
            margin-top: 0;
            margin-bottom: 10px;
            text-align: center;
            font-weight: 600;
        }}
        .subtitle {{
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            margin: 0;
            text-align: center;
        }}
        p {{
            margin-bottom: 20px;
            font-size: 16px;
            color: #4a5568;
        }}
        .button-container {{
            text-align: center;
            margin: 35px 0;
        }}
        .button {{
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white !important;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
        }}
        .footer {{
            text-align: center;
            padding: 25px 20px;
            background-color: #f8fafc;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
        }}
        .highlight {{
            color: #3b82f6;
            font-weight: 600;
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>Restablecimiento de Contraseña</h1>
            <p class=""subtitle"">Recupera el acceso a tu cuenta</p>
        </div>
        <div class=""content"">
            <p>Estimado(a) usuario,</p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta en <span class=""highlight"">CUNIGRANJA</span>. Para garantizar la seguridad de su información, hemos generado un enlace único para que pueda crear una nueva contraseña.</p>
            <div class=""button-container"">
                <a href=""{resetLink}"" class=""button"">Restablecer Contraseña</a>
            </div>
            <p style=""text-align: center; font-style: italic; color: #64748b;"">Este enlace expirará en 30 minutos por razones de seguridad.</p>
        </div>
        <div class=""footer"">
            <p>© 2024 <span class=""highlight"">CUNIGRANJA</span>. Todos los derechos reservados.</p>
            <p>Si tiene problemas con el botón, copie y pegue este enlace en su navegador:</p>
            <p style=""word-break: break-all; font-size: 12px;"">{resetLink}</p>
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

        // NUEVO MÉTODO PARA NOTIFICACIÓN DE NUEVAS CUENTAS
        public async Task<ResponseSend> SendNewAccountNotification(string adminEmail, string newUserName, string newUserEmail, string userType)
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

                MailAddress remitente = new MailAddress(configServer.Email, "CUNIGRANJA - Sistema", Encoding.UTF8);
                MailAddress destinatario = new MailAddress(adminEmail);

                MailMessage message = new MailMessage(remitente, destinatario)
                {
                    Subject = "Nueva cuenta pendiente de activación - CUNIGRANJA",
                    IsBodyHtml = true
                };

                // Crear el cuerpo del correo con HTML
                string imageUrl = "https://i.imgur.com/HZ5gs1C.png";
                string currentDate = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");

                message.Body = $@"
<!DOCTYPE html>
<html lang=""es"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Nueva cuenta pendiente - CUNIGRANJA</title>
    <style>
        body {{
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f0f4f8;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }}
        .header {{
            text-align: center;
            padding: 30px 0;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            position: relative;
        }}
        .content {{
            padding: 40px 30px;
            text-align: justify;
        }}
        h1 {{
            color: white;
            font-size: 28px;
            margin-top: 0;
            margin-bottom: 10px;
            text-align: center;
            font-weight: 600;
        }}
        .subtitle {{
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            margin: 0;
            text-align: center;
        }}
        p {{
            margin-bottom: 20px;
            font-size: 16px;
            color: #4a5568;
        }}
        .info-box {{
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 15px 20px;
            margin: 25px 0;
            text-align: left;
            font-size: 14px;
            border-radius: 0 8px 8px 0;
        }}
        .footer {{
            text-align: center;
            padding: 25px 20px;
            background-color: #f8fafc;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
        }}
        .highlight {{
            color: #3b82f6;
            font-weight: 600;
        }}
        .user-info {{
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>Nueva Cuenta Registrada</h1>
            <p class=""subtitle"">Requiere activación del administrador</p>
        </div>
        <div class=""content"">
            <p>Estimado administrador,</p>
            
            <p>Se ha registrado una nueva cuenta en <span class=""highlight"">CUNIGRANJA</span> que requiere su activación para que el usuario pueda acceder al sistema.</p>
            
            <div class=""user-info"">
                <p><strong>Nombre:</strong> {newUserName}</p>
                <p><strong>Correo:</strong> {newUserEmail}</p>
                <p><strong>Tipo de usuario:</strong> {userType}</p>
                <p><strong>Fecha de registro:</strong> {currentDate}</p>
                <p style=""margin-bottom: 0;""><strong>Estado:</strong> <span style=""color: #dc2626; font-weight: bold;"">INACTIVA</span></p>
            </div>
            
            <div class=""info-box"">
                <p style=""margin: 0; font-weight: bold;"">Acción requerida:</p>
                <p style=""margin: 5px 0 0 0;"">Debe iniciar sesión en el panel de administración de CUNIGRANJA para activar esta cuenta y permitir que el usuario acceda al sistema.</p>
            </div>
            
            <p>Como administrador principal, solo usted puede activar nuevas cuentas en el sistema.</p>
        </div>
        
        <div class=""footer"">
            <p>© 2024 <span class=""highlight"">CUNIGRANJA</span>. Todos los derechos reservados.</p>
            <p>Este es un mensaje automático del sistema. No responda a este correo.</p>
        </div>
    </div>
</body>
</html>";

                await smtpClient.SendMailAsync(message);
                responseSend.Message = "Notificación enviada exitosamente al administrador principal";
                responseSend.status = true;

                // Agregar log de la notificación
                AddLog($"Notificación de nueva cuenta enviada - Usuario: {newUserName} ({newUserEmail}) - Tipo: {userType}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error enviando notificación: {ex.Message}");
                responseSend.Message = "Ocurrió un error al enviar la notificación. Inténtalo más tarde.";
                responseSend.status = false;

                // Agregar log del error
                AddLog($"Error enviando notificación de nueva cuenta - Usuario: {newUserName} - Error: {ex.Message}");
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
                var registro = DateTime.Now + " " + newLog + "\n";
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
