import type {
  ProvinceOption,
  WardOption,
  VietnamProvinceApiResponse,
  VietnamSingleProvinceApiResponse,
} from "~/types/entities/address.type";
import axios from "axios";

const VIETNAM_API_BASE = "https://vietnamlabs.com/api";

const vietnamApi = axios.create({
  baseURL: VIETNAM_API_BASE,
  timeout: 10000,
});

export const addressService = {
  /** Fetch all Vietnamese provinces/cities */
  getProvinces: async (): Promise<ProvinceOption[]> => {
    const res =
      await vietnamApi.get<VietnamProvinceApiResponse>("/vietnamprovince");
    if (!res.data.success) {
      throw new Error("Không thể tải danh sách tỉnh/thành phố.");
    }
    return res.data.data.map((p) => ({
      id: p.id,
      name: p.province,
    }));
  },

  /** Fetch wards for a specific province by name */
  getWardsByProvince: async (provinceName: string): Promise<WardOption[]> => {
    if (!provinceName) return [];
    const res = await vietnamApi.get<VietnamSingleProvinceApiResponse>(
      "/vietnamprovince",
      { params: { province: provinceName } },
    );
    if (!res.data.success) {
      throw new Error("Không thể tải danh sách phường/xã.");
    }
    return res.data.data.wards.map((w) => ({
      name: w.name,
    }));
  },
};
