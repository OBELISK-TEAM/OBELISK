export interface HandleAuth {
  email: string;
  password: string;
  error: string[] | null;
  loading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string[] | null) => void;
  setLoading: (loading: boolean) => void;
  login: (e: React.FormEvent) => Promise<void>;
  signup: (e: React.FormEvent) => Promise<void>;
  logout: (e: React.FormEvent) => Promise<void>;
  googleAuth: (e: React.FormEvent) => Promise<void>;
}
