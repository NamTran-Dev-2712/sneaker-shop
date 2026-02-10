using MediatR;

public class DeleteSlideCommandHandler : IRequestHandler<DeleteSlideCommand, DeleteSlideResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteSlideCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteSlideResult> Handle(
        DeleteSlideCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get slide
        var slide = await _unitOfWork.Slides.GetByIdAsync(command.Id, cancellationToken);
        if (slide == null)
        {
            throw new NotFoundException("Không tìm thấy slide.");
        }

        // 2. Hard delete (Slide is a simple entity)
        _unitOfWork.Slides.Remove(slide);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeleteSlideResult { Success = true, Message = "Xóa slide thành công." };
    }
}
