using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetColorStatisticQuery : IRequest<GetColorStatisticResult>;

public class GetColorStatisticQueryHandler
    : IRequestHandler<GetColorStatisticQuery, GetColorStatisticResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetColorStatisticQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetColorStatisticResult> Handle(
        GetColorStatisticQuery request,
        CancellationToken cancellationToken
    )
    {
        var totalColors = await _unitOfWork
            .Colors.Query()
            .AsNoTracking()
            .CountAsync(cancellationToken);

        var colorsInUse = await _unitOfWork
            .Colors.Query()
            .AsNoTracking()
            .CountAsync(c => c.SneakerColorways.Any(), cancellationToken);

        var totalProductsUsingColors = await _unitOfWork
            .SneakerColorways.Query()
            .AsNoTracking()
            .CountAsync(cancellationToken);

        return new GetColorStatisticResult
        {
            TotalColors = totalColors,
            ColorsInUse = colorsInUse,
            TotalProductsUsingColors = totalProductsUsingColors,
        };
    }
}
