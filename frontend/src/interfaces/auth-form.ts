export interface AuthState {
  email: string;
  password: string;
  error: string[] | null;
  loading: boolean;
}
