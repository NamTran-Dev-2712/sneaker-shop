public class BaseGetResponse<T>
    where T : class
{
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
    public bool HasPreviousPage { get; set; }
    public bool HasNextPage { get; set; }
    public List<T> Items { get; set; } = new();
}
