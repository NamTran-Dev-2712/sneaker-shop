using MediatR;

public sealed record IncrementAccessoryViewCountCommand(int Id)
    : IRequest<IncrementAccessoryViewCountResult>;
