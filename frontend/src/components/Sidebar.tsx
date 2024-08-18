import { FC } from "react";
import { HomeIcon, FolderIcon, CogIcon, ShareIcon } from "lucide-react";

const Sidebar: FC = () => {
  return (
    <div
      className="w-min-[56px] group relative flex w-[56px] flex-col overflow-hidden border-r bg-background transition-all duration-300 ease-in-out hover:w-52"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      <div className="flex flex-1 flex-col space-y-4 p-2">
        <div className="grow">
          <button className="relative flex items-center rounded p-2 text-left text-muted-foreground hover:bg-muted hover:text-foreground group-hover:w-full">
            <HomeIcon className="h-5 w-5 flex-shrink-0" />
            <span className="ml-8 whitespace-nowrap text-left text-sm font-medium opacity-0 transition-all duration-300 ease-in-out group-hover:ml-2 group-hover:opacity-100">
              Dashboard
            </span>
          </button>
          <button className="relative flex items-center rounded p-2 text-left text-muted-foreground hover:bg-muted hover:text-foreground group-hover:w-full">
            <FolderIcon className="h-5 w-5 flex-shrink-0" />
            <span className="ml-8 whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 ease-in-out group-hover:ml-2 group-hover:opacity-100">
              My Boards
            </span>
          </button>
          <button className="relative flex items-center rounded p-2 text-left text-muted-foreground hover:bg-muted hover:text-foreground group-hover:w-full">
            <ShareIcon className="h-5 w-5 flex-shrink-0" />
            <span className="ml-8 whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 ease-in-out group-hover:ml-2 group-hover:opacity-100">
              Shared
            </span>
          </button>
        </div>
        <div>
          <button className="relative flex items-center rounded p-2 text-left text-muted-foreground hover:bg-muted hover:text-foreground group-hover:w-full">
            <CogIcon className="h-5 w-5 flex-shrink-0" />
            <span className="ml-8 whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 ease-in-out group-hover:ml-2 group-hover:opacity-100">
              Settings
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
