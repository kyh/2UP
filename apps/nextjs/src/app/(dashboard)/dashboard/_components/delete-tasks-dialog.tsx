"use client";

import { Button } from "@2up/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@2up/ui/dialog";
import { toast } from "@2up/ui/toast";
import { TrashIcon } from "lucide-react";

import type { RouterOutputs } from "@2up/api";
import { api } from "@/trpc/react";

type Tasks = RouterOutputs["task"]["retrieve"]["data"];

type DeleteTasksDialogProps = {
  tasks: Tasks;
  showTrigger?: boolean;
  onSuccess?: () => void;
} & React.ComponentPropsWithoutRef<typeof Dialog>;

export const DeleteTasksDialog = ({
  tasks,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteTasksDialogProps) => {
  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      props.onOpenChange?.(false);
      toast.success("Tasks deleted");
      onSuccess?.();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({tasks.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{tasks.length}</span>
            {tasks.length === 1 ? " task" : " tasks"} from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            loading={deleteTask.isPending}
            onClick={() => {
              deleteTask.mutate({
                ids: tasks.map((task) => task.id),
              });
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
