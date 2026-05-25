public class ForbiddenException : Exception
{
    public int StatusCode { get; }

    public ForbiddenException(string message, int statusCode = 403)
        : base(message)
    {
        StatusCode = statusCode;
    }
}
