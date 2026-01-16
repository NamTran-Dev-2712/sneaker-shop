using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetAllSizeQuery : IRequest<List<GetAllSizeResult>>;

public class GetAllSizeQueryHandler : IRequestHandler<GetAllSizeQuery, List<GetAllSizeResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAllSizeQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<GetAllSizeResult>> Handle(
        GetAllSizeQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork
            .Sizes.Query()
            .AsNoTracking()
            .OrderBy(s => s.System)
            .ThenBy(s => s.Value)
            .Select(s => new GetAllSizeResult
            {
                Id = s.Id,
                System = s.System,
                Value = s.Value,
                ProductCount = s.SneakerVariants.Count,
                CreatedAt = s.CreatedAt,
            })
            .ToListAsync(cancellationToken);
    }
}
