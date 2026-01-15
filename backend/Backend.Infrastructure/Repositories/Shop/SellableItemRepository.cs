using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;

public class SellableItemRepository : GenericRepository<SellableItem>, ISellableItemRepository
{
    public SellableItemRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<string> GenerateSkuAsync(
        string brandCode,
        string sneakerCode,
        string colorCode,
        string sizeCode
    )
    {
        // Normalize codes: uppercase, remove special chars, limit length
        var brand = NormalizeCode(brandCode, 3);
        var sneaker = NormalizeCode(sneakerCode, 10);
        var color = NormalizeCode(colorCode, 5);
        var size = NormalizeCode(sizeCode, 5);

        var baseSku = $"{brand}-{sneaker}-{color}-{size}".ToUpper();

        // Check for duplicates and add suffix if needed
        var sku = baseSku;
        var counter = 1;
        while (await ExistsBySkuAsync(sku))
        {
            sku = $"{baseSku}-{counter}";
            counter++;
        }

        return sku;
    }

    public async Task<bool> ExistsBySkuAsync(string sku)
    {
        return await _dbSet.AnyAsync(si => si.Sku == sku);
    }

    private static string NormalizeCode(string input, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(input))
            return "UNK";

        // Remove special characters, keep only alphanumeric
        var normalized = Regex.Replace(input.Trim(), @"[^a-zA-Z0-9]", "");

        // Limit length
        if (normalized.Length > maxLength)
            normalized = normalized[..maxLength];

        return normalized.ToUpper();
    }
}
