export interface HandleAuthI {
  email: string;
  password: string;
  loading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setLoading: (loading: boolean) => void;
  login: (e: React.FormEvent) => Promise<void>;
  signup: (e: React.FormEvent) => Promise<void>;
  logout: (e: React.FormEvent) => Promise<void>;
  googleAuth: (e: React.FormEvent) => Promise<void>;
}
