export interface AuthStateI {
  email: string;
  password: string;
  error: string[] | null;
  loading: boolean;
}
