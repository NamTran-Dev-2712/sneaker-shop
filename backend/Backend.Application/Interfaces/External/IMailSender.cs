public interface IMailSender
{
    /// <summary>
    /// Send email with HTML body
    /// </summary>
    /// <param name="toEmail">Recipient email address</param>
    /// <param name="subject">Email subject</param>
    /// <param name="htmlBody">HTML content</param>
    Task SendEmailAsync(string toEmail, string subject, string htmlBody);

    /// <summary>
    /// Send verification email with token
    /// </summary>
    /// <param name="toEmail">Recipient email address</param>
    /// <param name="fullName">User's full name</param>
    /// <param name="verificationLink">Verification URL with token</param>
    Task SendVerificationEmailAsync(string toEmail, string fullName, string verificationLink);
}
