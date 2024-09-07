export interface AuthContext {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  loginGoogleUser: (userTempId: string) => Promise<void>;
}
