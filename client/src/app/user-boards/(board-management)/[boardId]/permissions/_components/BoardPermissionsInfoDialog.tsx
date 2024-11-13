"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";
const BoardPermissionsInfoDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const triggerButtonRef = React.useRef<HTMLButtonElement>(null);
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && triggerButtonRef.current) {
      triggerButtonRef.current.blur();
    }
  };
  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <button ref={triggerButtonRef} onClick={() => setIsDialogOpen(true)} className={"flex"}>
          <InfoIcon />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="text-xs text-muted-foreground" sideOffset={8}>
        Click to see information about permissions.
      </HoverCardContent>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Board Permissions</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Board permissions determine how others can use the board. There are 3 types of permissions:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 px-3 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold text-accent-foreground">Viewer</span> - users can view the board but cannot
              make changes (add, modify, delete board objects and slides) or manage other users&apos; board permissions.
            </div>
            <div>
              <span className="font-semibold text-accent-foreground">Editor</span> - users can view the board and modify
              its content (add, modify, and delete board objects and slides) but cannot manage other users&apos; board
              permissions.
            </div>
            <div>
              <span className="font-semibold text-accent-foreground">Moderator</span> - users have full access to the
              board; they can view it, modify its content, and manage other users&apos; board permissions.
            </div>
          </div>
          <div className="mt-1 space-y-3 text-sm text-muted-foreground">
            There is one special type of user - the <span className="font-semibold text-accent-foreground">owner</span>{" "}
            of the board. The user who created the board is its owner. Such a user can perform additional unique
            actions: change the name of the board and permanently delete the board.
          </div>
          <DialogFooter className="mt-6 flex justify-end">
            <DialogClose asChild>
              <Button>OK</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HoverCard>
  );
};
export default BoardPermissionsInfoDialog;
