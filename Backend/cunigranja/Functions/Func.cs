using cunigranja.Models;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace cunigranja.Functions
{
    public class Func

    {	public ConfigServer configServer {  get; set; }

		public Func(IConfiguration configuration)

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
				MailMessage message = new MailMessage(remitente,destinatario);

				message.Subject = "PRUEBA ENVIO CORREO ADSO ";
				message.Body = " cuerpo del correo";

				message.IsBodyHtml = true;

				await smtpClient.SendMailAsync (message);
				responseSend.Message = "correo enviado";
				responseSend.status = true;

			}
			catch (Exception ex)
			{
				responseSend.Message = ex.Message;
				responseSend.status = false;
			}
			return responseSend;




        }
    }
}
