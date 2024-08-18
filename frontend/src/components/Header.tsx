import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HeaderLinks from "./HeaderLinks";
import { useHandleAuth } from "@/hooks/auth/useHandleAuth";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { AppLogo } from "./AppLogo";

const Header: FC = () => {
  const { logout, loading } = useHandleAuth();

  return (
    <div className="flex items-center justify-between h-[64px] h-min-[64px] x-4 bg-background border-b pl-0">
      <div className="flex ">
        <div className="border-r flex items-center justify-center h-[64px] h-min-[64px]   w-[3.5em]">
          <AppLogo width={20} height={20} />
        </div>
        <div className="flex ">
          <HeaderLinks />
        </div>
      </div>

      <div className="flex items-center space-x-4 pr-6">
        <span className="font-semibold">Anon Anno</span>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <ThemeToggle />
        <Button onClick={logout} variant="outline" disabled={loading}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Header;
