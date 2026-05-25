/**
 * using MediatR;

public record CreateStoreCommand : IRequest<CreateStoreResult>
{
    public required string Code { get; init; }
    public required string Name { get; init; }
    public string? Address { get; init; }
    public string? Phone { get; init; }
}

 */

export interface CreateStoreRequest {
  code: string;
  name: string;
  address?: string;
  phone?: string;
}
