public interface IEmailJobQueue
{
    void EnqueueVerificationEmail(string email, string fullName, string verificationLink);
    void EnqueuePasswordResetOtpEmail(string email, string otpCode);
    void EnqueueStaffCredentialsEmail(
        string email,
        string fullName,
        string rawPassword,
        string storeName
    );
}
