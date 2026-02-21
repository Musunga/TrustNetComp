export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}

export interface ApiValidationErrorBody {
  formErrors: string[]
  fieldErrors: Record<string, string[]>
}
