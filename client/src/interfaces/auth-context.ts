import { User } from "@/interfaces/user/user";

export interface AuthContext {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  loginGoogleUser: (userTempId: string) => Promise<void>;
  userInfo: User | null;
}
