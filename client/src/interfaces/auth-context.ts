import { DecodedToken } from "@/interfaces/decoded-token/decoded-token";

export interface AuthContext {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  loginGoogleUser: (userTempId: string) => Promise<void>;
  decodedToken: DecodedToken | null;
}
