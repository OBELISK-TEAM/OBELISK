import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthRequestFunction } from "@/interfaces/auth-api";
import { useAuthForm } from "@/hooks/auth-form/useAuthForm";

export const useHandleAuth = () => {
    const authForm = useAuthForm()
    const { email, password,error,loading,setEmail,setPassword, setError, setLoading } = authForm;
    const router = useRouter();

    const handleAuth = useCallback(
        (authFunc: AuthRequestFunction, successRedirect: string) => {
            return async (e: React.FormEvent) => {
                e.preventDefault();
                setLoading(true);
                try {
                    const data = await authFunc({ email, password });

                    localStorage.setItem("token", data.token);
                    router.push(successRedirect);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
        },
        [email, password, setError, setLoading, router]
    );

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
    };
};
