import { Button } from "@/components/ui/button";
import { FilterIcon, ViewIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

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
      <Link href={"/board"}>
        <Button>
          <PlusIcon className="mr-2 h-5 w-5" />
          Create new board
        </Button>
      </Link>
    </div>
  );
};

export default UserBoardsActionButtons;
