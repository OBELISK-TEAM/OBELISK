import { LoginRequest, RegisterRequest, AuthResponse } from "@/interfaces/auth-api";

export const authRequest = async <T>(
    endpoint: string,
    method: string,
    body: LoginRequest | RegisterRequest
): Promise<T> => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
        {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
    }

    return response.json();
};

export const loginUser = async (
    loginData: LoginRequest
): Promise<AuthResponse> => {
    return authRequest<AuthResponse>("/auth/login", "POST", loginData);
};

export const registerUser = async (
    registerData: RegisterRequest
): Promise<AuthResponse> => {
    return authRequest<AuthResponse>("/auth/register", "POST", registerData);
};
