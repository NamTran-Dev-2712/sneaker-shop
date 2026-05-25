using MediatR;

public record DeleteBrandCommand : IRequest<DeleteBrandResult>
{
    public required int Id { get; init; }
}
