using MediatR;
using Microsoft.AspNetCore.Http;

public record RegisterCommand : IRequest<RegisterResult>
{
    public required string FullName { get; init; }
    public required string Email { get; init; }
    public required string Phone { get; init; }
    public required string Password { get; init; }
    public string? Birthday { get; init; }
    public IFormFile? Avatar { get; init; }
}
