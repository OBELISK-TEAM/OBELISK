import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { MinusIcon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface DeleteSlideDialogProps {
  deleteSlide: () => void;
  totalSlides: number;
}

export function DeleteSlideDialog({ deleteSlide, totalSlides }: DeleteSlideDialogProps) {
  const isDisabled = totalSlides === 1;

  const handleClick = (event: React.MouseEvent) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <Dialog>
      <HoverCard closeDelay={200}>
        <HoverCardTrigger asChild>
          <div>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={isDisabled} onClick={handleClick}>
                <MinusIcon size={16} className="mr-2 h-5 w-5" />
                Delete slide
              </Button>
            </DialogTrigger>
          </div>
        </HoverCardTrigger>
        {isDisabled && (
          <HoverCardContent className="mt-2 w-48 p-4 text-center">
            <span>You cannot delete the only slide</span>
          </HoverCardContent>
        )}
      </HoverCard>
      {!isDisabled && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Current Slide</DialogTitle>
            <DialogDescription>
              You are about to permanently delete the current slide.
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
              <Button variant="destructive" onClick={deleteSlide} className="ml-2">
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
