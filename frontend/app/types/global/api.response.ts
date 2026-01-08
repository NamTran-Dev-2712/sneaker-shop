export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
}

export interface ApiResponseError {
  success: boolean;
  message: string;
  data: null;
  errors: Record<string, string[]> | null;
}
