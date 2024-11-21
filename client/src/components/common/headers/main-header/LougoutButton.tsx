"use client";
import { FC } from "react";
import { useHandleAuth } from "@/hooks/auth/useHandleAuth";
import { Button } from "@/components/ui/button";

const LogoutButton: FC = () => {
  const { logout, loading } = useHandleAuth();
  return (
    <Button onClick={logout} variant="outline" disabled={loading}>
      Logout
    </Button>
  );
};

export default LogoutButton;
