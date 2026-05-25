using MediatR;

public record UpdateSizeCommand : IRequest<UpdateSizeResult>
{
    public required int Id { get; init; }
    public required string System { get; init; }
    public required decimal Value { get; init; }
}
