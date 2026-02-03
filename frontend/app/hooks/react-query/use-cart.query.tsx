import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "~/services/shop/cart/cart.service";
import type { AddToCartRequest } from "~/services/shop/cart/dto/add-to-cart/add-to-cart.request";
import type { UpdateCartItemRequest } from "~/services/shop/cart/dto/update-cart-item/update-cart-item.request";
import { useAppDispatch } from "~/hooks/redux";
import { updateCartItemCount } from "~/store/auth/auth.slice";
import { showSuccessToast, showErrorToast } from "~/components/common/toast";

// ==========================================
// Query Keys
// ==========================================

export const cartKeys = {
  all: ["cart"] as const,
  list: (pageNumber: number, pageSize: number) =>
    [...cartKeys.all, "list", { pageNumber, pageSize }] as const,
  count: () => [...cartKeys.all, "count"] as const,
};

// ==========================================
// Queries
// ==========================================

/**
 * Hook lấy giỏ hàng với phân trang
 */
export const useCart = (pageNumber: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: cartKeys.list(pageNumber, pageSize),
    queryFn: async () => {
      const response = await cartService.getCart(pageNumber, pageSize);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải giỏ hàng");
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 phút
    placeholderData: (previousData) => previousData,
  });
};

// ==========================================
// Mutations
// ==========================================

/**
 * Hook thêm sản phẩm vào giỏ hàng
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (request: Omit<AddToCartRequest, "customerId">) => {
      const response = await cartService.addToCart(request as AddToCartRequest);
      if (!response.success) {
        throw new Error(response.message || "Không thể thêm vào giỏ hàng");
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate cart queries để refetch
      queryClient.invalidateQueries({ queryKey: cartKeys.all });

      // Update cart item count trong Redux
      if (data?.totalCartItems !== undefined) {
        dispatch(updateCartItemCount(data.totalCartItems));
      }

      showSuccessToast("Đã thêm sản phẩm vào giỏ hàng");
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Không thể thêm vào giỏ hàng");
    },
  });
};

/**
 * Hook cập nhật số lượng sản phẩm trong giỏ hàng
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({
      cartItemId,
      request,
    }: {
      cartItemId: number;
      request: Omit<UpdateCartItemRequest, "customerId">;
    }) => {
      const response = await cartService.updateCartItem(
        cartItemId,
        request as UpdateCartItemRequest,
      );
      if (!response.success) {
        throw new Error(response.message || "Không thể cập nhật giỏ hàng");
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate cart queries
      queryClient.invalidateQueries({ queryKey: cartKeys.all });

      // Update cart item count trong Redux
      if (data?.totalCartItems !== undefined) {
        dispatch(updateCartItemCount(data.totalCartItems));
      }

      showSuccessToast("Đã cập nhật giỏ hàng");
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Không thể cập nhật giỏ hàng");
    },
  });
};

/**
 * Hook xóa sản phẩm khỏi giỏ hàng
 */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (cartItemId: number) => {
      const response = await cartService.removeCartItem(cartItemId);
      if (!response.success) {
        throw new Error(response.message || "Không thể xóa sản phẩm");
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate cart queries
      queryClient.invalidateQueries({ queryKey: cartKeys.all });

      showSuccessToast("Đã xóa sản phẩm khỏi giỏ hàng");
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Không thể xóa sản phẩm");
    },
  });
};

/**
 * Hook xóa toàn bộ giỏ hàng
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      const response = await cartService.clearCart();
      if (!response.success) {
        throw new Error(response.message || "Không thể xóa giỏ hàng");
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate cart queries
      queryClient.invalidateQueries({ queryKey: cartKeys.all });

      // Reset cart count
      dispatch(updateCartItemCount(0));

      showSuccessToast("Đã xóa toàn bộ giỏ hàng");
    },
    onError: (error: Error) => {
      showErrorToast(error.message || "Không thể xóa giỏ hàng");
    },
  });
};
