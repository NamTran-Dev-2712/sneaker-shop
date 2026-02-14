/** Represents a Vietnamese province/city option for dropdown selection */
export interface ProvinceOption {
  id: string;
  name: string;
}

/** Represents a Vietnamese ward/commune option for dropdown selection */
export interface WardOption {
  name: string;
}

/** Raw province data from VietnamLabs API */
export interface VietnamProvinceRaw {
  province: string;
  id: string;
  licensePlates: string;
  wards: VietnamWardRaw[];
}

/** Raw ward data from VietnamLabs API */
export interface VietnamWardRaw {
  name: string;
  mergedFrom: string | null;
}

/** VietnamLabs API response wrapper */
export interface VietnamProvinceApiResponse {
  success: boolean;
  data: VietnamProvinceRaw[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  timestamp: string;
}

/** VietnamLabs API response for a single province */
export interface VietnamSingleProvinceApiResponse {
  success: boolean;
  data: VietnamProvinceRaw;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
  timestamp: string;
}
