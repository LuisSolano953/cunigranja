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
        .header-icon {{
            width: 80px;
            height: 80px;
            background-color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }}
        .header-icon img {{
            width: 40px;
            height: 40px;
        }}
        .logo {{
            max-width: 150px;
            margin-bottom: 15px;
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
            transition: transform 0.3s ease;
        }}
        .button:hover {{
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(59, 130, 246, 0.4);
        }}
        .expiry {{
            font-size: 14px;
            color: #64748b;
            margin-top: 25px;
            font-style: italic;
            text-align: center;
            padding: 10px 15px;
            background-color: #f8fafc;
            border-radius: 8px;
        }}
        .footer {{
            text-align: center;
            padding: 25px 20px;
            background-color: #f8fafc;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
        }}
        .security-note {{
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 15px 20px;
            margin: 25px 0;
            text-align: left;
            font-size: 14px;
            border-radius: 0 8px 8px 0;
        }}
        .image-container {{
            text-align: center;
            margin: 20px 0 30px;
            position: relative;
        }}
        .image {{
            max-width: 180px;
            border-radius: 12px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
            border: 5px solid white;
        }}
        .link-text {{
            word-break: break-all;
            font-size: 12px;
            color: #64748b;
            margin-top: 15px;
            padding: 10px;
            background-color: #f1f5f9;
            border-radius: 6px;
        }}
        .divider {{
            height: 1px;
            background: linear-gradient(to right, transparent, #cbd5e1, transparent);
            margin: 30px 0;
        }}
        .greeting {{
            font-size: 18px;
            font-weight: 600;
            color: #3b82f6;
            margin-bottom: 15px;
        }}
        .highlight {{
            color: #3b82f6;
            font-weight: 600;
        }}
        .timer-icon {{
            display: inline-block;
            margin-right: 5px;
            vertical-align: middle;
        }}
        .security-icon {{
            display: inline-block;
            margin-right: 8px;
            vertical-align: middle;
        }}
        .wave-top {{
            height: 30px;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            margin-bottom: -1px;
        }}
        .wave-bottom {{
            height: 30px;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            margin-top: -1px;
            transform: rotate(180deg);
        }}
        .badge {{
            display: inline-block;
            background-color: rgba(255, 255, 255, 0.2);
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            margin-top: 10px;
        }}
        .image-overlay {{
            position: absolute;
            top: -15px;
            right: 50%;
            transform: translateX(100px);
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            
            <h1>Restablecimiento de Contraseña</h1>
            <p class=""subtitle"">Recupera el acceso a tu cuenta</p>
            <div class=""badge"">Seguridad Garantizada</div>
        </div>

        <div class=""content"">
            <div class=""image-container"">
                <img src=""{imageUrl}"" alt=""Conejo"" class=""image"">
                              
            </div>
            
            <p class=""greeting"">Estimado(a) usuario,</p>
            
            <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta en<span class=""highlight"">CUNIGRANJA</span>.Para garantizar la seguridad de su información, hemos generado un enlace único para que pueda crear una nueva contraseña.</p>
            
            <div class=""button-container"">
                <a href = ""{resetLink
    }"" class=""button"">Restablecer Contraseña</a>
            </div>
            
            <p class=""expiry"">
                <svg class=""timer-icon"" xmlns=""http://www.w3.org/2000/svg"" width=""16"" height=""16"" viewBox=""0 0 24 24"" fill=""none"" stroke=""#64748b"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round"">
                    <circle cx = ""12"" cy=""12"" r=""10""></circle>
                    <polyline points = ""12 6 12 12 16 14""></polyline>
                </svg>
                Este enlace expirará en<span class=""highlight"">30 minutos</span> por razones de seguridad.
            </p>
            
            <div class=""divider""></div>
            
            <div class=""security-note"">
                <svg class=""security-icon"" xmlns=""http://www.w3.org/2000/svg"" width=""18"" height=""18"" viewBox=""0 0 24 24"" fill=""none"" stroke=""#3b82f6"" stroke-width=""2"" stroke-linecap=""round"" stroke-linejoin=""round"">
                    <path d = ""M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z""></path>
                </svg>
                <strong>Nota de seguridad:</strong> Si usted no solicitó este cambio de contraseña, por favor ignore este correo o contacte a nuestro equipo de soporte inmediatamente.
            </div>
        </div>
        
        <div class=""footer"">
            <p>© 2024 <span class=""highlight"">CUNIGRANJA</span>.Todos los derechos reservados.</p>
            <p>Si tiene problemas con el botón, copie y pegue este enlace en su navegador:</p>
            <p class=""link-text"">{resetLink
}</ p >
        </ div >
    </ div >
</ body >
</ html > ";

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
