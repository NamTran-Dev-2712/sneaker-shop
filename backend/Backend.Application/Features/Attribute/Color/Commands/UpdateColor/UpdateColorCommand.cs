using MediatR;

public record UpdateColorCommand : IRequest<UpdateColorResult>
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Hex { get; init; }
}
