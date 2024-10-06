export interface ErrorResponse {
  code: number;
  path: string;
  method: string;
  message: string | null;
  details?: string | object | null;
}
