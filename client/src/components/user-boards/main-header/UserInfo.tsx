import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "@/components/user-boards/main-header/LougoutButton";
import { decodeToken, getCookie } from "@/lib/authApiUtils";

const UserInfo: FC = () => {
  const token = getCookie("accessToken");
  if (!token) {
    return null;
  }
  const decodedToken = decodeToken(token);
  if (!decodedToken) {
    return null;
  }
  const { email } = decodedToken;
  return (
    <div className="flex items-center space-x-4 pr-6">
      <span className="font-semibold">{email}</span>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>{email.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <ThemeToggle />
      <LogoutButton />
    </div>
  );
};

export default UserInfo;
