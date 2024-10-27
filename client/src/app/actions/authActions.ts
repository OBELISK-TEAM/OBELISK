"use server";
import { clearCookie, setTokenCookie } from "@/lib/authApiUtils";
import logger from "@/lib/logger";
import { apiRequest } from "@/services/requestService";

export async function login(email: string, password: string): Promise<void> {
  try {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const { accessToken } = await response.json();
    setTokenCookie(accessToken);
  } catch (error) {
    logger.error("Error during login:", error);
    throw error;
  }
}

export async function register(email: string, password: string): Promise<void> {
  try {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const { accessToken } = await response.json();
    setTokenCookie(accessToken);
  } catch (error) {
    logger.error("Error during registration:", error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    await clearCookie();
  } catch (error) {
    throw new Error("Error during logout");
  }
}

export async function googleLogin(state: string): Promise<void> {
  try {
    const response = await apiRequest("/auth/google/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state}`,
      },
    });

    const { accessToken } = await response.json();
    setTokenCookie(accessToken);
  } catch (error) {
    logger.error("Error during Google login:", error);
    throw error;
  }
}
