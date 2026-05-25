/**
 * using MediatR;

public record GetSizeQuery : IRequest<BaseGetResponse<GetSizeResult>>
{
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public string? Search { get; init; }
    public string? System { get; init; } // Filter by system: US, UK, EU, CM
    public string SortBy { get; init; } = "value";
    public string SortOrder { get; init; } = global::SortOrder.ASC;
}

 */

import type { BaseGetRequest } from "~/types/global/base.request";
import type { SortSizeBy } from "~/types/global/filter/sort-by.filter";
import type { SortOrder } from "~/types/global/filter/sort-order.filter";

export interface GetSizeRequest extends BaseGetRequest {
  system?: string;
  sortBy?: SortSizeBy;
  sortOrder?: SortOrder;
}
