using MediatR;

public class DeleteStaffCommandHandler : IRequestHandler<DeleteStaffCommand, DeleteStaffResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteStaffCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteStaffResult> Handle(
        DeleteStaffCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get existing staff with details
        var staff = await _unitOfWork.Staffs.GetByIdWithDetailsAsync(command.Id);
        if (staff == null)
        {
            throw new NotFoundException("Không tìm thấy nhân viên.");
        }

        // 2. Deactivate account (soft delete)
        staff.Account.Deactivate();

        // 3. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 4. Return result
        return new DeleteStaffResult
        {
            Id = staff.Id,
            Message = "Vô hiệu hóa nhân viên thành công.",
        };
    }
}
