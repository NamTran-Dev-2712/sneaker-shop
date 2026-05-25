using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetStoreDetailQueryHandler : IRequestHandler<GetStoreDetailQuery, GetStoreDetailResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetStoreDetailQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetStoreDetailResult> Handle(
        GetStoreDetailQuery query,
        CancellationToken cancellationToken
    )
    {
        var result = await _unitOfWork
            .Stores.Query()
            .AsNoTracking()
            .Where(s => s.Id == query.Id && !s.IsDeleted)
            .Select(s => new GetStoreDetailResult
            {
                Id = s.Id,
                Code = s.Code,
                Name = s.Name,
                Address = s.Address,
                Phone = s.Phone,
                IsActive = s.IsActive,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                StaffCount = s.StaffProfiles.Count,
                InventoryCount = s.Inventories.Count,
                OrderCount = s.Orders.Count,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (result == null)
        {
            throw new NotFoundException("Không tìm thấy cửa hàng.");
        }

        return result;
    }
}
