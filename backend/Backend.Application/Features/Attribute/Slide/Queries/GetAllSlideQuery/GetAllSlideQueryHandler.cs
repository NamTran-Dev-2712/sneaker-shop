using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetAllSlideQueryHandler : IRequestHandler<GetAllSlideQuery, List<GetAllSlideResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAllSlideQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<GetAllSlideResult>> Handle(
        GetAllSlideQuery query,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork
            .Slides.Query()
            .AsNoTracking()
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => new GetAllSlideResult
            {
                Id = s.Id,
                Title = s.Title,
                Subtitle = s.Subtitle,
                Description = s.description,
                ImageUrl = s.ImageUrl,
                ButtonText = s.ButtonText,
                ButtonUrl = s.ButtonUrl,
            })
            .ToListAsync(cancellationToken);
    }
}
