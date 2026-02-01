using MediatR;

public sealed record IncrementSneakerViewCountCommand(int Id)
    : IRequest<IncrementSneakerViewCountResult>;
