using MediatR;

public record CreateColorCommand : IRequest<CreateColorResult>
{
    public required string Name { get; init; }
    public required string Hex { get; init; }
}
