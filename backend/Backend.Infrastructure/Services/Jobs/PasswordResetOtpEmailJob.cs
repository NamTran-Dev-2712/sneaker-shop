public record PasswordResetOtpEmailJob(string Email, string OtpCode) : EmailJob;
