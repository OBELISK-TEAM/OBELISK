import { FC } from "react";
import { HomeIcon, FolderIcon, CogIcon, ShareIcon } from "lucide-react";

const Sidebar: FC = () => {
  return (
    
      <div className="relative flex flex-col bg-background border-r group hover:w-52 w-[56px] w-min-[56px] transition-all  duration-300 ease-in-out overflow-hidden" style={{
        height: "calc(100vh - 64px)"
      }}>
        
        <div className="flex flex-col flex-1 p-2 space-y-4">
          <div className="grow">
            <button className="flex items-center text-left text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded relative group-hover:w-full">
              <HomeIcon className="h-5 w-5 flex-shrink-0" />
              <span className="text-left ml-8 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out group-hover:ml-2 whitespace-nowrap text-sm font-medium">
                Dashboard
              </span>
            </button>
            <button className="flex items-center text-left text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded relative group-hover:w-full">
              <FolderIcon className="h-5 w-5 flex-shrink-0" />
              <span className="ml-8 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out group-hover:ml-2 whitespace-nowrap text-sm font-medium">
                My Boards
              </span>
            </button>
            <button className="flex items-center text-left text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded relative group-hover:w-full">
              <ShareIcon className="h-5 w-5 flex-shrink-0" />
              <span className="ml-8 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out group-hover:ml-2 whitespace-nowrap text-sm font-medium">
                Shared
              </span>
            </button>
          </div>
          <div>
            <button className="flex items-center text-left text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded relative group-hover:w-full">
              <CogIcon className="h-5 w-5 flex-shrink-0" />
              <span className="ml-8 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out group-hover:ml-2 whitespace-nowrap text-sm font-medium">
                Settings
              </span>
            </button>
          </div>
        </div>
      </div>
    
  );
};

export default Sidebar;
