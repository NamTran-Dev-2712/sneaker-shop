using System.Threading.Channels;

public class EmailJobQueue : IEmailJobQueue
{
    private readonly Channel<EmailJob> _channel = Channel.CreateUnbounded<EmailJob>(
        new UnboundedChannelOptions { SingleReader = true }
    );

    public ChannelReader<EmailJob> Reader => _channel.Reader;

    public void EnqueueVerificationEmail(string email, string fullName, string verificationLink) =>
        _channel.Writer.TryWrite(new VerificationEmailJob(email, fullName, verificationLink));

    public void EnqueuePasswordResetOtpEmail(string email, string otpCode) =>
        _channel.Writer.TryWrite(new PasswordResetOtpEmailJob(email, otpCode));

    public void EnqueueStaffCredentialsEmail(
        string email,
        string fullName,
        string rawPassword,
        string storeName
    ) =>
        _channel.Writer.TryWrite(
            new StaffCredentialsEmailJob(email, fullName, rawPassword, storeName)
        );
}
