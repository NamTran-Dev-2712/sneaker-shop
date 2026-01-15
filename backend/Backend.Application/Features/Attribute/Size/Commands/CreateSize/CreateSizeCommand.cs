using MediatR;

public record CreateSizeCommand : IRequest<CreateSizeResult>
{
    public required string System { get; init; } // US, UK, EU, etc.
    public required decimal Value { get; init; }
}
