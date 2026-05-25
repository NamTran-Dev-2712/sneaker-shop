public class ConflictException : Exception
{
    public int StatusCode { get; }

    public ConflictException(string message, int statusCode = 409)
        : base(message)
    {
        StatusCode = statusCode;
    }
}
