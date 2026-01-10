public class BadException : Exception
{
    public int StatusCode { get; }
    public List<string>? Errors { get; }

    public BadException(string message, int statusCode = 400, List<string>? errors = null)
        : base(message)
    {
        StatusCode = statusCode;
        Errors = errors;
    }
}
