"use client";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HeaderLinks from "./HeaderLinks";
import { useHandleAuth } from "@/hooks/auth/useHandleAuth";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { AppLogo } from "./AppLogo";
import Link from "next/link";

const Header: FC = () => {
  const { logout, loading } = useHandleAuth();

  return (
    <div className="h-min-[64px] x-4 flex h-[64px] items-center justify-between border-b bg-background pl-0">
      <div className="flex">
        <Link href={"/user-boards"}>
          <div className="h-min-[64px] flex h-[64px] w-[3.5em] cursor-pointer items-center justify-center border-r transition-colors hover:bg-muted">
            <AppLogo width={20} height={20} />
          </div>
        </Link>
        <div className="flex">
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
