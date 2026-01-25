/**
 * Format number to Vietnamese currency (VND)
 * @param value - Number or string value to format
 * @returns Formatted currency string (e.g., "1.234.567 ₫")
 */
export const formatCurrency = (
  value: number | string | undefined | null,
): string => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numValue);
};

/**
 * Format number with thousand separator (no currency symbol)
 * @param value - Number or string value to format
 * @returns Formatted number string (e.g., "1.234.567")
 */
export const formatNumber = (
  value: number | string | undefined | null,
): string => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "";
  }

  return new Intl.NumberFormat("vi-VN").format(numValue);
};

/**
 * Parse formatted currency/number string back to number
 * @param formattedValue - Formatted string (e.g., "1.234.567" or "1.234.567 ₫")
 * @returns Parsed number value
 */
export const parseCurrency = (
  formattedValue: string | undefined | null,
): number | undefined => {
  if (!formattedValue) {
    return undefined;
  }

  // Remove currency symbol, spaces, and replace Vietnamese thousand separator
  const cleanValue = formattedValue
    .replace(/[₫đ\s]/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");

  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? undefined : parsed;
};
