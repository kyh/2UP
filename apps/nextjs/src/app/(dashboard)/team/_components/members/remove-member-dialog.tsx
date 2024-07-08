"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@2up/ui/alert-dialog";
import { Button } from "@2up/ui/button";
import { toast } from "@2up/ui/toast";

import { api } from "@/trpc/react";

export const RemoveMemberDialog = ({
  isOpen,
  setIsOpen,
  teamAccountId,
  userId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  teamAccountId: string;
  userId: string;
}) => (
  <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>You are removing this user</AlertDialogTitle>

        <AlertDialogDescription>
          Remove this member from the team. They will no longer have access to
          the team.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <RemoveMemberForm
        setIsOpen={setIsOpen}
        accountId={teamAccountId}
        userId={userId}
      />
    </AlertDialogContent>
  </AlertDialog>
);

const RemoveMemberForm = ({
  accountId,
  userId,
  setIsOpen,
}: {
  accountId: string;
  userId: string;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const removeMember = api.team.removeMember.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      toast.success("Member removed successfully");
    },
    onError: () =>
      toast.error("Sorry, we encountered an error. Please try again"),
  });

  const onMemberRemoved = () => {
    removeMember.mutate({ accountId, userId });
  };

  return (
    <form action={onMemberRemoved}>
      <div className="flex flex-col space-y-6">
        <p className="text-muted-foreground text-sm">
          Are you sure you want to continue?
        </p>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button variant="destructive" disabled={removeMember.isPending}>
            Remove User from Team
          </Button>
        </AlertDialogFooter>
      </div>
    </form>
  );
};
