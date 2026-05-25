using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class EmailProcessorService : BackgroundService
{
    private readonly EmailJobQueue _queue;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<EmailProcessorService> _logger;

    public EmailProcessorService(
        EmailJobQueue queue,
        IServiceScopeFactory scopeFactory,
        ILogger<EmailProcessorService> logger
    )
    {
        _queue = queue;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var job in _queue.Reader.ReadAllAsync(stoppingToken))
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var mailSender = scope.ServiceProvider.GetRequiredService<IMailSender>();
                await ProcessJobAsync(mailSender, job);
                _logger.LogInformation(
                    "Email job {JobType} sent to {Email}",
                    job.GetType().Name,
                    GetEmail(job)
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to process email job {JobType} for {Email}",
                    job.GetType().Name,
                    GetEmail(job)
                );
            }
        }
    }

    private static Task ProcessJobAsync(IMailSender mailSender, EmailJob job) =>
        job switch
        {
            VerificationEmailJob v => mailSender.SendVerificationEmailAsync(
                v.Email,
                v.FullName,
                v.VerificationLink
            ),
            PasswordResetOtpEmailJob p => mailSender.SendPasswordResetOtpEmailAsync(
                p.Email,
                p.OtpCode
            ),
            StaffCredentialsEmailJob s => mailSender.SendStaffCredentialsEmailAsync(
                s.Email,
                s.FullName,
                s.RawPassword,
                s.StoreName
            ),
            _ => Task.CompletedTask,
        };

    private static string GetEmail(EmailJob job) =>
        job switch
        {
            VerificationEmailJob v => v.Email,
            PasswordResetOtpEmailJob p => p.Email,
            StaffCredentialsEmailJob s => s.Email,
            _ => "unknown",
        };
}
