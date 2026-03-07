public record VerificationEmailJob(string Email, string FullName, string VerificationLink)
    : EmailJob;
