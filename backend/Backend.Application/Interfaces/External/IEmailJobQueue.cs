public interface IEmailJobQueue
{
    void EnqueueVerificationEmail(string email, string fullName, string verificationLink);
    void EnqueueStaffCredentialsEmail(
        string email,
        string fullName,
        string rawPassword,
        string storeName
    );
}
