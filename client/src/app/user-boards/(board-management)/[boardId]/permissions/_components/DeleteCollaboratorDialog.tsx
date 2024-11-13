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
import { BoardPermissionsUser } from "@/interfaces/board-permissions-user";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { ApiError } from "@/classes/errors/ApiError";
import { complexToastContext } from "@/contexts/ComplexToastContext";
import { ToastTypes } from "@/enums/ToastType";
import { BoardPermissionModifyRequest } from "@/interfaces/requests/board-permission-modify-request";
import { modifyPermission } from "@/app/actions/permissionsActions";
import { BoardPermissionNum } from "@/enums/BoardPermissionNum";

interface DeleteCollaboratorButtonProps {
  user: BoardPermissionsUser;
  boardId: string;
}

const DeleteCollaboratorDialog: React.FC<DeleteCollaboratorButtonProps> = ({ user, boardId }) => {
  const triggerButtonRef = React.useRef<HTMLButtonElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && triggerButtonRef.current) {
      triggerButtonRef.current.blur();
    }
  };
  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleDeleteUser = () => {
    startTransition(async () => {
      try {
        const boardPermissionModifyRequest: BoardPermissionModifyRequest = {
          userId: user.id,
          permission: BoardPermissionNum.NONE,
        };
        await modifyPermission(boardId, boardPermissionModifyRequest);
        toast.success("Collaborator deleted successfully");
      } catch (error: any) {
        logger.error("Error in handleDeleteUser:", error);
        if (error instanceof ApiError) {
          complexToastContext(ToastTypes.ERROR, error.messages, { duration: Infinity });
        } else {
          toast.error(error.message || "Failed to delete board");
        }
      }
    });
    handleDialogOpenChange(false);
  };

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          className="hover:text-muted-foreground"
          aria-label={`Delete collaborator ${user.name}`}
          onClick={handleButtonClick}
          ref={triggerButtonRef}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="max-w-36">
        Delete this collaborator
      </HoverCardContent>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Collaborator</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove collaborator <strong>{user.name}</strong> from this board?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button disabled={isPending} variant="destructive" onClick={handleDeleteUser} className="ml-2">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HoverCard>
  );
};

export default DeleteCollaboratorDialog;
