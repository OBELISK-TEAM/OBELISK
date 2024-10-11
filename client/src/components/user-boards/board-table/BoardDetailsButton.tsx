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
          className="hover:text-muted-foreground"
          onClick={handleDetailsClick}
          aria-label="Go to board details"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="max-w-36">
        Go to board details
      </HoverCardContent>
    </HoverCard>
  );
};
