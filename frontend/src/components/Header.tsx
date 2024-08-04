import {FC} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";
import HeaderLinks from "./HeaderLinks";
import {useHandleAuth} from "@/hooks/auth/useHandleAuth";
import {Button} from "@/components/ui/button";

const Header: FC = () => {
    const {logout} = useHandleAuth();

    return (
    <div className="flex items-center justify-between h-[64px] h-min-[64px] x-4 bg-white border-b pl-0">
      <div className="flex ">
        <div className="border-r flex items-center justify-center h-[64px] h-min-[64px]   w-[3.5em]">
          <Image src="/best-logo-lite.png" alt="Logo" width={20} height={20} />
        </div>
        <div className="flex ">
          <HeaderLinks />
        </div>
      </div>

      <div className="flex items-center space-x-4 pr-2">
        <span className="font-semibold">Anon Anno</span>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png"/>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Button
            onClick={logout}
            variant="outline"
            >
          Logout
        </Button>
      </div>
    </div>
    );
};

export default Header;
