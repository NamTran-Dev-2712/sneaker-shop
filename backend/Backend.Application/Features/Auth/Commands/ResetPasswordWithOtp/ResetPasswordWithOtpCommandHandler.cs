using System.Data;
using System.Security.Cryptography;
using System.Text;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class ResetPasswordWithOtpCommandHandler
    : IRequestHandler<ResetPasswordWithOtpCommand, ResetPasswordWithOtpResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public ResetPasswordWithOtpCommandHandler(
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher
    )
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
    }

    public async Task<ResetPasswordWithOtpResult> Handle(
        ResetPasswordWithOtpCommand command,
        CancellationToken cancellationToken
    )
    {
        var normalizedEmail = command.Email.Trim().ToLowerInvariant();
        var now = DateTime.UtcNow;

        return await _unitOfWork.ExecuteInTransactionAsync(
            async () =>
            {
                var account = await _unitOfWork
                    .Repository<Account>()
                    .GetFirstOrDefaultAsync(a => a.Email.ToLower() == normalizedEmail);

                if (account == null || !account.IsActive)
                {
                    throw new BadException("OTP không hợp lệ hoặc đã hết hạn.");
                }

                var otpRecord = await _unitOfWork
                    .Repository<PasswordResetOtp>()
                    .Query()
                    .Where(x => x.AccountId == account.Id && x.ConsumedAt == null)
                    .OrderByDescending(x => x.CreatedAt)
                    .FirstOrDefaultAsync(cancellationToken);

                if (otpRecord == null || !otpRecord.IsUsable(now))
                {
                    throw new BadException("OTP không hợp lệ hoặc đã hết hạn.");
                }

                var providedHash = ComputeSha256Hash(command.Otp);
                if (!string.Equals(otpRecord.OtpHash, providedHash, StringComparison.Ordinal))
                {
                    otpRecord.MarkAttemptFailed();
                    _unitOfWork.Repository<PasswordResetOtp>().Update(otpRecord);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);

                    throw new BadException("OTP không hợp lệ hoặc đã hết hạn.");
                }

                var newPasswordHash = _passwordHasher.HashPassword(command.NewPassword);
                account.UpdatePassword(newPasswordHash);
                otpRecord.MarkConsumed();

                _unitOfWork.Repository<Account>().Update(account);
                _unitOfWork.Repository<PasswordResetOtp>().Update(otpRecord);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return new ResetPasswordWithOtpResult
                {
                    Message = "Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.",
                };
            },
            IsolationLevel.Serializable
        );
    }

    private static string ComputeSha256Hash(string input)
    {
        var hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(hashBytes);
    }
}
