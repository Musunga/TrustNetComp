export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
}
