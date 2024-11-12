"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

const formSchema = z.object({
  boardName: z
    .string()
    .min(3, { message: "Board name must be at least 3 characters." })
    .max(30, { message: "Board name cannot exceed 30 characters." }),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface CreateBoardDialog {
  action: (values: FormSchemaType) => Promise<void>;
  children: React.ReactNode;
}

export function CreateBoardDialog({ action, children }: CreateBoardDialog) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      boardName: "",
    },
  });

  const handleCreateNewBoard: SubmitHandler<FormSchemaType> = async (values) => {
    await action(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>Input basic information in order to create a new table</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateNewBoard)} className="space-y-4">
            <FormField
              control={form.control}
              name="boardName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Board Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g. My awesome board"
                      {...field}
                      className={`${fieldState.error ? "border-error-border" : ""} focus:outline-none focus:ring-0`}
                      style={{ boxShadow: "none" }}
                    />
                  </FormControl>
                  <FormMessage className={`${fieldState.error ? "text-error-foreground" : ""}`} />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-between">
              <DialogClose asChild>
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
