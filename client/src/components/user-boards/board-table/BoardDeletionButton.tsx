import React, { useTransition } from "react";
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
import { PaginatedBoardsResponse } from "@/interfaces/responses/user-boards/paginated-boards-response";
import { KeyedMutator } from "swr";
import logger from "@/lib/logger";
import { toast } from "sonner";
import { ApiError } from "@/errors/ApiError";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";

interface BoardDeletionButtonProps {
  deleteBoard: () => void;
  revalidateFunc: KeyedMutator<PaginatedBoardsResponse>;
}

export const BoardDeletionButton: React.FC<BoardDeletionButtonProps> = ({ deleteBoard, revalidateFunc }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const triggerButtonRef = React.useRef<HTMLButtonElement>(null);
  const [isPending, startTransition] = useTransition();
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
    startTransition(async () => {
      try {
        await deleteBoard();
        await revalidateFunc();
        toast.success("Board deleted successfully");
      } catch (error: any) {
        if (error instanceof ApiError) {
          complexToast(ToastTypes.ERROR, error.messages, { duration: Infinity });
        } else {
          toast.error(error.message || "Failed to delete board");
        }
      }
    });
  };
  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          className="hover:text-muted-foreground"
          aria-label="Delete board"
          onClick={handleButtonClick}
          disabled={isPending}
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
