using MediatR;

public class CreateManualFinanceEntryCommandHandler
    : IRequestHandler<CreateManualFinanceEntryCommand, CreateManualFinanceEntryResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateManualFinanceEntryCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CreateManualFinanceEntryResult> Handle(
        CreateManualFinanceEntryCommand command,
        CancellationToken cancellationToken
    )
    {
        if (command.StoreId.HasValue)
        {
            var storeExists = await _unitOfWork.Stores.ExistsAsync(x =>
                x.Id == command.StoreId.Value
            );
            if (!storeExists)
            {
                throw new NotFoundException("Không tìm thấy cửa hàng.");
            }
        }

        var entry = new FinanceLedgerEntry
        {
            Status = command.Status,
            Amount = command.Amount,
            Category = command.Category.Trim(),
            Description = command.Description?.Trim(),
            StoreId = command.StoreId,
            OccurredAt = command.OccurredAt.HasValue
                ? DateTime.SpecifyKind(command.OccurredAt.Value, DateTimeKind.Utc)
                : DateTime.UtcNow,
            CreatedBy = command.CreatedBy,
            SourceType = FinanceEntrySourceType.MANUAL,
            SourceId = null,
        };

        await _unitOfWork.FinanceLedgerEntries.AddAsync(entry, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new CreateManualFinanceEntryResult
        {
            Id = entry.Id,
            Status = entry.Status,
            Amount = entry.Amount,
            Category = entry.Category,
            Description = entry.Description,
            StoreId = entry.StoreId,
            OccurredAt = entry.OccurredAt,
            CreatedAt = entry.CreatedAt,
        };
    }
}
