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

    public async Task<string> GenerateAccessorySkuAsync(string categoryCode, string brandCode)
    {
        // Format: ACC-{CategoryCode}-{BrandCode}-{Sequence}
        var category = NormalizeCode(categoryCode, 5);
        var brand = NormalizeCode(brandCode, 5);

        var baseSku = $"ACC-{category}-{brand}".ToUpper();

        // Find next available sequence number
        var existingSkus = await _dbSet
            .AsNoTracking()
            .Where(si => si.Sku.StartsWith(baseSku))
            .Select(si => si.Sku)
            .ToListAsync();

        if (existingSkus.Count == 0)
        {
            return $"{baseSku}-001";
        }

        // Extract sequence numbers and find max
        var maxSequence = existingSkus
            .Select(sku =>
            {
                var parts = sku.Split('-');
                if (parts.Length > 0 && int.TryParse(parts[^1], out var seq))
                    return seq;
                return 0;
            })
            .Max();

        return $"{baseSku}-{(maxSequence + 1):D3}";
    }

    public async Task<bool> ExistsBySkuAsync(string sku)
    {
        return await _dbSet.AsNoTracking().AnyAsync(si => si.Sku == sku);
    }

    public async Task<SellableItem?> GetByAccessoryIdAsync(
        int accessoryId,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbSet.FirstOrDefaultAsync(
            si => si.AccessoryId == accessoryId && si.Type == SellableType.ACCESSORY,
            cancellationToken
        );
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
