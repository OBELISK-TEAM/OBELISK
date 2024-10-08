import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface BoardDeletionButtonProps {
  deleteBoard: () => void;
}

export const BoardDeletionButton: React.FC<BoardDeletionButtonProps> = ({ deleteBoard }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const triggerButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && triggerButtonRef.current) {
      triggerButtonRef.current.blur();
    }
  };
  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };
  const handleDeleteBoard = () => {
    deleteBoard();
  };
  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          className="hover:text-muted-foreground"
          aria-label="Delete board"
          onClick={handleButtonClick}
        >
          <TrashIcon />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="max-w-36">
        Delete this board
      </HoverCardContent>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Board</DialogTitle>
            <DialogDescription>
              You are about to permanently delete this board.
              <br />
              This action is <strong>irreversible!</strong>
              <br />
              Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" onClick={handleDeleteBoard} className="ml-2">
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HoverCard>
  );
};