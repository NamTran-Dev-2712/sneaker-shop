using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetSizeStatisticQuery : IRequest<GetSizeStatisticResult>;

public class GetSizeStatisticQueryHandler
    : IRequestHandler<GetSizeStatisticQuery, GetSizeStatisticResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetSizeStatisticQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetSizeStatisticResult> Handle(
        GetSizeStatisticQuery request,
        CancellationToken cancellationToken
    )
    {
        var totalSizes = await _unitOfWork
            .Sizes.Query()
            .AsNoTracking()
            .CountAsync(cancellationToken);

        var sizesInUse = await _unitOfWork
            .Sizes.Query()
            .AsNoTracking()
            .CountAsync(s => s.SneakerVariants.Any(), cancellationToken);

        var totalProductsUsingSizes = await _unitOfWork
            .SneakerVariants.Query()
            .AsNoTracking()
            .CountAsync(cancellationToken);

        return new GetSizeStatisticResult
        {
            TotalSizes = totalSizes,
            SizesInUse = sizesInUse,
            TotalProductsUsingSizes = totalProductsUsingSizes,
        };
    }
}
