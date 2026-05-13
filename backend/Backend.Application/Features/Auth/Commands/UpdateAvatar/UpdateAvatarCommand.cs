using MediatR;
using Microsoft.AspNetCore.Http;

public record UpdateAvatarCommand : IRequest<UpdateAvatarResult>
{
    public required int AccountId { get; init; }
    public required IFormFile Avatar { get; init; }
}
