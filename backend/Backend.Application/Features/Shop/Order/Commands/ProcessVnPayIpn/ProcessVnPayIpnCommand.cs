using MediatR;

public record ProcessVnPayIpnCommand : IRequest<ProcessVnPayIpnResult>
{
    public required IReadOnlyDictionary<string, string> QueryParams { get; init; }
}
