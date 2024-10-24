import { FC } from "react";
import HeaderLinks from "../HeaderLinks";
import { AppLogo } from "./AppLogo";
import Link from "next/link";
import UserInfo from "@/components/user-boards/main-header/UserInfo";

const Header: FC = () => {
  return (
    <div className="h-min-[64px] x-4 sticky top-0 z-10 flex h-[64px] items-center justify-between border-b bg-background pl-0">
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

      <UserInfo />
    </div>
  );
};

export default Header;
