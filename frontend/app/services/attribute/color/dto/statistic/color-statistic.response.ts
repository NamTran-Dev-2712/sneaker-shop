/**
 * public record GetColorStatisticResult
{
    public required int TotalColors { get; init; }
    public required int ColorsInUse { get; init; }
    public required int TotalProductsUsingColors { get; init; }
}

 */

export interface ColorStatisticResponse {
  totalColors: number;
  colorsInUse: number;
  totalProductsUsingColors: number;
}
