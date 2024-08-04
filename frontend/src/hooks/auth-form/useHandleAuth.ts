import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthRequestFunction } from "@/interfaces/auth-api";
import { useAuthForm } from "@/hooks/auth-form/useAuthForm";
import {useAuth} from "@/context/AuthContext";
import {AuthActionType} from "@/enums/AuthMessage";

export const useHandleAuth = () => {
    const authForm = useAuthForm();
    const { email, password, error, loading, setEmail, setPassword, setError, setLoading } = authForm;
    const { setAuthAction } = useAuth();
    const router = useRouter();

    const handleAuth = useCallback(
        (authFunc: AuthRequestFunction, successRedirect: string) => {
            return async (e: React.FormEvent) => {
                e.preventDefault();
                setLoading(true);
                try {
                    const data = await authFunc({ email, password });

                    setAuthAction(AuthActionType.LOGIN_SUCCESS, data.token);
                    router.push(successRedirect);
                } catch (err: any) {
                    if (err instanceof Error) {
                        //setAuthAction(AuthActionType.LOGIN_FAILURE);
                        const errorMessages = JSON.parse(err.message) as string[];
                        setError(errorMessages);
                    } else {
                        setError(["Unexpected error occurred."]);
                    }
                } finally {
                    setLoading(false);
                }
            };
        },
        [email, password, setError, setLoading, router]
    );

    const logout = useCallback(() => {
        setAuthAction(AuthActionType.LOGOUT_SUCCESS);
        router.push("/auth/login");
    }, [setAuthAction, router]);

    return {
        email,
        password,
        error,
        loading,
        setEmail,
        setPassword,
        setError,
        setLoading,
        handleAuth,
        logout
    };
};
