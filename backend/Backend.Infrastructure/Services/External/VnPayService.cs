using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

public class VnPayService : IVnPayService
{
    public bool IsEnabled { get; }

    private static readonly TimeZoneInfo VnTimeZone = ResolveVnTimeZone();

    private readonly string _tmnCode;
    private readonly string _hashSecret;
    private readonly string _baseUrl;
    private readonly string _returnUrl;
    private readonly string _version;
    private readonly string _command;
    private readonly string _currCode;
    private readonly string _locale;
    private readonly string _orderType;
    private readonly int _expireInMinutes;

    public VnPayService(IConfiguration configuration)
    {
        IsEnabled = bool.TryParse(configuration["VnPay:Enabled"], out var enabled) && enabled;

        _tmnCode = configuration["VnPay:TmnCode"] ?? string.Empty;
        _hashSecret = configuration["VnPay:HashSecret"] ?? string.Empty;
        _baseUrl = configuration["VnPay:BaseUrl"] ?? string.Empty;
        _returnUrl = configuration["VnPay:ReturnUrl"] ?? string.Empty;

        _version = configuration["VnPay:Version"] ?? "2.1.0";
        _command = configuration["VnPay:Command"] ?? "pay";
        _currCode = configuration["VnPay:CurrCode"] ?? "VND";
        _locale = configuration["VnPay:Locale"] ?? "vn";
        _orderType = configuration["VnPay:OrderType"] ?? "other";

        _expireInMinutes = int.TryParse(configuration["VnPay:ExpireInMinutes"], out var minutes)
            ? Math.Clamp(minutes, 1, 60)
            : 15;

        if (
            IsEnabled
            && (
                string.IsNullOrWhiteSpace(_tmnCode)
                || string.IsNullOrWhiteSpace(_hashSecret)
                || string.IsNullOrWhiteSpace(_baseUrl)
                || string.IsNullOrWhiteSpace(_returnUrl)
            )
        )
        {
            throw new InvalidOperationException(
                "VNPay is enabled but required configuration (TmnCode/HashSecret/BaseUrl/ReturnUrl) is missing."
            );
        }
    }

    public string CreatePaymentUrl(
        string txnRef,
        decimal amount,
        string orderInfo,
        string ipAddress,
        DateTime createdAtUtc
    )
    {
        EnsureConfigured();

        var createdAtVn = TimeZoneInfo.ConvertTimeFromUtc(
            createdAtUtc.ToUniversalTime(),
            VnTimeZone
        );
        var expireAtVn = createdAtVn.AddMinutes(_expireInMinutes);

        var amountInSmallestUnit = decimal.Round(amount * 100m, 0, MidpointRounding.AwayFromZero);

        var vnPayData = new SortedDictionary<string, string>(StringComparer.Ordinal)
        {
            ["vnp_Version"] = _version,
            ["vnp_Command"] = _command,
            ["vnp_TmnCode"] = _tmnCode,
            ["vnp_Amount"] = amountInSmallestUnit.ToString("0", CultureInfo.InvariantCulture),
            ["vnp_CreateDate"] = createdAtVn.ToString(
                "yyyyMMddHHmmss",
                CultureInfo.InvariantCulture
            ),
            ["vnp_CurrCode"] = _currCode,
            ["vnp_IpAddr"] = ipAddress,
            ["vnp_Locale"] = _locale,
            ["vnp_OrderInfo"] = orderInfo,
            ["vnp_OrderType"] = _orderType,
            ["vnp_ReturnUrl"] = _returnUrl,
            ["vnp_TxnRef"] = txnRef,
            ["vnp_ExpireDate"] = expireAtVn.ToString(
                "yyyyMMddHHmmss",
                CultureInfo.InvariantCulture
            ),
        };

        var query = BuildQueryString(vnPayData);
        var secureHash = ComputeHmacSha512(_hashSecret, query);

        return $"{_baseUrl}?{query}&vnp_SecureHash={secureHash}";
    }

    public bool ValidateSignature(IReadOnlyDictionary<string, string> queryParams)
    {
        if (string.IsNullOrWhiteSpace(_hashSecret))
        {
            return false;
        }

        if (!queryParams.TryGetValue("vnp_SecureHash", out var secureHash))
        {
            return false;
        }

        var data = new SortedDictionary<string, string>(StringComparer.Ordinal);

        foreach (var pair in queryParams)
        {
            if (!pair.Key.StartsWith("vnp_", StringComparison.Ordinal))
            {
                continue;
            }

            if (
                pair.Key.Equals("vnp_SecureHash", StringComparison.OrdinalIgnoreCase)
                || pair.Key.Equals("vnp_SecureHashType", StringComparison.OrdinalIgnoreCase)
            )
            {
                continue;
            }

            if (string.IsNullOrWhiteSpace(pair.Value))
            {
                continue;
            }

            data[pair.Key] = pair.Value;
        }

        var rawData = BuildQueryString(data);
        var calculatedHash = ComputeHmacSha512(_hashSecret, rawData);

        return string.Equals(calculatedHash, secureHash, StringComparison.OrdinalIgnoreCase);
    }

    public bool IsPaymentSuccess(string? responseCode, string? transactionStatus)
    {
        if (!string.Equals(responseCode, "00", StringComparison.Ordinal))
        {
            return false;
        }

        return string.IsNullOrWhiteSpace(transactionStatus)
            || string.Equals(transactionStatus, "00", StringComparison.Ordinal);
    }

    private static string BuildQueryString(SortedDictionary<string, string> data)
    {
        var stringBuilder = new StringBuilder();
        foreach (var kvp in data)
        {
            if (!string.IsNullOrEmpty(kvp.Value))
            {
                stringBuilder.Append(
                    System.Net.WebUtility.UrlEncode(kvp.Key)
                        + "="
                        + System.Net.WebUtility.UrlEncode(kvp.Value)
                        + "&"
                );
            }
        }

        var queryString = stringBuilder.ToString();
        if (queryString.Length > 0)
        {
            queryString = queryString.Remove(queryString.Length - 1, 1);
        }

        return queryString;
    }

    private static string ComputeHmacSha512(string key, string input)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var inputBytes = Encoding.UTF8.GetBytes(input);

        using var hmac = new HMACSHA512(keyBytes);
        var hashBytes = hmac.ComputeHash(inputBytes);
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }

    private void EnsureConfigured()
    {
        if (
            string.IsNullOrWhiteSpace(_tmnCode)
            || string.IsNullOrWhiteSpace(_hashSecret)
            || string.IsNullOrWhiteSpace(_baseUrl)
            || string.IsNullOrWhiteSpace(_returnUrl)
        )
        {
            throw new InvalidOperationException("VNPay configuration is incomplete.");
        }
    }

    private static TimeZoneInfo ResolveVnTimeZone()
    {
        var timezoneIds = new[] { "SE Asia Standard Time", "Asia/Ho_Chi_Minh" };

        foreach (var timezoneId in timezoneIds)
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById(timezoneId);
            }
            catch (TimeZoneNotFoundException)
            {
                // Try next known ID.
            }
            catch (InvalidTimeZoneException)
            {
                // Try next known ID.
            }
        }

        return TimeZoneInfo.Local;
    }
}
