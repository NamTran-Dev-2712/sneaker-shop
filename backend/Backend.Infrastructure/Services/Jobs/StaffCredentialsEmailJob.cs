public record StaffCredentialsEmailJob(
    string Email,
    string FullName,
    string RawPassword,
    string StoreName
) : EmailJob;
