using MediatR;
using Microsoft.AspNetCore.Http;

public record UpdateProfileCommand : IRequest<UpdateProfileResult>
{
    public required int AccountId { get; init; }
    public required string Email { get; init; }
    public required string Phone { get; init; }
    public IFormFile? Avatar { get; init; }
}
