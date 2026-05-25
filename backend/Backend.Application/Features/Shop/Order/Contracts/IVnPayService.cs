public interface IVnPayService
{
    bool IsEnabled { get; }

    string CreatePaymentUrl(
        string txnRef,
        decimal amount,
        string orderInfo,
        string ipAddress,
        DateTime createdAtUtc
    );

    bool ValidateSignature(IReadOnlyDictionary<string, string> queryParams);

    bool IsPaymentSuccess(string? responseCode, string? transactionStatus);
}
