using MediatR;

public record GetAllCategoryAccessoryQuery : IRequest<List<GetAllCategoryAccessoryResult>>
{
    // No pagination - returns all for dropdowns
}
