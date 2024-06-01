import { Button } from "@/components/ui/button";
import { FilterIcon, ViewIcon, PlusIcon } from "lucide-react";

const ActionButtons = () => {
  return (
    <div className="flex space-x-2">
      <Button variant="outline">
        <FilterIcon className="h-5 w-5 mr-2" />
        Filter
      </Button>
      <Button variant="outline">
        <ViewIcon className="h-5 w-5 mr-2" />
        View
      </Button>
      <Button>
        <PlusIcon className="h-5 w-5 mr-2" />
        Create new board
      </Button>
    </div>
  );
};

export default ActionButtons;
