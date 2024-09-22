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

interface DeleteSlideDialogProps {
  deleteSlide: () => void;
}

export function DeleteSlideDialog({ deleteSlide }: DeleteSlideDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MinusIcon size={16} className="mr-2 h-5 w-5" />
          Delete slide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete current slide</DialogTitle>
          <DialogDescription>
            You are about to permanently delete the current slide.
            <br />
            The action is <strong>irreversible!</strong>
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
              {"Delete"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
