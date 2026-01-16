using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetAllColorQuery : IRequest<List<GetAllColorResult>>;

public class GetAllColorQueryHandler : IRequestHandler<GetAllColorQuery, List<GetAllColorResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAllColorQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<GetAllColorResult>> Handle(
        GetAllColorQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork
            .Colors.Query()
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .Select(c => new GetAllColorResult
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Hex = c.Hex,
                ProductCount = c.SneakerColorways.Count,
                CreatedAt = c.CreatedAt,
            })
            .ToListAsync(cancellationToken);
    }
}
