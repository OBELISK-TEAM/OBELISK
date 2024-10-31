"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "@/components/main-header/LougoutButton";
import { useAuth } from "@/contexts/AuthContext";

const UserInfo = ({ withoutLogout }: { withoutLogout?: boolean }) => {
  const { decodedToken } = useAuth();
  return (
    <>
      <span className="hidden font-semibold lg:block">{decodedToken?.email}</span>
      <Avatar>
        <AvatarImage src="#" />
        <AvatarFallback>{decodedToken?.email.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <ThemeToggle />
      {!withoutLogout && <LogoutButton />}
    </>
  );
};

export default UserInfo;
