export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  errors: any;
}

export interface ApiResponseError {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
  errors: string[] | null;
}
