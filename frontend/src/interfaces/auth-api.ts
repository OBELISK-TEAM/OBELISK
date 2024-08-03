
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export type AuthRequestFunction = (data: LoginRequest | RegisterRequest) => Promise<AuthResponse>;
