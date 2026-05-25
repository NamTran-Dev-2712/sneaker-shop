import { useQuery } from "@tanstack/react-query";
import { addressService } from "~/services/address/address.service";

export const addressKeys = {
  all: ["address"] as const,
  provinces: () => [...addressKeys.all, "provinces"] as const,
  wards: (province: string) => [...addressKeys.all, "wards", province] as const,
};

/** Fetch all provinces — very stable data, cached for 24h */
export const useProvinces = () => {
  return useQuery({
    queryKey: addressKeys.provinces(),
    queryFn: () => addressService.getProvinces(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000,
  });
};

/** Fetch wards for a given province name. Disabled when province is empty. */
export const useWards = (provinceName: string) => {
  return useQuery({
    queryKey: addressKeys.wards(provinceName),
    queryFn: () => addressService.getWardsByProvince(provinceName),
    enabled: !!provinceName,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};
