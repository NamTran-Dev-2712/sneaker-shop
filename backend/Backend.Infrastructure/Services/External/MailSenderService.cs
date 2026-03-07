using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using RazorLight;

public class MailSenderService : IMailSender
{
    private readonly IConfiguration _configuration;
    private readonly IRazorLightEngine _razorEngine;
    private readonly string _emailAddress;
    private readonly string _displayName;
    private readonly string _password;
    private readonly string _host;
    private readonly int _port;

    public MailSenderService(IConfiguration configuration, IRazorLightEngine razorEngine)
    {
        _configuration = configuration;
        _razorEngine = razorEngine;
        _emailAddress =
            configuration["EmailSettings:EmailAddress"]
            ?? throw new InvalidOperationException("Email address is not configured.");
        _displayName =
            configuration["EmailSettings:DisplayName"]
            ?? throw new InvalidOperationException("Display name is not configured.");
        _password =
            configuration["EmailSettings:Password"]
            ?? throw new InvalidOperationException("Email password is not configured.");
        _host =
            configuration["EmailSettings:Host"]
            ?? throw new InvalidOperationException("SMTP host is not configured.");
        _port = int.Parse(configuration["EmailSettings:Port"] ?? "587");
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_displayName, _emailAddress));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = htmlBody };
            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(_host, _port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_emailAddress, _password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to send email: {ex.Message}", ex);
        }
    }

    public async Task SendVerificationEmailAsync(
        string toEmail,
        string fullName,
        string verificationLink
    )
    {
        var model = new VerifyEmailModel
        {
            FullName = fullName,
            VerificationLink = verificationLink,
        };

        var templatePath = "Email/VerifyEmailTemplate.cshtml";
        var htmlBody = await _razorEngine.CompileRenderAsync(templatePath, model);

        await SendEmailAsync(toEmail, "Verify Your Email - Sneaker Shop", htmlBody);
    }

    public async Task SendStaffCredentialsEmailAsync(
        string toEmail,
        string fullName,
        string rawPassword,
        string storeName
    )
    {
        var model = new StaffCredentialsModel
        {
            FullName = fullName,
            Email = toEmail,
            Password = rawPassword,
            StoreName = storeName,
        };

        var templatePath = "Email/StaffCredentialsTemplate.cshtml";
        var htmlBody = await _razorEngine.CompileRenderAsync(templatePath, model);

        await SendEmailAsync(toEmail, "Thông tin tài khoản nhân viên - Sneaker Shop", htmlBody);
    }
}
