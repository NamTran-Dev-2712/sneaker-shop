using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetSlideQueryHandler : IRequestHandler<GetSlideQuery, BaseGetResponse<GetSlideResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetSlideQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetSlideResult>> Handle(
        GetSlideQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Build base query with AsNoTracking
        var baseQuery = _unitOfWork.Slides.Query().AsNoTracking();

        // 2. Apply search filter
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(s =>
                s.Title.ToLower().Contains(searchLower)
                || s.Subtitle.ToLower().Contains(searchLower)
                || s.description.ToLower().Contains(searchLower)
            );
        }

        // 3. Get total count before pagination
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // 4. Apply sorting
        baseQuery = ApplySorting(baseQuery, query.SortBy, query.SortOrder);

        // 5. Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(s => new GetSlideResult
            {
                Id = s.Id,
                Title = s.Title,
                Subtitle = s.Subtitle,
                Description = s.description,
                ImageUrl = s.ImageUrl,
                ButtonText = s.ButtonText,
                ButtonUrl = s.ButtonUrl,
                CreatedAt = s.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        // 6. Calculate pagination info
        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        return new BaseGetResponse<GetSlideResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }

    private static IQueryable<Slide> ApplySorting(
        IQueryable<Slide> query,
        string sortBy,
        string sortOrder
    )
    {
        var isDescending = sortOrder.Equals(SortOrder.DESC, StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLower() switch
        {
            "title" => isDescending
                ? query.OrderByDescending(s => s.Title)
                : query.OrderBy(s => s.Title),
            "createdat" => isDescending
                ? query.OrderByDescending(s => s.CreatedAt)
                : query.OrderBy(s => s.CreatedAt),
            _ => query.OrderByDescending(s => s.CreatedAt),
        };
    }
}
