using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetAllVendorQuery : IRequest<List<GetAllVendorResult>>;

public class GetAllVendorQueryHandler : IRequestHandler<GetAllVendorQuery, List<GetAllVendorResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAllVendorQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<GetAllVendorResult>> Handle(
        GetAllVendorQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork
            .Vendors.Query()
            .AsNoTracking()
            .Where(v => !v.IsDeleted && v.IsActive)
            .OrderBy(v => v.Name)
            .Select(v => new GetAllVendorResult
            {
                Id = v.Id,
                Name = v.Name,
                Phone = v.Phone,
                Email = v.Email,
            })
            .ToListAsync(cancellationToken);
    }
}
