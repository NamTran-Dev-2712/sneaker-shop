public class ApiResponse<T>
{
    public bool Success { get; set; }
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string>? Errors { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    protected ApiResponse() { }

    public static ApiResponse<T> Ok(T data, string message = "Success", int statusCode = 200) =>
        new ApiResponse<T>
        {
            Success = true,
            StatusCode = statusCode,
            Message = message,
            Data = data,
        };

    public static ApiResponse<T> Fail(
        int statusCode,
        string message,
        List<string>? errors = null
    ) =>
        new ApiResponse<T>
        {
            Success = false,
            StatusCode = statusCode,
            Message = message,
            Errors = errors,
        };
}
