import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useRouter } from "next/navigation";

interface BoardDetailsButtonProps {
  boardId: string;
}

export const BoardDetailsButton: React.FC<BoardDetailsButtonProps> = ({ boardId }) => {
  const router = useRouter();
  const handleDetailsClick = () => {
    router.push(`/user-boards/${boardId}`);
  };

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          className="p-2 hover:text-muted-foreground"
          style={{ width: "40px" }}
          onClick={handleDetailsClick}
          aria-label="Go to board details"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="max-w-36">
        Go to board details
      </HoverCardContent>
    </HoverCard>
  );
};
