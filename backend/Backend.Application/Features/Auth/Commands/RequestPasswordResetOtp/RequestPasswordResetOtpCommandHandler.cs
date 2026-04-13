using System.Data;
using System.Security.Cryptography;
using System.Text;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class RequestPasswordResetOtpCommandHandler
    : IRequestHandler<RequestPasswordResetOtpCommand, RequestPasswordResetOtpResult>
{
    private const int OTP_LENGTH = 6;
    private static readonly TimeSpan OTP_TTL = TimeSpan.FromMinutes(5);
    private static readonly TimeSpan RESEND_COOLDOWN = TimeSpan.FromSeconds(60);

    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailJobQueue _emailJobQueue;

    public RequestPasswordResetOtpCommandHandler(
        IUnitOfWork unitOfWork,
        IEmailJobQueue emailJobQueue
    )
    {
        _unitOfWork = unitOfWork;
        _emailJobQueue = emailJobQueue;
    }

    public async Task<RequestPasswordResetOtpResult> Handle(
        RequestPasswordResetOtpCommand command,
        CancellationToken cancellationToken
    )
    {
        var normalizedEmail = command.Email.Trim().ToLowerInvariant();
        var now = DateTime.UtcNow;
        string? emailToSend = null;
        string? otpCodeToSend = null;

        var result = await _unitOfWork.ExecuteInTransactionAsync(
            async () =>
            {
                var account = await _unitOfWork
                    .Repository<Account>()
                    .GetFirstOrDefaultAsync(a => a.Email.ToLower() == normalizedEmail);

                // Enumeration-safe response.
                if (account == null || !account.IsActive)
                {
                    return new RequestPasswordResetOtpResult
                    {
                        Message =
                            "Nếu email tồn tại trong hệ thống, mã OTP đã được gửi. Vui lòng kiểm tra hộp thư.",
                        CooldownSeconds = (int)RESEND_COOLDOWN.TotalSeconds,
                    };
                }

                var latestOtp = await _unitOfWork
                    .Repository<PasswordResetOtp>()
                    .Query()
                    .Where(x => x.AccountId == account.Id)
                    .OrderByDescending(x => x.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);

                if (latestOtp != null && !latestOtp.CanResend(now))
                {
                    var seconds = (int)
                        Math.Ceiling((latestOtp.ResendAvailableAt - now).TotalSeconds);
                    return new RequestPasswordResetOtpResult
                    {
                        Message =
                            "Nếu email tồn tại trong hệ thống, mã OTP đã được gửi. Vui lòng kiểm tra hộp thư.",
                        CooldownSeconds = Math.Max(seconds, 1),
                    };
                }

                var activeOtps = await _unitOfWork
                    .Repository<PasswordResetOtp>()
                    .Query()
                    .Where(x => x.AccountId == account.Id && x.ConsumedAt == null)
                    .ToListAsync(cancellationToken);

                foreach (var otp in activeOtps)
                {
                    otp.MarkConsumed();
                    _unitOfWork.Repository<PasswordResetOtp>().Update(otp);
                }

                var otpCode = GenerateNumericOtp(OTP_LENGTH);
                var otpHash = ComputeSha256Hash(otpCode);

                var resetOtp = PasswordResetOtp.Create(
                    account.Id,
                    normalizedEmail,
                    otpHash,
                    now.Add(OTP_TTL),
                    now.Add(RESEND_COOLDOWN)
                );

                await _unitOfWork
                    .Repository<PasswordResetOtp>()
                    .AddAsync(resetOtp, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                emailToSend = account.Email;
                otpCodeToSend = otpCode;

                return new RequestPasswordResetOtpResult
                {
                    Message =
                        "Nếu email tồn tại trong hệ thống, mã OTP đã được gửi. Vui lòng kiểm tra hộp thư.",
                    CooldownSeconds = (int)RESEND_COOLDOWN.TotalSeconds,
                };
            },
            IsolationLevel.Serializable
        );

        if (!string.IsNullOrWhiteSpace(emailToSend) && !string.IsNullOrWhiteSpace(otpCodeToSend))
        {
            _emailJobQueue.EnqueuePasswordResetOtpEmail(emailToSend, otpCodeToSend);
        }

        return result;
    }

    private static string GenerateNumericOtp(int length)
    {
        Span<byte> bytes = stackalloc byte[length];
        RandomNumberGenerator.Fill(bytes);

        var chars = new char[length];
        for (var i = 0; i < length; i++)
        {
            chars[i] = (char)('0' + (bytes[i] % 10));
        }

        return new string(chars);
    }

    private static string ComputeSha256Hash(string input)
    {
        var hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(hashBytes);
    }
}
