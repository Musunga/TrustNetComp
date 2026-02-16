import api from "../api";
import { API_ROUTES } from "../constants/api-routes";
import type { ApiResponse } from "../types/response";
import type { Framework } from "../types/framework";

export const fetchAllFrameworks = async (): Promise<Framework[]> => {
  const response = await api.get<Framework[] | ApiResponse<Framework[]>>(API_ROUTES.FRAMEWORKS.LIST);
  const data = response.data;
  if (Array.isArray(data)) return data;
  return (data as ApiResponse<Framework[]>).data ?? [];
};
