using MediatR;

public class GoogleLoginCommand : IRequest<GoogleLoginResult>
{
    public required string Code { get; set; }
    public required string RedirectUri { get; set; }
}
