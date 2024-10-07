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

interface DeleteCollaboratorButtonProps {
  deleteUser: (username: string) => void;
  username: string;
}

const DeleteCollaboratorButton: React.FC<DeleteCollaboratorButtonProps> = ({ deleteUser, username }) => {
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

  const handleDeleteUser = () => {
    deleteUser(username);
  };

  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          className="hover:text-muted-foreground"
          aria-label={`Delete collaborator ${username}`}
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
              Are you sure you want to remove collaborator <strong>{username}</strong> from this board?
              <br />
              This action is <strong>irreversible!</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive" onClick={handleDeleteUser} className="ml-2">
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HoverCard>
  );
};

export default DeleteCollaboratorButton;
