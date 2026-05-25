using MediatR;

public record ProcessVnPayReturnCommand : IRequest<ProcessVnPayReturnResult>
{
    public required IReadOnlyDictionary<string, string> QueryParams { get; init; }
}
