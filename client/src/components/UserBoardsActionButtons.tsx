import { Button } from "@/components/ui/button";
import { FilterIcon, ViewIcon, PlusIcon } from "lucide-react";

const UserBoardsActionButtons = () => {
  return (
    <div className="flex space-x-2">
      <Button variant="outline">
        <FilterIcon className="mr-2 h-5 w-5" />
        Filter
      </Button>
      <Button variant="outline">
        <ViewIcon className="mr-2 h-5 w-5" />
        View
      </Button>
      <Button>
        <PlusIcon className="mr-2 h-5 w-5" />
        Create new board
      </Button>
    </div>
  );
};

export default UserBoardsActionButtons;
